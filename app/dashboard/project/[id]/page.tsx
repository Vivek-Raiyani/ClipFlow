import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { projects, projectFiles, creatorEditorRelationships, thumbnails, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { syncUser } from "@/lib/user-sync";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { ProjectDetailClient } from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
  });
  if (!project || project.creatorId !== user.id) notFound();

  const start = Date.now();
  const [files, editors, projectThumbnails] = await Promise.all([
    db
      .select({
        id: projectFiles.id,
        fileName: projectFiles.fileName,
        fileSize: projectFiles.fileSize,
        type: projectFiles.type,
        status: projectFiles.status,
        version: projectFiles.version,
        createdAt: projectFiles.createdAt,
        uploaderName: users.name,
        uploaderEmail: users.email,
      })
      .from(projectFiles)
      .leftJoin(users, eq(projectFiles.uploaderId, users.id))
      .where(eq(projectFiles.projectId, id)),

    db
      .select({
        id: creatorEditorRelationships.id,
        editorId: creatorEditorRelationships.editorId,
        status: creatorEditorRelationships.status,
        name: users.name,
        email: users.email,
      })
      .from(creatorEditorRelationships)
      .leftJoin(users, eq(creatorEditorRelationships.editorId, users.id))
      .where(
        and(
          eq(creatorEditorRelationships.creatorId, user.id),
          eq(creatorEditorRelationships.status, "active")
        )
      ),

    db.select().from(thumbnails).where(eq(thumbnails.projectId, id)),
  ]);
  console.log(`[ProjectPage] Fetch for ${id} took ${Date.now() - start}ms`);

  const isYouTubeConnected = Boolean(user.activeChannelId);

  return (
    <DashboardLayout>
      <ProjectDetailClient
        project={{
          id: project.id,
          title: project.title,
          status: project.status,
          visibility: project.visibility,
          createdAt: project.createdAt.toISOString(),
          description: project.description,
          youtubeVideoId: project.youtubeVideoId,
        }}
        files={files.map(f => ({
          ...f,
          createdAt: f.createdAt.toISOString(),
        }))}
        editors={editors.map(e => ({
          id: e.id,
          editorId: e.editorId,
          name: e.name,
          email: e.email,
          status: e.status,
        }))}
        thumbnails={projectThumbnails.map(t => ({
          id: t.id,
          r2Key: t.r2Key,
          isMain: t.isMain,
        }))}
        isYouTubeConnected={isYouTubeConnected}
      />
    </DashboardLayout>
  );
}
