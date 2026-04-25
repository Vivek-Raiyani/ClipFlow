import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

/**
 * Project Detail API ([id])
 * 
 * Handles individual project operations: Fetch, Update, and Delete.
 */

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log(`[Projects-Detail] Fetching project: ${id}`);

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });

    if (!project) {
      console.warn(`[Projects-Detail] Project ${id} not found.`);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[Projects-Detail] GET Error for ${id}:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, tags, categoryId, visibility } = body;

    console.log(`[Projects-Detail] Updating project: ${id}`);

    const [updated] = await db
      .update(projects)
      .set({ title, description, tags, categoryId, visibility, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Project not found or update failed" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[Projects-Detail] PATCH Error for ${id}:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log(`[Projects-Detail] Deleting project: ${id}`);

    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log(`[Projects-Detail] Successfully deleted project: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[Projects-Detail] DELETE Error for ${id}:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


