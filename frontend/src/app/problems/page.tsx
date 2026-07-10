"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Question, PageResponse, UserProgressDTO } from "@/types";
import Link from "next/link";
import { Check, ChevronDown, CheckCircle2, Circle } from "lucide-react";
import clsx from "clsx";

export default function ProblemsPage() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  
  const { data: questionsData, isLoading: isQuestionsLoading } = useQuery<PageResponse<Question>>({
    queryKey: ["questions", "DSA"],
    queryFn: () => apiFetch<PageResponse<Question>>("/questions?category=DSA&page=0&size=500", { requireAuth: true }),
  });

  const { data: progressData, isLoading: isProgressLoading } = useQuery<UserProgressDTO[]>({
    queryKey: ["progress"],
    queryFn: () => apiFetch<UserProgressDTO[]>("/progress", { requireAuth: true }),
  });

  if (isQuestionsLoading || isProgressLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  // Pre-filter for Walmart questions as requested
  const allQuestions = questionsData?.content || [];
  const walmartQuestions = allQuestions.filter(q => q.companyTags?.includes("Walmart"));

  // Apply Difficulty filter
  const displayedQuestions = walmartQuestions.filter(q => 
    filterDifficulty === "All" || q.difficulty === filterDifficulty.toUpperCase()
  );

  const getStatus = (questionId: string) => {
    return progressData?.find((p) => p.questionId === questionId)?.status;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] text-gray-300 pb-24">
        {/* Simple Navbar */}
        <nav className="border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white tracking-tight">InterviewPrep</Link>
            <div className="flex gap-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/problems" className="text-blue-400 font-medium">Problems</Link>
              <Link href="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Walmart Problemset</h1>
              <p className="text-gray-400">Curated list of highly frequent problems for Walmart interviews.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2"
              >
                <option value="All" className="bg-[#0a0a0a]">All Difficulties</option>
                <option value="Easy" className="bg-[#0a0a0a] text-emerald-400">Easy</option>
                <option value="Medium" className="bg-[#0a0a0a] text-amber-400">Medium</option>
                <option value="Hard" className="bg-[#0a0a0a] text-rose-400">Hard</option>
              </select>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th scope="col" className="px-6 py-4 w-16">Status</th>
                  <th scope="col" className="px-6 py-4">Title</th>
                  <th scope="col" className="px-6 py-4 w-24">Acceptance</th>
                  <th scope="col" className="px-6 py-4 w-32">Difficulty</th>
                  <th scope="col" className="px-6 py-4 w-40">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {displayedQuestions.map((q, idx) => {
                  const status = getStatus(q.id);
                  const isSolved = status === "SOLVED";
                  
                  // Mock acceptance rate between 30% and 80% for visual completeness
                  const mockAcceptance = (30 + (idx * 7 % 50)).toFixed(1) + "%";
                  
                  // Frequency calculation based on q.frequency (assumed 1-100 scale)
                  const freq = q.frequency || 50;

                  return (
                    <tr key={q.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 inline-block" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-600 inline-block" />
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-200">
                        <Link href={`/dsa`} className="hover:text-blue-400 transition-colors block">
                          {idx + 1}. {q.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {mockAcceptance}
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "text-[13px] font-medium",
                          q.difficulty === "EASY" && "text-emerald-400",
                          q.difficulty === "MEDIUM" && "text-amber-400",
                          q.difficulty === "HARD" && "text-rose-400"
                        )}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full opacity-80" 
                            style={{ width: `${freq}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {displayedQuestions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No problems found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </main>
      </div>
    </ProtectedRoute>
  );
}
