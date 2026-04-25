import { r2, R2_BUCKET_NAME } from "./r2";
import { getYoutubeClient } from "./youtube";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

/**
 * YouTube Publisher Utility
 * 
 * Handles the heavy lifting of streaming video data from Cloudflare R2
 * directly to the YouTube Data API.
 * 
 * High Efficiency: This implementation uses Node.js streams to ensure
 * that even multi-gigabyte files don't crash the 4GB VPS by avoiding
 * in-memory buffering.
 */

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
  console.log(`[YouTube-Publisher] Starting stream-upload for: ${title}`);
  
  const youtube = getYoutubeClient(accessToken, refreshToken);

  // 1. Initiate stream from Cloudflare R2
  const response = await r2.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
    })
  );

  if (!response.Body) {
    console.error(`[YouTube-Publisher] Failed to fetch object body from R2 for key: ${r2Key}`);
    throw new Error("Failed to get file body from R2");
  }

  // 2. Convert R2 Body to a Readable stream for the YouTube API
  const fileStream = response.Body as Readable;
  const contentLength = Number(response.ContentLength) || 1;

  console.log(`[YouTube-Publisher] Connected to R2. Stream size: ${(contentLength / (1024 * 1024)).toFixed(2)} MB`);

  // 3. Pipe stream to YouTube Video Insert API
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
      // Resumable upload configurations (handled by googleapis internal logic)
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / contentLength) * 100;
        if (evt.bytesRead % (5 * 1024 * 1024) < 100000) { // Log every ~5MB to avoid log flooding
          console.log(`[YouTube-Publisher] Upload Progress: ${Math.round(progress)}% (${(evt.bytesRead / (1024 * 1024)).toFixed(2)} MB)`);
        }
      },
    }
  );

  console.log(`[YouTube-Publisher] Upload complete. YouTube ID: ${res.data.id}`);
  return res.data;
}

