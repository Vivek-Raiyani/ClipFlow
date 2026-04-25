import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, creatorEditorRelationships } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ editorId: string }> }
) {
  try {
    const { editorId } = await params;
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const creator = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!creator) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await db
      .update(creatorEditorRelationships)
      .set({ status: "terminated" })
      .where(
        and(
          eq(creatorEditorRelationships.creatorId, creator.id),
          eq(creatorEditorRelationships.editorId, editorId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
