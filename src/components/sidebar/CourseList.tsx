"use client";

import { useScheduleStore } from "@/stores/useScheduleStore";
import { CourseCard } from "./CourseCard";
import { CreateCourseButton } from "./CreateCourseButton";

export function CourseList() {
  const courses = useScheduleStore((s) => s.courses);

  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      <CreateCourseButton />
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
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
