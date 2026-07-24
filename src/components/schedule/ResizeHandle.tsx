"use client";

import { useEffect, useRef, useState } from "react";
import { snapToSlot, minToTime, formatDuration } from "@/utils/time";
import { useScheduleStore } from "@/stores/useScheduleStore";

interface ResizeHandleProps {
  blockId: string;
  startMin: number;
  initialEndMin: number;
  minuteHeight: number;
}

export function ResizeHandle({
  blockId,
  startMin,
  initialEndMin,
  minuteHeight,
}: ResizeHandleProps) {
  const resizeBlock = useScheduleStore((s) => s.resizeBlock);
  const [isDragging, setIsDragging] = useState(false);
  const [previewEndMin, setPreviewEndMin] = useState(initialEndMin);
  
  const startY = useRef(0);
  const startEndMin = useRef(initialEndMin);

  useEffect(() => {
    if (!isDragging) return;

    function handlePointerMove(e: PointerEvent) {
      const deltaY = e.clientY - startY.current;
      const deltaMins = deltaY / minuteHeight;
      // Mínimo 15 minutos de duración
      const newEndMin = Math.max(
        startMin + 15,
        snapToSlot(startEndMin.current + deltaMins, 15)
      );
      
      if (newEndMin !== previewEndMin) {
        setPreviewEndMin(newEndMin);
        resizeBlock(blockId, newEndMin);
      }
    }

    function handlePointerUp() {
      setIsDragging(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDragging, minuteHeight, previewEndMin, startMin, blockId, resizeBlock]);

  return (
    <>
      <div
        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize flex items-end justify-center pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Evitar que DndContext de dnd-kit capture el drag
          startY.current = e.clientY;
          startEndMin.current = initialEndMin;
          setPreviewEndMin(initialEndMin);
          setIsDragging(true);
        }}
      >
        <div className="w-8 h-1 rounded-full bg-foreground/20 hover:bg-foreground/40 transition-colors" />
      </div>

      {isDragging && (
        <div 
          className="fixed z-50 pointer-events-none rounded-md bg-foreground text-background px-2.5 py-1 text-xs font-medium shadow-xl whitespace-nowrap animate-in fade-in zoom-in duration-150"
          style={{
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          {minToTime(startMin)} - {minToTime(previewEndMin)} 
          <span className="opacity-70 ml-1.5 font-normal">
            ({formatDuration(previewEndMin - startMin)})
          </span>
        </div>
      )}
    </>
  );
}
