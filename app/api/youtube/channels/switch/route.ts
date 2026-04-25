import { db } from "@/lib/db";
import { users, youtubeChannels } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Channel Switch API
 * 
 * Allows users to toggle between different connected YouTube channels.
 * This sets the `activeChannelId` on the user record, which is then used
 * to filter projects and publication targets.
 */

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[YouTube-Switch] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { channelId } = await request.json();
    if (!channelId) {
      return NextResponse.json({ error: "Channel ID is required" }, { status: 400 });
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!dbUser) {
      console.error(`[YouTube-Switch] User not found for clerkId: ${clerkId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Security check: Verify the channel actually belongs to this user
    const channel = await db.query.youtubeChannels.findFirst({
      where: and(
        eq(youtubeChannels.id, channelId),
        eq(youtubeChannels.userId, dbUser.id)
      ),
    });

    if (!channel) {
      console.warn(`[YouTube-Switch] User ${dbUser.id} attempted to switch to unauthorized channel: ${channelId}`);
      return NextResponse.json({ error: "Channel not found or unauthorized" }, { status: 403 });
    }

    console.log(`[YouTube-Switch] Switching active channel for user ${dbUser.id} to: ${channel.channelTitle}`);

    // Update the session's active channel
    await db.update(users)
      .set({ activeChannelId: channelId })
      .where(eq(users.id, dbUser.id));

    return NextResponse.json({ success: true, activeChannelId: channelId });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[YouTube-Switch] Fatal Error:", err.message);
    return NextResponse.json({ error: "Failed to switch channel" }, { status: 500 });
  }
}

