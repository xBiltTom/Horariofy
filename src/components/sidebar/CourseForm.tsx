"use client";

import { useState } from "react";
import type { CourseColor } from "@/types";
import { ColorPicker } from "./ColorPicker";

interface CourseFormProps {
  initialName?: string;
  initialProfessor?: string;
  initialLocation?: string;
  initialColor?: CourseColor;
  onSubmit: (data: {
    name: string;
    professor: string;
    location: string;
    color: CourseColor;
  }) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function CourseForm({
  initialName = "",
  initialProfessor = "",
  initialLocation = "",
  initialColor = "rose",
  onSubmit,
  onCancel,
  submitLabel = "Crear",
}: CourseFormProps) {
  const [name, setName] = useState(initialName);
  const [professor, setProfessor] = useState(initialProfessor);
  const [location, setLocation] = useState(initialLocation);
  const [color, setColor] = useState<CourseColor>(initialColor);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, professor, location, color });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
      <label className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs font-medium">
          Profesor
        </span>
        <input
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          placeholder="Nombre del docente"
          className="h-9 rounded-md border border-input bg-background px-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs font-medium">
          Aula o ubicación
        </span>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Edificio A — 201"
          className="h-9 rounded-md border border-input bg-background px-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </label>
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs font-medium">Color</span>
        <ColorPicker value={color} onChange={setColor} />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="hover:bg-muted h-8 rounded-md px-3 text-sm transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/80 h-8 rounded-md px-3 text-sm font-medium transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
