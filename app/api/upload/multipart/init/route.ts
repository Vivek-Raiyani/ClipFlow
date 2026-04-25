import { NextResponse } from "next/server";
import { CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { auth } from "@clerk/nextjs/server";

/**
 * Multipart Upload - Initiation
 * 
 * This is the first step of a reliable large-file upload.
 * It creates a 'UploadId' in R2 which will be used to link all subsequent parts.
 */

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fileName, fileType, projectId } = await req.json();
    if (!fileName || !fileType || !projectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const key = `projects/${projectId}/${Date.now()}-${fileName}`;

    console.log(`[Multipart-Init] Initiating upload for: ${fileName}`);

    const command = new CreateMultipartUploadCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const response = await r2.send(command);

    return NextResponse.json({ 
      uploadId: response.UploadId, 
      key: response.Key 
    });
  } catch (error) {
    console.error("[Multipart-Init] Error:", error);
    return NextResponse.json({ error: "Failed to initiate multipart upload" }, { status: 500 });
  }
}
