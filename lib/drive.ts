import { google } from "googleapis";

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

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.drive({ version: "v3", auth });
};

export const refreshDriveAccessToken = async (refreshToken: string) => {
  const auth = new google.auth.OAuth2(
    DRIVE_CLIENT_ID,
    DRIVE_CLIENT_SECRET,
    DRIVE_REDIRECT_URI
  );

  auth.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await auth.refreshAccessToken();
  return credentials.access_token!;
};
