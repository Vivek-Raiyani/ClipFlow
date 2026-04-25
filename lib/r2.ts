import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 (S3 Compatible) Client
 * 
 * Used for storing high-volume assets like videos and thumbnails.
 * Offloading storage to R2 keeps the VPS disk usage minimal.
 */

const missingR2Vars = !process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY;

if (missingR2Vars) {
  console.warn("[Storage] Warning: R2 environment variables are missing. File operations will fail.");
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

/**
 * Deletes an object from the R2 bucket.
 * 
 * @param key The full path/key of the object to delete
 */
export async function deleteFromR2(key: string) {
  if (!R2_BUCKET_NAME) {
    console.error("[Storage] Cannot delete: R2_BUCKET_NAME is not defined.");
    return;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    await r2.send(command);
    console.log(`[Storage] Successfully deleted: ${key}`);
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Storage] Failed to delete ${key}:`, err);
  }
}
