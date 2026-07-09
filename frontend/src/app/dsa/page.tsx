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
    queryFn: () => apiFetch<UserProgressDTO[]>("/progress"),
  });

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
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Questions...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#fafbfc] pb-24">
      <Header totalQuestions={allQuestions.length} totalTopics={dynamicTopics.length} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Filters
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          showWalmartOnly={showWalmartOnly}
          setShowWalmartOnly={setShowWalmartOnly}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />

        <div>
          {Object.entries(grouped).length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
              <h3 className="text-lg font-bold text-gray-900 mb-1">No questions found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters to see more results.</p>
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
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? "Loading more..." : "Load More Questions"}
            </button>
          </div>
        )}
      </main>
    </div>
    </ProtectedRoute>
  );
}
