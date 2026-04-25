import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects, projectFiles } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { syncUser } from "@/lib/user-sync";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { PendingReviewClient } from "./PendingReviewClient";

export const dynamic = "force-dynamic";

export default async function PendingReviewPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const pendingFiles = await db
    .select({
      file: projectFiles,
      projectTitle: projects.title,
    })
    .from(projectFiles)
    .innerJoin(projects, eq(projectFiles.projectId, projects.id))
    .where(
      and(
        eq(projects.creatorId, user.id),
        eq(projectFiles.status, "pending"),
        user.activeChannelId ? eq(projects.channelId, user.activeChannelId) : undefined
      )
    )
    .orderBy(desc(projectFiles.createdAt));

  return (
    <DashboardLayout>
      <PendingReviewClient
        initialFiles={pendingFiles.map(f => ({
          ...f.file,
          projectTitle: f.projectTitle
        }))}
      />
    </DashboardLayout>
  );
}
