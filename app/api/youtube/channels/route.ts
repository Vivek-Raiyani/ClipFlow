import { db } from "@/lib/db";
import { users, youtubeChannels } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * YouTube Channels Listing API
 * 
 * Retrieves all YouTube channels connected by the authenticated user.
 * Includes the `activeChannelId` to show which one is currently selected.
 */

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[YouTube-Channels] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!dbUser) {
      console.error(`[YouTube-Channels] User not found for clerkId: ${clerkId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[YouTube-Channels] Fetching connected channels for user: ${dbUser.id}`);

    const channels = await db.query.youtubeChannels.findMany({
      where: eq(youtubeChannels.userId, dbUser.id),
      orderBy: (youtubeChannels, { desc }) => [desc(youtubeChannels.createdAt)],
    });

    console.log(`[YouTube-Channels] Found ${channels.length} connected channels.`);

    return NextResponse.json({
      channels,
      activeChannelId: dbUser.activeChannelId,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[YouTube-Channels] Fatal Error:", err.message);
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 });
  }
}

