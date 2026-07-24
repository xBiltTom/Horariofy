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
  isReadOnly?: boolean;
}

export function DayColumn({
  day,
  blocks,
  courses,
  minuteHeight,
  gridStartMin,
  gridEndMin,
  isReadOnly = false,
}: DayColumnProps) {
  const height = (gridEndMin - gridStartMin) * minuteHeight;

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day}`,
    data: { type: "day", day },
    disabled: isReadOnly,
  });

  // Calculate overlapping columns
  const sortedBlocks = [...blocks].sort(
    (a, b) => a.startMin - b.startMin || b.endMin - a.endMin
  );

  const columns: BlockType[][] = [];
  const layoutData = new Map<string, { col: number; maxCol: number }>();
  let lastEventEnding: number | null = null;
  const currentCluster: BlockType[] = [];

  const packCluster = (cluster: BlockType[], numCols: number) => {
    for (const block of cluster) {
      // Find which column this block is in
      const colIndex = columns.findIndex(col => col.includes(block));
      layoutData.set(block.id, { col: colIndex, maxCol: numCols });
    }
  };

  for (const block of sortedBlocks) {
    if (lastEventEnding !== null && block.startMin >= lastEventEnding) {
      packCluster(currentCluster, columns.length);
      columns.length = 0;
      currentCluster.length = 0;
      lastEventEnding = null;
    }

    let placed = false;
    for (const col of columns) {
      const lastInCol = col[col.length - 1];
      if (lastInCol.endMin <= block.startMin) {
        col.push(block);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([block]);
    }

    currentCluster.push(block);
    if (lastEventEnding === null || block.endMin > lastEventEnding) {
      lastEventEnding = block.endMin;
    }
  }

  if (currentCluster.length > 0) {
    packCluster(currentCluster, columns.length);
  }

  return (
    <div 
      ref={isReadOnly ? undefined : setNodeRef}
      className={`relative flex-1 border-r border-border/50 min-w-[120px] transition-colors ${isOver && !isReadOnly ? 'bg-accent/20' : ''}`}
    >
      <div className="relative w-full" style={{ height: `${height}px` }}>
        {sortedBlocks.map((block) => {
          const course = courses[block.courseId];
          if (!course) return null;
          const layout = layoutData.get(block.id) || { col: 0, maxCol: 1 };
          return (
            <Block
              key={block.id}
              block={block}
              course={course}
              minuteHeight={minuteHeight}
              gridStartMin={gridStartMin}
              col={layout.col}
              maxCol={layout.maxCol}
              isReadOnly={isReadOnly}
            />
          );
        })}
      </div>
    </div>
  );
}
