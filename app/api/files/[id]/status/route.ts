import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectFiles, auditLogs, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await req.json();

    // Get the internal user ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) return NextResponse.json({ error: "User not synced" }, { status: 404 });

    const { id } = await params;

    const [updatedFile] = await db
      .update(projectFiles)
      .set({ 
        status, 
        approvedAt: status === "approved" ? new Date() : null,
        approvedBy: status === "approved" ? user.id : null
      })
      .where(eq(projectFiles.id, id))
      .returning();

    // Log the audit
    await db.insert(auditLogs).values({
      userId: user.id,
      projectId: updatedFile.projectId,
      fileId: updatedFile.id,
      action: status === "approved" ? "FILE_APPROVED" : "FILE_REJECTED",
      details: { status },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
