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
import { useScheduleStore } from "@/stores/useScheduleStore";
import { SchedulePreview } from "./SchedulePreview";
import { useExportOptions } from "./useExportOptions";
import { exportToPng } from "./exportSchedule";
import { CURATED_THEMES } from "./exportThemes";
import type { ExportTheme } from "./exportTypes";

const PREVIEW_WIDTH = 1100;

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const { courses, blocks, config } = useScheduleStore();
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
      <DialogContent className="flex max-h-[90vh] w-full max-w-5xl flex-col gap-0 p-0 sm:max-w-5xl">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="font-display text-lg">
            Exportar horario
          </DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1">
          {/* Panel de opciones */}
          <div className="flex w-72 shrink-0 flex-col gap-5 overflow-y-auto border-r p-5">
            <Section title="Título">
              <input
                value={options.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ciclo 2026-1"
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:border-accent"
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
                        ? "border-accent bg-accent/5"
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
                      <span className="text-accent text-xs">●</span>
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
                  max={20}
                  value={options.fontSize}
                  onChange={(e) => update("fontSize", Number(e.target.value))}
                  className="flex-1 accent-[var(--accent)]"
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
                  className="flex-1 accent-[var(--accent)]"
                />
                <span className="text-muted-foreground w-12 text-right text-xs tabular-nums">
                  {options.gridLineIntensity}%
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
            className="flex min-w-0 flex-1 items-start justify-center overflow-auto bg-muted/30 p-6"
          >
            <div
              style={{
                width: PREVIEW_WIDTH * scale,
                height: 600 * scale,
              }}
              className="shrink-0"
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: PREVIEW_WIDTH,
                }}
                className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5"
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

        <DialogFooter className="border-t px-5 py-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={exporting}
          >
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {exporting ? "Generando..." : "Descargar PNG"}
          </Button>
        </DialogFooter>
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
    <Label className="flex items-center justify-between gap-2 font-normal">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </Label>
  );
}
