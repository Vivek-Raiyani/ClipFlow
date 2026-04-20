import { r2, R2_BUCKET_NAME } from "./r2";
import { getYoutubeClient } from "./youtube";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export async function publishToYouTube({
  accessToken,
  refreshToken,
  r2Key,
  title,
  description,
  tags,
  categoryId,
  privacyStatus,
}: {
  accessToken: string;
  refreshToken?: string;
  r2Key: string;
  title: string;
  description: string;
  tags?: string;
  categoryId?: string;
  privacyStatus: "private" | "unlisted" | "public";
}) {
  const youtube = getYoutubeClient(accessToken, refreshToken);

  // Get stream from R2
  const response = await r2.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
    })
  );

  if (!response.Body) {
    throw new Error("Failed to get file body from R2");
  }

  // Convert Body to Readable if it's not already
  const fileStream = response.Body as Readable;

  const res = await youtube.videos.insert(
    {
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags: tags ? tags.split(",").map(t => t.trim()) : [],
          categoryId,
        },
        status: {
          privacyStatus,
        },
      },
      media: {
        body: fileStream,
      },
    },
    {
      // Resumable upload configurations
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / (Number(response.ContentLength) || 1)) * 100;
        console.log(`YouTube Upload: ${Math.round(progress)}% complete`);
      },
    }
  );

  return res.data;
}
