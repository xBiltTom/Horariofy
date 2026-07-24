"use client";

import { useState } from "react";
import { Download, Menu, Settings2 } from "lucide-react";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { ExportDialog } from "@/features/export/ExportDialog";

export function Header() {
  const { config, setConfig, mobileSidebarOpen, setMobileSidebarOpen } =
    useScheduleStore();
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/50 sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 md:px-6 backdrop-blur-md transition-all">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hover:bg-muted -ml-1.5 rounded-md p-1.5 transition-colors md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          <Menu className="size-5" />
        </button>
        
        {/* Custom Geometric Logo for Horariofy */}
        <div className="flex items-center gap-2.5 select-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
            <rect x="3" y="4" width="5" height="16" rx="1.5" className="fill-slate-800 dark:fill-slate-200" />
            <rect x="16" y="4" width="5" height="16" rx="1.5" className="fill-slate-800 dark:fill-slate-200" />
            <rect x="8" y="10" width="8" height="4" rx="1" className="fill-slate-400 dark:fill-slate-500" />
          </svg>
          <span className="font-display text-lg font-semibold tracking-tight">
            Horariofy
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Configuración de Rango Horario (Oculto en móviles muy pequeños para dar espacio) */}
        <div className="hidden sm:flex items-center gap-2">
          <Settings2 className="size-3.5 text-muted-foreground/70" />
          <div className="flex items-center rounded-full border border-border/60 bg-muted/20 px-1 py-0.5 shadow-sm">
            <select
              value={config.startMin}
              onChange={(e) => setConfig({ startMin: Number(e.target.value) })}
              className="h-7 cursor-pointer appearance-none rounded-full bg-transparent px-3 text-xs font-semibold tracking-wide outline-none transition-colors hover:bg-muted focus:bg-muted text-center"
            >
              {Array.from({ length: 7 }).map((_, i) => {
                const hour = 6 + i;
                return (
                  <option key={hour} value={hour * 60}>
                    {hour.toString().padStart(2, "0")}:00
                  </option>
                );
              })}
            </select>
            <span className="text-muted-foreground/50 text-[10px] font-bold">—</span>
            <select
              value={config.endMin}
              onChange={(e) => setConfig({ endMin: Number(e.target.value) })}
              className="h-7 cursor-pointer appearance-none rounded-full bg-transparent px-3 text-xs font-semibold tracking-wide outline-none transition-colors hover:bg-muted focus:bg-muted text-center"
            >
              {Array.from({ length: 9 }).map((_, i) => {
                const hour = 16 + i;
                return (
                  <option key={hour} value={hour * 60}>
                    {hour.toString().padStart(2, "0")}:00
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Botón de exportar */}
        <button
          type="button"
          onClick={() => setExportOpen(true)}
          className="bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Download className="size-3.5" />
          <span>Exportar</span>
        </button>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </header>
  );
}
