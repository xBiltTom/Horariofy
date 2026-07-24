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
  const [activeType, setActiveType] = useState<"course" | "block" | null>(null);

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
    setActiveType(active.data.current?.type as "course" | "block");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    // 1. Reordenar cursos en la barra lateral
    if (
      active.data.current?.type === "course" &&
      over.data.current?.type === "course"
    ) {
      const activeCourseId = (active.id as string).replace("new-course-", "");
      const overCourseId = (over.id as string).replace("new-course-", "");
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
    const startMin = snapToSlot(droppedMin, 15);

    if (active.data.current?.type === "course") {
      const courseId = active.data.current.courseId;
      addBlock({
        courseId,
        day: day as 0 | 1 | 2 | 3 | 4,
        startMin,
        endMin: startMin + 60, // 1 hora por defecto
      });
    } else if (active.data.current?.type === "block") {
      const blockId = active.data.current.blockId;
      moveBlock(blockId, day as 0 | 1 | 2 | 3 | 4, startMin);
    }
  }

  const renderOverlay = () => {
    if (!activeId || !activeType) return null;

    if (activeType === "course") {
      const courseId = activeId.replace("new-course-", "");
      const course = courses.find((c) => c.id === courseId);
      if (!course) return null;
      return (
        <div className="w-56 opacity-90 rotate-2 scale-105 shadow-2xl transition-transform cursor-grabbing">
          <CourseCard course={course} isOverlay />
        </div>
      );
    }

    if (activeType === "block") {
      const blockId = activeId.replace("block-", "");
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return null;
      const course = courses.find((c) => c.id === block.courseId);
      if (!course) return null;
      return (
        <div 
          className="w-[120px] opacity-90 rotate-2 scale-105 shadow-2xl cursor-grabbing relative" 
          style={{ height: (block.endMin - block.startMin) * MINUTE_HEIGHT }}
        >
          {/* Usamos gridStartMin = startMin para que el top interno sea 0 y quede pegado al tope del overlay */}
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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {renderOverlay()}
      </DragOverlay>
    </DndContext>
  );
}
