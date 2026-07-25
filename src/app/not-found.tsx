import Link from "next/link";
import { ArrowLeft, CalendarX2 } from "lucide-react";

export const metadata = {
  title: "Página no encontrada - Horariofy",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground overflow-hidden relative">
      {/* Background Grid Pattern to mimic the calendar */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex flex-col">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`h-${i}`} className="w-full h-12 border-b border-foreground" />
        ))}
      </div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`v-${i}`} className="h-full w-32 border-r border-foreground shrink-0" />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* The "Lost Block" Signature Element */}
        <div className="relative mb-8 group cursor-default">
          <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative flex flex-col w-48 h-48 bg-slate-100 border-2 border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-xl p-5 transform -rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105">
            {/* Left solid color strip typical of our blocks */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500 rounded-l-xl" />
            
            <div className="flex-1 flex flex-col items-start justify-center pl-3">
              <CalendarX2 className="size-8 text-rose-500 mb-3 opacity-80" />
              <span className="font-display text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-none">
                404
              </span>
              <span className="font-sans text-sm font-bold text-rose-500 uppercase tracking-widest mt-1">
                Clase perdida
              </span>
              <div className="mt-auto w-full">
                <div className="h-1.5 w-1/2 bg-slate-300 dark:bg-slate-700 rounded-full mb-1.5" />
                <div className="h-1.5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-3">
          Bloque no encontrado
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Parece que te has quedado fuera de horario. La página que buscas no existe, fue movida o el enlace que ingresaste es incorrecto.
        </p>

        {/* CTA */}
        <Link 
          href="/" 
          className="group flex h-11 items-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-semibold text-slate-50 transition-all hover:bg-slate-800 active:scale-95 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span>Ir al inicio</span>
        </Link>
      </div>
    </div>
  );
}
