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
  TrendingUp
} from "lucide-react";

export default async function DashboardPage() {
  const user = await syncUser();
  if (!user) return null;

  // Fetch dynamic stats
  const userProjects = await db.select().from(projects).where(eq(projects.creatorId, user.id));
  
  const files = await db.select()
    .from(projectFiles)
    .innerJoin(projects, eq(projectFiles.projectId, projects.id))
    .where(eq(projects.creatorId, user.id));

  const pendingReview = files.filter(f => f.project_files.status === "pending").length;
  const recentActivity = files.filter(f => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(f.project_files.createdAt) > oneDayAgo;
  }).length;

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">System Nominal</span>
          </div>
          <h1 className="text-6xl font-serif font-medium tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
            Overview
          </h1>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            Manage your high-performance creation workflows and monitor processing nodes in real-time.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {!user.youtubeRefreshToken && (
            <Link 
              href="/api/auth/youtube"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all group"
            >
              <Video className="w-4 h-4 text-[#FF0000]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70">Connect YouTube</span>
              <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          )}
          
          <CreateProjectButton />
        </div>
      </header>

      {/* Primary Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Pending Review" 
          value={pendingReview.toString()} 
          description="Awaiting final production sign-off"
          icon={ShieldCheck}
          accent="primary"
        />
        <StatCard 
          title="Daily Throughput" 
          value={recentActivity.toString()} 
          description="Assets processed in 24h cycle"
          icon={Zap}
          accent="secondary"
        />
        <StatCard 
          title="Active Pipelines" 
          value={userProjects.length.toString()} 
          description="Configured project environments"
          icon={FolderGit2}
          accent="accent"
        />
      </section>

      {/* Projects Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif italic text-white/90">Recent Deployments</h2>
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-[0.2em]">Latest workspace activity</p>
          </div>
          <Link href="/dashboard/projects" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            Portfolio <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        </div>
        
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-2 backdrop-blur-sm">
          <ProjectList creatorId={user.id} />
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, description, icon: Icon, accent }: { title: string; value: string; description: string; icon: any; accent: 'primary' | 'secondary' | 'accent' }) {
  const accentColors = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent"
  };

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-1">
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity ${accentColors[accent]}`}>
        <Icon size={120} strokeWidth={1} />
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors ${accentColors[accent]}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-mono tracking-tighter text-white font-medium">{value}</h3>
            <div className={`w-1.5 h-1.5 rounded-full ${accentColors[accent]} animate-pulse`} />
          </div>
          <p className="text-xs font-semibold text-white/80 mt-2 uppercase tracking-wide">{title}</p>
        </div>
        
        <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest leading-none">
          {description}
        </p>
      </div>
    </div>
  );
}
