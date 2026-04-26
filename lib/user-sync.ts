import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";

/**
 * User Synchronization Utility
 * 
 * Synchronizes the Clerk authenticated user with our local Postgres database.
 * This ensures we have a local UUID (users.id) for foreign key relationships.
 * 
 * Wrapped in React cache() to avoid redundant calls during a single request.
 */
export const syncUser = cache(async () => {
  const start = Date.now();
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.warn("[User-Sync] No active session found.");
      return null;
    }

    // 1. Check if user already exists in our local DB (FAST)
    const result = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    const existingUser = result[0];
    if (existingUser) {
      console.log(`[User-Sync] Verified user in ${Date.now() - start}ms`);
      return existingUser;
    }

    console.log(`[User-Sync] User missing from DB, fetching from Clerk...`);
    // 2. If NOT found, fetch full user details from Clerk (SLOW - only runs once)
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0].emailAddress;

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
});

