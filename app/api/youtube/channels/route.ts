import { db } from "@/lib/db";
import { users, youtubeChannels } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
      with: {
        // We'll need to define relationships in the schema or use a direct query
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const channels = await db.query.youtubeChannels.findMany({
      where: eq(youtubeChannels.userId, dbUser.id),
      orderBy: (youtubeChannels, { desc }) => [desc(youtubeChannels.createdAt)],
    });

    return NextResponse.json({
      channels,
      activeChannelId: dbUser.activeChannelId,
    });
  } catch (error) {
    console.error("Fetch channels error:", error);
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 });
  }
}
