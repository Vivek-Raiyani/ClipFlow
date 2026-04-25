import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { executePublishProject } from "@/lib/actions/publish";
import { inngest } from "@/lib/inngest";


/**
 * YouTube Publishing API
 * 
 * Orchestrates the publishing of a video file to YouTube.
 * Supports both inline and background processing.
 */

export async function POST(req: Request) {
  const ENABLE_BACKGROUND = process.env.ENABLE_BACKGROUND_JOBS === "true";

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[YouTube-Publish] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, fileId } = await req.json();
    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    // Resolve internal User ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
    if (!user) return NextResponse.json({ error: "User not synced" }, { status: 404 });

    if (ENABLE_BACKGROUND) {
      console.log(`[YouTube-Publish] Dispatching background job for project: ${projectId}`);
      
      await inngest.send({
        name: "project/publish",
        data: { projectId, userId: user.id, fileId }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: "Publication started in the background."
      });
    } else {
      console.log(`[YouTube-Publish] Running publication inline for project: ${projectId}`);
      
      // Execute the shared action
      // Note: Passing fileId to ensure the specific version is published if provided
      const result = await executePublishProject(projectId, user.id, fileId);
      
      return NextResponse.json({ 
        success: true, 
        youtubeVideoId: result.youtubeVideoId,
        youtubeUrl: `https://youtu.be/${result.youtubeVideoId}`
      });
    }

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[YouTube-Publish] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


