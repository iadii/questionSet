"use client";

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Question, PageResponse } from "@/types";
import { ChevronRight, Target, Briefcase, ClockAlert } from "lucide-react";
import { motion } from "framer-motion";

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
    queryFn: () => apiFetch<PageResponse<Question>>("/questions?category=DSA&page=0&size=500", { requireAuth: true }),
  });

  const { data: progressData, isLoading: isProgressLoading } = useQuery<any[]>({
    queryKey: ["progress"],
    queryFn: () => apiFetch<any[]>("/progress", { requireAuth: true }),
  });

  if (isProfileLoading || isQuestionsLoading || isProgressLoading) {
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

  // Filter for Due Reviews (SRS)
  const dueReviewIds = progressData
    ?.filter(p => p.status === "REVISION_NEEDED")
    .map(p => p.questionId) || [];
    
  const dueReviews = questionsData?.content
    ?.filter(q => dueReviewIds.includes(q.id)) || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 relative overflow-hidden">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] mix-blend-screen" />
        </div>

        {/* Dashboard Header */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.name.split(' ')[0]} 👋</h1>
                <p className="text-gray-400">Continue your preparation for {profile?.targetCompany || 'top tech companies'}.</p>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400 font-medium">Problems Solved</div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    {progressData?.filter(p => p.status === 'SOLVED').length || 0} / {questionsData?.totalElements || 0}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Target Company Banner */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)] relative overflow-hidden">
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-4 uppercase tracking-wider">
                      <Target className="w-3 h-3" /> Current Goal
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Targeting {targetCompany}</h2>
                    <p className="text-blue-200/80 max-w-md">Your dashboard is currently optimized for {targetCompany} interview patterns. Keep grinding!</p>
                  </div>
                  <div className="hidden md:flex w-16 h-16 bg-blue-500/20 rounded-2xl items-center justify-center border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <Briefcase className="w-8 h-8 text-blue-300" />
                  </div>
                </div>
              </motion.div>

              {/* Due for Review (SRS) */}
              {dueReviews.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-orange-500/10 backdrop-blur-xl rounded-2xl shadow-sm border border-orange-500/20 overflow-hidden">
                  <div className="p-6 border-b border-orange-500/20 flex justify-between items-center bg-orange-500/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                        <ClockAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-orange-400">Due for Review Today</h2>
                        <p className="text-sm text-orange-300/80">Spaced repetition to reinforce memory.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-orange-500/10 bg-white/5">
                    {dueReviews.map((q, idx) => (
                      <div key={q.id} className="p-4 flex items-center justify-between hover:bg-orange-500/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="text-orange-400 font-mono text-sm w-6 text-center">{idx + 1}</span>
                          <div>
                            <h4 className="font-semibold text-white text-base">{q.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold tracking-wide ${
                                q.difficulty === 'EASY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                q.difficulty === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}>
                                {q.difficulty}
                              </span>
                              <span className="text-xs text-gray-400 font-medium">{q.topic}</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/dsa`} className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 hover:bg-orange-500/30 text-orange-300 text-sm font-medium rounded-lg transition-colors shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                          Review Now
                        </Link>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Company-Specific Prep Track */}
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-sm border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <div>
                    <h2 className="text-xl font-bold text-white">Top 5 {targetCompany} Questions</h2>
                    <p className="text-sm text-gray-400 mt-1">Highly frequently asked in recent interviews.</p>
                  </div>
                  <Link href="/dsa" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="divide-y divide-white/10">
                  {companyTrack.length > 0 ? companyTrack.map((q, idx) => (
                    <div key={q.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 font-mono text-sm w-6 text-center">{idx + 1}</span>
                        <div>
                          <h4 className="font-semibold text-gray-200 text-base group-hover:text-blue-400 transition-colors">{q.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold tracking-wide ${
                              q.difficulty === 'EASY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              q.difficulty === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {q.difficulty}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{q.topic}</span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/dsa`} className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all border border-white/10">
                        Solve
                      </Link>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-gray-400">
                      No specific questions found for this company yet. Check back soon!
                    </div>
                  )}
                </div>
              </motion.section>
            </div>
            
            {/* Right Column - Stats */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-400 font-medium mb-1">Company Readiness</h3>
                  <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    {Math.min(100, Math.round((profile?.totalSolved || 0) / 50 * 100))}
                    <span className="text-2xl text-gray-500">/100</span>
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">Based on top {targetCompany} questions.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-400 font-medium mb-1">Questions Solved</h3>
                  <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    {profile?.totalSolved || 0}
                    <span className="text-2xl text-gray-500">/120</span>
                  </p>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (profile?.totalSolved || 0) / 120 * 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-400 font-medium mb-1">Current Streak</h3>
                  <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
                    {profile?.currentStreak || 0} <span className="text-2xl text-gray-500">Days</span>
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">Keep the momentum going!</p>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
