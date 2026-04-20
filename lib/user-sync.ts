import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0].emailAddress;
    const clerkId = clerkUser.id;

    // Use explicit select for better error tracking
    const result = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    const existingUser = result[0];

    if (existingUser) {
      return existingUser;
    }

    // If not, create them
    const [newUser] = await db.insert(users).values({
      clerkId: clerkId,
      email: email,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      role: "creator", 
    }).returning();

    return newUser;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("DEBUG: SyncUser Database Error:", err.message);
    throw err;
  }
}
