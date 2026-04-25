import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, googleDriveConnections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { refreshDriveAccessToken } from "@/lib/drive";
import { encrypt } from "@/lib/crypto";

/**
 * Drive Token Management API
 * 
 * Fetches and refreshes the Google Drive access token for the client.
 * All tokens returned to the DB are encrypted for security.
 */

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Drive-Token] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({ where: eq(users.clerkId, clerkId) });
    if (!user) {
      console.error(`[Drive-Token] User not found for clerkId: ${clerkId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const driveConn = await db.query.googleDriveConnections.findFirst({
      where: eq(googleDriveConnections.userId, user.id),
    });

    if (!driveConn) {
      console.info(`[Drive-Token] No Drive connection for user: ${user.id}`);
      return NextResponse.json({ error: "Drive not connected" }, { status: 400 });
    }

    console.log(`[Drive-Token] Refreshing access token for user: ${user.id}`);
    
    // refreshDriveAccessToken handles decryption of the refresh token internally
    const plaintextAccessToken = await refreshDriveAccessToken(driveConn.refreshToken);
    
    // Encrypt the new access token before saving to database
    const encryptedAccessToken = encrypt(plaintextAccessToken);

    // Persist the refreshed access token
    await db
      .update(googleDriveConnections)
      .set({ accessToken: encryptedAccessToken, updatedAt: new Date() })
      .where(eq(googleDriveConnections.userId, user.id));

    console.log(`[Drive-Token] Successfully refreshed and secured new token.`);

    return NextResponse.json({ accessToken: plaintextAccessToken });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unknown error";
    console.error("[Drive-Token] Fatal Error:", err);
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}

