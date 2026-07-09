"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Heatmap from "@/components/profile/Heatmap";
import InterviewWorkspace from "@/components/profile/InterviewWorkspace";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  heatmap: Record<string, number>;
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: () => apiFetch<UserProfile>("/profile", { requireAuth: true }),
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#fafbfc] pb-24">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info */}
            <div className="col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-500 text-sm">{profile?.email}</p>
            </div>
            
            {/* Stats */}
            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <h3 className="text-gray-500 font-medium mb-4">Questions Solved</h3>
              <div className="flex items-end gap-4 mb-6">
                <span className="text-5xl font-bold text-gray-900">{profile?.totalSolved}</span>
                <span className="text-gray-400 mb-1">/ 120</span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-100">
                  <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Easy</span>
                  <span className="text-2xl font-bold">{profile?.easySolved}</span>
                </div>
                <div className="flex-1 bg-amber-50 text-amber-700 px-4 py-3 rounded-xl border border-amber-100">
                  <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Medium</span>
                  <span className="text-2xl font-bold">{profile?.mediumSolved}</span>
                </div>
                <div className="flex-1 bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100">
                  <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Hard</span>
                  <span className="text-2xl font-bold">{profile?.hardSolved}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap */}
          {profile?.heatmap && <Heatmap data={profile.heatmap} />}

          {/* Interview Workspace */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI Interview Workspace</h3>
            <InterviewWorkspace />
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
