import type { CourseColor } from "@/types";
import { COURSE_COLORS } from "@/types";

/**
 * Paleta curada para bloques de cursos.
 * Cada color define su tinte de fondo, texto, borde y un fondo sólido
 * para previews (ej. tarjetas en la sidebar).
 *
 * Están pensados como "color chips" sobre papel: saturación media,
 * nunca tan vivos como para competir con el acento Ember de la UI.
 */
export const COURSE_COLOR_STYLES: Record<
  CourseColor,
  {
    name: string;
    soft: string;
    softHover: string;
    text: string;
    border: string;
    solid: string;
    dot: string;
  }
> = {
  rose: {
    name: "Rosa",
    soft: "#fce7ec",
    softHover: "#f8d4dd",
    text: "#9d2449",
    border: "#f3b6c6",
    solid: "#e5648a",
    dot: "#e5648a",
  },
  amber: {
    name: "Ámbar",
    soft: "#fdf3da",
    softHover: "#fae6ad",
    text: "#8a5a08",
    border: "#f0cd76",
    solid: "#e0a82e",
    dot: "#e0a82e",
  },
  lime: {
    name: "Lima",
    soft: "#eef6da",
    softHover: "#dfedaf",
    text: "#4d6111",
    border: "#c5d97a",
    solid: "#9bbf3a",
    dot: "#9bbf3a",
  },
  teal: {
    name: "Verde azulado",
    soft: "#d6f0ef",
    softHover: "#aee3e0",
    text: "#0f5953",
    border: "#7bc8c1",
    solid: "#2fa89f",
    dot: "#2fa89f",
  },
  violet: {
    name: "Violeta",
    soft: "#ece6f8",
    softHover: "#d8ccef",
    text: "#4a3385",
    border: "#b9a3e0",
    solid: "#8a6bd4",
    dot: "#8a6bd4",
  },
  sky: {
    name: "Cielo",
    soft: "#dceff7",
    softHover: "#b3def0",
    text: "#0e4a66",
    border: "#7cc2e0",
    solid: "#3a9fc7",
    dot: "#3a9fc7",
  },
  fuchsia: {
    name: "Fucsia",
    soft: "#f7e0f0",
    softHover: "#efc0e0",
    text: "#7a1d5a",
    border: "#e08fc4",
    solid: "#c8458f",
    dot: "#c8458f",
  },
  orange: {
    name: "Naranja",
    soft: "#fce8d6",
    softHover: "#f8d0a8",
    text: "#8a3e0c",
    border: "#f0ab68",
    solid: "#e07a2a",
    dot: "#e07a2a",
  },
};

/**
 * Asigna el color menos usado entre los cursos existentes.
 * Si todos están en uso, rota por índice.
 */
export function pickAutoColor(usedColors: CourseColor[]): CourseColor {
  if (usedColors.length === 0) return COURSE_COLORS[0];

  const counts = new Map<CourseColor, number>();
  for (const c of COURSE_COLORS) counts.set(c, 0);
  for (const u of usedColors) counts.set(u, (counts.get(u) ?? 0) + 1);

  let best = COURSE_COLORS[0];
  let bestCount = Infinity;
  for (const c of COURSE_COLORS) {
    const n = counts.get(c) ?? 0;
    if (n < bestCount) {
      bestCount = n;
      best = c;
    }
  }
  return best;
}
