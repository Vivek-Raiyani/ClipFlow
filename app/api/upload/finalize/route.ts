import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectFiles, auditLogs, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

/**
 * Finalize Upload API
 * 
 * Called after a successful client-side upload to R2.
 * This route creates a record in the `project_files` table and logs the action.
 */

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Upload-Finalize] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, r2Key, fileName, fileSize, type } = await req.json();

    // Resolve internal user
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!user) {
      console.error(`[Upload-Finalize] User not synced: ${clerkId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const uploaderId = user.id;

    console.log(`[Upload-Finalize] Finalizing file: ${fileName} (Type: ${type}) for project: ${projectId}`);

    // Get current max version for this project to handle versioning automatically
    const lastFile = await db.query.projectFiles.findFirst({
      where: eq(projectFiles.projectId, projectId),
      orderBy: desc(projectFiles.version),
    });

    const newVersion = (lastFile?.version || 0) + 1;

    // Insert the file record
    const [newFile] = await db.insert(projectFiles).values({
      projectId,
      uploaderId,
      r2Key,
      fileName,
      fileSize,
      type,
      version: newVersion,
      status: "pending",
    }).returning();

    // Log the action in the audit logs for history tracking
    await db.insert(auditLogs).values({
      userId: uploaderId,
      projectId,
      fileId: newFile.id,
      action: "FILE_UPLOADED",
      details: { fileName, version: newVersion, type },
    });

    console.log(`[Upload-Finalize] Success: Registered file version ${newVersion} with ID ${newFile.id}`);
    return NextResponse.json(newFile);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Upload-Finalize] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

