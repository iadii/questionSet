import { useAuthStore } from "@/store/authStore";

export const API_BASE_URL = "http://localhost:8080/api";

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;
  validationErrors?: Record<string, string>;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.validationErrors = data?.data?.validationErrors || data?.validationErrors;
  }
}

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const onRefreshed = (success: boolean) => {
  refreshSubscribers.forEach((callback) => callback(success));
  refreshSubscribers = [];
};

export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { requireAuth = true, headers, ...customConfig } = options;

  const config: RequestInit = {
    ...customConfig,
    credentials: "include", // Send cookies cross-origin
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (error: any) {
    throw new Error(`Network Error: ${error.message}`);
  }

  // Handle 401 Unauthorized globally using refresh token via HttpOnly cookies
  if (response.status === 401 && requireAuth && endpoint !== "/auth/refresh") {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // sends the refreshToken cookie
        });

        if (refreshResponse.ok) {
          isRefreshing = false;
          onRefreshed(true);
        } else {
          isRefreshing = false;
          onRefreshed(false);
          useAuthStore.getState().logout();
          if (typeof window !== "undefined") window.location.href = "/login";
          throw new Error("Session expired. Please log in again.");
        }
      } catch (err) {
        isRefreshing = false;
        onRefreshed(false);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") window.location.href = "/login";
        throw new Error("Session expired. Please log in again.");
      }
    }

    // Wait for the refresh to complete before retrying the original request
    return new Promise((resolve, reject) => {
      refreshSubscribers.push(async (success: boolean) => {
        if (success) {
          try {
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
            if (!retryResponse.ok) throw new Error("Retry failed");
            
            const data = await retryResponse.json();
            resolve(data.success !== undefined && data.data !== undefined ? data.data : data);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error("Session expired."));
        }
      });
    });
  }

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    let errorData = null;
    try {
      errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
      else if (errorData.data?.message) errorMessage = errorData.data.message;
    } catch (e) {
      const text = await response.text();
      if (text) errorMessage = text;
    }
    throw new ApiError(errorMessage, response.status, errorData);
  }

  const data = await response.json();
  
  if (data.success !== undefined && data.data !== undefined) {
    return data.data;
  }
  return data;
}
