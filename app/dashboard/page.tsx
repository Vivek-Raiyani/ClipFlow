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
          background: "rgba(0,0,0,0.01)",
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
                marginBottom: 12,
              }}
            >
              <LayoutGrid
                style={{ width: 14, height: 14, color: "#000" }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#000",
                  opacity: 0.4
                }}
              >
                Dashboard
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: 12,
                fontFamily: "var(--font-serif)"
              }}
            >
              Overview
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "var(--text-secondary)",
                maxWidth: 480,
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Monitor and manage your high-performance creation workflows with precision and ease.
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
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "rgba(0,0,0,0.02)",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <Video style={{ width: 14, height: 14, color: "#000" }} />
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
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "rgba(0,0,0,0.02)",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <Cloud style={{ width: 14, height: 14, color: "#000" }} />
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginBottom: 64,
          }}
        >
          <StatCard
            title="Pending Review"
            value={pendingReview.toString()}
            description="Awaiting your approval"
            icon={ShieldCheck}
            accent="#000"
          />
          <StatCard
            title="Daily Throughput"
            value={recentActivity.toString()}
            description="Assets processed in 24 h"
            icon={Zap}
            accent="#000"
          />
          <StatCard
            title="Active Pipelines"
            value={userProjects.length.toString()}
            description="Configured projects"
            icon={FolderGit2}
            accent="#000"
          />
        </section>

        {/* ─── Projects List ─── */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              paddingBottom: 24,
              marginBottom: 32,
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
                color: "#000",
                textDecoration: "none",
                opacity: 0.4,
              }}
            >
              All Projects
              <ArrowUpRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,1)",
              border: "1px solid rgba(0,0,0,0.04)",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 2px 20px rgba(0,0,0,0.02)"
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
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: 24,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 2px 12px rgba(0,0,0,0.01)"
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: `#f5f5f7`,
          border: `1px solid rgba(0,0,0,0.04)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
        }}
      >
        <Icon style={{ width: 22, height: 22 }} />
      </div>

      {/* Value */}
      <div>
        <div
          style={{
            fontSize: "clamp(40px, 5vw, 56px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            lineHeight: 1,
            marginBottom: 8,
            fontFamily: "var(--font-serif)"
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#000",
            opacity: 0.4,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 400 }}>
          {description}
        </div>
      </div>
    </div>
  );
}
