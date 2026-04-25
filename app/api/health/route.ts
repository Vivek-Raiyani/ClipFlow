import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * Health Check API
 * 
 * Used by Coolify/Docker to ensure the application is live and
 * the database connection is healthy.
 */

export async function GET() {
  try {
    // 1. Check Database Connection
    // We run a simple query that doesn't return much data
    await db.execute(sql`SELECT 1`);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: process.env.NODE_ENV,
    }, { status: 200 });

  } catch (error) {
    console.error("[Health-Check] Unhealthy state detected:", error);

    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 503 });
  }
}
