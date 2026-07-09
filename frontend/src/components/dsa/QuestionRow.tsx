import { Question } from "@/types";
import { CheckCircle2, Circle, ExternalLink, FileText, PlayCircle } from "lucide-react";
import clsx from "clsx";

interface QuestionRowProps {
  question: Question;
  status: string | undefined;
  onToggleStatus: (id: string, currentStatus?: string) => void;
  isPending: boolean;
}

export default function QuestionRow({
  question,
  status,
  onToggleStatus,
  isPending,
}: QuestionRowProps) {
  const isSolved = status === "SOLVED";

  return (
    <tr className="group hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-0">
      {/* Status Toggle */}
      <td className="pl-6 pr-3 py-4 w-14">
        <button
          onClick={() => onToggleStatus(question.id, status)}
          disabled={isPending}
          className="flex items-center justify-center text-gray-300 hover:text-emerald-500 transition-colors disabled:opacity-50"
        >
          {isSolved ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
      </td>

      {/* Title & Tags */}
      <td className="px-3 py-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className={clsx(
              "text-sm font-semibold transition-colors",
              isSolved ? "text-gray-400 line-through decoration-gray-300" : "text-gray-900 group-hover:text-blue-600"
            )}>
              {question.title}
            </span>
            {question.companyTags?.includes("Walmart") && (
              <span className="shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-bold border border-blue-100">
                Walmart
              </span>
            )}
          </div>
          {question.companyTags && question.companyTags.length > 0 && (
            <div className="flex gap-1.5">
              {question.companyTags.filter(t => t !== "Walmart").slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </td>

      {/* Difficulty */}
      <td className="px-3 py-4 w-24">
        <span className={clsx(
          "inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md",
          question.difficulty === "EASY" ? "bg-emerald-50 text-emerald-700" :
          question.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-700" :
          "bg-rose-50 text-rose-700"
        )}>
          <span className={clsx(
            "w-1.5 h-1.5 rounded-full",
            question.difficulty === "EASY" ? "bg-emerald-500" :
            question.difficulty === "MEDIUM" ? "bg-amber-500" :
            "bg-rose-500"
          )} />
          {question.difficulty === "EASY" ? "Easy" :
           question.difficulty === "MEDIUM" ? "Medium" : "Hard"}
        </span>
      </td>

      {/* Frequency */}
      <td className="px-3 py-4 w-20 text-center">
        <div className="flex items-center justify-center gap-0.5 group/freq relative cursor-help">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                "w-1 h-3.5 rounded-full transition-colors",
                i < Math.min(Math.ceil(question.frequency / 2), 5)
                  ? "bg-orange-400"
                  : "bg-gray-200"
              )}
            />
          ))}
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover/freq:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
            Frequency: {question.frequency}/10
          </div>
        </div>
      </td>

      {/* Resources */}
      <td className="px-3 py-4 w-32">
        <div className="flex items-center justify-center gap-3">
          {question.articleUrl ? (
            <a href={question.articleUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" title="Read Article">
              <FileText className="w-4 h-4" />
            </a>
          ) : (
            <FileText className="w-4 h-4 text-gray-200" />
          )}
          {question.videoUrl ? (
            <a href={question.videoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors" title="Watch Video">
              <PlayCircle className="w-4 h-4" />
            </a>
          ) : (
            <PlayCircle className="w-4 h-4 text-gray-200" />
          )}
        </div>
      </td>

      {/* Action / Practice */}
      <td className="pr-6 pl-3 py-4 w-28 text-right">
        {question.leetcodeUrl ? (
          <a
            href={question.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg transition-all shadow-sm"
          >
            Solve <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-gray-300 px-3 py-1.5">—</span>
        )}
      </td>
    </tr>
  );
}
