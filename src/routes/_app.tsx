import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MobileFrame, StatusBar } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  return (
    <MobileFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col overflow-y-auto scroll-area">
        <Outlet />
      </div>
      <BottomNav />
    </MobileFrame>
  );
}
