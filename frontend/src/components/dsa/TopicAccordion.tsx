import { Question } from "@/types";
import QuestionRow from "./QuestionRow";
import { ChevronDown, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface TopicAccordionProps {
  topic: string;
  questions: Question[];
  isExpanded: boolean;
  onToggle: () => void;
  getQuestionStatus: (questionId: string) => string | undefined;
  onToggleStatus: (questionId: string, currentStatus?: string, confidence?: string) => void;
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
  const solvedCount = questions.filter((q) => getQuestionStatus(q.id) === "SOLVED").length;
  const progress = questions.length > 0 ? (solvedCount / questions.length) * 100 : 0;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-sm border border-white/10 overflow-hidden mb-4 transition-all duration-300 hover:shadow-lg hover:border-white/20">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-transparent hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={clsx(
            "p-2 rounded-xl transition-colors",
            isExpanded ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-gray-400"
          )}>
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-white">{topic}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-400 font-medium">
              <span>{questions.length} problems</span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span className="text-blue-400">{solvedCount} solved</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="hidden sm:flex items-center gap-4 w-48">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-300 w-12 text-right">{Math.round(progress)}%</span>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-white/10 divide-y divide-white/5">
          {questions.map((q) => (
            <QuestionRow
              key={q.id}
              question={q}
              status={getQuestionStatus(q.id)}
              onToggleStatus={(confidence) => onToggleStatus(q.id, getQuestionStatus(q.id), confidence)}
              isUpdatePending={isUpdatePending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
