import { google } from "googleapis";
import { decrypt } from "@/lib/crypto";

/**
 * Google Drive API Client Utility
 * 
 * Handles authentication and client instantiation for Google Drive API.
 * All tokens passed here are automatically decrypted if they are in the versioned format.
 */

// It is highly recommended to use a separate credential pair or at least a separate redirect URI for Drive
const DRIVE_CLIENT_ID = process.env.DRIVE_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID;
const DRIVE_CLIENT_SECRET = process.env.DRIVE_CLIENT_SECRET || process.env.YOUTUBE_CLIENT_SECRET;
const DRIVE_REDIRECT_URI = process.env.NEXT_PUBLIC_DRIVE_REDIRECT_URI || "http://localhost:3000/api/auth/drive/callback";

export const DriveOAuth2Client = new google.auth.OAuth2(
  DRIVE_CLIENT_ID,
  DRIVE_CLIENT_SECRET,
  DRIVE_REDIRECT_URI
);

export const DRIVE_SCOPES = [
  // Full, permissive scope to access all of a user's files and allow the app to upload items to drive
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const getDriveClient = (accessToken: string, refreshToken?: string) => {
  const auth = new google.auth.OAuth2(
    DRIVE_CLIENT_ID,
    DRIVE_CLIENT_SECRET,
    DRIVE_REDIRECT_URI
  );

  // Decrypt tokens before usage
  auth.setCredentials({
    access_token: decrypt(accessToken),
    refresh_token: refreshToken ? decrypt(refreshToken) : undefined,
  });

  return google.drive({ version: "v3", auth });
};

export const refreshDriveAccessToken = async (refreshToken: string) => {
  const auth = new google.auth.OAuth2(
    DRIVE_CLIENT_ID,
    DRIVE_CLIENT_SECRET,
    DRIVE_REDIRECT_URI
  );

  const decryptedRefreshToken = decrypt(refreshToken);
  auth.setCredentials({ refresh_token: decryptedRefreshToken });
  
  try {
    const { credentials } = await auth.refreshAccessToken();
    return credentials.access_token!;
  } catch (error) {
    console.error("[Drive] Failed to refresh access token:", error);
    throw error;
  }
};

