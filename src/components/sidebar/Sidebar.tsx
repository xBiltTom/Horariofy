export function Sidebar() {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex h-12 items-center border-b px-4">
        <h2 className="text-sm font-medium text-sidebar-foreground">Cursos</h2>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground text-center text-sm">
          Tus cursos aparecerán aquí
        </p>
      </div>
    </aside>
  );
}
