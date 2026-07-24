"use client";

import { useMemo } from "react";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { DAYS, DAY_LABELS, type Course, type Block as BlockType } from "@/types";
import { TimeColumn } from "./TimeColumn";
import { DayColumn } from "./DayColumn";

const MINUTE_HEIGHT = 1.3333; // 80px por hora

export function ScheduleGrid() {
  const { blocks, courses, config } = useScheduleStore();

  const coursesMap = useMemo(() => {
    return courses.reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {} as Record<string, Course>);
  }, [courses]);

  const blocksByDay = useMemo(() => {
    const acc: Record<number, BlockType[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (const block of blocks) {
      if (acc[block.day]) {
        acc[block.day].push(block);
      }
    }
    return acc;
  }, [blocks]);

  const hourHeight = 60 * MINUTE_HEIGHT;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Sticky Day Headers */}
      <div className="flex pl-16 border-b border-border/50 bg-background/95 backdrop-blur-sm z-20 sticky top-0 shadow-sm">
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex-1 py-3 text-center border-r border-border/50 last:border-r-0"
          >
            <span className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
              {DAY_LABELS[day]}
            </span>
          </div>
        ))}
      </div>

      {/* Scrollable Grid Area */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex relative min-w-[700px]">
          {/* Horizontal Grid Lines */}
          <div
            className="absolute inset-0 left-16 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
              backgroundSize: `100% ${hourHeight}px`,
              opacity: 0.4,
            }}
          />

          <TimeColumn
            startMin={config.startMin}
            endMin={config.endMin}
            minuteHeight={MINUTE_HEIGHT}
          />
          
          <div className="flex flex-1">
            {DAYS.map((day) => (
              <DayColumn
                key={day}
                day={day}
                blocks={blocksByDay[day]}
                courses={coursesMap}
                minuteHeight={MINUTE_HEIGHT}
                gridStartMin={config.startMin}
                gridEndMin={config.endMin}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
