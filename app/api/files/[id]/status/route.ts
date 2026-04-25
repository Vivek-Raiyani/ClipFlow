import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectFiles, auditLogs, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

/**
 * File Status Update API
 * 
 * Handles the approval or rejection of a project file by a creator.
 * Updates the `project_files` table and logs the event for the project's history.
 */

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[File-Status] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    // Get the internal user ID for the approver
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      console.error(`[File-Status] User not synced for clerkId: ${clerkId}`);
      return NextResponse.json({ error: "User not synced" }, { status: 404 });
    }

    const { id: fileId } = await params;

    console.log(`[File-Status] Updating file ${fileId} to status: ${status} by user: ${user.id}`);

    const [updatedFile] = await db
      .update(projectFiles)
      .set({ 
        status, 
        approvedAt: status === "approved" ? new Date() : null,
        approvedBy: status === "approved" ? user.id : null
      })
      .where(eq(projectFiles.id, fileId))
      .returning();

    if (!updatedFile) {
      console.warn(`[File-Status] File ${fileId} not found.`);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Log the audit event
    await db.insert(auditLogs).values({
      userId: user.id,
      projectId: updatedFile.projectId,
      fileId: updatedFile.id,
      action: status === "approved" ? "FILE_APPROVED" : "FILE_REJECTED",
      details: { status },
    });

    console.log(`[File-Status] Success: File ${fileId} is now ${status}.`);

    return NextResponse.json(updatedFile);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[File-Status] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

