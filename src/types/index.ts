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

export interface Course {
  id: string;
  name: string;
  professor: string;
  location: string;
  color: CourseColor;
}

export interface Block {
  id: string;
  courseId: string;
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
