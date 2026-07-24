import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Block, Course, Day, CourseColor, CourseSession } from "@/types";
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
    color?: CourseColor;
    sessions?: CourseSession[];
  }) => string;
  updateCourse: (id: string, data: Partial<Omit<Course, "id">>) => void;
  removeCourse: (id: string) => void;
  reorderCourses: (activeId: string, overId: string) => void;
  shuffleColors: () => void;

  addBlock: (data: {
    courseId: string;
    sessionId: string;
    day: Day;
    startMin: number;
    endMin: number;
  }) => string;
  updateBlock: (id: string, data: Partial<Omit<Block, "id">>) => void;
  moveBlock: (id: string, day: Day, startMin: number) => void;
  resizeBlock: (id: string, newStartMin: number, newEndMin: number) => void;
  removeBlock: (id: string) => void;

  setConfig: (data: Partial<typeof DEFAULT_CONFIG>) => void;
  
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      courses: [
        { 
          id: "c_seed1", 
          name: "Diseño de Interfaces", 
          color: "rose",
          sessions: [{ id: "s_seed1", type: "Teoría", professor: "Alan Turing", location: "Lab 3" }]
        },
        { 
          id: "c_seed2", 
          name: "Estructuras de Datos", 
          color: "sky",
          sessions: [{ id: "s_seed2", type: "Práctica", professor: "Grace Hopper", location: "Aula 101" }]
        },
      ],
      blocks: [
        { id: "b_seed1", courseId: "c_seed1", sessionId: "s_seed1", day: 0, startMin: 9 * 60, endMin: 11 * 60 },
        { id: "b_seed2", courseId: "c_seed1", sessionId: "s_seed1", day: 2, startMin: 9 * 60, endMin: 11 * 60 },
        { id: "b_seed3", courseId: "c_seed2", sessionId: "s_seed2", day: 1, startMin: 14 * 60 + 30, endMin: 16 * 60 },
        { id: "b_seed4", courseId: "c_seed2", sessionId: "s_seed2", day: 3, startMin: 14 * 60 + 30, endMin: 16 * 60 },
      ],
      config: DEFAULT_CONFIG,
      mobileSidebarOpen: false,

      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

      addCourse: ({ name, color, sessions = [] }) => {
        const id = uid("c_");
        const usedColors = get().courses.map((c) => c.color);
        const finalColor = color ?? pickAutoColor(usedColors);
        
        const defaultSession: CourseSession = {
          id: uid("s_"),
          type: "Clase",
          professor: "",
          location: "",
        };

        const newSessions = sessions.length > 0 
          ? sessions.map(s => ({ ...s, id: uid("s_") })) 
          : [defaultSession];

        const course: Course = {
          id,
          name: name.trim() || "Sin nombre",
          color: finalColor,
          sessions: newSessions,
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
                }
              : c,
          ),
        })),

      removeCourse: (id) =>
        set((s) => ({
          courses: s.courses.filter((c) => c.id !== id),
          blocks: s.blocks.filter((b) => b.courseId !== id),
        })),

      reorderCourses: (activeId, overId) =>
        set((s) => {
          const oldIndex = s.courses.findIndex((c) => c.id === activeId);
          const newIndex = s.courses.findIndex((c) => c.id === overId);
          if (oldIndex === -1 || newIndex === -1) return s;
          const newCourses = [...s.courses];
          const [removed] = newCourses.splice(oldIndex, 1);
          newCourses.splice(newIndex, 0, removed);
          return { courses: newCourses };
        }),

      shuffleColors: () =>
        set((s) => {
          const { COURSE_COLORS } = require("@/types");
          const availableColors = [...COURSE_COLORS];
          // Fisher-Yates shuffle
          for (let i = availableColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableColors[i], availableColors[j]] = [availableColors[j], availableColors[i]];
          }
          
          let colorIndex = 0;
          const newCourses = s.courses.map((c) => {
            const color = availableColors[colorIndex % availableColors.length];
            colorIndex++;
            return { ...c, color };
          });
          return { courses: newCourses };
        }),

      addBlock: ({ courseId, sessionId, day, startMin, endMin }) => {
        const id = uid("b_");
        const block: Block = { id, courseId, sessionId, day, startMin, endMin };
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

      resizeBlock: (id, newStartMin, newEndMin) =>
        set((s) => ({
          blocks: s.blocks.map((b) => {
            if (b.id !== id) return b;
            // Garantizar al menos 15 minutos de duración
            if (newEndMin - newStartMin < 15) return b;
            return { ...b, startMin: newStartMin, endMin: newEndMin };
          }),
        })),

      removeBlock: (id) =>
        set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) })),

      setConfig: (data) =>
        set((s) => {
          const newConfig = { ...s.config, ...data };
          // Validar coherencia
          if (newConfig.startMin >= newConfig.endMin) return s;

          const newBlocks = s.blocks.map(block => {
             let { startMin, endMin } = block;
             const duration = endMin - startMin;

             // 1. Si el bloque empieza antes del nuevo inicio, lo empujamos hacia abajo
             if (startMin < newConfig.startMin) {
                startMin = newConfig.startMin;
                endMin = startMin + duration;
             }
             
             // 2. Si termina después del nuevo fin, lo empujamos hacia arriba
             if (endMin > newConfig.endMin) {
                endMin = newConfig.endMin;
                startMin = endMin - duration;
                
                // 3. Si al empujarlo hacia arriba resulta que ahora choca con el inicio
                if (startMin < newConfig.startMin) {
                   startMin = newConfig.startMin;
                   endMin = newConfig.endMin;
                }
             }

             return { ...block, startMin, endMin };
          });

          return { config: newConfig, blocks: newBlocks };
        }),
    }),
    {
      name: "horariofy",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migración de v0 a v1 (Soporte para múltiples sesiones)
          const oldCourses = persistedState.courses || [];
          let oldBlocks = persistedState.blocks || [];
          
          persistedState.courses = oldCourses.map((c: any) => {
            if (c.sessions) return c; // Ya migrado
            
            const sessionId = uid("s_");
            const newSession = {
              id: sessionId,
              type: "Clase",
              professor: c.professor || "",
              location: c.location || "",
            };
            
            // Asignar esta nueva sesión a todos los bloques de este curso
            oldBlocks = oldBlocks.map((b: any) => {
              if (b.courseId === c.id && !b.sessionId) {
                return { ...b, sessionId };
              }
              return b;
            });
            
            const { professor, location, ...rest } = c;
            return {
              ...rest,
              sessions: [newSession],
            };
          });
          
          persistedState.blocks = oldBlocks;
        }
        return persistedState;
      },
      partialize: (s) => ({
        courses: s.courses,
        blocks: s.blocks,
        config: s.config,
      }),
    },
  ),
);
