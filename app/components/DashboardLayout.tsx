import { DashboardSidebar } from "@/app/components/DashboardSidebar";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import { projects, projectFiles, creatorEditorRelationships } from "@/lib/db/schema";
import { eq, and, count, isNull } from "drizzle-orm";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId: clerkId } = await auth();
  const user = await syncUser();

  let counts = {
    projects: 0,
    pending: 0,
    published: 0,
    editors: 0,
  };

  if (user) {
    const [allProjects, pendingFiles, editors] = await Promise.all([
      db.select().from(projects).where(
        and(
          eq(projects.creatorId, user.id),
          user.activeChannelId 
            ? eq(projects.channelId, user.activeChannelId) 
            : isNull(projects.channelId)
        )
      ),
      db.select({ count: count() })
        .from(projectFiles)
        .innerJoin(projects, eq(projectFiles.projectId, projects.id))
        .where(
          and(
            eq(projects.creatorId, user.id),
            eq(projectFiles.status, "pending"),
            user.activeChannelId ? eq(projects.channelId, user.activeChannelId) : isNull(projects.channelId)
          )
        ),
      db.select({ count: count() }).from(creatorEditorRelationships).where(
        eq(creatorEditorRelationships.creatorId, user.id)
      ),
    ]);

    counts = {
      projects: allProjects.length,
      pending: Number(pendingFiles[0]?.count ?? 0),
      published: allProjects.filter(p => p.status === "published").length,
      editors: Number(editors[0]?.count ?? 0),
    };
  }

  return (
    <div className="dash-layout">
      <DashboardSidebar counts={counts} />
      <main className="dash-main">{children}</main>
    </div>
  );
}
