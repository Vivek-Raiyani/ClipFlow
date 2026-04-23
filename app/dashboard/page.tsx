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
    <div className="space-y-32 pb-32">
      {/* ─── Page Header ─── */}
      <header className="flex flex-col xl:flex-row justify-between items-start gap-16">
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.4em] text-black/40 font-mono">
            <LayoutGrid className="w-5 h-5" />
            Control Center
          </div>
          <h1 className="text-7xl md:text-9xl font-serif font-bold tracking-tighter text-black leading-[0.85]">
            Overview
          </h1>
          <p className="text-2xl text-black/40 max-w-2xl leading-relaxed font-medium">
            Monitor and manage your high-performance creation workflows with precision and ease. 
            Track real-time deployments and team synchronization.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 pt-6">
          {!user.youtubeRefreshToken && (
            <Link
              href="/api/auth/youtube"
              className="flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-black/[0.03] border border-black/[0.06] text-[11px] font-bold uppercase tracking-widest text-black/60 hover:bg-black/5 transition-all shadow-sm"
            >
              <Video className="w-5 h-5" />
              Connect YouTube
              <ArrowUpRight className="w-4 h-4 opacity-30" />
            </Link>
          )}
          {!user.driveRefreshToken && (
            <Link
              href="/api/auth/drive"
              className="flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-black/[0.03] border border-black/[0.06] text-[11px] font-bold uppercase tracking-widest text-black/60 hover:bg-black/5 transition-all shadow-sm"
            >
              <Cloud className="w-5 h-5" />
              Connect Drive
              <ArrowUpRight className="w-4 h-4 opacity-30" />
            </Link>
          )}
          <CreateProjectButton />
        </div>
      </header>

      {/* ─── Stats Grid ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatCard
          title="Pending Review"
          value={pendingReview.toString()}
          description="Awaiting approval"
          icon={ShieldCheck}
          href="/dashboard/review"
        />
        <StatCard
          title="Daily Throughput"
          value={recentActivity.toString()}
          description="Assets processed"
          icon={Zap}
        />
        <StatCard
          title="Active Projects"
          value={userProjects.length.toString()}
          description="Live pipelines"
          icon={FolderGit2}
          href="/dashboard/projects"
        />
      </section>

      {/* ─── Projects List ─── */}
      <section className="space-y-16">
        <div className="flex justify-between items-end border-b border-black/[0.05] pb-12">
          <div className="space-y-3">
            <h2 className="text-5xl font-serif font-bold text-black tracking-tight">
              Recent Projects
            </h2>
            <p className="text-xl text-black/30 font-medium italic">
              Your latest storage and publishing nodes
            </p>
          </div>
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.3em] text-black/30 hover:text-black transition-colors pb-2"
          >
            All Projects
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white border border-black/[0.03] rounded-[4rem] overflow-hidden shadow-[0_12px_60px_rgba(0,0,0,0.03)]">
          <ProjectList creatorId={user.id} />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
  href?: string;
}) {
  const Card = (
    <div className="group bg-white border border-black/[0.03] rounded-[3.5rem] p-12 space-y-12 transition-all duration-500 hover:border-black/10 hover:shadow-[0_50px_100px_rgba(0,0,0,0.04)]">
      <div className="w-20 h-20 rounded-[2rem] bg-black/[0.02] border border-black/[0.03] flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-8 h-8" />
      </div>

      <div className="space-y-4">
        <div className="text-8xl font-serif font-bold text-black tracking-tighter leading-none">
          {value}
        </div>
        <div className="space-y-2">
           <div className="text-[12px] font-bold uppercase tracking-[0.4em] text-black/40 font-mono">
             {title}
           </div>
           <div className="text-xs text-black/30 font-bold uppercase tracking-widest font-mono italic">
             {description}
           </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{Card}</Link>;
  }

  return Card;
}
