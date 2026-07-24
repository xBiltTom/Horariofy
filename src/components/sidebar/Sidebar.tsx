"use client";

import { X } from "lucide-react";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { CourseList } from "./CourseList";

export function Sidebar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useScheduleStore();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <aside 
        className={`
          bg-sidebar flex w-72 shrink-0 flex-col border-r z-50 transition-transform duration-300 ease-in-out
          fixed inset-y-0 left-0 h-full
          md:relative md:translate-x-0
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-14 items-center justify-between border-b px-4 md:h-11">
          <h2 className="text-foreground text-xs font-semibold tracking-wide uppercase">
            Cursos
          </h2>
          <button 
            type="button" 
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 -mr-1.5 hover:bg-black/5 rounded-md"
          >
            <X className="size-4 opacity-70" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <CourseList />
        </div>
      </aside>
    </>
  );
}
