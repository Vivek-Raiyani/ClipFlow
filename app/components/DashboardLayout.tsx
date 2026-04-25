import { DashboardSidebar } from "@/app/components/DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  counts?: {
    projects?: number;
    pending?: number;
    published?: number;
    editors?: number;
  };
}

export function DashboardLayout({ children, counts }: DashboardLayoutProps) {
  return (
    <div className="dash-layout">
      <DashboardSidebar counts={counts} />
      <main className="dash-main">{children}</main>
    </div>
  );
}
