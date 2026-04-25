import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/drive";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, googleDriveConnections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { Upload } from "@aws-sdk/lib-storage";
import crypto from "crypto";
import { Readable } from "stream";

/**
 * Drive Import API
 * 
 * Transfers a file from Google Drive directly to Cloudflare R2.
 * 
 * Efficiency Note: This route pipes the Google Drive stream directly into
 * the R2 upload client. This prevents the large video file from being
 * loaded into the VPS RAM, allowing the 4GB instance to handle multiple
 * imports simultaneously without crashing.
 */

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Drive-Import] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId, projectId } = await req.json();
    if (!fileId || !projectId) {
      return NextResponse.json({ error: "Missing fileId or projectId" }, { status: 400 });
    }

    // Resolve internal user
    const user = await db.query.users.findFirst({ where: eq(users.clerkId, clerkId) });
    if (!user) {
      console.error(`[Drive-Import] User not found: ${clerkId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get Drive connection (Tokens decrypted in lib/drive.ts)
    const driveConn = await db.query.googleDriveConnections.findFirst({
      where: eq(googleDriveConnections.userId, user.id),
    });

    if (!driveConn) {
      console.warn(`[Drive-Import] Drive not connected for user: ${user.id}`);
      return NextResponse.json({ error: "Drive not connected" }, { status: 400 });
    }

    const drive = getDriveClient(driveConn.accessToken, driveConn.refreshToken);

    // 1. Get file metadata (name, mimeType, size)
    console.log(`[Drive-Import] Fetching metadata for file: ${fileId}`);
    const fileMeta = await drive.files.get({
      fileId,
      fields: "name, mimeType, size",
    });

    if (!fileMeta.data.name) throw new Error("Could not find file info on Google Drive");

    console.log(`[Drive-Import] Found: ${fileMeta.data.name} (${fileMeta.data.size} bytes)`);

    // R2 not configured — return metadata only so finalize can still record the Drive file
    if (!process.env.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID === "your_cloudflare_account_id") {
      console.warn("[Drive-Import] R2 not configured. Skipping R2 transfer, returning mock key.");
      const mockKey = `projects/${projectId}/drive-import-mock-${crypto.randomUUID()}-${fileMeta.data.name}`;
      return NextResponse.json({
        success: true,
        key: mockKey,
        fileName: fileMeta.data.name,
        fileSize: Number(fileMeta.data.size) || 0,
      });
    }

    // 2. Stream file content from Drive
    console.log(`[Drive-Import] Initiating stream from Google Drive...`);
    const driveRes = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    // 3. Generate a safe r2Key and upload directly to R2
    const safeFileName = fileMeta.data.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const r2Key = `projects/${projectId}/${crypto.randomUUID()}-${safeFileName}`;

    console.log(`[Drive-Import] Piping stream to R2: ${r2Key}`);

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

    console.log(`[Drive-Import] Successfully imported ${fileMeta.data.name} to R2.`);

    return NextResponse.json({
      success: true,
      key: r2Key,
      fileName: fileMeta.data.name,
      fileSize: Number(fileMeta.data.size) || 0,
    });

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Drive-Import] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

