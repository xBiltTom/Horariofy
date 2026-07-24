import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import { minToTime } from "@/utils/time";
import { COURSE_COLOR_STYLES } from "@/utils/colors";
import { DAY_LABELS, type Block as BlockType, type Course } from "@/types";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CourseForm } from "@/components/sidebar/CourseForm";
import { ResizeHandle } from "./ResizeHandle";

interface BlockProps {
  block: BlockType;
  course: Course;
  minuteHeight: number;
  gridStartMin: number;
  isOverlay?: boolean;
  col?: number;
  maxCol?: number;
  isReadOnly?: boolean;
}

export function Block({ 
  block, 
  course, 
  minuteHeight, 
  gridStartMin, 
  isOverlay = false,
  col = 0,
  maxCol = 1,
  isReadOnly = false
}: BlockProps) {
  const top = (block.startMin - gridStartMin) * minuteHeight;
  const height = (block.endMin - block.startMin) * minuteHeight;
  const style = COURSE_COLOR_STYLES[course.color];

  // If the block is very small (e.g. 15 mins), we might want to hide the time or location
  const duration = block.endMin - block.startMin;
  const isCompact = duration <= 30;

  const [open, setOpen] = useState(false);
  const updateCourse = useScheduleStore((s) => s.updateCourse);
  const removeBlock = useScheduleStore((s) => s.removeBlock);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `block-${block.id}`,
    data: { type: "block", blockId: block.id },
    disabled: isReadOnly,
  });

  // Calculate horizontal position based on overlapping columns
  const widthPercent = 100 / maxCol;
  const leftPercent = col * widthPercent;
  // Apply a small gap between overlapping blocks (except if maxCol is 1)
  const widthStr = maxCol > 1 ? `calc(${widthPercent}% - 4px)` : 'auto';

  const session = course.sessions?.find(s => s.id === block.sessionId) || { type: "Clase", professor: "", location: "" };

  const blockContent = (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      suppressHydrationWarning
      className={`absolute rounded-md border p-1.5 shadow-sm transition-all overflow-hidden flex flex-col group ${isReadOnly ? '' : 'cursor-grab active:cursor-grabbing hover:shadow-md'} ${isDragging && !isOverlay ? 'opacity-40' : ''}`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        width: widthStr,
        left: maxCol > 1 ? `calc(${leftPercent}% + 2px)` : '4px',
        right: maxCol > 1 ? 'auto' : '4px',
        backgroundColor: style.soft,
        borderColor: style.border,
        zIndex: isDragging ? 40 : 10 + col, // Ensure later columns overlap slightly if we wanted negative margins, but here they are side by side
      }}
    >
      {/* Indicador de color sólido a la izquierda */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 ${isReadOnly ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} transition-opacity`} 
        style={{ backgroundColor: style.solid }}
      />
      
      <div className="pl-1.5 flex flex-col h-full relative z-10 w-full text-left overflow-hidden pb-1">
        <span 
          className="text-xs font-bold leading-tight uppercase tracking-wider opacity-80 break-words" 
          style={{ color: style.text }}
        >
          {course.name}
        </span>
        <span 
          className="text-sm font-black leading-tight mt-0.5 break-words" 
          style={{ color: style.text }}
        >
          {session.type}
        </span>
        
        {!isCompact && (
          <div className="flex flex-col gap-0.5 mt-1.5 flex-1 w-full min-h-0 overflow-hidden">
            {session.professor && (
              <span 
                className="text-[11px] font-medium leading-tight opacity-90 break-words" 
                style={{ color: style.text }}
              >
                {session.professor}
              </span>
            )}
            {session.location && (
              <span 
                className="text-[11px] font-medium leading-tight opacity-90 break-words" 
                style={{ color: style.text }}
              >
                {session.location}
              </span>
            )}
            <span 
              className="text-[10px] font-bold opacity-70 mt-auto pt-1" 
              style={{ color: style.text }}
            >
              {minToTime(block.startMin)} - {minToTime(block.endMin)}
            </span>
          </div>
        )}
      </div>

      {/* Resize Handle only visible when not dragging the block itself and not readonly */}
      {!isDragging && !isOverlay && !isReadOnly && (
        <>
          <ResizeHandle
            blockId={block.id}
            initialStartMin={block.startMin}
            initialEndMin={block.endMin}
            minuteHeight={minuteHeight}
            position="top"
          />
          <ResizeHandle
            blockId={block.id}
            initialStartMin={block.startMin}
            initialEndMin={block.endMin}
            minuteHeight={minuteHeight}
            position="bottom"
          />
        </>
      )}
    </div>
  );

  if (isReadOnly) {
    return blockContent;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={blockContent} nativeButton={false} />
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{course.name}</h4>
              <p className="text-xs text-muted-foreground">{session.type}</p>
            </div>
            <button 
              onClick={() => removeBlock(block.id)}
              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"
              title="Eliminar bloque"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {DAY_LABELS[block.day]} de {minToTime(block.startMin)} a {minToTime(block.endMin)}
          </p>
        </div>
        <div className="p-3">
          <CourseForm
            initialName={course.name}
            initialColor={course.color}
            initialSessions={course.sessions}
            submitLabel="Guardar cambios"
            onCancel={() => setOpen(false)}
            onSubmit={(data) => {
              updateCourse(course.id, data);
              setOpen(false);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
