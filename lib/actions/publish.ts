import { db } from "@/lib/db";
import { projects, projectFiles, users, auditLogs, youtubeChannels } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { refreshAccessToken } from "@/lib/youtube";
import { publishToYouTube } from "@/lib/youtube-publisher";
import { deleteFromR2 } from "@/lib/r2";
import { encrypt } from "@/lib/crypto";

/**
 * Core Project Publication Action
 * 
 * This function contains the business logic for publishing a project to YouTube.
 * It is decoupled from the HTTP layer so it can be run inline or in a background job.
 * 
 * @param projectId The UUID of the project to publish
 * @param userId The UUID of the user performing the action
 * @param fileId Optional specific file UUID to publish. If omitted, the latest approved final file is used.
 */
export async function executePublishProject(projectId: string, userId: string, fileId?: string) {

  console.log(`[Publish-Action] Starting execution for Project: ${projectId}, User: ${userId}`);

  // 1. Resolve Project and User
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });

  if (!project) throw new Error("Project not found");
  if (project.creatorId !== userId) throw new Error("Forbidden: User is not the owner");

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) throw new Error("User not found");

  // 2. Resolve Channel
  const channelId = project.channelId || user.activeChannelId;
  if (!channelId) throw new Error("No YouTube channel associated");

  const channel = await db.query.youtubeChannels.findFirst({
    where: eq(youtubeChannels.id, channelId),
  });
  if (!channel) throw new Error("YouTube channel not found");

  // 3. Resolve File (Target specific version if provided, otherwise latest approved final)
  const fileToPublish = await db.query.projectFiles.findFirst({
    where: and(
      eq(projectFiles.projectId, projectId),
      fileId ? eq(projectFiles.id, fileId) : eq(projectFiles.type, "final")
    ),
    orderBy: (files, { desc }) => [desc(files.version)],
  });

  if (!fileToPublish) {
    throw new Error(fileId ? "Selected file not found" : "No final file found for this project");
  }

  if (fileToPublish.status !== "approved") {
    throw new Error("Only approved files can be published to YouTube");
  }

  // Define local variable for cleaner access in subsequent steps
  const finalFile = fileToPublish;


  // 4. Refresh YouTube Access Token
  console.log("[Publish-Action] Refreshing YouTube tokens...");
  const plaintextAccessToken = await refreshAccessToken(channel.refreshToken);
  const encryptedAccessToken = encrypt(plaintextAccessToken);
  
  await db.update(youtubeChannels)
    .set({ accessToken: encryptedAccessToken, updatedAt: new Date() })
    .where(eq(youtubeChannels.id, channel.id));

  // 5. Publish to YouTube (Streaming)
  console.log("[Publish-Action] Uploading stream to YouTube API...");
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

  // 6. Update Project State
  await db.update(projects)
    .set({ 
      youtubeVideoId: ytResponse.id,
      status: "published",
      updatedAt: new Date()
    })
    .where(eq(projects.id, projectId));

  // 7. Audit Log
  await db.insert(auditLogs).values({
    userId: user.id,
    projectId: project.id,
    fileId: finalFile.id,
    action: "PROJECT_PUBLISHED",
    details: { youtubeVideoId: ytResponse.id },
  });

  // 8. Storage Cleanup (R2)
  if (finalFile.r2Key) {
    console.log(`[Publish-Action] Cleaning up R2 object: ${finalFile.r2Key}`);
    await deleteFromR2(finalFile.r2Key);
  }

  console.log(`[Publish-Action] Successfully published project: ${projectId}`);
  return { youtubeVideoId: ytResponse.id };
}
