import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { thumbnails, projects, users, youtubeChannels, auditLogs } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { refreshAccessToken } from "@/lib/youtube";
import { encrypt } from "@/lib/crypto";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, thumbnailId } = await req.json();
    if (!projectId || !thumbnailId) {
      return NextResponse.json(
        { error: "projectId and thumbnailId are required" },
        { status: 400 }
      );
    }

    // ── Resolve the user ──────────────────────────────────────────────────────
    const user = await db.query.users.findFirst({ where: eq(users.clerkId, clerkId) });
    if (!user) return NextResponse.json({ error: "User not synced" }, { status: 404 });

    // ── Resolve the project ───────────────────────────────────────────────────
    const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId) });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!project.youtubeVideoId) {
      return NextResponse.json(
        { error: "Project has not been published to YouTube yet" },
        { status: 400 }
      );
    }

    // ── Resolve the channel ───────────────────────────────────────────────────
    const channelId = project.channelId || user.activeChannelId;
    if (!channelId) {
      return NextResponse.json({ error: "YouTube account not connected" }, { status: 400 });
    }

    const channel = await db.query.youtubeChannels.findFirst({
      where: eq(youtubeChannels.id, channelId),
    });

    if (!channel || !channel.refreshToken) {
      return NextResponse.json({ error: "YouTube channel disconnected" }, { status: 400 });
    }

    // ── Resolve the thumbnail ─────────────────────────────────────────────────
    const thumbnail = await db.query.thumbnails.findFirst({
      where: and(eq(thumbnails.id, thumbnailId), eq(thumbnails.projectId, projectId)),
    });
    if (!thumbnail) return NextResponse.json({ error: "Thumbnail not found" }, { status: 404 });

    // ── Refresh access token ──────────────────────────────────────────────────
    const accessToken = await refreshAccessToken(channel.refreshToken);
    const encryptedAccessToken = encrypt(accessToken);
    await db.update(youtubeChannels)
      .set({ accessToken: encryptedAccessToken, updatedAt: new Date() })
      .where(eq(youtubeChannels.id, channel.id));

    // ── Fetch thumbnail from R2 ───────────────────────────────────────────────
    const getCmd = new GetObjectCommand({ Bucket: R2_BUCKET_NAME!, Key: thumbnail.r2Key });
    const r2Url = await getSignedUrl(r2, getCmd, { expiresIn: 3600 });
    const r2Response = await fetch(r2Url);

    if (!r2Response.ok || !r2Response.body) {
      return NextResponse.json({ error: "Failed to fetch thumbnail from R2" }, { status: 502 });
    }

    // ── Determine image MIME type ─────────────────────────────────────────────
    const ext = thumbnail.r2Key.split(".").pop()?.toLowerCase() ?? "jpg";
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const contentType = mimeMap[ext] ?? "image/jpeg";

    // ── Push to YouTube ───────────────────────────────────────────────────────
    const ytRes = await fetch(
      `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${project.youtubeVideoId}&uploadType=media`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": contentType,
        },
        body: r2Response.body,
        // @ts-expect-error — Node 18 streaming bodies require duplex
        duplex: "half",
      }
    );

    if (!ytRes.ok) {
      const errText = await ytRes.text();
      return NextResponse.json(
        { error: `YouTube thumbnail upload failed (${ytRes.status}): ${errText}` },
        { status: 502 }
      );
    }

    // ── Audit log ─────────────────────────────────────────────────────────────
    await db.insert(auditLogs).values({
      userId: user.id,
      projectId,
      action: "THUMBNAIL_PUSHED",
      details: { thumbnailId, youtubeVideoId: project.youtubeVideoId },
    });

    return NextResponse.json({ success: true, youtubeVideoId: project.youtubeVideoId });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[YouTube Thumbnail]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
