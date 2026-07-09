"use client";

import { useState } from "react";
import Link from "next/link";

// Topic ordering like Striver's SDE Sheet
const TOPIC_ORDER = [
  "Arrays", "Strings", "Linked List", "Stack", "Queue",
  "Trees", "BST", "Heap", "Graph", "DP",
  "Greedy", "Recursion", "Backtracking", "Trie",
  "Bit Manipulation", "Binary Search", "Sliding Window", "Design"
];

const TOPIC_ICONS: Record<string, string> = {
  "Arrays": "📊", "Strings": "🔤", "Linked List": "🔗", "Stack": "📚",
  "Queue": "🚶", "Trees": "🌳", "BST": "🌲", "Heap": "⛰️",
  "Graph": "🕸️", "DP": "🧩", "Greedy": "🎯", "Recursion": "🔄",
  "Backtracking": "↩️", "Trie": "🔡", "Bit Manipulation": "💻",
  "Binary Search": "🔍", "Sliding Window": "🪟", "Design": "🏗️"
};

interface Question {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  category: string;
  isWalmartPrevious: boolean;
  frequency: number;
  leetcodeUrl?: string;
  articleUrl?: string;
  videoUrl?: string;
  companyTags?: string[];
  hints?: string[];
  status?: string;
}

// --- MOCK DATA (mirrors the JSON structure exactly) ---
const allQuestions: Question[] = [
  // Arrays
  { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 9, leetcodeUrl: "https://leetcode.com/problems/two-sum/", companyTags: ["Walmart", "Amazon", "Google"], hints: ["Use a HashMap to store each number's index."] },
  { id: 2, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 8, leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", companyTags: ["Walmart", "Amazon"] },
  { id: 3, title: "Contains Duplicate", difficulty: "Easy", topic: "Arrays", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/", companyTags: ["Amazon"] },
  { id: 4, title: "Maximum Subarray", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/", companyTags: ["Walmart", "Amazon", "Google"] },
  { id: 5, title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/", companyTags: ["Walmart", "Amazon"] },
  { id: 6, title: "3Sum", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/3sum/", companyTags: ["Walmart", "Amazon", "Google"] },
  { id: 7, title: "Sort Colors", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/sort-colors/", companyTags: ["Walmart"] },
  { id: 8, title: "Subarray Sum Equals K", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 8, leetcodeUrl: "https://leetcode.com/problems/subarray-sum-equals-k/", companyTags: ["Walmart", "Google"] },
  { id: 9, title: "Jump Game", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/jump-game/", companyTags: ["Walmart"] },
  { id: 10, title: "Merge Intervals", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/merge-intervals/", companyTags: ["Walmart", "Google", "Facebook"] },
  { id: 11, title: "Next Permutation", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/next-permutation/", companyTags: ["Walmart", "Google"] },
  { id: 12, title: "Container With Most Water", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/", companyTags: ["Amazon", "Google"] },
  { id: 13, title: "Trapping Rain Water", difficulty: "Hard", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/", companyTags: ["Walmart", "Amazon", "Google"] },
  { id: 14, title: "Set Matrix Zeroes", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/set-matrix-zeroes/", companyTags: ["Walmart"] },
  { id: 15, title: "Rotate Image", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/rotate-image/", companyTags: ["Amazon"] },
  { id: 16, title: "Spiral Matrix", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/spiral-matrix/", companyTags: ["Amazon"] },
  { id: 17, title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "Arrays", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/", companyTags: ["Walmart", "Google"] },
  // Strings
  { id: 18, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Strings", category: "DSA", isWalmartPrevious: true, frequency: 9, leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", companyTags: ["Walmart", "Amazon", "Google"] },
  { id: 19, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "Strings", category: "DSA", isWalmartPrevious: true, frequency: 8, leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/", companyTags: ["Walmart", "Amazon"] },
  { id: 20, title: "Valid Anagram", difficulty: "Easy", topic: "Strings", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/valid-anagram/", companyTags: ["Walmart"] },
  { id: 21, title: "Group Anagrams", difficulty: "Medium", topic: "Strings", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/group-anagrams/", companyTags: ["Amazon", "Facebook"] },
  { id: 22, title: "Longest Repeating Character Replacement", difficulty: "Medium", topic: "Strings", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/", companyTags: ["Walmart"] },
  { id: 23, title: "Minimum Window Substring", difficulty: "Hard", topic: "Strings", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/", companyTags: ["Amazon", "Google"] },
  // Linked List
  { id: 24, title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", category: "DSA", isWalmartPrevious: true, frequency: 8, leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/", companyTags: ["Walmart", "Amazon"] },
  { id: 25, title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/", companyTags: ["Walmart", "Amazon"] },
  { id: 26, title: "Linked List Cycle", difficulty: "Easy", topic: "Linked List", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/", companyTags: ["Walmart"] },
  { id: 27, title: "Reverse Nodes in k-Group", difficulty: "Hard", topic: "Linked List", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/reverse-nodes-in-k-group/", companyTags: ["Walmart", "Amazon"] },
  { id: 28, title: "Copy List with Random Pointer", difficulty: "Medium", topic: "Linked List", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/copy-list-with-random-pointer/", companyTags: ["Walmart", "Amazon"] },
  // Stack
  { id: 29, title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", category: "DSA", isWalmartPrevious: true, frequency: 9, leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/", companyTags: ["Walmart", "Amazon", "Google"] },
  { id: 30, title: "Min Stack", difficulty: "Medium", topic: "Stack", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/min-stack/", companyTags: ["Amazon"] },
  { id: 31, title: "Daily Temperatures", difficulty: "Medium", topic: "Stack", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/", companyTags: ["Amazon"] },
  { id: 32, title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/", companyTags: ["Google"] },
  // Trees
  { id: 33, title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/", companyTags: ["Walmart", "Amazon"] },
  { id: 34, title: "Binary Tree Right Side View", difficulty: "Medium", topic: "Trees", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/binary-tree-right-side-view/", companyTags: ["Walmart", "Amazon", "Facebook"] },
  { id: 35, title: "Symmetric Tree", difficulty: "Easy", topic: "Trees", category: "DSA", isWalmartPrevious: true, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/symmetric-tree/", companyTags: ["Walmart"] },
  { id: 36, title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", topic: "Trees", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", companyTags: ["Walmart", "Google"] },
  { id: 37, title: "Binary Tree Zigzag Level Order Traversal", difficulty: "Medium", topic: "Trees", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", companyTags: ["Walmart"] },
  { id: 38, title: "Lowest Common Ancestor", difficulty: "Medium", topic: "Trees", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", companyTags: ["Walmart", "Amazon", "Facebook"] },
  { id: 39, title: "Diameter of Binary Tree", difficulty: "Easy", topic: "Trees", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/diameter-of-binary-tree/", companyTags: ["Facebook", "Google"] },
  // BST
  { id: 40, title: "Validate Binary Search Tree", difficulty: "Medium", topic: "BST", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/", companyTags: ["Walmart", "Amazon"] },
  { id: 41, title: "Kth Smallest Element in a BST", difficulty: "Medium", topic: "BST", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", companyTags: ["Walmart", "Amazon"] },
  // Heap
  { id: 42, title: "Top K Frequent Elements", difficulty: "Medium", topic: "Heap", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/", companyTags: ["Walmart", "Amazon"] },
  { id: 43, title: "Kth Largest Element in an Array", difficulty: "Medium", topic: "Heap", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/", companyTags: ["Walmart", "Amazon", "Facebook"] },
  { id: 44, title: "Merge K Sorted Lists", difficulty: "Hard", topic: "Heap", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/", companyTags: ["Walmart", "Amazon", "Google"] },
  // Graph
  { id: 45, title: "Number of Islands", difficulty: "Medium", topic: "Graph", category: "DSA", isWalmartPrevious: true, frequency: 9, leetcodeUrl: "https://leetcode.com/problems/number-of-islands/", companyTags: ["Walmart", "Amazon", "Google", "Microsoft"] },
  { id: 46, title: "Course Schedule", difficulty: "Medium", topic: "Graph", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/course-schedule/", companyTags: ["Walmart", "Amazon"] },
  { id: 47, title: "Word Search", difficulty: "Medium", topic: "Graph", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/word-search/", companyTags: ["Walmart", "Amazon"] },
  { id: 48, title: "Rotting Oranges", difficulty: "Medium", topic: "Graph", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/", companyTags: ["Walmart", "Amazon"] },
  // DP
  { id: 49, title: "Climbing Stairs", difficulty: "Easy", topic: "DP", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/", companyTags: ["Walmart", "Amazon"] },
  { id: 50, title: "House Robber", difficulty: "Medium", topic: "DP", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/house-robber/", companyTags: ["Walmart", "Amazon"] },
  { id: 51, title: "House Robber II", difficulty: "Medium", topic: "DP", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/", companyTags: ["Walmart"] },
  { id: 52, title: "Coin Change", difficulty: "Medium", topic: "DP", category: "DSA", isWalmartPrevious: true, frequency: 8, leetcodeUrl: "https://leetcode.com/problems/coin-change/", companyTags: ["Walmart", "Amazon", "Google"] },
  { id: 53, title: "Longest Common Subsequence", difficulty: "Medium", topic: "DP", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/", companyTags: ["Walmart", "Amazon"] },
  { id: 54, title: "Word Break", difficulty: "Medium", topic: "DP", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/word-break/", companyTags: ["Walmart", "Amazon", "Google"] },
  { id: 55, title: "Decode Ways", difficulty: "Medium", topic: "DP", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/decode-ways/", companyTags: ["Walmart"] },
  { id: 56, title: "Partition Equal Subset Sum", difficulty: "Medium", topic: "DP", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/", companyTags: ["Walmart", "Amazon"] },
  { id: 57, title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "DP", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/", companyTags: ["Walmart", "Google"] },
  { id: 58, title: "Edit Distance", difficulty: "Medium", topic: "DP", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/edit-distance/", companyTags: ["Amazon", "Google"] },
  // Binary Search
  { id: 59, title: "Binary Search", difficulty: "Easy", topic: "Binary Search", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/binary-search/", companyTags: ["Walmart", "Amazon"] },
  { id: 60, title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", category: "DSA", isWalmartPrevious: true, frequency: 7, leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/", companyTags: ["Walmart", "Amazon", "Google"] },
  { id: 61, title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/", companyTags: ["Walmart", "Google"] },
  // Sliding Window
  { id: 62, title: "Maximum Sum Subarray of Size K", difficulty: "Easy", topic: "Sliding Window", category: "DSA", isWalmartPrevious: false, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/maximum-average-subarray-i/", companyTags: ["Amazon"] },
  { id: 63, title: "Minimum Size Subarray Sum", difficulty: "Medium", topic: "Sliding Window", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/minimum-size-subarray-sum/", companyTags: ["Amazon"] },
  // Design
  { id: 64, title: "LRU Cache", difficulty: "Medium", topic: "Design", category: "DSA", isWalmartPrevious: true, frequency: 9, leetcodeUrl: "https://leetcode.com/problems/lru-cache/", companyTags: ["Walmart", "Amazon", "Google", "Facebook"] },
  { id: 65, title: "Design HashMap", difficulty: "Easy", topic: "Design", category: "DSA", isWalmartPrevious: true, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/design-hashmap/", companyTags: ["Walmart"] },
  { id: 66, title: "Insert Delete GetRandom O(1)", difficulty: "Medium", topic: "Design", category: "DSA", isWalmartPrevious: true, frequency: 6, leetcodeUrl: "https://leetcode.com/problems/insert-delete-getrandom-o1/", companyTags: ["Walmart", "Amazon", "Facebook"] },
  // Backtracking
  { id: 67, title: "Subsets II", difficulty: "Medium", topic: "Backtracking", category: "DSA", isWalmartPrevious: true, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/subsets-ii/", companyTags: ["Walmart"] },
  { id: 68, title: "Permutations", difficulty: "Medium", topic: "Backtracking", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/permutations/", companyTags: ["Amazon", "Google"] },
  // Greedy
  { id: 69, title: "Gas Station", difficulty: "Medium", topic: "Greedy", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/gas-station/", companyTags: ["Amazon"] },
  { id: 70, title: "Task Scheduler", difficulty: "Medium", topic: "Greedy", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/task-scheduler/", companyTags: ["Facebook"] },
  // Trie
  { id: 71, title: "Implement Trie (Prefix Tree)", difficulty: "Medium", topic: "Trie", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/", companyTags: ["Amazon", "Google"] },
  // Bit Manipulation
  { id: 72, title: "Single Number", difficulty: "Easy", topic: "Bit Manipulation", category: "DSA", isWalmartPrevious: false, frequency: 5, leetcodeUrl: "https://leetcode.com/problems/single-number/", companyTags: ["Amazon"] },
];

export default function DSASheetPage() {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(TOPIC_ORDER));
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  const [showWalmartOnly, setShowWalmartOnly] = useState(false);

  // Group questions by topic
  const grouped = TOPIC_ORDER.reduce<Record<string, Question[]>>((acc, topic) => {
    const topicQuestions = allQuestions
      .filter((q) => q.topic === topic)
      .filter((q) => filterDifficulty === "All" || q.difficulty === filterDifficulty)
      .filter((q) => !showWalmartOnly || q.isWalmartPrevious);
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

  const totalQ = allQuestions.length;

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Walmart 120 DSA Sheet</h1>
            <p className="text-sm text-gray-500 mt-0.5">{totalQ} questions across {TOPIC_ORDER.length} topics</p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filterDifficulty === d
                    ? d === "Easy" ? "bg-green-100 text-green-700"
                    : d === "Medium" ? "bg-yellow-100 text-yellow-700"
                    : d === "Hard" ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowWalmartOnly(!showWalmartOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showWalmartOnly
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            🏪 Walmart Previously Asked
          </button>
          <button
            onClick={() => setExpandedTopics(new Set())}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          >
            Collapse All
          </button>
          <button
            onClick={() => setExpandedTopics(new Set(TOPIC_ORDER))}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          >
            Expand All
          </button>
        </div>

        {/* Topic Sections */}
        <div className="space-y-3">
          {Object.entries(grouped).map(([topic, questions]) => {
            const isExpanded = expandedTopics.has(topic);
            const easyCount = questions.filter((q) => q.difficulty === "Easy").length;
            const mediumCount = questions.filter((q) => q.difficulty === "Medium").length;
            const hardCount = questions.filter((q) => q.difficulty === "Hard").length;

            return (
              <div key={topic} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Topic Header */}
                <button
                  onClick={() => toggleTopic(topic)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{TOPIC_ICONS[topic] || "📁"}</span>
                    <span className="text-base font-semibold text-gray-800">{topic}</span>
                    <span className="text-xs text-gray-400 font-mono">({questions.length})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {easyCount > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">{easyCount} Easy</span>}
                    {mediumCount > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 font-medium">{mediumCount} Med</span>}
                    {hardCount > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">{hardCount} Hard</span>}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Questions Table */}
                {isExpanded && (
                  <table className="w-full border-t border-gray-100">
                    <thead>
                      <tr className="bg-gray-50/60 text-[11px] uppercase tracking-wider text-gray-400">
                        <th className="pl-5 pr-2 py-2.5 text-left w-10">Status</th>
                        <th className="px-2 py-2.5 text-left">Problem</th>
                        <th className="px-2 py-2.5 text-left w-20">Difficulty</th>
                        <th className="px-2 py-2.5 text-center w-16">Freq</th>
                        <th className="px-2 py-2.5 text-center w-24">Prev Asked</th>
                        <th className="px-2 py-2.5 text-center w-20">Article</th>
                        <th className="px-2 py-2.5 text-center w-20">Video</th>
                        <th className="pr-5 pl-2 py-2.5 text-center w-20">Practice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {questions.map((q, idx) => (
                        <tr key={q.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="pl-5 pr-2 py-3">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                                {q.title}
                              </span>
                              {q.isWalmartPrevious && (
                                <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                                  W
                                </span>
                              )}
                            </div>
                            {q.companyTags && q.companyTags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {q.companyTags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="text-[10px] text-gray-400">{tag}</span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-3">
                            <span className={`text-xs font-semibold ${
                              q.difficulty === "Easy" ? "text-green-600" :
                              q.difficulty === "Medium" ? "text-yellow-600" :
                              "text-red-600"
                            }`}>
                              {q.difficulty}
                            </span>
                          </td>
                          <td className="px-2 py-3 text-center">
                            <div className="flex items-center justify-center gap-0.5">
                              {Array.from({ length: Math.min(q.frequency, 10) }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 h-3 rounded-full ${
                                    i < q.frequency * 0.6 ? "bg-orange-400" : "bg-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-2 py-3 text-center">
                            {q.isWalmartPrevious ? (
                              <span className="text-green-600 text-sm">✅</span>
                            ) : (
                              <span className="text-gray-300 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-2 py-3 text-center">
                            <span className="text-gray-300 text-sm cursor-pointer hover:text-blue-600" title="Article">📄</span>
                          </td>
                          <td className="px-2 py-3 text-center">
                            <span className="text-gray-300 text-sm cursor-pointer hover:text-red-500" title="Video">▶️</span>
                          </td>
                          <td className="pr-5 pl-2 py-3 text-center">
                            {q.leetcodeUrl ? (
                              <a
                                href={q.leetcodeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Solve ↗
                              </a>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
