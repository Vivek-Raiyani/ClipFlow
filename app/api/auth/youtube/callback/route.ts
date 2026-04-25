import { OAuth2Client, getChannelInfo } from "@/lib/youtube";
import { db } from "@/lib/db";
import { users, youtubeChannels } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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
    if (!tokens.access_token) {
        throw new Error("Failed to get access token");
    }

    const channelInfo = await getChannelInfo(tokens.access_token);
    if (!channelInfo) {
        throw new Error("Failed to get channel info");
    }
    
    // Get the internal user ID
    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId)
    });

    if (!dbUser) {
        throw new Error("User not found in database");
    }

    // Upsert the channel
    const [channel] = await db.insert(youtubeChannels)
      .values({
        userId: dbUser.id,
        youtubeChannelId: channelInfo.id,
        channelTitle: channelInfo.title,
        channelThumbnail: channelInfo.thumbnail,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token!,
      })
      .onConflictDoUpdate({
        target: youtubeChannels.youtubeChannelId,
        set: {
          channelTitle: channelInfo.title,
          channelThumbnail: channelInfo.thumbnail,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token!,
          updatedAt: new Date(),
        }
      })
      .returning();

    // Set as active channel
    await db.update(users)
      .set({ activeChannelId: channel.id })
      .where(eq(users.id, dbUser.id));

    return NextResponse.redirect(new URL("/dashboard?success=youtube_connected", request.url));
  } catch (error) {
    console.error("YouTube Auth Error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=auth_failed", request.url));
  }
}
