import { DriveOAuth2Client, DRIVE_SCOPES } from "@/lib/drive";
import { NextResponse } from "next/server";

/**
 * Google Drive Auth Initiation
 * 
 * Generates the Google OAuth2 consent URL specifically for Drive permissions.
 * Forces `prompt: "consent"` to ensure a refresh token is provided.
 */

export async function GET() {
  console.log("[Drive-Auth] Generating OAuth consent URL...");
  
  const url = DriveOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: DRIVE_SCOPES,
    prompt: "consent", 
  });

  return NextResponse.redirect(url);
}

