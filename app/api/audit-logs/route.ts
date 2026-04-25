import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditLogs, users, projects } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const creator = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!creator) return NextResponse.json([]);

    const logs = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        details: auditLogs.details,
        createdAt: auditLogs.createdAt,
        projectId: auditLogs.projectId,
        fileId: auditLogs.fileId,
        userName: users.name,
        userEmail: users.email,
        projectTitle: projects.title,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .leftJoin(projects, eq(auditLogs.projectId, projects.id))
      .where(eq(auditLogs.userId, creator.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(100);

    return NextResponse.json(logs);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
