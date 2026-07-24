import { Header } from "@/components/toolbar/Header";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ScheduleGrid } from "@/components/schedule/ScheduleGrid";

import { ScheduleDndProvider } from "@/features/schedule/ScheduleDndProvider";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <ScheduleDndProvider>
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="flex min-w-0 flex-1 flex-col">
            <ScheduleGrid />
          </main>
        </div>
      </ScheduleDndProvider>
    </div>
  );
}
