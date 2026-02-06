import { AppHeader } from "../../components/app-header";
import { DashboardSidebar } from "../../components/dashboard-sidebar";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className="dashboard-shell">
        <DashboardSidebar />
        <div className="dashboard-content">{children}</div>
      </div>
    </>
  );
}
