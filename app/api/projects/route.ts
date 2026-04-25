import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";

/**
 * Projects API Route
 * 
 * Handles CRUD operations for user projects.
 * Automatically filters by the user's active YouTube channel if one is selected.
 */

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    // Resolve the internal UUID for the user
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      console.error(`[Projects-API] User not found for clerkId: ${clerkId}`);
      return NextResponse.json({ error: "User not synced" }, { status: 404 });
    }

    console.log(`[Projects-API] Creating new project: "${title}" for user: ${user.id}`);

    const [newProject] = await db.insert(projects).values({
      title,
      creatorId: user.id,
      channelId: user.activeChannelId, 
      visibility: "unlisted",
      status: "active",
    }).returning();

    return NextResponse.json(newProject);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Projects-API] POST Error:", err.message);
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

    console.log(`[Projects-API] Fetching projects for user: ${user.id}`);

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
    console.error("[Projects-API] GET Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

