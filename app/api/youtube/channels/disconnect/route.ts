import { db } from "@/lib/db";
import { users, youtubeChannels, projects } from "@/lib/db/schema";
import { eq, and, isNull, ne } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify channel belongs to user
    const channel = await db.query.youtubeChannels.findFirst({
      where: and(
        eq(youtubeChannels.id, channelId),
        eq(youtubeChannels.userId, dbUser.id)
      ),
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found or unauthorized" }, { status: 403 });
    }

    // 1. Update projects that use this channel to have null channelId
    await db.update(projects)
      .set({ channelId: null })
      .where(eq(projects.channelId, channelId));

    // 2. If this was the active channel, try to find another one
    if (dbUser.activeChannelId === channelId) {
      const remainingChannel = await db.query.youtubeChannels.findFirst({
        where: and(
            eq(youtubeChannels.userId, dbUser.id),
            ne(youtubeChannels.id, channelId)
        )
      });
      
      await db.update(users)
        .set({ activeChannelId: remainingChannel ? remainingChannel.id : null })
        .where(eq(users.id, dbUser.id));
    }

    // 3. Delete the channel
    await db.delete(youtubeChannels)
      .where(eq(youtubeChannels.id, channelId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Disconnect channel error:", error);
    return NextResponse.json({ error: "Failed to disconnect channel" }, { status: 500 });
  }
}
