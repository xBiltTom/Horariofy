import { useDroppable } from "@dnd-kit/core";
import type { Block as BlockType, Course, Day } from "@/types";
import { Block } from "./Block";

interface DayColumnProps {
  day: Day;
  blocks: BlockType[];
  courses: Record<string, Course>;
  minuteHeight: number;
  gridStartMin: number;
  gridEndMin: number;
}

export function DayColumn({
  day,
  blocks,
  courses,
  minuteHeight,
  gridStartMin,
  gridEndMin,
}: DayColumnProps) {
  const height = (gridEndMin - gridStartMin) * minuteHeight;

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day}`,
    data: { type: "day", day },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`relative flex-1 border-r border-border/50 min-w-[120px] transition-colors ${isOver ? 'bg-accent/20' : ''}`}
    >
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
