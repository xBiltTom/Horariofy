"use client";

import { CalendarDays, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { useScheduleStore } from "@/stores/useScheduleStore";

export function Header() {
  const { config, setConfig } = useScheduleStore();

  return (
    <header className="bg-background/80 sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <div className="bg-accent text-accent-foreground flex size-7 items-center justify-center rounded-md shadow-sm">
          <CalendarDays className="size-4" />
        </div>
        <span className="font-display text-xl leading-none tracking-tight">
          Horariofy
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Configuración de Rango Horario */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground text-xs font-medium">De</span>
          <select
            value={config.startMin}
            onChange={(e) => setConfig({ startMin: Number(e.target.value) })}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-accent"
          >
            {Array.from({ length: 7 }).map((_, i) => {
              const hour = 6 + i; // 6:00 a 12:00
              return (
                <option key={hour} value={hour * 60}>
                  {hour.toString().padStart(2, "0")}:00
                </option>
              );
            })}
          </select>
          <span className="text-muted-foreground text-xs font-medium">a</span>
          <select
            value={config.endMin}
            onChange={(e) => setConfig({ endMin: Number(e.target.value) })}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-accent"
          >
            {Array.from({ length: 9 }).map((_, i) => {
              const hour = 16 + i; // 16:00 a 24:00
              return (
                <option key={hour} value={hour * 60}>
                  {hour.toString().padStart(2, "0")}:00
                </option>
              );
            })}
          </select>
        </div>

        {/* Botón de exportar */}
        <button
          type="button"
          onClick={async () => {
            const node = document.getElementById("schedule-grid-export");
            if (!node) return;
            try {
              // Pequeño hack para asegurar que las fuentes/estilos estén listos
              await new Promise((resolve) => setTimeout(resolve, 100));
              const dataUrl = await toPng(node, {
                cacheBust: true,
                backgroundColor: "#ffffff",
                pixelRatio: 2, // Mayor calidad
              });
              const link = document.createElement("a");
              link.download = "mi-horario.png";
              link.href = dataUrl;
              link.click();
            } catch (err) {
              console.error("Error al exportar:", err);
            }
          }}
          className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
        >
          <Download className="size-3.5" />
          Exportar
        </button>
      </div>
    </header>
  );
}
