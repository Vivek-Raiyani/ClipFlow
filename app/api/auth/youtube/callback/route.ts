import { OAuth2Client, getChannelInfo } from "@/lib/youtube";
import { db } from "@/lib/db";
import { users, youtubeChannels } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/crypto";

/**
 * YouTube Auth Callback Handler
 * 
 * This route handles the OAuth2 callback from Google.
 * It exchanges the code for tokens, encrypts them, and stores/updates
 * the channel information in the database.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.warn("[YouTube-Auth] Callback reached without code");
    return NextResponse.redirect(new URL("/dashboard?error=no_code", request.url));
  }

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[YouTube-Auth] Unauthorized access attempt");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    console.log(`[YouTube-Auth] Exchanging code for user: ${clerkId}`);
    const { tokens } = await OAuth2Client.getToken(code);
    
    if (!tokens.access_token) {
        throw new Error("Failed to get access token from Google");
    }

    // Fetch channel metadata (title, thumbnail)
    const channelInfo = await getChannelInfo(tokens.access_token);
    if (!channelInfo) {
        throw new Error("Failed to fetch channel information from YouTube API");
    }
    
    // Get the internal user ID for database relationships
    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId)
    });

    if (!dbUser) {
        throw new Error("User record not found in database for sync");
    }

    // Encrypt sensitive tokens before storage
    const encryptedAccessToken = encrypt(tokens.access_token);
    const encryptedRefreshToken = tokens.refresh_token ? encrypt(tokens.refresh_token) : "";

    console.log(`[YouTube-Auth] Syncing channel ${channelInfo.title} for user ${dbUser.id}`);

    // Upsert the channel record (create if new, update if existing)
    const [channel] = await db.insert(youtubeChannels)
      .values({
        userId: dbUser.id,
        youtubeChannelId: channelInfo.id,
        channelTitle: channelInfo.title,
        channelThumbnail: channelInfo.thumbnail,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
      })
      .onConflictDoUpdate({
        target: youtubeChannels.youtubeChannelId,
        set: {
          channelTitle: channelInfo.title,
          channelThumbnail: channelInfo.thumbnail,
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
          updatedAt: new Date(),
        }
      })
      .returning();

    // Automatically set this as the active channel for the user
    await db.update(users)
      .set({ activeChannelId: channel.id })
      .where(eq(users.id, dbUser.id));

    console.log(`[YouTube-Auth] Success: Channel ${channel.channelTitle} connected`);
    return NextResponse.redirect(new URL("/dashboard?success=youtube_connected", request.url));
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[YouTube-Auth] Fatal Error:", err.message);
    return NextResponse.redirect(new URL("/dashboard?error=auth_failed", request.url));
  }
}

