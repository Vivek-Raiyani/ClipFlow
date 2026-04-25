import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/lib/user-sync";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { SettingsClient } from "./SettingsClient";
import { db } from "@/lib/db";
import { youtubeChannels, googleDriveConnections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const [channels, driveConnections] = await Promise.all([
    db.query.youtubeChannels.findMany({
      where: eq(youtubeChannels.userId, user.id),
      orderBy: (youtubeChannels, { desc }) => [desc(youtubeChannels.createdAt)],
    }),
    db.query.googleDriveConnections.findFirst({
      where: eq(googleDriveConnections.userId, user.id),
    })
  ]);

  return (
    <DashboardLayout>
      <SettingsClient
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          youtubeConnected: channels.length > 0,
          driveConnected: !!driveConnections,
        }}
        channels={channels.map(c => ({
          id: c.id,
          title: c.channelTitle,
          thumbnail: c.channelThumbnail || "",
          connectedAt: c.createdAt.toISOString(),
        }))}
      />
    </DashboardLayout>
  );
}
