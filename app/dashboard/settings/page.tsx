import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/lib/user-sync";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await syncUser();
  if (!user) redirect("/sign-in");

  return (
    <DashboardLayout>
      <SettingsClient
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          youtubeConnected: Boolean(user.youtubeRefreshToken),
          driveConnected: Boolean(user.driveRefreshToken),
        }}
      />
    </DashboardLayout>
  );
}
