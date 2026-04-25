import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, projectFiles, users, auditLogs, youtubeChannels } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { refreshAccessToken } from "@/lib/youtube";
import { publishToYouTube } from "@/lib/youtube-publisher";
import { deleteFromR2 } from "@/lib/r2";
import { encrypt } from "@/lib/crypto";

/**
 * Project Publish API ([id])
 * 
 * Specifically triggers the publication of a project's approved "final" file
 * to the associated YouTube channel.
 */

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Project-Publish] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Resolve User
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!user) {
      console.error(`[Project-Publish] User not synced: ${clerkId}`);
      return NextResponse.json({ error: "User not synced" }, { status: 404 });
    }

    // 2. Resolve Project
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.creatorId !== user.id) {
      console.warn(`[Project-Publish] Forbidden: User ${user.id} tried to publish project ${projectId}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Resolve Channel
    const channelId = project.channelId || user.activeChannelId;
    if (!channelId) {
      return NextResponse.json({ error: "No YouTube channel associated with this project" }, { status: 400 });
    }

    const channel = await db.query.youtubeChannels.findFirst({
      where: eq(youtubeChannels.id, channelId),
    });

    if (!channel) {
      console.error(`[Project-Publish] Channel ${channelId} not found for project ${projectId}`);
      return NextResponse.json({ error: "Associated YouTube channel not found" }, { status: 404 });
    }

    // 4. Resolve Approved Final File
    const finalFile = await db.query.projectFiles.findFirst({
      where: and(
        eq(projectFiles.projectId, projectId),
        eq(projectFiles.status, "approved"),
        eq(projectFiles.type, "final")
      ),
      orderBy: (files, { desc }) => [desc(files.version)],
    });

    if (!finalFile) {
      console.warn(`[Project-Publish] No approved final file found for project: ${projectId}`);
      return NextResponse.json(
        { error: "No approved final file found to publish" },
        { status: 400 }
      );
    }

    console.log(`[Project-Publish] Starting publication for project: ${project.title}`);

    // 5. Refresh YouTube Access Token
    console.log("[Project-Publish] Refreshing access token...");
    const plaintextAccessToken = await refreshAccessToken(channel.refreshToken);
    
    // Encrypt the new token before saving
    const encryptedAccessToken = encrypt(plaintextAccessToken);
    
    await db.update(youtubeChannels)
      .set({ accessToken: encryptedAccessToken, updatedAt: new Date() })
      .where(eq(youtubeChannels.id, channel.id));

    // 6. Publish to YouTube
    console.log("[Project-Publish] Streaming to YouTube...");
    const ytResponse = await publishToYouTube({
      accessToken: plaintextAccessToken,
      refreshToken: channel.refreshToken,
      r2Key: finalFile.r2Key,
      title: project.title,
      description: project.description || "",
      tags: project.tags || "",
      categoryId: project.categoryId || "22",
      privacyStatus: project.visibility as any,
    });

    if (!ytResponse.id) {
      throw new Error("YouTube API did not return a video ID");
    }

    console.log(`[Project-Publish] Success! YouTube Video ID: ${ytResponse.id}`);

    // 7. Update Project and Audit Log
    await db.update(projects)
      .set({ 
        youtubeVideoId: ytResponse.id,
        status: "published",
        updatedAt: new Date()
      })
      .where(eq(projects.id, projectId));

    await db.insert(auditLogs).values({
      userId: user.id,
      projectId: project.id,
      fileId: finalFile.id,
      action: "PROJECT_PUBLISHED",
      details: { youtubeVideoId: ytResponse.id },
    });

    // 8. Delete the file from R2 to save space (Cleanup)
    if (finalFile.r2Key) {
      console.log(`[Project-Publish] Cleaning up R2 storage for key: ${finalFile.r2Key}`);
      await deleteFromR2(finalFile.r2Key);
    }

    return NextResponse.json({ 
      success: true, 
      youtubeVideoId: ytResponse.id,
      youtubeUrl: `https://youtu.be/${ytResponse.id}`
    });

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[Project-Publish] Fatal Error for ${projectId}:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


