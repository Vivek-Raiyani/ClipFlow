import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { projects, projectFiles, creatorEditorRelationships, youtubeChannels, users } from "./db/schema";
import { eq, and, count, desc } from "drizzle-orm";
import { cache } from "react";
import { syncUser } from "./user-sync";

export const getDashboardData = cache(async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  // We still run syncUser to ensure the user exists in DB, 
  // but we don't WAIT for it before starting our data queries.
  const userPromise = syncUser();

  const start = Date.now();
  
  const dbStart = Date.now();
  
  // Use db.batch to send ALL queries in a single HTTP request to Neon.
  // This drastically reduces latency caused by multiple roundtrips.
  const [allProjects, pendingFiles, editors, userChannels] = await db.batch([
    db.select({ projects, activeChannelId: users.activeChannelId })
      .from(projects)
      .innerJoin(users, eq(projects.creatorId, users.id))
      .where(eq(users.clerkId, clerkId))
      .orderBy(desc(projects.updatedAt)),
    
    db.select({ count: count() })
      .from(projectFiles)
      .innerJoin(projects, eq(projectFiles.projectId, projects.id))
      .innerJoin(users, eq(projects.creatorId, users.id))
      .where(
        and(
          eq(users.clerkId, clerkId),
          eq(projectFiles.status, "pending")
        )
      ),
    db.select({ count: count() })
      .from(creatorEditorRelationships)
      .innerJoin(users, eq(creatorEditorRelationships.creatorId, users.id))
      .where(eq(users.clerkId, clerkId)),
    
    db.select({ youtubeChannels })
      .from(youtubeChannels)
      .innerJoin(users, eq(youtubeChannels.userId, users.id))
      .where(eq(users.clerkId, clerkId)),
  ]);

  console.log(`[DB-Fetch] Batch query took ${Date.now() - dbStart}ms`);

  const user = await userPromise;
  if (!user) return null;

  console.log(`[DB-Fetch] Dashboard Data for ${clerkId} took ${Date.now() - start}ms`);

  // Correctly filter projects based on the user's active channel
  const projectsList = allProjects
    .filter(r => {
      const activeId = r.activeChannelId;
      return activeId 
        ? r.projects.channelId === activeId 
        : r.projects.channelId === null;
    })
    .map(r => r.projects);

  return {
    user,
    allProjects: projectsList,
    pendingCount: Number(pendingFiles[0]?.count ?? 0),
    editorCount: Number(editors[0]?.count ?? 0),
    channels: userChannels.map(r => r.youtubeChannels),
    publishedCount: projectsList.filter(p => p.status === "published").length,
  };
});
