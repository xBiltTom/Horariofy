import { CalendarDays } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
          <CalendarDays className="size-4" />
        </div>
        <span className="text-base font-semibold tracking-tight">Horariofy</span>
      </div>
    </header>
  );
}
