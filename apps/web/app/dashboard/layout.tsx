import { AppHeader } from "../../components/app-header";
import { DashboardSidebar } from "../../components/dashboard-sidebar";
import { MobileDrawerProvider } from "../../components/mobile-drawer";
import { MobileDrawerBackdrop } from "../../components/mobile-drawer-backdrop";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileDrawerProvider>
      <AppHeader />
      <div className="dashboard-shell">
        <DashboardSidebar />
        <MobileDrawerBackdrop />
        <div className="dashboard-content">{children}</div>
      </div>
    </MobileDrawerProvider>
  );
}
