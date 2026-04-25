import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  // We don't throw yet to allow the app to build, but log warning
  console.warn("R2 environment variables are missing.");
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

export async function deleteFromR2(key: string) {
  if (!R2_BUCKET_NAME) return;
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    await r2.send(command);
    console.log(`Successfully deleted ${key} from R2`);
  } catch (error) {
    console.error(`Failed to delete ${key} from R2:`, error);
  }
}
