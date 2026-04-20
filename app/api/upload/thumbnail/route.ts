import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { thumbnails, auditLogs } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, r2Key } = await req.json();
    if (!projectId || !r2Key) {
      return NextResponse.json({ error: "projectId and r2Key are required" }, { status: 400 });
    }

    // Resolve user from DB for ID
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.clerkId, clerkId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [newThumbnail] = await db.insert(thumbnails).values({
      projectId,
      r2Key,
    }).returning();

    await db.insert(auditLogs).values({
      userId: user.id,
      projectId,
      action: "THUMBNAIL_UPLOADED",
      details: { thumbnailId: newThumbnail.id, r2Key },
    });

    return NextResponse.json({ success: true, thumbnail: newThumbnail });

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
