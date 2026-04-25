import { google } from "googleapis";

const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REDIRECT_URI = process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI;

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

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.youtube({ version: "v3", auth });
};

export const refreshAccessToken = async (refreshToken: string) => {
  const auth = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URI
  );

  auth.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await auth.refreshAccessToken();
  return credentials.access_token!;
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
