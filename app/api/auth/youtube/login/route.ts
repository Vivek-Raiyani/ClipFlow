import { OAuth2Client, YOUTUBE_SCOPES } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET() {
  const url = OAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: YOUTUBE_SCOPES,
    prompt: "consent", // Force consent to get refresh token
  });

  return NextResponse.redirect(url);
}
