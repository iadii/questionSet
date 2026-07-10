"use client";

import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Question, UserProgressDTO, PageResponse } from "@/types";

import Header from "@/components/dsa/Header";
import Filters from "@/components/dsa/Filters";
import TopicAccordion from "@/components/dsa/TopicAccordion";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DSASheetPage() {
  const queryClient = useQueryClient();
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  const [showWalmartOnly, setShowWalmartOnly] = useState(false);

  // Fetch questions with infinite pagination
  const { 
    data: questionsData, 
    isLoading: questionsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<PageResponse<Question>, Error>({
    queryKey: ["questions", "DSA"],
    queryFn: ({ pageParam }) => apiFetch<PageResponse<Question>>(`/questions?category=DSA&page=${pageParam}&size=20`, { requireAuth: true }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.number < lastPage.totalPages - 1) {
        return lastPage.number + 1;
      }
      return undefined;
    }
  });

  const allQuestions = questionsData?.pages.flatMap(page => page.content) || [];
  const dynamicTopics = Array.from(new Set(allQuestions.map((q) => q.topic))).sort();

  // Fetch progress
  const { data: progressData } = useQuery<UserProgressDTO[]>({
    queryKey: ["progress"],
    queryFn: () => apiFetch<UserProgressDTO[]>("/progress", { requireAuth: true }),
  });

  const solvedIds = progressData?.filter(p => p.status === 'SOLVED').map(p => p.questionId) || [];

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

  // Group questions by dynamically derived topics
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading Questions...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden pb-24">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px] mix-blend-screen" />
        </div>

        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">DSA Sheet</h1>
                <p className="text-gray-400">120+ Curated Problems for Interview Prep</p>
              </div>
              <div className="text-right bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <div className="text-sm text-gray-400 font-medium">Progress</div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  {solvedIds.length} / {allQuestions.length}
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
            
            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl shadow-sm hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  {isFetchingNextPage ? "Loading more..." : "Load More Questions"}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
