"use client";

import { useId, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Course, CourseSession } from "@/types";
import { COURSE_COLOR_STYLES } from "@/utils/colors";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { CourseForm } from "./CourseForm";

interface CourseCardProps {
  course: Course;
  isOverlay?: boolean;
}

function SessionPill({ course, session }: { course: Course, session: CourseSession }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-course-${course.id}-${session.id}`,
    data: { type: "course", courseId: course.id, sessionId: session.id },
  });
  
  const style = COURSE_COLOR_STYLES[course.color];

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex flex-col gap-0.5 rounded border p-2 text-xs cursor-grab active:cursor-grabbing hover:brightness-95 transition-all ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ backgroundColor: style.soft, borderColor: style.border, color: style.text }}
    >
      <span className="font-semibold">{session.type}</span>
      {session.professor && <span className="opacity-75 truncate">{session.professor}</span>}
      {session.location && <span className="opacity-75 truncate">{session.location}</span>}
    </div>
  );
}

export function CourseCard({ course, isOverlay = false }: CourseCardProps) {
  const updateCourse = useScheduleStore((s) => s.updateCourse);
  const removeCourse = useScheduleStore((s) => s.removeCourse);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const labelId = useId();
  const style = COURSE_COLOR_STYLES[course.color];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `course-${course.id}`,
    data: { type: "sortable-course", courseId: course.id },
  });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={dndStyle}
      className={`group relative flex flex-col gap-2 rounded-lg border border-border/50 bg-card p-2.5 shadow-sm transition-all ${isDragging && !isOverlay ? 'opacity-40' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div 
          className="flex items-center gap-2 flex-1 min-w-0 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: style.solid }}
          />
          <p
            id={labelId}
            className="truncate text-sm font-semibold"
            style={{ color: style.text }}
          >
            {course.name}
          </p>
        </div>
        
        <Popover 
          open={menuOpen || editing} 
          onOpenChange={(open) => {
            if (!open) {
              setMenuOpen(false);
              setEditing(false);
            } else {
              setMenuOpen(true);
            }
          }}
        >
          <PopoverTrigger
            aria-label="Opciones del curso"
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-black/5 flex size-6 items-center justify-center rounded-md transition-opacity"
            render={<button type="button" onPointerDown={(e) => e.stopPropagation()}><MoreHorizontal className="size-4" /></button>}
          />
          <PopoverContent align="end" sideOffset={4} className={editing ? "w-80" : "w-40 p-1"}>
            {editing ? (
              <CourseForm
                initialName={course.name}
                initialColor={course.color}
                initialSessions={course.sessions}
                submitLabel="Guardar"
                onCancel={() => {
                  setEditing(false);
                  setMenuOpen(true);
                }}
                onSubmit={(data) => {
                  updateCourse(course.id, data);
                  setEditing(false);
                  setMenuOpen(false);
                }}
              />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                >
                  <Pencil className="size-3.5" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeCourse(course.id);
                    setMenuOpen(false);
                  }}
                  className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  Eliminar
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-1.5">
        {course.sessions?.map(session => (
          <SessionPill key={session.id} course={course} session={session} />
        ))}
      </div>
    </div>
  );
}
