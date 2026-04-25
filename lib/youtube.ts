import { google } from "googleapis";
import { decrypt } from "@/lib/crypto";

const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REDIRECT_URI = process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI;

/**
 * YouTube API Client Utility
 * 
 * Handles authentication and client instantiation for YouTube Data API v3.
 * All tokens passed here are automatically decrypted if they are in the versioned format.
 */

export const OAuth2Client = new google.auth.OAuth2(
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REDIRECT_URI
);

export const YOUTUBE_SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const getYoutubeClient = (accessToken: string, refreshToken?: string) => {
  const auth = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URI
  );

  // Decrypt tokens before usage
  auth.setCredentials({
    access_token: decrypt(accessToken),
    refresh_token: refreshToken ? decrypt(refreshToken) : undefined,
  });

  return google.youtube({ version: "v3", auth });
};

export const refreshAccessToken = async (refreshToken: string) => {
  const auth = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URI
  );

  const decryptedRefreshToken = decrypt(refreshToken);
  auth.setCredentials({ refresh_token: decryptedRefreshToken });
  
  try {
    const { credentials } = await auth.refreshAccessToken();
    return credentials.access_token!;
  } catch (error) {
    console.error("[YouTube] Failed to refresh access token:", error);
    throw error;
  }
};


export const getChannelInfo = async (accessToken: string) => {
  const youtube = getYoutubeClient(accessToken);
  const response = await youtube.channels.list({
    part: ["snippet", "id"],
    mine: true,
  });

  const channel = response.data.items?.[0];
  if (!channel) return null;

  return {
    id: channel.id!,
    title: channel.snippet?.title!,
    thumbnail: channel.snippet?.thumbnails?.default?.url!,
  };
};
