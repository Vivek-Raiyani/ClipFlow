import { DriveOAuth2Client } from "@/lib/drive";
import { db } from "@/lib/db";
import { users, googleDriveConnections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=no_code", request.url));
  }

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Look up internal user id
    const user = await db.query.users.findFirst({ where: eq(users.clerkId, clerkId) });
    if (!user) {
      return NextResponse.redirect(new URL("/dashboard?error=user_not_found", request.url));
    }

    // Exchange the auth code for access & refresh tokens
    const { tokens } = await DriveOAuth2Client.getToken(code);
    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(new URL("/dashboard?error=missing_tokens", request.url));
    }

    // Fetch the connected Google account email
    DriveOAuth2Client.setCredentials(tokens);
    const oauth2 = (await import("googleapis")).google.oauth2({ version: "v2", auth: DriveOAuth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();
    const email = userInfo.email ?? "unknown";

    // Upsert into googleDriveConnections
    const existing = await db.query.googleDriveConnections.findFirst({
      where: eq(googleDriveConnections.userId, user.id),
    });

    if (existing) {
      await db
        .update(googleDriveConnections)
        .set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, email })
        .where(eq(googleDriveConnections.userId, user.id));
    } else {
      await db.insert(googleDriveConnections).values({
        userId: user.id,
        email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
    }

    return NextResponse.redirect(new URL("/dashboard?success=drive_connected", request.url));
  } catch (error) {
    console.error("Drive Auth Error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=auth_failed", request.url));
  }
}
