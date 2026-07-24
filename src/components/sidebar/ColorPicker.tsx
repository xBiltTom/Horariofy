"use client";

import type { CourseColor } from "@/types";
import { COURSE_COLORS } from "@/types";
import { COURSE_COLOR_STYLES } from "@/utils/colors";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: CourseColor;
  onChange: (color: CourseColor) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {COURSE_COLORS.map((color) => {
        const style = COURSE_COLOR_STYLES[color];
        const selected = color === value;
        return (
          <button
            key={color}
            type="button"
            aria-label={style.name}
            aria-pressed={selected}
            onClick={() => onChange(color)}
            className={cn(
              "size-6 rounded-full transition-transform hover:scale-110",
              selected
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-popover"
                : "ring-1 ring-foreground/10",
            )}
            style={{ backgroundColor: style.solid }}
          />
        );
      })}
    </div>
  );
}
