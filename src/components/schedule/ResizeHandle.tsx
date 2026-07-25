"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const config = useScheduleStore((s) => s.config);
  const [isDragging, setIsDragging] = useState(false);
  const [previewStartMin, setPreviewStartMin] = useState(initialStartMin);
  const [previewEndMin, setPreviewEndMin] = useState(initialEndMin);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  
  const startY = useRef(0);
  const dragStartMin = useRef(initialStartMin);
  const dragEndMin = useRef(initialEndMin);

  useEffect(() => {
    if (!isDragging) return;

    function handlePointerMove(e: PointerEvent) {
      setPointerPos({ x: e.clientX, y: e.clientY });
      
      const deltaY = e.clientY - startY.current;
      const deltaMins = deltaY / minuteHeight;
      
      let newStartMin = dragStartMin.current;
      let newEndMin = dragEndMin.current;

      if (position === "bottom") {
        newEndMin = snapToSlot(dragEndMin.current + deltaMins, 15);
        newEndMin = Math.max(newStartMin + 15, newEndMin);
        newEndMin = Math.min(newEndMin, config.endMin); // Limite inferior global
      } else {
        newStartMin = snapToSlot(dragStartMin.current + deltaMins, 15);
        newStartMin = Math.min(newStartMin, newEndMin - 15);
        newStartMin = Math.max(newStartMin, config.startMin); // Limite superior global
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
  }, [
    isDragging,
    minuteHeight,
    previewStartMin,
    previewEndMin,
    blockId,
    resizeBlock,
    position,
    config.startMin,
    config.endMin,
  ]);

  return (
    <>
      <div
        className={`absolute left-0 right-0 h-4 cursor-ns-resize flex justify-center opacity-0 group-hover:opacity-100 transition-opacity touch-none ${
          position === "top" ? "top-0 items-start pt-0.5" : "bottom-0 items-end pb-0.5"
        }`}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Evitar que DndContext de dnd-kit capture el drag
          e.currentTarget.setPointerCapture(e.pointerId); // Asegura que los eventos de movimiento sigan llegando a este elemento
          startY.current = e.clientY;
          dragStartMin.current = initialStartMin;
          dragEndMin.current = initialEndMin;
          setPointerPos({ x: e.clientX, y: e.clientY });
          setPreviewStartMin(initialStartMin);
          setPreviewEndMin(initialEndMin);
          setIsDragging(true);
        }}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        <div className="w-8 h-1.5 rounded-full bg-foreground/30 hover:bg-foreground/50 transition-colors" />
      </div>

      {isDragging && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed z-9999 pointer-events-none rounded-md bg-foreground text-background px-2.5 py-1 text-xs font-medium shadow-xl whitespace-nowrap animate-in fade-in zoom-in duration-75"
          style={{
            top: pointerPos.y + (position === "top" ? -40 : 20),
            left: pointerPos.x,
            transform: 'translateX(-50%)'
          }}
        >
          {minToTime(previewStartMin)} - {minToTime(previewEndMin)} 
          <span className="opacity-70 ml-1.5 font-normal">
            ({formatDuration(previewEndMin - previewStartMin)})
          </span>
        </div>,
        document.body
      )}
    </>
  );
}
