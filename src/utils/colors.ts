import type { CourseColor } from "@/types";
import { COURSE_COLORS } from "@/types";
import { parse } from "path";

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
  red: {
    name: "Rojo",
    soft: "#fee2e2",
    softHover: "#fecaca",
    text: "#991b1b",
    border: "#fca5a5",
    solid: "#ef4444",
    dot: "#ef4444",
  },
  yellow: {
    name: "Amarillo",
    soft: "#fef9c3",
    softHover: "#fef08a",
    text: "#854d0e",
    border: "#fde047",
    solid: "#eab308",
    dot: "#eab308",
  },
  emerald: {
    name: "Esmeralda",
    soft: "#d1fae5",
    softHover: "#a7f3d0",
    text: "#065f46",
    border: "#6ee7b7",
    solid: "#10b981",
    dot: "#10b981",
  },
  cyan: {
    name: "Cian",
    soft: "#cffafe",
    softHover: "#a5f3fc",
    text: "#164e63",
    border: "#67e8f9",
    solid: "#06b6d4",
    dot: "#06b6d4",
  },
  blue: {
    name: "Azul",
    soft: "#dbeafe",
    softHover: "#bfdbfe",
    text: "#1e3a8a",
    border: "#93c5fd",
    solid: "#3b82f6",
    dot: "#3b82f6",
  },
  indigo: {
    name: "Índigo",
    soft: "#e0e7ff",
    softHover: "#c7d2fe",
    text: "#3730a3",
    border: "#a5b4fc",
    solid: "#6366f1",
    dot: "#6366f1",
  },
  pink: {
    name: "Rosado",
    soft: "#fce7f3",
    softHover: "#fbcfe8",
    text: "#831843",
    border: "#f9a8d4",
    solid: "#ec4899",
    dot: "#ec4899",
  },
  slate: {
    name: "Pizarra",
    soft: "#f1f5f9",
    softHover: "#e2e8f0",
    text: "#334155",
    border: "#cbd5e1",
    solid: "#64748b",
    dot: "#64748b",
  },
  stone: {
    name: "Piedra",
    soft: "#f5f5f4",
    softHover: "#e7e5e4",
    text: "#44403c",
    border: "#d6d3d1",
    solid: "#78716c",
    dot: "#78716c",
  },
  zinc: {
    name: "Zinc",
    soft: "#f4f4f5",
    softHover: "#e4e4e7",
    text: "#3f3f46",
    border: "#d4d4d8",
    solid: "#71717a",
    dot: "#71717a",
  },
  purple: {
    name: "Púrpura",
    soft: "#f3e8ff",
    softHover: "#e9d5ff",
    text: "#581c87",
    border: "#d8b4fe",
    solid: "#a855f7",
    dot: "#a855f7",
  },
  green: {
    name: "Verde",
    soft: "#dcfce7",
    softHover: "#bbf7d0",
    text: "#14532d",
    border: "#86efac",
    solid: "#22c55e",
    dot: "#22c55e",
  },
  navy: {
    name: "Marino",
    soft: "#e0e7ff",
    softHover: "#c7d2fe",
    text: "#1e3a8a", // darker text
    border: "#a5b4fc",
    solid: "#3730a3", // indigo-800 ish
    dot: "#3730a3",
  },
  brown: {
    name: "Marrón",
    soft: "#fdf8f6",
    softHover: "#f5ebe6",
    text: "#451a03", // orange-950
    border: "#e5d3cb",
    solid: "#7c2d12", // orange-900
    dot: "#7c2d12",
  },
  maroon: {
    name: "Granate",
    soft: "#fff1f2",
    softHover: "#ffe4e6",
    text: "#881337", // rose-900
    border: "#fecdd3",
    solid: "#be123c", // rose-700
    dot: "#be123c",
  },
  mint: {
    name: "Menta",
    soft: "#ecfdf5",
    softHover: "#d1fae5",
    text: "#064e3b", // emerald-900
    border: "#a7f3d0",
    solid: "#10b981", // emerald-500
    dot: "#10b981",
  },
};


export function mixHexColors(hexA: string, hexB: string, t: number): string {
  const clampedT = Math.min(1, Math.max(0, t));
  const a = parseHexColor(hexA);
  const b = parseHexColor(hexB);
  if (!a || !b) return hexA;
  
  const r = Math.round(a.r + (b.r - a.r)*clampedT);
  const g = Math.round(a.g + (b.g - a.g)*clampedT);
  const b1 = Math.round(a.b + (b.b - a.b)*clampedT); 
  return `#${toHex(r)}${toHex(g)}${toHex(b1)}`;
}

function parseHexColor(hex: string): {r: number, g: number, b: number} | null{
  const normalized = hex.replace("#", "");
  const full = 
    normalized.length === 3
      ? normalized
          .split("")
          .map((c)=>c+c)
          .join("")
      : normalized

  if (full.length !== 6) return null;
  const r = parseInt(full.slice(0,2), 16);
  const g = parseInt(full.slice(2,4), 16);
  const b = parseInt(full.slice(4,6), 16);
  if ([r,g,b].some((n)=>Number.isNaN(n))) return null;
  return {r,g,b};
}

function toHex(n: number): string{
  return Math.min(255, Math.max(0, n)).toString(16).padStart(2, "0");
}

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
