import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, creatorEditorRelationships } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

/**
 * Team Listing API
 * 
 * Fetches all editors currently associated with the authenticated creator.
 * This allows creators to see who has access to their projects.
 */

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Team-API] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creator = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!creator) {
      console.error(`[Team-API] Creator not synced for clerkId: ${clerkId}`);
      return NextResponse.json([]);
    }

    console.log(`[Team-API] Fetching active editors for creator: ${creator.id}`);

    const relationships = await db
      .select({
        id: creatorEditorRelationships.id,
        editorId: creatorEditorRelationships.editorId,
        status: creatorEditorRelationships.status,
        createdAt: creatorEditorRelationships.createdAt,
        name: users.name,
        email: users.email,
      })
      .from(creatorEditorRelationships)
      .leftJoin(users, eq(creatorEditorRelationships.editorId, users.id))
      .where(
        and(
          eq(creatorEditorRelationships.creatorId, creator.id),
          eq(creatorEditorRelationships.status, "active")
        )
      );

    console.log(`[Team-API] Found ${relationships.length} active editors.`);

    return NextResponse.json(relationships);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Team-API] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

