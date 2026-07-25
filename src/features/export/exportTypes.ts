export interface ExportTheme {
  id: string;
  name: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  headerBackground: string;
  headerText: string;
  gridLineAlpha: number;
  blockStyle: "soft" | "solid" | "outline";
}

export interface ExportOptions {
  title: string;
  theme: ExportTheme;
  fontSize: number;
  showCourseName: boolean;
  showSessionType: boolean;
  showProfessor: boolean;
  showLocation: boolean;
  showTime: boolean;
  gridLineIntensity: number;
  labelContrast: number;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  title: "",
  theme: {
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
  fontSize: 14,
  showCourseName: true,
  showSessionType: true,
  showProfessor: true,
  showLocation: true,
  showTime: true,
  gridLineIntensity: 50,
  labelContrast: 0,
};
