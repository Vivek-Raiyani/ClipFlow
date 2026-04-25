import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, projects } from "@/lib/db/schema";

/**
 * DB Health Check API
 * 
 * Diagnostic endpoint to verify database connectivity and basic schema health.
 * Returns counts of core entities.
 */

export async function GET() {
  try {
    console.log("[DB-Check] Running diagnostic health check...");
    
    const allUsers = await db.select().from(users);
    const allProjects = await db.select().from(projects);
    
    console.log(`[DB-Check] Connection healthy. Users: ${allUsers.length}, Projects: ${allProjects.length}`);
    
    return NextResponse.json({ 
      success: true, 
      userCount: allUsers.length,
      projectCount: allProjects.length 
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[DB-Check] Health check failed:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
