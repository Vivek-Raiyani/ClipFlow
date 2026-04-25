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
 * YouTube Publishing API
 * 
 * Orchestrates the publishing of an approved video file to YouTube.
 * Steps:
 * 1. Validate user and project ownership.
 * 2. Refresh OAuth tokens.
 * 3. Stream file from R2 to YouTube API.
 * 4. Update project status and cleanup R2 storage.
 */

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[YouTube-Publish] Unauthorized access attempt.");
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
    if (!user) {
      console.error(`[YouTube-Publish] User not synced: ${clerkId}`);
      return NextResponse.json({ error: "User not synced" }, { status: 404 });
    }

    // 2. Resolve Project
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.creatorId !== user.id) {
      console.warn(`[YouTube-Publish] Forbidden access: User ${user.id} attempted to publish project ${projectId}`);
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
      console.error(`[YouTube-Publish] Channel ${channelId} not found for project ${projectId}`);
      return NextResponse.json({ error: "Associated YouTube channel not found" }, { status: 404 });
    }

    // 4. Resolve Selected File
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
      console.warn(`[YouTube-Publish] Attempted to publish unapproved file: ${file.id}`);
      return NextResponse.json({ error: "Only approved files can be published" }, { status: 400 });
    }

    console.log(`[YouTube-Publish] Starting publication for project: ${project.title}`);

    // 5. Refresh YouTube Access Token
    console.log(`[YouTube-Publish] Refreshing access token for channel: ${channel.channelTitle}`);
    const newAccessTokenPlaintext = await refreshAccessToken(channel.refreshToken);
    
    // Encrypt the new token before saving
    const encryptedNewAccessToken = encrypt(newAccessTokenPlaintext);
    
    await db.update(youtubeChannels)
      .set({ accessToken: encryptedNewAccessToken, updatedAt: new Date() })
      .where(eq(youtubeChannels.id, channel.id));

    // 6. Publish to YouTube
    console.log(`[YouTube-Publish] Uploading stream to YouTube...`);
    const ytResponse = await publishToYouTube({
      accessToken: newAccessTokenPlaintext, // Use plaintext for the client call
      refreshToken: channel.refreshToken,
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

    console.log(`[YouTube-Publish] Successfully published! Video ID: ${ytResponse.id}`);

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

    // 7. Delete the file from R2 to save space (Cleanup)
    if (file.r2Key) {
      console.log(`[YouTube-Publish] Cleaning up R2 storage for key: ${file.r2Key}`);
      await deleteFromR2(file.r2Key);
    }

    return NextResponse.json({ 
      success: true, 
      youtubeVideoId: ytResponse.id,
      youtubeUrl: `https://youtu.be/${ytResponse.id}`
    });

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[YouTube-Publish] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

