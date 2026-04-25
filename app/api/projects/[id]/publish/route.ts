import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { executePublishProject } from "@/lib/actions/publish";
import { inngest } from "@/lib/inngest";


/**
 * Project Publish API ([id])
 * 
 * Triggers the publication of a project's approved "final" file.
 * Supports both inline and background processing via ENABLE_BACKGROUND_JOBS.
 */

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const ENABLE_BACKGROUND = process.env.ENABLE_BACKGROUND_JOBS === "true";

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Project-Publish] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve internal User ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!user) return NextResponse.json({ error: "User not synced" }, { status: 404 });

    if (ENABLE_BACKGROUND) {
      console.log(`[Project-Publish] Dispatching background job for project: ${projectId}`);
      
      await inngest.send({
        name: "project/publish",
        data: { projectId, userId: user.id }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: "Publication started in the background. Check status in a few minutes."
      });
    } else {
      console.log(`[Project-Publish] Running publication inline for project: ${projectId}`);
      const result = await executePublishProject(projectId, user.id);
      
      return NextResponse.json({ 
        success: true, 
        youtubeVideoId: result.youtubeVideoId,
        youtubeUrl: `https://youtu.be/${result.youtubeVideoId}`
      });
    }

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[Project-Publish] Fatal Error for ${projectId}:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



