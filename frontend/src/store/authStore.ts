import { create } from 'zustand';
import { apiFetch } from "@/lib/api";

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuthenticated: (status: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  return {
    isAuthenticated: false,
    isInitialized: false,
    
    setAuthenticated: (status: boolean) => {
      set({ isAuthenticated: status, isInitialized: true });
    },
    
    checkAuth: async () => {
      if (get().isInitialized) return;
      try {
        await apiFetch("/profile", { requireAuth: true });
        set({ isAuthenticated: true, isInitialized: true });
      } catch (e) {
        set({ isAuthenticated: false, isInitialized: true });
      }
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
