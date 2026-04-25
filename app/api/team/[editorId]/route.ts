import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, creatorEditorRelationships } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

/**
 * Editor Termination API ([editorId])
 * 
 * Removes an editor from the creator's team by setting their relationship
 * status to 'terminated'. This revokes their access to the creator's projects.
 */

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ editorId: string }> }
) {
  const { editorId } = await params;
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      console.warn("[Team-Terminate] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creator = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!creator) {
      console.error(`[Team-Terminate] Creator not found for clerkId: ${clerkId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[Team-Terminate] Creator ${creator.id} is terminating editor ${editorId}`);

    const result = await db
      .update(creatorEditorRelationships)
      .set({ status: "terminated" })
      .where(
        and(
          eq(creatorEditorRelationships.creatorId, creator.id),
          eq(creatorEditorRelationships.editorId, editorId)
        )
      ).returning();

    if (result.length === 0) {
      console.warn(`[Team-Terminate] No active relationship found between ${creator.id} and ${editorId}`);
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    console.log(`[Team-Terminate] Successfully terminated relationship for editor: ${editorId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[Team-Terminate] Fatal Error for editor ${editorId}:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

