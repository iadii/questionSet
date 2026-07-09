import { create } from 'zustand';
import { apiFetch } from "@/lib/api";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // We can't strictly know if cookie exists syncronously in JS, 
  // so we default to false and rely on initial API calls to verify.
  return {
    isAuthenticated: false, 
    
    setAuthenticated: (status: boolean) => {
      set({ isAuthenticated: status });
    },
    
    logout: async () => {
      try {
        await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          credentials: "include"
        });
      } catch (e) {
        // ignore
      }
      set({ isAuthenticated: false });
    },
  };
});
