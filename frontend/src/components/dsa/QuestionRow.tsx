import { Question } from "@/types";
import { CheckCircle2, Circle, ExternalLink, RefreshCw, Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

interface QuestionRowProps {
  question: Question;
  status?: string;
  onToggleStatus: (confidence?: string) => void;
  isUpdatePending: boolean;
}

export default function QuestionRow({
  question,
  status,
  onToggleStatus,
  isUpdatePending,
}: QuestionRowProps) {
  const isSolved = status === "SOLVED";
  const isRevisionNeeded = status === "REVISION_NEEDED";
  const [showConfidence, setShowConfidence] = useState(false);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "EASY": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "MEDIUM": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "HARD": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const handleStatusClick = () => {
    if (isSolved || isRevisionNeeded) {
      onToggleStatus();
    } else {
      setShowConfidence(true);
    }
  };

  const handleConfidenceSelect = (confidence: string) => {
    onToggleStatus(confidence);
    setShowConfidence(false);
  };

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/5 transition-colors gap-4">
      <div className="flex items-start gap-4">
        {/* Status Button */}
        <div className="pt-1">
          {showConfidence ? (
            <div className="flex flex-col gap-1 bg-white/10 p-1.5 rounded-lg border border-white/20 animate-in fade-in zoom-in duration-200">
              <span className="text-[10px] uppercase font-bold text-gray-400 text-center mb-1">How was it?</span>
              <div className="flex gap-1">
                <button onClick={() => handleConfidenceSelect('EASY')} className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded">Easy</button>
                <button onClick={() => handleConfidenceSelect('MEDIUM')} className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded">Med</button>
                <button onClick={() => handleConfidenceSelect('HARD')} className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded">Hard</button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStatusClick}
              disabled={isUpdatePending}
              className={clsx(
                "transition-all duration-200 flex-shrink-0 focus:outline-none",
                isUpdatePending && "opacity-50 cursor-wait",
                isSolved && "text-emerald-400 hover:text-emerald-300",
                isRevisionNeeded && "text-orange-400 hover:text-orange-300",
                !isSolved && !isRevisionNeeded && "text-gray-500 hover:text-gray-300"
              )}
            >
              {isRevisionNeeded ? (
                <RefreshCw className="w-6 h-6" />
              ) : isSolved ? (
                <CheckCircle2 className="w-6 h-6 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
          )}
        </div>

        {/* Info */}
        <div>
          <Link href={`/dsa`} className="text-base font-semibold text-gray-200 hover:text-blue-400 transition-colors">
            {question.title}
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={clsx("px-2 py-0.5 rounded-md text-[11px] font-bold border tracking-wide", getDifficultyColor(question.difficulty))}>
              {question.difficulty}
            </span>
            {question.companyTags && question.companyTags.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                <Building2 className="w-3 h-3" />
                {question.companyTags[0]}
                {question.companyTags.length > 1 && ` +${question.companyTags.length - 1}`}
              </span>
            )}
            {isRevisionNeeded && (
              <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                Needs Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center sm:ml-auto ml-10">
        <Link
          href={`/dsa`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-colors"
        >
          Solve Problem
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
