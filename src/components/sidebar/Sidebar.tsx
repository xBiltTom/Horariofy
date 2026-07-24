export function Sidebar() {
  return (
    <aside className="bg-sidebar flex w-72 shrink-0 flex-col border-r">
      <div className="flex h-11 items-center border-b px-4">
        <h2 className="text-foreground text-xs font-semibold tracking-wide uppercase">
          Cursos
        </h2>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          Crea tu primer curso
          <br />
          y arrástralo a la grilla.
        </p>
      </div>
    </aside>
  );
}
