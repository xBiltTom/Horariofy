import { Header } from "@/components/toolbar/Header";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ScheduleGrid } from "@/components/schedule/ScheduleGrid";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <ScheduleGrid />
        </main>
      </div>
    </div>
  );
}
