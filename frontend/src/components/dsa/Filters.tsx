import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

interface FiltersProps {
  filterDifficulty: string;
  setFilterDifficulty: (d: string) => void;
  showWalmartOnly: boolean;
  setShowWalmartOnly: (s: boolean) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export default function Filters({
  filterDifficulty,
  setFilterDifficulty,
  showWalmartOnly,
  setShowWalmartOnly,
  onExpandAll,
  onCollapseAll,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        {/* Difficulty Filter */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {["All", "Easy", "Medium", "Hard"].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={clsx(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                filterDifficulty === d
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              )}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Walmart Filter */}
        <button
          onClick={() => setShowWalmartOnly(!showWalmartOnly)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
            showWalmartOnly
              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
              : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
          )}
        >
          <Building2 className={clsx("w-4 h-4", showWalmartOnly ? "text-blue-400" : "text-gray-400")} />
          Walmart Previously Asked
        </button>
      </div>

      {/* Expand/Collapse */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={onExpandAll}
          className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={onCollapseAll}
          className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          Collapse All
        </button>
      </div>
    </div>
  );
}
