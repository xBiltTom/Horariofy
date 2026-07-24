"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CourseForm } from "./CourseForm";
import { useScheduleStore } from "@/stores/useScheduleStore";

export function CreateCourseButton() {
  const [open, setOpen] = useState(false);
  const addCourse = useScheduleStore((s) => s.addCourse);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="bg-primary text-primary-foreground hover:bg-primary/80 flex w-full items-center justify-center gap-1.5 rounded-md h-9 px-3 text-sm font-medium transition-colors"
        render={
          <button type="button">
            <Plus className="size-4" />
            Nuevo curso
          </button>
        }
      />
      <PopoverContent align="start" sideOffset={8} className="w-72">
        <CourseForm
          onCancel={() => setOpen(false)}
          onSubmit={(data) => {
            addCourse(data);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
