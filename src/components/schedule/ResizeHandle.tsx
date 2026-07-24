"use client";

import { useEffect, useRef, useState } from "react";
import { snapToSlot, minToTime, formatDuration } from "@/utils/time";
import { useScheduleStore } from "@/stores/useScheduleStore";

interface ResizeHandleProps {
  blockId: string;
  initialStartMin: number;
  initialEndMin: number;
  minuteHeight: number;
  position: "top" | "bottom";
}

export function ResizeHandle({
  blockId,
  initialStartMin,
  initialEndMin,
  minuteHeight,
  position,
}: ResizeHandleProps) {
  const resizeBlock = useScheduleStore((s) => s.resizeBlock);
  const [isDragging, setIsDragging] = useState(false);
  const [previewStartMin, setPreviewStartMin] = useState(initialStartMin);
  const [previewEndMin, setPreviewEndMin] = useState(initialEndMin);
  
  const startY = useRef(0);
  const dragStartMin = useRef(initialStartMin);
  const dragEndMin = useRef(initialEndMin);

  useEffect(() => {
    if (!isDragging) return;

    function handlePointerMove(e: PointerEvent) {
      const deltaY = e.clientY - startY.current;
      const deltaMins = deltaY / minuteHeight;
      
      let newStartMin = dragStartMin.current;
      let newEndMin = dragEndMin.current;

      if (position === "bottom") {
        newEndMin = snapToSlot(dragEndMin.current + deltaMins, 15);
        newEndMin = Math.max(newStartMin + 15, newEndMin);
      } else {
        newStartMin = snapToSlot(dragStartMin.current + deltaMins, 15);
        newStartMin = Math.min(newStartMin, newEndMin - 15);
      }
      
      if (newStartMin !== previewStartMin || newEndMin !== previewEndMin) {
        setPreviewStartMin(newStartMin);
        setPreviewEndMin(newEndMin);
        resizeBlock(blockId, newStartMin, newEndMin);
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
  }, [isDragging, minuteHeight, previewStartMin, previewEndMin, blockId, resizeBlock, position]);

  return (
    <>
      <div
        className={`absolute left-0 right-0 h-3 cursor-ns-resize flex justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
          position === "top" ? "top-0 items-start pt-0.5" : "bottom-0 items-end pb-0.5"
        }`}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Evitar que DndContext de dnd-kit capture el drag
          startY.current = e.clientY;
          dragStartMin.current = initialStartMin;
          dragEndMin.current = initialEndMin;
          setPreviewStartMin(initialStartMin);
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
            bottom: position === "bottom" ? '32px' : 'auto',
            top: position === "top" ? '32px' : 'auto',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          {minToTime(previewStartMin)} - {minToTime(previewEndMin)} 
          <span className="opacity-70 ml-1.5 font-normal">
            ({formatDuration(previewEndMin - previewStartMin)})
          </span>
        </div>
      )}
    </>
  );
}
