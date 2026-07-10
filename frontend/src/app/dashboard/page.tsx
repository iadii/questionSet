"use client";

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import FloatingNavbar from '@/components/FloatingNavbar';
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Question, PageResponse } from "@/types";
import { ChevronRight, Target, Flame, CheckCircle, ClockAlert, ArrowRight, BookOpen } from "lucide-react";
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
        <div className="flex items-center justify-center pt-32 pb-24">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </ProtectedRoute>
    );
  }

  const targetCompany = profile?.targetCompany || "Walmart";
  
  // Filter for the target company
  const companyTrack = questionsData?.content
    ?.filter(q => q.companyTags && q.companyTags.includes(targetCompany))
    ?.slice(0, 5) || [];

  // Filter for Due Reviews (SRS)
  const dueReviewIds = progressData
    ?.filter(p => p.status === "REVISION_NEEDED")
    .map(p => p.questionId) || [];
    
  const dueReviews = questionsData?.content
    ?.filter(q => dueReviewIds.includes(q.id)) || [];

  const totalQuestions = questionsData?.totalElements || 120;
  const solvedCount = progressData?.filter(p => p.status === 'SOLVED').length || 0;
  const progressPercent = Math.round((solvedCount / totalQuestions) * 100) || 0;

  return (
    <ProtectedRoute>
      <div className="text-gray-300 pb-24">
        {/* Navbar */}
        <FloatingNavbar />

        <main className="max-w-6xl mx-auto px-6 py-10 pt-32 space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome, {profile?.name.split(' ')[0]}</h1>
              <p className="text-gray-400">Here's your prep overview for {targetCompany}.</p>
            </div>
          </div>

          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Solved</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{solvedCount}</span>
                  <span className="text-sm text-gray-500">/ {totalQuestions}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Streak</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{profile?.currentStreak || 0}</span>
                  <span className="text-sm text-gray-500">Days</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div className="w-full">
                <p className="text-sm text-gray-400 flex justify-between">
                  <span>Prep Progress</span>
                  <span className="text-white font-medium">{progressPercent}%</span>
                </p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Quick Actions & Due Reviews */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h2 className="text-lg font-bold text-white">Continue Practicing</h2>
                  </div>
                  <Link href="/problems" className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
                    Go to Problems <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="p-8 text-center bg-[#0a0a0a]">
                  <p className="text-gray-400 mb-6">You have access to 120+ curated questions specifically for Walmart SDE-1 interviews.</p>
                  <Link href="/problems" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Start Next Problem
                  </Link>
                </div>
              </div>

              {dueReviews.length > 0 && (
                <div className="bg-white/5 border border-orange-500/20 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-orange-500/5">
                    <ClockAlert className="w-5 h-5 text-orange-400" />
                    <h2 className="text-lg font-bold text-white">Due for Review ({dueReviews.length})</h2>
                  </div>
                  <div className="divide-y divide-white/10">
                    {dueReviews.map((q) => (
                      <div key={q.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div>
                          <h4 className="font-medium text-gray-200">{q.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{q.topic}</p>
                        </div>
                        <Link href={`/problems`} className="px-3 py-1.5 bg-orange-500/20 text-orange-300 text-sm font-medium rounded-lg hover:bg-orange-500/30 transition-colors">
                          Review
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Target Company Track */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden self-start">
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-lg font-bold text-white mb-1">Top {targetCompany} Questions</h2>
                <p className="text-xs text-gray-400">Highly frequent in recent interviews</p>
              </div>
              <div className="divide-y divide-white/10">
                {companyTrack.length > 0 ? companyTrack.map((q) => (
                  <div key={q.id} className="p-4 hover:bg-white/5 transition-colors">
                    <Link href={`/problems`} className="block">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-200 text-sm leading-snug hover:text-blue-400 transition-colors">{q.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          q.difficulty === 'EASY' ? 'bg-emerald-500/20 text-emerald-400' :
                          q.difficulty === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{q.topic}</span>
                      </div>
                    </Link>
                  </div>
                )) : (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No specific questions found for this company yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
