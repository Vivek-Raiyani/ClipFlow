import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { thumbnails } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

/**
 * Project Thumbnails API
 * 
 * Fetches all thumbnails associated with a specific project,
 * including A/B testing status for each thumbnail.
 */

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      console.warn("[Project-Thumbnails] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`[Project-Thumbnails] Fetching thumbnails for project: ${projectId}`);

    const results = await db.query.thumbnails.findMany({
      where: eq(thumbnails.projectId, projectId),
      orderBy: [desc(thumbnails.createdAt)],
    });

    console.log(`[Project-Thumbnails] Found ${results.length} thumbnails.`);

    return NextResponse.json({ thumbnails: results });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[Project-Thumbnails] GET Error for project ${projectId}:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

