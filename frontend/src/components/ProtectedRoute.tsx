"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, setAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        // Ping a protected route. 
        // apiFetch handles 401 interceptor, refresh tokens, and redirects internally.
        await apiFetch("/profile", { requireAuth: true });
        setAuthenticated(true);
      } catch (e) {
        // Interceptor might have already redirected, but as a fallback:
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, setAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Authenticating securely...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
