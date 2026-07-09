import clsx from "clsx";

interface HeatmapProps {
  data: Record<string, number>;
}

export default function Heatmap({ data }: HeatmapProps) {
  // Generate last 365 days
  const today = new Date();
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({
      date: dateStr,
      count: data[dateStr] || 0
    });
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count < 2) return "bg-green-200";
    if (count < 4) return "bg-green-400";
    if (count < 6) return "bg-green-600";
    return "bg-green-800";
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Activity</h3>
      <div className="flex flex-col gap-2 min-w-max">
        <div className="grid grid-rows-7 grid-flow-col gap-1">
          {days.map((day, i) => (
            <div
              key={i}
              title={`${day.count} submissions on ${day.date}`}
              className={clsx("w-3 h-3 rounded-sm cursor-help", getColor(day.count))}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-800" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
