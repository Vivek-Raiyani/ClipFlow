import { db } from "@/lib/db";
import { users, youtubeChannels } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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

    // Update active channel
    await db.update(users)
      .set({ activeChannelId: channelId })
      .where(eq(users.id, dbUser.id));

    return NextResponse.json({ success: true, activeChannelId: channelId });
  } catch (error) {
    console.error("Switch channel error:", error);
    return NextResponse.json({ error: "Failed to switch channel" }, { status: 500 });
  }
}
