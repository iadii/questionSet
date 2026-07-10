"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Question } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import InterviewWorkspace from "@/components/profile/InterviewWorkspace";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;

  const { data: question, isLoading, error } = useQuery<Question>({
    queryKey: ["question", questionId],
    queryFn: () => apiFetch<Question>(`/questions/${questionId}`, { requireAuth: true }),
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-400 font-medium">Loading Workspace...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !question) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Question Not Found</h2>
          <p className="text-gray-400 mb-6">The problem you're looking for doesn't exist or you don't have access.</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
        
        {/* Compact Navbar */}
        <nav className="border-b border-white/10 bg-[#0a0a0a] flex-none z-50">
          <div className="w-full px-4 h-14 flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <span className="font-bold text-white truncate max-w-[300px] md:max-w-[500px]">
                {question.title}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                question.difficulty === "EASY" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                question.difficulty === "MEDIUM" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                "bg-rose-500/20 text-rose-300 border-rose-500/30"
              }`}>
                {question.difficulty}
              </span>
            </div>
            
            <div className="ml-auto flex items-center gap-4 text-sm font-medium">
              <Link href="/set" className="text-gray-400 hover:text-white transition-colors">Sets</Link>
            </div>
          </div>
        </nav>

        {/* Workspace Area - Takes remaining height */}
        <main className="flex-1 min-h-0 relative p-4">
          {/* Background Mesh */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
            <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen" />
            <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px] mix-blend-screen" />
          </div>

          <div className="h-full relative z-10">
            <InterviewWorkspace question={question} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
