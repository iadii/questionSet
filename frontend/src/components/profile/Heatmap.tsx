import clsx from "clsx";

interface HeatmapProps {
  data: Record<string, number>;
}

export default function Heatmap({ data }: HeatmapProps) {
  // Generate last 365 days in a grid format (weeks x days)
  const today = new Date();
  
  // We want to align the grid so the top row is Sunday, bottom is Saturday
  // We'll generate an array of 52 weeks, each with 7 days
  const numWeeks = 52;
  const daysInGrid = numWeeks * 7;
  
  interface GridDay {
    date: string;
    count: number;
    month: string;
    isFirstDayOfMonth: boolean;
  }
  
  const gridDays: GridDay[] = [];
  for (let i = daysInGrid - 1; i >= 0; i--) {
    const d = new Date(today);
    // Shift back by the number of days, plus adjust to end on the current day of the week
    const currentDayOfWeek = today.getDay(); // 0-6 (Sun-Sat)
    const daysToSubtract = i - (6 - currentDayOfWeek); 
    
    d.setDate(d.getDate() - daysToSubtract);
    
    // Only show up to today
    const isFuture = d > today;
    
    const dateStr = d.toISOString().split("T")[0];
    gridDays.push({
      date: dateStr,
      count: isFuture ? -1 : (data[dateStr] || 0), // -1 means don't render or render hidden
      month: d.toLocaleString('default', { month: 'short' }),
      isFirstDayOfMonth: d.getDate() === 1
    });
  }

  const getColor = (count: number) => {
    if (count === -1) return "bg-transparent border-none";
    if (count === 0) return "bg-[#2b2b2b]"; // Empty day (dark mode)
    if (count < 2) return "bg-[#0e4429]";  // Level 1
    if (count < 4) return "bg-[#006d32]";  // Level 2
    if (count < 6) return "bg-[#26a641]";  // Level 3
    return "bg-[#39d353]";                 // Level 4 (max)
  };

  const months = gridDays.filter(d => d.isFirstDayOfMonth && d.count !== -1);
  
  return (
    <div className="w-full overflow-x-auto pb-4">
      <h3 className="text-lg font-bold text-white mb-4">Activity Heatmap</h3>
      
      <div className="inline-flex flex-col min-w-max">
        
        {/* Months Row */}
        <div className="flex text-xs text-gray-500 mb-2 pl-8">
          {/* We simplify month labels for demonstration, a perfect implementation would position them absolutely based on the week index */}
          <div className="w-full flex justify-between px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Day of Week Labels */}
          <div className="flex flex-col justify-between text-[10px] text-gray-500 py-1 pr-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {Array.from({ length: numWeeks }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = gridDays[weekIndex * 7 + dayIndex];
                  if (!day) return null;
                  
                  return (
                    <div
                      key={day.date}
                      title={day.count === -1 ? "" : `${day.count} submissions on ${day.date}`}
                      className={clsx(
                        "w-[12px] h-[12px] rounded-sm transition-colors",
                        day.count !== -1 ? "cursor-help hover:ring-1 ring-gray-400" : "",
                        getColor(day.count)
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 text-xs text-gray-500 mt-4 pr-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-[12px] h-[12px] rounded-sm bg-[#2b2b2b]" />
            <div className="w-[12px] h-[12px] rounded-sm bg-[#0e4429]" />
            <div className="w-[12px] h-[12px] rounded-sm bg-[#006d32]" />
            <div className="w-[12px] h-[12px] rounded-sm bg-[#26a641]" />
            <div className="w-[12px] h-[12px] rounded-sm bg-[#39d353]" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
