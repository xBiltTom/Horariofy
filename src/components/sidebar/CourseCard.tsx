"use client";

import { useId, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Course } from "@/types";
import { COURSE_COLOR_STYLES } from "@/utils/colors";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { CourseForm } from "./CourseForm";

interface CourseCardProps {
  course: Course;
  isOverlay?: boolean;
}

export function CourseCard({ course, isOverlay = false }: CourseCardProps) {
  const updateCourse = useScheduleStore((s) => s.updateCourse);
  const removeCourse = useScheduleStore((s) => s.removeCourse);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const labelId = useId();
  const style = COURSE_COLOR_STYLES[course.color];

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-course-${course.id}`,
    data: { type: "course", courseId: course.id },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`group relative flex items-start gap-2.5 rounded-lg border border-transparent p-2.5 transition-colors hover:border-border cursor-grab active:cursor-grabbing ${isDragging && !isOverlay ? 'opacity-40' : ''}`}
      style={{ backgroundColor: style.soft }}
    >
      <span
        aria-hidden
        className="mt-1 size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: style.solid }}
      />
      <div className="min-w-0 flex-1">
        <p
          id={labelId}
          className="truncate text-sm font-medium"
          style={{ color: style.text }}
        >
          {course.name}
        </p>
        {course.location && (
          <p className="truncate text-xs opacity-70" style={{ color: style.text }}>
            {course.location}
          </p>
        )}
        {course.professor && (
          <p className="truncate text-xs opacity-60" style={{ color: style.text }}>
            {course.professor}
          </p>
        )}
      </div>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger
          aria-label="Opciones del curso"
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-black/5 absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-md transition-opacity"
          render={<button type="button"><MoreHorizontal className="size-4" /></button>}
        />
        <PopoverContent align="end" sideOffset={4} className="w-40 p-1">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setEditing(true);
            }}
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
        </PopoverContent>
      </Popover>
      <Popover open={editing} onOpenChange={setEditing}>
        <PopoverContent align="center" sideOffset={8} className="w-72">
          <CourseForm
            initialName={course.name}
            initialProfessor={course.professor}
            initialLocation={course.location}
            initialColor={course.color}
            submitLabel="Guardar"
            onCancel={() => setEditing(false)}
            onSubmit={(data) => {
              updateCourse(course.id, data);
              setEditing(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
