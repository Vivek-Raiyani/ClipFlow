import { syncUser } from "@/lib/user-sync";
import CreateProjectButton from "@/app/components/CreateProjectButton";
import ProjectList from "@/app/components/ProjectList";
import { db } from "@/lib/db";
import { projects, projectFiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  FolderGit2,
  Video,
  ArrowUpRight,
  LayoutGrid,
  Cloud,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await syncUser();
  if (!user) return null;

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.creatorId, user.id));

  const files = await db
    .select()
    .from(projectFiles)
    .innerJoin(projects, eq(projectFiles.projectId, projects.id))
    .where(eq(projects.creatorId, user.id));

  const pendingReview = files.filter(
    (f) => f.project_files.status === "pending"
  ).length;
  const recentActivity = files.filter((f) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(f.project_files.createdAt) > oneDayAgo;
  }).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-deep)" }}>
      {/* Ambient orbs */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          left: "-5%",
          width: 500,
          height: 500,
          background: "rgba(168,85,247,0.07)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          right: "-5%",
          width: 600,
          height: 400,
          background: "rgba(236,72,153,0.05)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1120,
          margin: "0 auto",
          padding: "80px 24px 60px",
        }}
      >
        {/* ─── Page Header ─── */}
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <LayoutGrid
                style={{ width: 14, height: 14, color: "#a855f7" }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#a855f7",
                }}
              >
                Dashboard
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              Overview
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                maxWidth: 420,
                lineHeight: 1.6,
              }}
            >
              Monitor and manage your high-performance creation workflows.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {!user.youtubeRefreshToken && (
              <Link
                href="/api/auth/youtube"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <Video style={{ width: 14, height: 14, color: "#ef4444" }} />
                Connect YouTube
                <ArrowUpRight style={{ width: 12, height: 12, opacity: 0.4 }} />
              </Link>
            )}
            {!user.driveRefreshToken && (
              <Link
                href="/api/auth/drive"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <Cloud style={{ width: 14, height: 14, color: "#3b82f6" }} />
                Connect Drive
                <ArrowUpRight style={{ width: 12, height: 12, opacity: 0.4 }} />
              </Link>
            )}
            <CreateProjectButton />
          </div>
        </header>

        {/* ─── Stats Grid ─── */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <StatCard
            title="Pending Review"
            value={pendingReview.toString()}
            description="Awaiting your approval"
            icon={ShieldCheck}
            accent="#a855f7"
          />
          <StatCard
            title="Daily Throughput"
            value={recentActivity.toString()}
            description="Assets processed in 24 h"
            icon={Zap}
            accent="#ec4899"
          />
          <StatCard
            title="Active Pipelines"
            value={userProjects.length.toString()}
            description="Configured projects"
            icon={FolderGit2}
            accent="#22c55e"
          />
        </section>

        {/* ─── Projects List ─── */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              paddingBottom: 20,
              marginBottom: 24,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                Recent Projects
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Your latest storage and publishing nodes
              </p>
            </div>
            <Link
              href="/dashboard/projects"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                fontWeight: 500,
                color: "#a855f7",
                textDecoration: "none",
                opacity: 0.8,
              }}
            >
              All Projects
              <ArrowUpRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            <ProjectList creatorId={user.id} />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
        }}
      >
        <Icon style={{ width: 18, height: 18 }} />
      </div>

      {/* Value */}
      <div>
        <div
          style={{
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "var(--text-primary)",
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          {description}
        </div>
      </div>
    </div>
  );
}
