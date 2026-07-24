import type { ExportTheme } from "./exportTypes";

export const CURATED_THEMES: ExportTheme[] = [
  {
    id: "papel",
    name: "Papel",
    background: "#fbfaf7",
    foreground: "#1a1a17",
    muted: "#6b675e",
    border: "#e3dfd6",
    headerBackground: "#fbfaf7",
    headerText: "#6b675e",
    gridLineAlpha: 0.5,
    blockStyle: "soft",
  },
  {
    id: "tinta",
    name: "Tinta",
    background: "#14140f",
    foreground: "#f2efe7",
    muted: "#a8a397",
    border: "#33332b",
    headerBackground: "#1d1d17",
    headerText: "#a8a397",
    gridLineAlpha: 0.4,
    blockStyle: "soft",
  },
  {
    id: "minimal",
    name: "Minimal",
    background: "#ffffff",
    foreground: "#111111",
    muted: "#999999",
    border: "#eeeeee",
    headerBackground: "#ffffff",
    headerText: "#999999",
    gridLineAlpha: 0.35,
    blockStyle: "outline",
  },
  {
    id: "vivido",
    name: "Vívido",
    background: "#1a1a2e",
    foreground: "#f0f0f5",
    muted: "#8b8ba0",
    border: "#2d2d44",
    headerBackground: "#22223a",
    headerText: "#c0c0d0",
    gridLineAlpha: 0.45,
    blockStyle: "solid",
  },
];

const BLOCK_STYLES: ExportTheme["blockStyle"][] = ["soft", "solid", "outline"];

interface PalettePair {
  bg: string;
  fg: string;
  muted: string;
  border: string;
  headerBg: string;
  headerText: string;
}

const VALID_PAIRS: PalettePair[] = [
  {
    bg: "#fbfaf7",
    fg: "#1a1a17",
    muted: "#6b675e",
    border: "#e3dfd6",
    headerBg: "#fbfaf7",
    headerText: "#6b675e",
  },
  {
    bg: "#14140f",
    fg: "#f2efe7",
    muted: "#a8a397",
    border: "#33332b",
    headerBg: "#1d1d17",
    headerText: "#a8a397",
  },
  {
    bg: "#ffffff",
    fg: "#111111",
    muted: "#999999",
    border: "#eeeeee",
    headerBg: "#ffffff",
    headerText: "#999999",
  },
  {
    bg: "#1a1a2e",
    fg: "#f0f0f5",
    muted: "#8b8ba0",
    border: "#2d2d44",
    headerBg: "#22223a",
    headerText: "#c0c0d0",
  },
  {
    bg: "#f4f1ea",
    fg: "#2a2418",
    muted: "#7a7060",
    border: "#e0d9c8",
    headerBg: "#efe9db",
    headerText: "#7a7060",
  },
  {
    bg: "#0f1419",
    fg: "#e6e6e6",
    muted: "#8a9099",
    border: "#1f262e",
    headerBg: "#161b20",
    headerText: "#8a9099",
  },
  {
    bg: "#1c1917",
    fg: "#fafaf9",
    muted: "#a8a29e",
    border: "#292524",
    headerBg: "#292524",
    headerText: "#a8a29e",
  },
  {
    bg: "#f0f4f8",
    fg: "#1e293b",
    muted: "#64748b",
    border: "#dbe4eb",
    headerBg: "#e8eef4",
    headerText: "#64748b",
  },
];

const ALPHAS = [0.35, 0.4, 0.45, 0.5, 0.6];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateTheme(): ExportTheme {
  const pair = pick(VALID_PAIRS);
  const blockStyle = pick(BLOCK_STYLES);
  const alpha = pick(ALPHAS);
  const id = "gen_" + Math.random().toString(36).slice(2, 8);
  return {
    id,
    name: "Generado",
    background: pair.bg,
    foreground: pair.fg,
    muted: pair.muted,
    border: pair.border,
    headerBackground: pair.headerBg,
    headerText: pair.headerText,
    gridLineAlpha: alpha,
    blockStyle,
  };
}
