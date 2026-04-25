import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectFiles, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

/**
 * Project Files API
 * 
 * Fetches all file versions associated with a specific project.
 * Joins with the users table to provide uploader details for each file.
 */

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      console.warn("[Project-Files] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`[Project-Files] Fetching files for project: ${projectId}`);

    const files = await db
      .select({
        id: projectFiles.id,
        projectId: projectFiles.projectId,
        uploaderId: projectFiles.uploaderId,
        r2Key: projectFiles.r2Key,
        fileName: projectFiles.fileName,
        fileSize: projectFiles.fileSize,
        type: projectFiles.type,
        status: projectFiles.status,
        version: projectFiles.version,
        createdAt: projectFiles.createdAt,
        approvedAt: projectFiles.approvedAt,
        uploaderName: users.name,
        uploaderEmail: users.email,
      })
      .from(projectFiles)
      .leftJoin(users, eq(projectFiles.uploaderId, users.id))
      .where(eq(projectFiles.projectId, projectId))
      .orderBy(desc(projectFiles.createdAt));

    console.log(`[Project-Files] Found ${files.length} files.`);

    return NextResponse.json(files);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[Project-Files] GET Error for project ${projectId}:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

