import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

/**
 * User Synchronization Utility
 * 
 * Synchronizes the Clerk authenticated user with our local Postgres database.
 * This ensures we have a local UUID (users.id) for foreign key relationships.
 */

export async function syncUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.warn("[User-Sync] No active session found.");
      return null;
    }

    const email = clerkUser.emailAddresses[0].emailAddress;
    const clerkId = clerkUser.id;

    // Check if user already exists in our local DB
    const result = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    const existingUser = result[0];

    if (existingUser) {
      return existingUser;
    }

    console.log(`[User-Sync] Creating new local user record for: ${email}`);

    // If not found, create the local record
    const [newUser] = await db.insert(users).values({
      clerkId: clerkId,
      email: email,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      role: "creator", 
    }).returning();

    console.log(`[User-Sync] Successfully created user ID: ${newUser.id}`);
    return newUser;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[User-Sync] Fatal Error:", err.message);
    throw err;
  }
}

