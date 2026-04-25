import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects, projectFiles, creatorEditorRelationships, users } from "@/lib/db/schema";
import { eq, count, and, isNull } from "drizzle-orm";
import { syncUser } from "@/lib/user-sync";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { ProjectCard } from "@/app/components/ProjectCard";
import { CreateProjectButton } from "./CreateProjectButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const [allProjects, pendingFiles, editors] = await Promise.all([
    db.select().from(projects).where(
      and(
        eq(projects.creatorId, user.id),
        user.activeChannelId 
          ? eq(projects.channelId, user.activeChannelId) 
          : isNull(projects.channelId)
      )
    ),
    db.select({ count: count() }).from(projectFiles).where(eq(projectFiles.status, "pending")),
    db.select({ count: count() }).from(creatorEditorRelationships).where(
      eq(creatorEditorRelationships.creatorId, user.id)
    ),
  ]);

  const publishedCount = allProjects.filter(p => p.status === "published").length;
  const pendingCount = Number(pendingFiles[0]?.count ?? 0);
  const editorCount = Number(editors[0]?.count ?? 0);

  const counts = {
    projects: allProjects.length,
    pending: pendingCount,
    published: publishedCount,
    editors: editorCount,
  };

  return (
    <DashboardLayout counts={counts}>
      {/* Header */}
      <div className="dash-header">
        <div>
          <div className="dash-header-title">Pipelines</div>
          <div className="dash-header-sub">
            {allProjects.length} active project{allProjects.length !== 1 ? "s" : ""} · Last sync just now
          </div>
        </div>
        <div className="dash-header-actions">
          <CreateProjectButton />
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="stat-card">
          <div className="stat-label">Pending Review</div>
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-delta">files awaiting approval</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Published</div>
          <div className="stat-value">{publishedCount}</div>
          <div className="stat-delta">projects pushed to YouTube</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Editors</div>
          <div className="stat-value">{editorCount}</div>
          <div className="stat-delta">across all projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Projects</div>
          <div className="stat-value">{allProjects.length}</div>
          <div className="stat-delta">in your workspace</div>
        </div>
      </div>

      {/* Project list */}
      <div className="dash-proj-header">
        <div className="dash-proj-title">All Projects</div>
        <div className="dash-proj-count">{allProjects.length} total</div>
      </div>

      {allProjects.length === 0 ? (
        <div className="proj-list">
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="empty-title">No projects yet</div>
            <div className="empty-sub">Create your first pipeline to start managing video uploads from your editors.</div>
            <CreateProjectButton />
          </div>
        </div>
      ) : (
        <div className="proj-list">
          {allProjects.map((project) => (
            <Link key={project.id} href={`/dashboard/project/${project.id}`} style={{ textDecoration: "none" }}>
              <ProjectCard
                title={project.title}
                avatarChar={project.title[0]?.toUpperCase() ?? "P"}
                date={new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                visibility={project.visibility === "private" ? "Private" : "Public"}
                statusValue={project.status === "active" ? "Operational" : project.status === "published" ? "Published" : "Archived"}
                statusActive={project.status === "active"}
                archived={project.status === "archived"}
              />
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
