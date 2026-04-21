import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/drive";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { Upload } from "@aws-sdk/lib-storage";
import crypto from "crypto";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fileId, projectId } = await req.json();
    if (!fileId || !projectId) {
      return NextResponse.json({ error: "Missing fileId or projectId" }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId)
    });

    if (!user || !user.driveRefreshToken) {
      return NextResponse.json({ error: "Drive not connected" }, { status: 400 });
    }

    const drive = getDriveClient(user.driveAccessToken || "", user.driveRefreshToken);

    // 1. Get file metadata (name, mimeType)
    const fileMeta = await drive.files.get({
      fileId,
      fields: "name, mimeType, size",
    });

    if (!fileMeta.data.name) throw new Error("Could not find file info");

    // 2. Stream file content from Drive
    const driveRes = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    // 3. Generate a safe r2Key and upload directly to R2
    const safeFileName = fileMeta.data.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const r2Key = `projects/${projectId}/${crypto.randomUUID()}-${safeFileName}`;

    const upload = new Upload({
      client: r2,
      params: {
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: driveRes.data as unknown as Readable,
        ContentType: fileMeta.data.mimeType || "video/mp4",
      },
    });

    await upload.done();

    // 4. Return the key so the frontend can finalize it
    return NextResponse.json({ 
      success: true, 
      key: r2Key, 
      fileName: fileMeta.data.name, 
      fileSize: Number(fileMeta.data.size) || 0,
    });

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Drive Import Error]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
