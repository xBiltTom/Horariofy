"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { CourseColor } from "@/types";
import { COURSE_COLORS } from "@/types";
import { COURSE_COLOR_STYLES } from "@/utils/colors";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: CourseColor;
  onChange: (color: CourseColor) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Asegurarnos de que el color seleccionado siempre sea visible al inicio,
  // incluso si está colapsado y no pertenece a la primera fila.
  // Pero la solicitud del usuario indica "solo la primera fila de colores siendo visibles con un boton (v)".
  const displayedColors = expanded ? COURSE_COLORS : COURSE_COLORS.slice(0, 8);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-8 gap-1.5">
        {displayedColors.map((color) => {
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
      {COURSE_COLORS.length > 8 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors self-center py-0.5 mt-0.5"
        >
          {expanded ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </button>
      )}
    </div>
  );
}
