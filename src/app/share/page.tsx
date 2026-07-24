import { Suspense } from "react";
import { ShareView } from "@/features/share/ShareView";

export const metadata = {
  title: "Horario Compartido - Horariofy",
  description: "Un horario público de Horariofy.",
};

export default function SharePage() {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden relative">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center font-medium">Cargando horario...</div>}>
        <ShareView />
      </Suspense>
    </div>
  );
}
