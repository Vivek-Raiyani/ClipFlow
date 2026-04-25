import { NextResponse } from "next/server";
import { CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { auth } from "@clerk/nextjs/server";

/**
 * Multipart Upload - Completion
 * 
 * After all parts are uploaded by the client, this route is called to
 * 'seal' the file in R2.
 */

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { key, uploadId, parts } = await req.json();

    if (!key || !uploadId || !parts || !Array.isArray(parts)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(`[Multipart-Complete] Completing upload for key: ${key}`);

    const command = new CompleteMultipartUploadCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        // Parts must be sorted by PartNumber
        Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
      },
    });

    await r2.send(command);

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("[Multipart-Complete] Error:", error);
    return NextResponse.json({ error: "Failed to complete multipart upload" }, { status: 500 });
  }
}
