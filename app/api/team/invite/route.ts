import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, invitations, creatorEditorRelationships } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendInviteEmail } from "@/lib/mail";

/**
 * Team Invitation API
 * 
 * Handles inviting a new editor to a creator's team.
 * Logic:
 * 1. If the user already exists in ClipFlow, auto-accept and link them.
 * 2. If the user is new, create a pending invitation.
 * 3. Send a branded invitation email via Nodemailer.
 */

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[Team-Invite] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Get the inviting user (Creator)
    const currentUserReq = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    const creator = currentUserReq[0];
    
    if (!creator) {
      console.error(`[Team-Invite] Creator not found for clerkId: ${clerkId}`);
      return NextResponse.json({ error: "Creator account not found" }, { status: 404 });
    }

    console.log(`[Team-Invite] User ${creator.email} is inviting ${email}`);

    // 2. Check if the invited user already has an account
    const existingUserReq = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const targetUser = existingUserReq[0];

    // 3. Create an invitation record in DB
    const isExistingUser = !!targetUser;
    await db.insert(invitations).values({
      creatorId: creator.id,
      email: email,
      status: isExistingUser ? "accepted" : "pending", 
    });

    // 4. If they exist, auto-create the creatorEditorRelationship
    if (targetUser) {
      console.log(`[Team-Invite] Target user exists (${targetUser.id}). Auto-linking relationship.`);
      await db.insert(creatorEditorRelationships).values({
        creatorId: creator.id,
        editorId: targetUser.id,
        status: "active",
      });
    }

    // 5. Send Invite Email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteUrl = isExistingUser ? `${appUrl}/sign-in` : `${appUrl}/sign-up?invite=${creator.id}`;
    
    const inviterName = creator.name || creator.email;
    
    console.log(`[Team-Invite] Dispatching email to ${email}`);
    await sendInviteEmail(email, inviterName, inviteUrl);

    console.log(`[Team-Invite] Invitation process complete for ${email}`);
    return NextResponse.json({ success: true, message: "Invitation sent successfully." });

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Team-Invite] Fatal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

