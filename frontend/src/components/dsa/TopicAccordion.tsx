import { ChevronDown, FolderOpen } from "lucide-react";
import clsx from "clsx";
import { Question } from "@/types";
import QuestionRow from "./QuestionRow";

interface TopicAccordionProps {
  topic: string;
  questions: Question[];
  isExpanded: boolean;
  onToggle: () => void;
  getQuestionStatus: (id: string) => string | undefined;
  onToggleStatus: (id: string, currentStatus?: string, confidence?: string) => void;
  isUpdatePending: boolean;
}

export default function TopicAccordion({
  topic,
  questions,
  isExpanded,
  onToggle,
  getQuestionStatus,
  onToggleStatus,
  isUpdatePending,
}: TopicAccordionProps) {
  const easyCount = questions.filter((q) => q.difficulty === "EASY").length;
  const mediumCount = questions.filter((q) => q.difficulty === "MEDIUM").length;
  const hardCount = questions.filter((q) => q.difficulty === "HARD").length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4 transition-all duration-200">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FolderOpen className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-gray-900">{topic}</span>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {questions.length} items
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            {easyCount > 0 && <span className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold">{easyCount} Easy</span>}
            {mediumCount > 0 && <span className="text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 font-semibold">{mediumCount} Med</span>}
            {hardCount > 0 && <span className="text-xs px-2 py-1 rounded-md bg-rose-50 text-rose-700 font-semibold">{hardCount} Hard</span>}
          </div>
          <ChevronDown
            className={clsx(
              "w-5 h-5 text-gray-400 transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Accordion Body */}
      <div
        className={clsx(
          "grid transition-all duration-300 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <table className="w-full text-left border-t border-gray-100">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-100">
                <th className="pl-6 pr-3 py-3 w-14 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Problem</th>
                <th className="px-3 py-3 w-24 font-semibold">Difficulty</th>
                <th className="px-3 py-3 w-20 text-center font-semibold">Freq</th>
                <th className="px-3 py-3 w-32 text-center font-semibold">Resources</th>
                <th className="pr-6 pl-3 py-3 w-28 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <QuestionRow
                  key={q.id}
                  question={q}
                  status={getQuestionStatus(q.id)}
                  onToggleStatus={onToggleStatus}
                  isPending={isUpdatePending}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
