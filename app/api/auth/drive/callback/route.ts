import { DriveOAuth2Client } from "@/lib/drive";
import { db } from "@/lib/db";
import { users, googleDriveConnections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/crypto";

/**
 * Google Drive Auth Callback Handler
 * 
 * Exchanges the auth code for encrypted access and refresh tokens.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.warn("[Drive-Auth] Callback reached without code");
    return NextResponse.redirect(new URL("/dashboard?error=no_code", request.url));
  }

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Drive-Auth] Unauthorized access attempt");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Look up internal user id
    const user = await db.query.users.findFirst({ where: eq(users.clerkId, clerkId) });
    if (!user) {
      console.error(`[Drive-Auth] User not synced in DB: ${clerkId}`);
      return NextResponse.redirect(new URL("/dashboard?error=user_not_found", request.url));
    }

    console.log(`[Drive-Auth] Exchanging code for user: ${user.id}`);
    
    // Exchange the auth code for access & refresh tokens
    const { tokens } = await DriveOAuth2Client.getToken(code);
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("Missing access or refresh tokens from Google");
    }

    // Fetch the connected Google account email
    DriveOAuth2Client.setCredentials(tokens);
    const oauth2 = (await import("googleapis")).google.oauth2({ version: "v2", auth: DriveOAuth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();
    const email = userInfo.email ?? "unknown";

    // Encrypt sensitive tokens before storage
    const encryptedAccessToken = encrypt(tokens.access_token);
    const encryptedRefreshToken = encrypt(tokens.refresh_token);

    // Upsert into googleDriveConnections
    const existing = await db.query.googleDriveConnections.findFirst({
      where: eq(googleDriveConnections.userId, user.id),
    });

    if (existing) {
      console.log(`[Drive-Auth] Updating existing connection for ${email}`);
      await db
        .update(googleDriveConnections)
        .set({ 
            accessToken: encryptedAccessToken, 
            refreshToken: encryptedRefreshToken, 
            email,
            updatedAt: new Date()
        })
        .where(eq(googleDriveConnections.userId, user.id));
    } else {
      console.log(`[Drive-Auth] Creating new connection for ${email}`);
      await db.insert(googleDriveConnections).values({
        userId: user.id,
        email,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
      });
    }

    console.log(`[Drive-Auth] Success: Drive connected for ${email}`);
    return NextResponse.redirect(new URL("/dashboard?success=drive_connected", request.url));
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Drive-Auth] Fatal Error:", err.message);
    return NextResponse.redirect(new URL("/dashboard?error=auth_failed", request.url));
  }
}

