import { minToTime } from "@/utils/time";
import { COURSE_COLOR_STYLES } from "@/utils/colors";
import type { Block as BlockType, Course, CourseSession } from "@/types";
import type { ExportOptions } from "./exportTypes";

interface PreviewBlockProps {
  block: BlockType;
  course: Course;
  session: CourseSession | undefined;
  minuteHeight: number;
  gridStartMin: number;
  col: number;
  maxCol: number;
  options: ExportOptions;
}

export function PreviewBlock({
  block,
  course,
  session,
  minuteHeight,
  gridStartMin,
  col,
  maxCol,
  options,
}: PreviewBlockProps) {
  const top = (block.startMin - gridStartMin) * minuteHeight;
  const height = (block.endMin - block.startMin) * minuteHeight;
  const style = COURSE_COLOR_STYLES[course.color];
  const duration = block.endMin - block.startMin;
  const isCompact = duration <= 30;

  const widthPercent = 100 / maxCol;
  const leftPercent = col * widthPercent;
  const widthStr = maxCol > 1 ? `calc(${widthPercent}% - 4px)` : "auto";

  let bg = style.soft;
  let fg = style.text;
  let borderColor = style.border;
  let barColor = style.solid;

  if (options.theme.blockStyle === "solid") {
    bg = style.solid;
    fg = "#ffffff";
    borderColor = style.solid;
    barColor = "#ffffff";
  } else if (options.theme.blockStyle === "outline") {
    bg = "transparent";
    fg = options.theme.foreground;
    borderColor = style.solid;
    barColor = style.solid;
  }

  return (
    <div
      className="absolute overflow-hidden rounded-md border"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        width: widthStr,
        left: maxCol > 1 ? `calc(${leftPercent}% + 2px)` : "4px",
        right: maxCol > 1 ? "auto" : "4px",
        backgroundColor: bg,
        borderColor,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: barColor }}
      />
      <div className="flex h-full flex-col pl-1.5">
        {options.showCourseName && (
          <span
            className="font-bold leading-tight uppercase tracking-wider line-clamp-2"
            style={{ color: fg, fontSize: `${options.fontSize * 0.72}px` }}
          >
            {course.name}
          </span>
        )}
        {options.showSessionType && session?.type && (
          <span
            className="font-black leading-tight line-clamp-1"
            style={{ color: fg, fontSize: `${options.fontSize}px` }}
          >
            {session.type}
          </span>
        )}

        {!isCompact && (
          <div className="flex flex-col gap-0.5 mt-1 flex-1 min-h-0">
            {options.showProfessor && session?.professor && (
              <span
                className="font-medium leading-tight opacity-90 line-clamp-2"
                style={{ color: fg, fontSize: `${options.fontSize * 0.8}px` }}
              >
                {session.professor}
              </span>
            )}
            {options.showLocation && session?.location && (
              <span
                className="font-medium leading-tight opacity-90 line-clamp-1"
                style={{ color: fg, fontSize: `${options.fontSize * 0.8}px` }}
              >
                {session.location}
              </span>
            )}
            {options.showTime && (
              <span
                className="font-bold opacity-70 mt-auto pt-1"
                style={{ color: fg, fontSize: `${options.fontSize * 0.72}px` }}
              >
                {minToTime(block.startMin)} - {minToTime(block.endMin)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
