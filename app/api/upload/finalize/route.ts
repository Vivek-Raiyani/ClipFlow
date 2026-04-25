import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectFiles, auditLogs, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projectId, r2Key, fileName, fileSize, type } = await req.json();

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const uploaderId = user.id;

    // Get current max version for this project/type
    const lastFile = await db.query.projectFiles.findFirst({
      where: eq(projectFiles.projectId, projectId),
      orderBy: desc(projectFiles.version),
    });

    const newVersion = (lastFile?.version || 0) + 1;

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

    // Log the audit
    await db.insert(auditLogs).values({
      userId: uploaderId,
      projectId,
      fileId: newFile.id,
      action: "FILE_UPLOADED",
      details: { fileName, version: newVersion, type },
    });

    return NextResponse.json(newFile);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
