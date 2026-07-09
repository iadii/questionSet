"use client";

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Question, PageResponse } from "@/types";
import { ChevronRight, Target, Briefcase } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  targetCompany: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
}

export default function DashboardPage() {
  const { data: profile, isLoading: isProfileLoading } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: () => apiFetch<UserProfile>("/profile", { requireAuth: true }),
  });

  const { data: questionsData, isLoading: isQuestionsLoading } = useQuery<PageResponse<Question>>({
    queryKey: ["questions", "DSA"],
    queryFn: () => apiFetch<PageResponse<Question>>("/questions?category=DSA&page=0&size=100", { requireAuth: true }),
  });

  if (isProfileLoading || isQuestionsLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  const targetCompany = profile?.targetCompany || "Walmart";
  
  // Filter for the target company and just grab the top 5
  const companyTrack = questionsData?.content
    ?.filter(q => q.companyTags && q.companyTags.includes(targetCompany))
    ?.slice(0, 5) || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#fafbfc] pb-24">
        <div className="p-8 max-w-6xl mx-auto space-y-12">
          
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {profile?.name?.split(' ')[0]} 👋</h1>
              <p className="text-gray-500 text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-500" />
                Targeting: <strong className="text-gray-800">{targetCompany}</strong>
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/dsa" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm">
                Go to DSA Sheet
              </Link>
              <Link href="/profile" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition shadow-sm">
                Interview Workspace
              </Link>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-medium mb-1">Company Readiness</h3>
                <p className="text-5xl font-bold text-blue-600">
                  {Math.min(100, Math.round((profile?.totalSolved || 0) / 50 * 100))}
                  <span className="text-2xl text-gray-400">/100</span>
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">Based on top {targetCompany} questions.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-medium mb-1">Questions Solved</h3>
                <p className="text-5xl font-bold text-emerald-600">
                  {profile?.totalSolved || 0}
                  <span className="text-2xl text-gray-400">/120</span>
                </p>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (profile?.totalSolved || 0) / 120 * 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-medium mb-1">Current Streak</h3>
                <p className="text-5xl font-bold text-orange-500">
                  {profile?.currentStreak || 0} <span className="text-2xl text-gray-400">Days</span>
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">Keep the momentum going!</p>
            </div>
          </div>

          {/* Company-Specific Prep Track */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{targetCompany} Prep Track</h2>
                  <p className="text-sm text-gray-500">Curated questions frequently asked by {targetCompany}.</p>
                </div>
              </div>
              <Link href={`/dsa`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                View Full Track <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100">
              {companyTrack.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No specific questions found for {targetCompany} yet.
                </div>
              ) : (
                companyTrack.map((q, idx) => (
                  <div key={q.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 font-mono text-sm w-6 text-center">{idx + 1}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base">{q.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold tracking-wide ${
                            q.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-700' :
                            q.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {q.difficulty}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">{q.topic}</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/dsa`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                      Solve
                    </Link>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </ProtectedRoute>
  );
}
