import type { Block as BlockType, Course, Day } from "@/types";
import { Block } from "./Block";

interface DayColumnProps {
  blocks: BlockType[];
  courses: Record<string, Course>;
  minuteHeight: number;
  gridStartMin: number;
  gridEndMin: number;
}

export function DayColumn({
  blocks,
  courses,
  minuteHeight,
  gridStartMin,
  gridEndMin,
}: DayColumnProps) {
  const height = (gridEndMin - gridStartMin) * minuteHeight;

  return (
    <div className="relative flex-1 border-r border-border/50 min-w-[120px]">
      <div className="relative w-full" style={{ height: `${height}px` }}>
        {blocks.map((block) => {
          const course = courses[block.courseId];
          if (!course) return null;
          return (
            <Block
              key={block.id}
              block={block}
              course={course}
              minuteHeight={minuteHeight}
              gridStartMin={gridStartMin}
            />
          );
        })}
      </div>
    </div>
  );
}
