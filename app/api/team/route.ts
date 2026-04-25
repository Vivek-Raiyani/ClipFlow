import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, creatorEditorRelationships } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const creator = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!creator) return NextResponse.json([]);

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

    return NextResponse.json(relationships);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
