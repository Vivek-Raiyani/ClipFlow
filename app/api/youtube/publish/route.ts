import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, projectFiles, users, auditLogs } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { refreshAccessToken } from "@/lib/youtube";
import { publishToYouTube } from "@/lib/youtube-publisher";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, fileId } = await req.json();
    if (!projectId || !fileId) {
      return NextResponse.json({ error: "projectId and fileId are required" }, { status: 400 });
    }

    // 1. Resolve User
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!user) return NextResponse.json({ error: "User not synced" }, { status: 404 });
    if (!user.youtubeRefreshToken) {
      return NextResponse.json({ error: "YouTube account not connected" }, { status: 400 });
    }

    // 2. Resolve Project
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Resolve Selected File
    const file = await db.query.projectFiles.findFirst({
      where: and(
        eq(projectFiles.id, fileId),
        eq(projectFiles.projectId, projectId)
      ),
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    if (file.status !== "approved") {
      return NextResponse.json({ error: "Only approved files can be published" }, { status: 400 });
    }

    // 4. Refresh YouTube Access Token
    const newAccessToken = await refreshAccessToken(user.youtubeRefreshToken);
    await db.update(users)
      .set({ youtubeAccessToken: newAccessToken })
      .where(eq(users.id, user.id));

    // 5. Publish to YouTube
    const ytResponse = await publishToYouTube({
      accessToken: newAccessToken,
      refreshToken: user.youtubeRefreshToken,
      r2Key: file.r2Key,
      title: project.title,
      description: project.description || "",
      tags: project.tags || "",
      categoryId: project.categoryId || "22",
      privacyStatus: project.visibility as any,
    });

    if (!ytResponse.id) {
      throw new Error("YouTube API did not return a video ID");
    }

    // 6. Update Project and Audit Log
    await db.update(projects)
      .set({ 
        youtubeVideoId: ytResponse.id,
        status: "published"
      })
      .where(eq(projects.id, projectId));

    await db.insert(auditLogs).values({
      userId: user.id,
      projectId: project.id,
      fileId: file.id,
      action: "PROJECT_PUBLISHED",
      details: { youtubeVideoId: ytResponse.id },
    });

    return NextResponse.json({ 
      success: true, 
      youtubeVideoId: ytResponse.id,
      youtubeUrl: `https://youtu.be/${ytResponse.id}`
    });

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[YouTube Publish Error]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
