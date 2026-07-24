export type Day = 0 | 1 | 2 | 3 | 4;

export const DAYS: Day[] = [0, 1, 2, 3, 4];

export const DAY_LABELS: Record<Day, string> = {
  0: "Lunes",
  1: "Martes",
  2: "Miércoles",
  3: "Jueves",
  4: "Viernes",
};

export type CourseColor =
  | "rose"
  | "amber"
  | "lime"
  | "teal"
  | "violet"
  | "sky"
  | "fuchsia"
  | "orange";

export const COURSE_COLORS: CourseColor[] = [
  "rose",
  "amber",
  "lime",
  "teal",
  "violet",
  "sky",
  "fuchsia",
  "orange",
];

export interface CourseSession {
  id: string;
  type: string; // e.g. "Teoría", "Práctica", "Laboratorio", etc.
  professor: string;
  location: string;
}

export interface Course {
  id: string;
  name: string;
  color: CourseColor;
  sessions: CourseSession[];
}

export interface Block {
  id: string;
  courseId: string;
  sessionId: string;
  day: Day;
  startMin: number;
  endMin: number;
}

export interface ScheduleConfig {
  startMin: number;
  endMin: number;
}

export interface ScheduleState {
  courses: Course[];
  blocks: Block[];
  config: ScheduleConfig;
}
