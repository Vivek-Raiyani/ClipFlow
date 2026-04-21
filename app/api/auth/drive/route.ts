import { DriveOAuth2Client, DRIVE_SCOPES } from "@/lib/drive";
import { NextResponse } from "next/server";

export async function GET() {
  const url = DriveOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: DRIVE_SCOPES,
    prompt: "consent", // Forces consent screen to ensure refresh token is returned
  });

  return NextResponse.redirect(url);
}
