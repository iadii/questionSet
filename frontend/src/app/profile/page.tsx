"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Heatmap from "@/components/profile/Heatmap";
import InterviewWorkspace from "@/components/profile/InterviewWorkspace";
import Link from "next/link";
import { User, CheckCircle, Target, ArrowLeft } from "lucide-react";

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
        <div className="flex items-center justify-center pt-32 pb-24">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="text-gray-300 pb-24">
        {/* Navbar */}
        <nav className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white tracking-tight">InterviewPrep</Link>
            <div className="flex gap-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/problems" className="text-gray-400 hover:text-white transition-colors">Problems</Link>
              <Link href="/profile" className="text-blue-400 font-medium">Profile</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Left Column: User Profile Details */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12" />
                </div>
                <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
                <div className="mt-6 w-full flex flex-col gap-2">
                  <Link href="/dashboard" className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Stats & Heatmap */}
            <div className="md:col-span-3 space-y-6">
              
              {/* Stats Section */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-gray-400 font-medium mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Questions Solved
                </h3>
                <div className="flex items-end gap-4 mb-6">
                  <span className="text-5xl font-bold text-white">{profile?.totalSolved || 0}</span>
                  <span className="text-gray-500 mb-1">/ 120</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-xl border border-emerald-500/20">
                    <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Easy</span>
                    <span className="text-2xl font-bold text-emerald-300">{profile?.easySolved || 0}</span>
                  </div>
                  <div className="bg-amber-500/10 text-amber-400 px-4 py-3 rounded-xl border border-amber-500/20">
                    <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Medium</span>
                    <span className="text-2xl font-bold text-amber-300">{profile?.mediumSolved || 0}</span>
                  </div>
                  <div className="bg-rose-500/10 text-rose-400 px-4 py-3 rounded-xl border border-rose-500/20">
                    <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Hard</span>
                    <span className="text-2xl font-bold text-rose-300">{profile?.hardSolved || 0}</span>
                  </div>
                </div>
              </div>

              {/* Heatmap Section */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <Heatmap data={profile?.heatmap || {}} />
              </div>

              {/* AI Workspace - Keep if needed, but styling needs dark mode */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">AI Interview Workspace</h3>
                <div className="opacity-80">
                  <InterviewWorkspace />
                </div>
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
