import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fileName, fileType, projectId } = await req.json();

    if (!fileName || !fileType || !projectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a unique key for the file in R2
    const key = `projects/${projectId}/${Date.now()}-${fileName}`;

    // Dev fallback if R2 is not configured
    if (!process.env.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID === "your_cloudflare_account_id") {
      console.warn("R2 is not configured. Falling back to mock upload.");
      return NextResponse.json({ signedUrl: "mock", key });
    }

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // URL expires in 60 minutes
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

    return NextResponse.json({ signedUrl, key });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error generating presigned URL:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
