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
    <div className="flex flex-wrap items-center gap-3 mb-8">
      {/* Difficulty Filter */}
      <div className="flex items-center p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
        {["All", "Easy", "Medium", "Hard"].map((d) => (
          <button
            key={d}
            onClick={() => setFilterDifficulty(d)}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200",
              filterDifficulty === d
                ? d === "Easy" ? "bg-emerald-100 text-emerald-700 shadow-sm"
                : d === "Medium" ? "bg-amber-100 text-amber-700 shadow-sm"
                : d === "Hard" ? "bg-rose-100 text-rose-700 shadow-sm"
                : "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 shadow-sm",
          showWalmartOnly
            ? "bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-100"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <Building2 className={clsx("w-4 h-4", showWalmartOnly ? "text-blue-600" : "text-gray-400")} />
        Walmart Previously Asked
      </button>

      <div className="flex-1" />

      {/* Expand/Collapse */}
      <div className="flex items-center gap-2">
        <button
          onClick={onCollapseAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-sm transition-all"
        >
          <ChevronUp className="w-4 h-4 text-gray-400" />
          Collapse All
        </button>
        <button
          onClick={onExpandAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-sm transition-all"
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
          Expand All
        </button>
      </div>
    </div>
  );
}
