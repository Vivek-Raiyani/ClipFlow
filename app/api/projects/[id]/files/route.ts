import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectFiles, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    return NextResponse.json(files);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
