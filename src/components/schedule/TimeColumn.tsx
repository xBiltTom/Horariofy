import { hourMarks, minToTime } from "@/utils/time";

interface TimeColumnProps {
  startMin: number;
  endMin: number;
  minuteHeight: number;
}

export function TimeColumn({ startMin, endMin, minuteHeight }: TimeColumnProps) {
  const marks = hourMarks(startMin, endMin);

  return (
    <div className="relative w-16 shrink-0 border-r border-border/50 bg-background/95 backdrop-blur z-10">
      {/* We add a small offset so the time text aligns with the horizontal grid lines */}
      <div className="relative" style={{ height: (endMin - startMin) * minuteHeight }}>
        {marks.map((min) => {
          // If the mark is outside the range, we don't render it (or clip it).
          if (min < startMin || min > endMin) return null;
          
          const top = (min - startMin) * minuteHeight;
          return (
            <div
              key={min}
              className="absolute left-0 right-3 flex items-center justify-end"
              style={{ top: `${top}px`, transform: "translateY(-50%)" }}
            >
              <span className="text-[11px] font-medium tracking-wider text-muted-foreground/70">
                {minToTime(min)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
