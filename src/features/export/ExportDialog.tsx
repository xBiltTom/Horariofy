"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { SchedulePreview } from "./SchedulePreview";
import { useExportOptions } from "./useExportOptions";
import { exportToPng } from "./exportSchedule";
import { CURATED_THEMES } from "./exportThemes";
import type { ExportTheme, ExportOptions } from "./exportTypes";
import type { SharedData } from "@/utils/share";

const PREVIEW_WIDTH = 1100;

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sharedData?: SharedData;
}

export function ExportDialog({ open, onOpenChange, sharedData }: ExportDialogProps) {
  const storeCourses = useScheduleStore((s) => s.courses);
  const storeBlocks = useScheduleStore((s) => s.blocks);
  const storeConfig = useScheduleStore((s) => s.config);

  const courses = sharedData?.courses ?? storeCourses;
  const blocks = sharedData?.blocks ?? storeBlocks;
  const config = sharedData?.config ?? storeConfig;
  
  const { options, update, generateRandomTheme } = useExportOptions();

  const innerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const compute = () => {
      const available = container.clientWidth;
      setScale(Math.min(1, available / PREVIEW_WIDTH));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    return () => ro.disconnect();
  }, [open]);

  async function handleExport() {
    if (!innerRef.current) return;
    setExporting(true);
    try {
      const fileName = options.title.trim()
        ? `${options.title.trim().replace(/\s+/g, "-").toLowerCase()}.png`
        : "mi-horario.png";
      await exportToPng(innerRef.current, options.theme.background, fileName);
      onOpenChange(false);
    } catch (err) {
      console.error("Error al exportar:", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-dvh md:h-auto max-h-dvh md:max-h-[90vh] w-full max-w-5xl flex-col gap-0 p-0 sm:max-w-5xl rounded-none md:rounded-lg">
        <DialogHeader className="border-b px-5 py-4 shrink-0">
          <DialogTitle className="font-display text-lg">
            Exportar horario
          </DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col-reverse md:flex-row">
          {/* Panel de opciones */}
          <div className="flex w-full md:w-72 flex-1 md:flex-none md:shrink-0 flex-col gap-5 overflow-y-auto border-t md:border-t-0 md:border-r p-5 pb-8 md:pb-5">
            <Section title="Título">
              <input
                value={options.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ciclo 2026-1"
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:border-slate-600 dark:focus:border-slate-400"
              />
            </Section>

            <Section title="Tema">
              <div className="flex flex-col gap-1.5">
                {CURATED_THEMES.map((theme: ExportTheme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => update("theme", theme)}
                    className={`flex items-center gap-2.5 rounded-md border px-2.5 py-2 text-left text-sm transition-colors ${
                      options.theme.id === theme.id
                        ? "border-slate-600 bg-slate-600/5 dark:border-slate-400 dark:bg-slate-400/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span
                      className="size-5 shrink-0 rounded-full border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      }}
                    >
                      <span
                        className="block size-full scale-[0.5] rounded-full"
                        style={{ backgroundColor: theme.foreground }}
                      />
                    </span>
                    <span className="flex-1">{theme.name}</span>
                    {options.theme.id === theme.id && (
                      <span className="text-slate-600 dark:text-slate-400 text-xs">●</span>
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={generateRandomTheme}
                  className="flex items-center justify-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Sparkles className="size-3.5" />
                  Generar tema
                </button>
              </div>
            </Section>

            <Section title="Tamaño del texto">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={12}
                  max={50}
                  value={options.fontSize}
                  onChange={(e) => update("fontSize", Number(e.target.value))}
                  className="flex-1 accent-slate-600 dark:accent-slate-400"
                />
                <span className="text-muted-foreground w-12 text-right text-xs tabular-nums">
                  {options.fontSize}px
                </span>
              </div>
            </Section>

            <Section title="Líneas de grilla">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={options.gridLineIntensity}
                  onChange={(e) =>
                    update("gridLineIntensity", Number(e.target.value))
                  }
                  className="flex-1 accent-slate-600 dark:accent-slate-400"
                />
                <span className="text-muted-foreground w-12 text-right text-xs tabular-nums">
                  {options.gridLineIntensity}%
                </span>
              </div>
            </Section>

            <Section title="Constraste de horas y días">
                <div className="flex items-center gap-3">
                  <input
                    type="range" 
                    min={0}
                    max={100}
                    className="flex-1 accent-slate-600 cursor-pointer dark:accent-slate-400"
                    value={options.labelContrast}
                    onChange={ (e) => 
                      update("labelContrast",Number(e.target.value))
                    }
                  />
                  <span className="text-muted-foreground w-12 text-right text-xs tabular-nums">
                    {options.labelContrast}%
                  </span>
                </div>
            </Section>

            <Section title="Mostrar en tarjetas">
              <div className="flex flex-col gap-2">
                <Toggle
                  label="Nombre del curso"
                  checked={options.showCourseName}
                  onChange={(v) => update("showCourseName", v)}
                />
                <Toggle
                  label="Tipo de sesión"
                  checked={options.showSessionType}
                  onChange={(v) => update("showSessionType", v)}
                />
                <Toggle
                  label="Profesor"
                  checked={options.showProfessor}
                  onChange={(v) => update("showProfessor", v)}
                />
                <Toggle
                  label="Aula o ubicación"
                  checked={options.showLocation}
                  onChange={(v) => update("showLocation", v)}
                />
                <Toggle
                  label="Hora"
                  checked={options.showTime}
                  onChange={(v) => update("showTime", v)}
                />
              </div>
            </Section>
          </div>

          {/* Área de preview */}
          <div
            ref={containerRef}
            className="flex min-w-0 shrink-0 h-[35vh] md:h-auto md:flex-1 items-start justify-center overflow-auto bg-muted/30 p-4 md:p-6"
          >
            <div
              style={{
                width: PREVIEW_WIDTH * scale,
                height: ((config.endMin - config.startMin) * (80 / 60) + 44 + 16 + (options.title.trim() ? 52 : 0)) * scale,
              }}
              className="shrink-0 relative"
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: PREVIEW_WIDTH,
                  height: ((config.endMin - config.startMin) * (80 / 60) + 44 + 16 + (options.title.trim() ? 52 : 0)),
                }}
                className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 absolute top-0 left-0"
              >
                <SchedulePreview
                  ref={innerRef}
                  blocks={blocks}
                  courses={courses}
                  config={config}
                  options={options}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 border-t p-4 bg-background rounded-b-none md:rounded-b-lg shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={exporting}
          >
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <Download className="size-4 mr-2" />
            )}
            {exporting ? "Generando..." : "Descargar PNG"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Label className="flex items-center justify-between gap-2 font-normal cursor-pointer">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
          checked ? "bg-slate-600 dark:bg-slate-400" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-4 transform rounded-full bg-background shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </Label>
  );
}
