import { OAuth2Client, YOUTUBE_SCOPES } from "@/lib/youtube";
import { NextResponse } from "next/server";

/**
 * YouTube Auth Initiation
 * 
 * Generates the Google OAuth2 consent URL for YouTube publishing permissions.
 * Offline access is requested to obtain a refresh token for background publishing.
 */

export async function GET() {
  console.log("[YouTube-Auth] Generating OAuth consent URL...");
  
  const url = OAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: YOUTUBE_SCOPES,
    prompt: "consent", 
  });

  return NextResponse.redirect(url);
}

