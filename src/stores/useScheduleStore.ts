import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Block, Course, Day, CourseColor } from "@/types";
import { uid } from "@/utils/time";
import { pickAutoColor } from "@/utils/colors";

export const DEFAULT_CONFIG = {
  startMin: 7 * 60,
  endMin: 22 * 60,
};

interface ScheduleStore {
  courses: Course[];
  blocks: Block[];
  config: typeof DEFAULT_CONFIG;

  addCourse: (data: {
    name: string;
    professor?: string;
    location?: string;
    color?: CourseColor;
  }) => string;
  updateCourse: (id: string, data: Partial<Omit<Course, "id">>) => void;
  removeCourse: (id: string) => void;

  addBlock: (data: {
    courseId: string;
    day: Day;
    startMin: number;
    endMin: number;
  }) => string;
  updateBlock: (id: string, data: Partial<Omit<Block, "id">>) => void;
  moveBlock: (id: string, day: Day, startMin: number) => void;
  resizeBlock: (id: string, endMin: number) => void;
  removeBlock: (id: string) => void;

  setConfig: (data: Partial<typeof DEFAULT_CONFIG>) => void;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      courses: [
        { id: "c_seed1", name: "Diseño de Interfaces", professor: "Alan Turing", location: "Lab 3", color: "rose" },
        { id: "c_seed2", name: "Estructuras de Datos", professor: "Grace Hopper", location: "Aula 101", color: "sky" },
      ],
      blocks: [
        { id: "b_seed1", courseId: "c_seed1", day: 0, startMin: 9 * 60, endMin: 11 * 60 },
        { id: "b_seed2", courseId: "c_seed1", day: 2, startMin: 9 * 60, endMin: 11 * 60 },
        { id: "b_seed3", courseId: "c_seed2", day: 1, startMin: 14 * 60 + 30, endMin: 16 * 60 },
        { id: "b_seed4", courseId: "c_seed2", day: 3, startMin: 14 * 60 + 30, endMin: 16 * 60 },
      ],
      config: DEFAULT_CONFIG,

      addCourse: ({ name, professor = "", location = "", color }) => {
        const id = uid("c_");
        const usedColors = get().courses.map((c) => c.color);
        const finalColor = color ?? pickAutoColor(usedColors);
        const course: Course = {
          id,
          name: name.trim() || "Sin nombre",
          professor: professor.trim(),
          location: location.trim(),
          color: finalColor,
        };
        set((s) => ({ courses: [...s.courses, course] }));
        return id;
      },

      updateCourse: (id, data) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...data,
                  name: data.name !== undefined ? data.name.trim() || "Sin nombre" : c.name,
                  professor: data.professor !== undefined ? data.professor.trim() : c.professor,
                  location: data.location !== undefined ? data.location.trim() : c.location,
                }
              : c,
          ),
        })),

      removeCourse: (id) =>
        set((s) => ({
          courses: s.courses.filter((c) => c.id !== id),
          blocks: s.blocks.filter((b) => b.courseId !== id),
        })),

      addBlock: ({ courseId, day, startMin, endMin }) => {
        const id = uid("b_");
        const block: Block = { id, courseId, day, startMin, endMin };
        set((s) => ({ blocks: [...s.blocks, block] }));
        return id;
      },

      updateBlock: (id, data) =>
        set((s) => ({
          blocks: s.blocks.map((b) => (b.id === id ? { ...b, ...data } : b)),
        })),

      moveBlock: (id, day, startMin) =>
        set((s) => ({
          blocks: s.blocks.map((b) => {
            if (b.id !== id) return b;
            const duration = b.endMin - b.startMin;
            return { ...b, day, startMin, endMin: startMin + duration };
          }),
        })),

      resizeBlock: (id, endMin) =>
        set((s) => ({
          blocks: s.blocks.map((b) =>
            b.id === id ? { ...b, endMin: Math.max(b.startMin + 15, endMin) } : b,
          ),
        })),

      removeBlock: (id) =>
        set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) })),

      setConfig: (data) =>
        set((s) => ({ config: { ...s.config, ...data } })),
    }),
    {
      name: "horariofy",
      partialize: (s) => ({
        courses: s.courses,
        blocks: s.blocks,
        config: s.config,
      }),
    },
  ),
);
