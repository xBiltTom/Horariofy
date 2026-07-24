"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { CourseColor, CourseSession } from "@/types";
import { ColorPicker } from "./ColorPicker";
import { uid } from "@/utils/time";

interface CourseFormProps {
  initialName?: string;
  initialColor?: CourseColor;
  initialSessions?: CourseSession[];
  onSubmit: (data: {
    name: string;
    color: CourseColor;
    sessions: CourseSession[];
  }) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function CourseForm({
  initialName = "",
  initialColor = "rose",
  initialSessions,
  onSubmit,
  onCancel,
  submitLabel = "Crear",
}: CourseFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState<CourseColor>(initialColor);
  
  const [sessions, setSessions] = useState<{ tempId: string, type: string, professor: string, location: string }[]>(
    initialSessions?.map(s => ({ ...s, tempId: uid("t_") })) || 
    [{ tempId: uid("t_"), type: "Clase", professor: "", location: "" }]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanSessions = sessions.map(({ tempId, ...rest }) => ({ id: tempId, ...rest }));
    onSubmit({ name, color, sessions: cleanSessions });
  }

  function addSession() {
    setSessions([...sessions, { tempId: uid("t_"), type: "Laboratorio", professor: "", location: "" }]);
  }

  function removeSession(id: string) {
    if (sessions.length === 1) return;
    setSessions(sessions.filter(s => s.tempId !== id));
  }

  function updateSession(id: string, field: keyof typeof sessions[0], value: string) {
    setSessions(sessions.map(s => s.tempId === id ? { ...s, [field]: value } : s));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs font-medium">
          Nombre del curso
        </span>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Cálculo I"
          className="h-9 rounded-md border border-input bg-background px-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </label>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-muted-foreground text-xs font-medium">Sesiones</span>
          <button 
            type="button"
            onClick={addSession}
            className="text-[11px] font-medium text-primary flex items-center hover:underline"
          >
            <Plus className="size-3 mr-0.5" /> Agregar
          </button>
        </div>
        
        <div className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto pr-1">
          {sessions.map((s, index) => (
            <div key={s.tempId} className="flex flex-col gap-1.5 border rounded-md p-2 bg-muted/20 relative">
              {sessions.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeSession(s.tempId)}
                  className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              )}
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Tipo</span>
                <input
                  value={s.type}
                  onChange={(e) => updateSession(s.tempId, "type", e.target.value)}
                  placeholder="Teoría, Lab..."
                  className="h-7 w-full rounded-sm border border-input bg-background px-2 text-xs outline-none focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Profesor</span>
                <input
                  value={s.professor}
                  onChange={(e) => updateSession(s.tempId, "professor", e.target.value)}
                  placeholder="Ej. Alan Turing"
                  className="h-7 w-full rounded-sm border border-input bg-background px-2 text-xs outline-none focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Ubicación</span>
                <input
                  value={s.location}
                  onChange={(e) => updateSession(s.tempId, "location", e.target.value)}
                  placeholder="Ej. Lab 3"
                  className="h-7 w-full rounded-sm border border-input bg-background px-2 text-xs outline-none focus:border-accent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs font-medium">Color</span>
        <ColorPicker value={color} onChange={setColor} />
      </div>
      
      <div className="flex justify-end gap-2 pt-1 border-t mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="hover:bg-muted h-8 rounded-md px-3 text-sm transition-colors mt-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/80 h-8 rounded-md px-3 text-sm font-medium transition-colors mt-2"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
