import { OAuth2Client } from "@/lib/youtube";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
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

    const { tokens } = await OAuth2Client.getToken(code);
    
    // Update tokens in DB
    await db.update(users)
      .set({
        youtubeAccessToken: tokens.access_token,
        youtubeRefreshToken: tokens.refresh_token,
      })
      .where(eq(users.clerkId, clerkId));

    return NextResponse.redirect(new URL("/dashboard?success=youtube_connected", request.url));
  } catch (error) {
    console.error("YouTube Auth Error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=auth_failed", request.url));
  }
}
