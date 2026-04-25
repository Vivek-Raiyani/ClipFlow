import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { thumbnails, auditLogs } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

/**
 * Thumbnail Upload Finalization API
 * 
 * Called after a client successfully uploads a thumbnail to R2.
 * This route registers the thumbnail in the DB and creates an audit trail.
 */

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Upload-Thumbnail] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, r2Key } = await req.json();
    if (!projectId || !r2Key) {
      return NextResponse.json({ error: "projectId and r2Key are required" }, { status: 400 });
    }

    // Resolve user from DB for foreign key relationships
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.clerkId, clerkId),
    });

    if (!user) {
      console.error(`[Upload-Thumbnail] User not synced: ${clerkId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[Upload-Thumbnail] Registering thumbnail for project: ${projectId}`);

    const [newThumbnail] = await db.insert(thumbnails).values({
      projectId,
      r2Key,
    }).returning();

    // Create audit log for historical tracking
    await db.insert(auditLogs).values({
      userId: user.id,
      projectId,
      action: "THUMBNAIL_UPLOADED",
      details: { thumbnailId: newThumbnail.id, r2Key },
    });

    console.log(`[Upload-Thumbnail] Success: Thumbnail ID ${newThumbnail.id} registered.`);

    return NextResponse.json({ success: true, thumbnail: newThumbnail });

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Upload-Thumbnail] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

