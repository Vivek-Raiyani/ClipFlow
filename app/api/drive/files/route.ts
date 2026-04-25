import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/drive";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, googleDriveConnections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Google Drive File Listing API
 * 
 * Fetches a list of video files from the user's connected Google Drive account.
 * Uses MIME type filtering to only return video content.
 */

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Drive-Files] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve internal user
    const user = await db.query.users.findFirst({ where: eq(users.clerkId, clerkId) });
    if (!user) {
      console.error(`[Drive-Files] User not synced for clerkId: ${clerkId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get Drive connection
    const driveConn = await db.query.googleDriveConnections.findFirst({
      where: eq(googleDriveConnections.userId, user.id),
    });

    if (!driveConn) {
      console.info(`[Drive-Files] No Drive connection found for user: ${user.id}`);
      return NextResponse.json({ error: "Drive not connected" }, { status: 400 });
    }

    console.log(`[Drive-Files] Fetching video list for user: ${user.id}`);

    // Initialize Drive client (tokens are decrypted inside getDriveClient)
    const drive = getDriveClient(driveConn.accessToken, driveConn.refreshToken);

    const res = await drive.files.list({
      q: "mimeType contains 'video/' and trashed = false",
      fields: "files(id, name, mimeType, size, thumbnailLink)",
      pageSize: 50,
      orderBy: "modifiedByMeTime desc",
    });

    const fileCount = res.data.files?.length || 0;
    console.log(`[Drive-Files] Successfully retrieved ${fileCount} videos.`);

    return NextResponse.json({ files: res.data.files || [] });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Drive-Files] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

