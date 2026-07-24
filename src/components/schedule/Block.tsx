import { useDraggable } from "@dnd-kit/core";
import { minToTime } from "@/utils/time";
import { COURSE_COLOR_STYLES } from "@/utils/colors";
import type { Block as BlockType, Course } from "@/types";

interface BlockProps {
  block: BlockType;
  course: Course;
  minuteHeight: number;
  gridStartMin: number;
  isOverlay?: boolean;
}

export function Block({ block, course, minuteHeight, gridStartMin, isOverlay = false }: BlockProps) {
  const top = (block.startMin - gridStartMin) * minuteHeight;
  const height = (block.endMin - block.startMin) * minuteHeight;
  const style = COURSE_COLOR_STYLES[course.color];

  // If the block is very small (e.g. 15 mins), we might want to hide the time or location
  const duration = block.endMin - block.startMin;
  const isCompact = duration <= 30;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `block-${block.id}`,
    data: { type: "block", blockId: block.id },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`absolute inset-x-1 rounded-md border p-1.5 shadow-sm transition-all hover:shadow-md overflow-hidden flex flex-col group cursor-grab active:cursor-grabbing ${isDragging && !isOverlay ? 'opacity-40' : ''}`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: style.soft,
        borderColor: style.border,
      }}
    >
      {/* Indicador de color sólido a la izquierda */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 opacity-70 group-hover:opacity-100 transition-opacity" 
        style={{ backgroundColor: style.solid }}
      />
      
      <div className="pl-1.5 flex flex-col h-full relative z-10">
        <span 
          className="text-xs font-semibold leading-tight truncate" 
          style={{ color: style.text }}
        >
          {course.name}
        </span>
        
        {!isCompact && (
          <>
            <span 
              className="text-[10px] opacity-80 mt-0.5 truncate" 
              style={{ color: style.text }}
            >
              {minToTime(block.startMin)} - {minToTime(block.endMin)}
            </span>
            {course.location && (
              <span 
                className="text-[10px] opacity-70 mt-auto truncate" 
                style={{ color: style.text }}
              >
                {course.location}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
