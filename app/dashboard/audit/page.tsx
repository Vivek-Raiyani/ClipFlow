import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auditLogs, users, projects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { syncUser } from "@/lib/user-sync";
import { DashboardLayout } from "@/app/components/DashboardLayout";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  FILE_UPLOADED: "Upload",
  FILE_APPROVED: "Approved",
  FILE_REJECTED: "Rejected",
  PROJECT_PUBLISHED: "Published",
};

const ACTION_CLASS: Record<string, string> = {
  FILE_UPLOADED: "upload",
  FILE_APPROVED: "approved",
  FILE_REJECTED: "rejected",
  PROJECT_PUBLISHED: "published",
};

function formatRelTime(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function AuditPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const logs = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      details: auditLogs.details,
      createdAt: auditLogs.createdAt,
      userName: users.name,
      userEmail: users.email,
      projectTitle: projects.title,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.id))
    .leftJoin(projects, eq(auditLogs.projectId, projects.id))
    .where(eq(auditLogs.userId, user.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(100);

  return (
    <DashboardLayout>
      <div className="dash-header">
        <div>
          <div className="dash-header-title">Audit Log</div>
          <div className="dash-header-sub">{logs.length} recent events</div>
        </div>
      </div>

      <div className="proj-list">
        {logs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="empty-title">No events yet</div>
            <div className="empty-sub">All file uploads, approvals, and publishes will be logged here.</div>
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="audit-row">
              <span className={`audit-action ${ACTION_CLASS[log.action] ?? ""}`}>
                {ACTION_LABELS[log.action] ?? log.action}
              </span>
              <div className="audit-meta">
                <div className="audit-desc">
                  {log.projectTitle ? (
                    <><strong>{log.projectTitle}</strong> · {log.userName ?? log.userEmail ?? "Unknown"}</>
                  ) : (
                    log.userName ?? log.userEmail ?? "Unknown"
                  )}
                </div>
                <div className="audit-time">{formatRelTime(log.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
