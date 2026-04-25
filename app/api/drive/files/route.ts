import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/drive";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, googleDriveConnections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.query.users.findFirst({ where: eq(users.clerkId, clerkId) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const driveConn = await db.query.googleDriveConnections.findFirst({
      where: eq(googleDriveConnections.userId, user.id),
    });

    if (!driveConn) {
      return NextResponse.json({ error: "Drive not connected" }, { status: 400 });
    }

    const drive = getDriveClient(driveConn.accessToken, driveConn.refreshToken);

    const res = await drive.files.list({
      q: "mimeType contains 'video/' and trashed = false",
      fields: "files(id, name, mimeType, size, thumbnailLink)",
      pageSize: 50,
      orderBy: "modifiedByMeTime desc",
    });

    return NextResponse.json({ files: res.data.files || [] });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Drive Fetch Error]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
