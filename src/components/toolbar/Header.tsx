import { CalendarDays } from "lucide-react";

export function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <div className="bg-accent text-accent-foreground flex size-7 items-center justify-center rounded-md">
          <CalendarDays className="size-4" />
        </div>
        <span className="font-display text-xl leading-none tracking-tight">
          Horariofy
        </span>
      </div>
    </header>
  );
}
