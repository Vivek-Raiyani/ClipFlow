import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { thumbnails } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const results = await db.query.thumbnails.findMany({
      where: eq(thumbnails.projectId, projectId),
      orderBy: [desc(thumbnails.createdAt)],
    });

    return NextResponse.json({ thumbnails: results });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
