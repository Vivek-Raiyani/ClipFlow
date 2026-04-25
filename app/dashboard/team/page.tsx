import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, creatorEditorRelationships, invitations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { syncUser } from "@/lib/user-sync";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { TeamClient } from "./TeamClient";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const [editors, pendingInvites] = await Promise.all([
    db
      .select({
        id: creatorEditorRelationships.id,
        editorId: creatorEditorRelationships.editorId,
        status: creatorEditorRelationships.status,
        createdAt: creatorEditorRelationships.createdAt,
        name: users.name,
        email: users.email,
      })
      .from(creatorEditorRelationships)
      .leftJoin(users, eq(creatorEditorRelationships.editorId, users.id))
      .where(
        and(
          eq(creatorEditorRelationships.creatorId, user.id),
          eq(creatorEditorRelationships.status, "active")
        )
      ),
    db
      .select()
      .from(invitations)
      .where(and(eq(invitations.creatorId, user.id), eq(invitations.status, "pending"))),
  ]);

  return (
    <DashboardLayout>
      <TeamClient
        editors={editors.map(e => ({
          id: e.id,
          editorId: e.editorId,
          name: e.name,
          email: e.email,
          status: e.status,
          joinedAt: e.createdAt.toISOString(),
        }))}
        pendingInvites={pendingInvites.map(i => ({
          id: i.id,
          email: i.email,
          createdAt: i.createdAt.toISOString(),
        }))}
      />
    </DashboardLayout>
  );
}
