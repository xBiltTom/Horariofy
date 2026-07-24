import { CourseList } from "./CourseList";

export function Sidebar() {
  return (
    <aside className="bg-sidebar flex w-72 shrink-0 flex-col border-r">
      <div className="flex h-11 items-center border-b px-4">
        <h2 className="text-foreground text-xs font-semibold tracking-wide uppercase">
          Cursos
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <CourseList />
      </div>
    </aside>
  );
}
