"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { CourseCard } from "./CourseCard";
import { CreateCourseButton } from "./CreateCourseButton";

export function CourseList() {
  const courses = useScheduleStore((s) => s.courses);

  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <CreateCourseButton />
        </div>
        <button
          type="button"
          onClick={() => useScheduleStore.getState().shuffleColors()}
          className="flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          title="Aleatorizar colores de cursos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l4.1-5.8a7.3 7.3 0 0 1 5.9-3.2h5.3"/><path d="M18 4l4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="M18 14l4 4-4 4"/></svg>
        </button>
      </div>
      {courses.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-1 px-2 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Aún no tienes cursos.
          </p>
          <p className="text-muted-foreground/70 text-xs">
            Crea el primero con el botón de arriba.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <SortableContext 
            items={courses.map(c => `course-${c.id}`)} 
            strategy={verticalListSortingStrategy}
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}
