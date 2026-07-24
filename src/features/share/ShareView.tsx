"use client";

import { useSearchParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { decodeScheduleData, type SharedData } from "@/utils/share";
import { ScheduleGrid } from "@/components/schedule/ScheduleGrid";
import { ExportDialog } from "@/features/export/ExportDialog";

export function ShareView() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("s");
  const [data, setData] = useState<SharedData | null>(null);
  const [error, setError] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    if (encoded) {
      (async () => {
        const decoded = await decodeScheduleData(encoded);
        if (decoded) {
          setData(decoded);
        } else {
          setError(true);
        }
      })();
    } else {
      setError(true);
    }
  }, [encoded]);

  if (error) {
    return notFound();
  }

  if (!data) return null; // Wait for decode

  return (
    <>
      <header className="bg-background/70 supports-[backdrop-filter]:bg-background/50 sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 md:px-6 backdrop-blur-md transition-all">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 select-none hover:opacity-80 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
              <rect x="3" y="4" width="5" height="16" rx="1.5" className="fill-slate-800 dark:fill-slate-200" />
              <rect x="16" y="4" width="5" height="16" rx="1.5" className="fill-slate-800 dark:fill-slate-200" />
              <rect x="8" y="10" width="8" height="4" rx="1" className="fill-slate-400 dark:fill-slate-500" />
            </svg>
            <span className="font-display text-lg font-semibold tracking-tight">
              Horariofy
            </span>
          </Link>
          <span className="bg-muted text-muted-foreground ml-2 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
            Solo lectura
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="hidden sm:inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mr-2">
            Crea el tuyo gratis
          </Link>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Download className="size-3.5" />
            <span>Exportar</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto max-w-[1400px] mx-auto w-full border-x border-border/50 bg-background/50">
          <ScheduleGrid
            initialCourses={data.courses}
            initialBlocks={data.blocks}
            initialConfig={data.config}
            isReadOnly={true}
          />
        </div>
      </main>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        sharedData={data} // Pasa los datos compartidos
      />
    </>
  );
}
