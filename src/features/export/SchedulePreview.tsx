import { forwardRef, useMemo } from "react";
import { DAYS, DAY_LABELS, type Block, type Course } from "@/types";
import { hourMarks, minToTime } from "@/utils/time";
import { layoutDay } from "@/utils/conflicts";
import type { ExportOptions } from "./exportTypes";
import { PreviewBlock } from "./PreviewBlock";

const PREVIEW_WIDTH = 1100;
const MINUTE_HEIGHT = 80 / 60;
const TIME_COL_WIDTH = 64;

interface SchedulePreviewProps {
  blocks: Block[];
  courses: Course[];
  config: { startMin: number; endMin: number };
  options: ExportOptions;
}

function resolveSession(course: Course | undefined, sessionId: string) {
  if (!course) return undefined;
  return course.sessions?.find((s) => s.id === sessionId);
}

export const SchedulePreview = forwardRef<HTMLDivElement, SchedulePreviewProps>(
  function SchedulePreview({ blocks, courses, config, options }, ref) {
    const coursesMap = useMemo(() => {
      const map: Record<string, Course> = {};
      for (const c of courses) map[c.id] = c;
      return map;
    }, [courses]);

    const blocksByDayMap = useMemo(() => {
      const acc: Record<number, Block[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };
      for (const b of blocks) {
        if (acc[b.day]) acc[b.day].push(b);
      }
      return acc;
    }, [blocks]);

    const totalHeight = (config.endMin - config.startMin) * MINUTE_HEIGHT;
    const marks = hourMarks(config.startMin, config.endMin);
    const theme = options.theme;
    const lineOpacity = options.gridLineIntensity / 100;
    const lineColor = theme.foreground;

    return (
      <div
        ref={ref}
        style={{
          width: `${PREVIEW_WIDTH}px`,
          backgroundColor: theme.background,
          color: theme.foreground,
          fontFamily: "var(--font-sans)",
        }}
      >
        {options.title.trim() && (
          <div
            style={{
              padding: "20px 24px 12px",
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              fontFamily: "var(--font-display)",
            }}
          >
            {options.title}
          </div>
        )}

        {/* Header de días */}
        <div
          style={{
            display: "flex",
            borderBottom: `1px solid ${theme.border}`,
            backgroundColor: theme.headerBackground,
          }}
        >
          <div
            style={{
              width: `${TIME_COL_WIDTH}px`,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: `1px solid ${theme.border}`,
              height: "44px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.headerText,
              opacity: 0.5,
            }}
          >
            Hora
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight:
                  day < DAYS[DAYS.length - 1]
                    ? `1px solid ${theme.border}`
                    : "none",
                height: "44px",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: theme.headerText,
              }}
            >
              {DAY_LABELS[day]}
            </div>
          ))}
        </div>

        {/* Área de grilla */}
        <div style={{ display: "flex", padding: "16px 0" }}>
          {/* Columna de horas */}
          <div
            style={{
              width: `${TIME_COL_WIDTH}px`,
              flexShrink: 0,
              position: "relative",
              borderRight: `1px solid ${theme.border}`,
              height: `${totalHeight}px`,
              backgroundColor: theme.headerBackground,
            }}
          >
            {marks.map((min) => {
              if (min < config.startMin || min > config.endMin) return null;
              const top = (min - config.startMin) * MINUTE_HEIGHT;
              return (
                <div
                  key={min}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 8,
                    top: `${top}px`,
                    transform: "translateY(-50%)",
                    display: "flex",
                    justifyContent: "flex-end",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    color: theme.muted,
                    opacity: 0.7,
                  }}
                >
                  {minToTime(min)}
                </div>
              );
            })}
          </div>

          {/* Columnas de días */}
          <div style={{ flex: 1, position: "relative", height: `${totalHeight}px` }}>
            {/* Líneas horizontales */}
            {marks.map((min) => {
              if (min < config.startMin || min > config.endMin) return null;
              const top = (min - config.startMin) * MINUTE_HEIGHT;
              return (
                <div
                  key={min}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: `${top}px`,
                    borderTop: `1px solid ${lineColor}`,
                    opacity: lineOpacity,
                  }}
                />
              );
            })}

            {/* Líneas verticales entre días */}
            {DAYS.map((day, i) => {
              if (i === 0) return null;
              const leftPercent = (i / DAYS.length) * 100;
              return (
                <div
                  key={`v-${day}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${leftPercent}%`,
                    borderLeft: `1px solid ${lineColor}`,
                    opacity: lineOpacity,
                  }}
                />
              );
            })}

            {/* Bloques */}
            {blocks.length === 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.3,
                }}
              >
                <span style={{ fontSize: "20px", fontWeight: 500 }}>
                  Tu horario está vacío
                </span>
              </div>
            )}

            {DAYS.map((day) => {
              const dayBlocks = blocksByDayMap[day];
              const layouts = layoutDay(dayBlocks);
              return (
                <div
                  key={day}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${(day / DAYS.length) * 100}%`,
                    width: `${100 / DAYS.length}%`,
                  }}
                >
                  {layouts.map(({ block, column, columnCount }) => {
                    const course = coursesMap[block.courseId];
                    const session = resolveSession(course, block.sessionId);
                    return (
                      <PreviewBlock
                        key={block.id}
                        block={block}
                        course={course}
                        session={session}
                        minuteHeight={MINUTE_HEIGHT}
                        gridStartMin={config.startMin}
                        col={column}
                        maxCol={columnCount}
                        options={options}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
