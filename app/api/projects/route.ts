import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title } = await req.json();

    // Get the internal user ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) return NextResponse.json({ error: "User not synced" }, { status: 404 });

    const [newProject] = await db.insert(projects).values({
      title,
      creatorId: user.id,
      channelId: user.activeChannelId, // Link to the currently active channel
      visibility: "unlisted",
      status: "active",
    }).returning();

    return NextResponse.json(newProject);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) return NextResponse.json([]);

    const userProjects = await db.select().from(projects).where(
      and(
        eq(projects.creatorId, user.id),
        user.activeChannelId 
          ? eq(projects.channelId, user.activeChannelId) 
          : isNull(projects.channelId)
      )
    );

    return NextResponse.json(userProjects);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
