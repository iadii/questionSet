"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Question, UserProgressDTO, PageResponse } from "@/types";

import Filters from "@/components/dsa/Filters";
import TopicAccordion from "@/components/dsa/TopicAccordion";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PracticeSheetProps {
  category: string;
  title: string;
}

export default function PracticeSheet({ category, title }: PracticeSheetProps) {
  const queryClient = useQueryClient();
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  const [showWalmartOnly, setShowWalmartOnly] = useState(false);

  // Fetch all questions for the category
  const { data: questionsData, isLoading: questionsLoading } = useQuery<PageResponse<Question>>({
    queryKey: ["questions", category],
    queryFn: () => apiFetch<PageResponse<Question>>(`/questions?category=${category}&page=0&size=500`, { requireAuth: true }),
  });

  const allQuestions = questionsData?.content || [];
  const dynamicTopics = Array.from(new Set(allQuestions.map((q) => q.topic))).sort();

  // Fetch progress
  const { data: progressData } = useQuery<UserProgressDTO[]>({
    queryKey: ["progress"],
    queryFn: () => apiFetch<UserProgressDTO[]>("/progress", { requireAuth: true }),
  });

  const categoryQuestionIds = new Set(allQuestions.map(q => q.id));
  const solvedIds = progressData?.filter(p => p.status === 'SOLVED' && categoryQuestionIds.has(p.questionId)).map(p => p.questionId) || [];

  // Update progress mutation
  const updateProgress = useMutation({
    mutationFn: ({ questionId, status, confidence }: { questionId: string; status: string; confidence?: string }) =>
      apiFetch(`/progress/${questionId}`, {
        method: "POST",
        body: JSON.stringify({ status, confidence }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });

  const handleToggleSolved = (questionId: string, currentStatus?: string, confidence?: string) => {
    if (currentStatus !== "SOLVED" || confidence) {
      updateProgress.mutate({ questionId, status: "SOLVED", confidence });
    }
  };

  const getQuestionStatus = (questionId: string) => {
    return progressData?.find((p) => p.questionId === questionId)?.status;
  };

  // Group questions
  const grouped = dynamicTopics.reduce<Record<string, Question[]>>((acc, topic) => {
    const topicQuestions = allQuestions
      .filter((q) => q.topic === topic)
      .filter((q) => filterDifficulty === "All" || q.difficulty === filterDifficulty.toUpperCase())
      .filter((q) => !showWalmartOnly || (q.companyTags && q.companyTags.includes("Walmart")));
    if (topicQuestions.length > 0) acc[topic] = topicQuestions;
    return acc;
  }, {});

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      next.has(topic) ? next.delete(topic) : next.add(topic);
      return next;
    });
  };

  const handleExpandAll = () => setExpandedTopics(new Set(dynamicTopics));
  const handleCollapseAll = () => setExpandedTopics(new Set());

  if (questionsLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center pt-32 pb-24">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium">Loading Questions...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="text-white relative overflow-hidden pb-24">
        
        {/* Navbar */}
        <nav className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white tracking-tight">InterviewPrep</Link>
            <div className="flex gap-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/set" className="text-blue-400 font-medium">Sets</Link>
              <Link href="/problems" className="text-gray-400 hover:text-white transition-colors">Problems</Link>
              <Link href="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link>
            </div>
          </div>
        </nav>

        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none fixed z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px] mix-blend-screen" />
        </div>

        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-[64px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2">
                <Link href="/set" className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10 bg-white/5">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">{title}</h1>
                  <p className="text-gray-400">Curated Problems for Interview Prep</p>
                </div>
                <div className="ml-auto text-right bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <div className="text-sm text-gray-400 font-medium">Progress</div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    {solvedIds.length} / {allQuestions.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
              <Filters
                filterDifficulty={filterDifficulty}
                setFilterDifficulty={setFilterDifficulty}
                showWalmartOnly={showWalmartOnly}
                setShowWalmartOnly={setShowWalmartOnly}
                onExpandAll={handleExpandAll}
                onCollapseAll={handleCollapseAll}
              />
            </div>

            <div className="space-y-4">
              {Object.entries(grouped).length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed backdrop-blur-xl">
                  <h3 className="text-lg font-bold text-white mb-1">No questions found</h3>
                  <p className="text-gray-400 text-sm">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                Object.entries(grouped).map(([topic, questions]) => (
                  <TopicAccordion
                    key={topic}
                    topic={topic}
                    questions={questions}
                    isExpanded={expandedTopics.has(topic)}
                    onToggle={() => toggleTopic(topic)}
                    getQuestionStatus={getQuestionStatus}
                    onToggleStatus={handleToggleSolved}
                    isUpdatePending={updateProgress.isPending}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
