export function ScheduleGrid() {
  return (
    <div className="relative flex-1 overflow-auto">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "var(--background)",
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "100% 48px, 48px 100%",
          opacity: 0.5,
        }}
      />
      <div className="relative flex h-full min-h-[600px] items-center justify-center p-8">
        <div className="text-center">
          <p className="text-foreground font-display text-2xl">
            Tu semana está en blanco
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Arrastra un curso desde la barra lateral para empezar.
          </p>
        </div>
      </div>
    </div>
  );
}
