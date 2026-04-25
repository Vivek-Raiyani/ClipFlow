import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, googleDriveConnections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { refreshDriveAccessToken } from "@/lib/drive";

export async function GET() {
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

  try {
    const accessToken = await refreshDriveAccessToken(driveConn.refreshToken);
    // Persist the refreshed access token
    await db
      .update(googleDriveConnections)
      .set({ accessToken })
      .where(eq(googleDriveConnections.userId, user.id));
    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}
