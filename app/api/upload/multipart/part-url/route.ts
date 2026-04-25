import { NextResponse } from "next/server";
import { UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { auth } from "@clerk/nextjs/server";

/**
 * Multipart Upload - Part URL
 * 
 * Generates a presigned URL for a specific part (e.g., Part 1, Part 2).
 * The client will upload a chunk of the file (usually 5MB-20MB) to this URL.
 */

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { key, uploadId, partNumber } = await req.json();

    if (!key || !uploadId || !partNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const command = new UploadPartCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    });

    // Parts usually need to be uploaded within a shorter window
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error("[Multipart-Part] Error:", error);
    return NextResponse.json({ error: "Failed to generate part URL" }, { status: 500 });
  }
}
