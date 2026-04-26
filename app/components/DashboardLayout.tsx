import { DashboardSidebar } from "@/app/components/DashboardSidebar";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import { projects, projectFiles, creatorEditorRelationships, youtubeChannels } from "@/lib/db/schema";
import { eq, and, count, isNull } from "drizzle-orm";

import { getDashboardData } from "@/lib/dashboard-data";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="dash-layout">
        <DashboardSidebar />
        <main className="dash-main">{children}</main>
      </div>
    );
  }

  const { user, allProjects, pendingCount, editorCount, channels, publishedCount } = data;

  const counts = {
    projects: allProjects.length,
    pending: pendingCount,
    published: publishedCount,
    editors: editorCount,
  };

  return (
    <div className="dash-layout">
      <DashboardSidebar 
        counts={counts} 
        initialChannels={channels}
        activeChannelId={user.activeChannelId}
      />
      <main className="dash-main">{children}</main>
    </div>
  );
}
