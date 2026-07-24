"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { snapToSlot } from "@/utils/time";
import { CourseCard } from "@/components/sidebar/CourseCard";
import { Block } from "@/components/schedule/Block";

const MINUTE_HEIGHT = 80 / 60; // 80px por hora

export function ScheduleDndProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"course" | "sortable-course" | "block" | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const { courses, blocks, config, addBlock, moveBlock } = useScheduleStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Evita drags accidentales al hacer clic (ej. al abrir popovers)
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type as "course" | "sortable-course" | "block");
    setActiveData(active.data.current);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);
    setActiveData(null);

    if (!over) return;

    // 1. Reordenar cursos en la barra lateral
    if (
      active.data.current?.type === "sortable-course" &&
      over.data.current?.type === "sortable-course"
    ) {
      const activeCourseId = (active.id as string).replace("course-", "");
      const overCourseId = (over.id as string).replace("course-", "");
      useScheduleStore.getState().reorderCourses(activeCourseId, overCourseId);
      return;
    }

    // 2. Si estamos en móvil y el sidebar está abierto, evitamos que un drop
    // accidental caiga en la grilla que está de fondo (traspasando el sidebar)
    if (useScheduleStore.getState().mobileSidebarOpen) {
      return;
    }

    if (over.data.current?.type !== "day") return;

    const day = over.data.current.day as number;

    const overRect = over.rect;
    const activeRect = active.rect.current.translated;

    if (!activeRect || !overRect) return;

    // Calculamos dónde soltó el cursor respecto al tope de la columna del día.
    const offsetY = activeRect.top - overRect.top;
    
    // Convertimos píxeles a minutos y sumamos el inicio del horario
    const droppedMin = config.startMin + offsetY / MINUTE_HEIGHT;
    
    // Hacemos snap a bloques de 15 minutos
    let startMin = snapToSlot(droppedMin, 15);

    if (active.data.current?.type === "course") {
      const courseId = active.data.current.courseId;
      const sessionId = active.data.current.sessionId;
      // Prevenir que empiece antes de la hora inicio o termine después de la hora fin
      startMin = Math.max(config.startMin, startMin);
      let endMin = startMin + 60; // 1 hora por defecto
      if (endMin > config.endMin) {
        endMin = config.endMin;
        startMin = Math.max(config.startMin, endMin - 60); // Empujar hacia arriba si choca abajo
      }
      addBlock({
        courseId,
        sessionId,
        day: day as 0 | 1 | 2 | 3 | 4,
        startMin,
        endMin,
      });
    } else if (active.data.current?.type === "block") {
      const blockId = active.data.current.blockId;
      const block = blocks.find((b) => b.id === blockId);
      if (block) {
        const duration = block.endMin - block.startMin;
        startMin = Math.max(config.startMin, startMin);
        if (startMin + duration > config.endMin) {
          startMin = config.endMin - duration; // Empujar hacia arriba si desborda por abajo
        }
        moveBlock(blockId, day as 0 | 1 | 2 | 3 | 4, startMin);
      }
    }
  }

  const renderOverlay = () => {
    if (!activeId || !activeType) return null;

    if (activeType === "sortable-course") {
      const courseId = activeData?.courseId;
      const course = courses.find((c) => c.id === courseId);
      if (!course) return null;
      return (
        <div className="w-56 opacity-90 rotate-2 scale-105 shadow-2xl transition-transform cursor-grabbing">
          <CourseCard course={course} isOverlay />
        </div>
      );
    }
    
    if (activeType === "course") {
      // Estamos arrastrando una píldora de sesión
      const courseId = activeData?.courseId;
      const sessionId = activeData?.sessionId;
      const course = courses.find((c) => c.id === courseId);
      const session = course?.sessions?.find(s => s.id === sessionId);
      if (!course || !session) return null;
      
      const { COURSE_COLOR_STYLES } = require("@/utils/colors");
      const style = COURSE_COLOR_STYLES[course.color];
      
      return (
        <div 
          className="w-48 opacity-90 rotate-3 scale-105 shadow-xl cursor-grabbing flex flex-col gap-0.5 rounded border p-2 text-xs"
          style={{ backgroundColor: style.soft, borderColor: style.border, color: style.text }}
        >
          <span className="font-semibold">{session.type}</span>
          {session.professor && <span className="opacity-75 truncate">{session.professor}</span>}
          {session.location && <span className="opacity-75 truncate">{session.location}</span>}
        </div>
      );
    }

    if (activeType === "block") {
      const blockId = activeData?.blockId;
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return null;
      const course = courses.find((c) => c.id === block.courseId);
      if (!course) return null;
      return (
        <div 
          className="w-[120px] opacity-90 rotate-2 scale-105 shadow-2xl cursor-grabbing relative" 
          style={{ height: (block.endMin - block.startMin) * MINUTE_HEIGHT }}
        >
          <Block
            block={block}
            course={course}
            minuteHeight={MINUTE_HEIGHT}
            gridStartMin={block.startMin}
            isOverlay
          />
        </div>
      );
    }
    return null;
  };

  function handleDragMove(event: import("@dnd-kit/core").DragMoveEvent) {
    // Si arrastramos un curso hacia la derecha (hacia la grilla), ocultamos el sidebar en móvil
    // para que el usuario pueda ver la grilla y soltarlo allí.
    if (
      activeType === "course" && 
      useScheduleStore.getState().mobileSidebarOpen &&
      event.delta.x > 50
    ) {
      useScheduleStore.getState().setMobileSidebarOpen(false);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {renderOverlay()}
      </DragOverlay>
    </DndContext>
  );
}
