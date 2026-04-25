import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditLogs, users, projects } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

/**
 * Audit Logs API
 * 
 * Retrieves the activity history for a user's account.
 * This includes file uploads, approvals, and publication events.
 */

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Audit-Logs] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creator = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!creator) {
      console.error(`[Audit-Logs] User not found for clerkId: ${clerkId}`);
      return NextResponse.json([]);
    }

    console.log(`[Audit-Logs] Fetching activity history for user: ${creator.id}`);

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

    console.log(`[Audit-Logs] Found ${logs.length} activity records.`);

    return NextResponse.json(logs);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Audit-Logs] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

