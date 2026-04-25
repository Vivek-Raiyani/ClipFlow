import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { syncUser } from "@/lib/user-sync";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { ProjectCard } from "@/app/components/ProjectCard";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublishedPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const publishedProjects = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.creatorId, user.id),
        eq(projects.status, "published"),
        user.activeChannelId ? eq(projects.channelId, user.activeChannelId) : undefined
      )
    )
    .orderBy(desc(projects.updatedAt));

  return (
    <DashboardLayout>
      <div className="dash-header">
        <div>
          <div className="dash-header-title">Published</div>
          <div className="dash-header-sub">Successfully pushed to YouTube</div>
        </div>
      </div>

      {publishedProjects.length === 0 ? (
        <div className="proj-list">
          <div className="empty-state">
            <div className="empty-icon">
              <CheckCircle size={24} className="text-[var(--ui-fg3)]" />
            </div>
            <div className="empty-title">No published projects</div>
            <div className="empty-sub">Once you approve a final file and publish it, it will appear here.</div>
          </div>
        </div>
      ) : (
        <div className="proj-list">
          {publishedProjects.map((project) => (
            <Link key={project.id} href={`/dashboard/project/${project.id}`} style={{ textDecoration: "none" }}>
              <ProjectCard
                title={project.title}
                avatarChar={project.title[0]?.toUpperCase() ?? "P"}
                date={new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                visibility={project.visibility === "private" ? "Private" : "Public"}
                statusValue="Published"
                statusActive={false}
              />
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
