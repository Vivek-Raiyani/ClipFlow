import { syncUser } from "@/lib/user-sync";
import CreateProjectButton from "@/app/components/CreateProjectButton";
import ProjectList from "@/app/components/ProjectList";

export default async function DashboardPage() {
  const user = await syncUser();

  if (!user) return null;

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <header className="flex justify-between items-end animate-fade-in">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-mono mb-2">Command Center</p>
          <h1 className="text-5xl font-serif font-medium tracking-tight">Overview</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4 hidden md:block">
            <p className="text-xs text-white/40 font-mono">NODE_STATUS</p>
            <p className="text-[10px] text-accent font-mono uppercase tracking-widest">Active & Secure</p>
          </div>
          <CreateProjectButton />
        </div>
      </header>

      {/* Primary Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <StatCard 
          title="Pending Review" 
          value="0" 
          description="Drafts waiting for your final approval"
          color="primary"
          icon="🛡️"
        />
        <StatCard 
          title="Recent Activity" 
          value="0" 
          description="Files processed in the last 24 hours"
          color="secondary"
          icon="⚡"
        />
        <StatCard 
          title="Total Projects" 
          value="0" 
          description="Active workflow pipelines configured"
          color="accent"
          icon="📁"
        />
      </section>

      {/* Projects Section */}
      <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif">Active Projects</h2>
            <span className="text-[10px] font-mono text-white/20 bg-white/5 px-2 py-0.5 rounded-full">LIVE</span>
          </div>
          <Link href="/dashboard/projects" className="text-xs font-mono text-white/40 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group">
            View All Projects <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="glass p-1">
          <ProjectList creatorId={user.id} />
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, description, color, icon }: { title: string; value: string; description: string; color: 'primary' | 'secondary' | 'accent'; icon: string }) {
  const colorMap = {
    primary: 'border-primary/20 hover:border-primary/50 text-primary',
    secondary: 'border-secondary/20 hover:border-secondary/50 text-secondary',
    accent: 'border-accent/20 hover:border-accent/50 text-accent',
  };

  return (
    <div className={`glass p-8 group transition-all duration-500 hover:-translate-y-1 border-b-2 ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-6">
        <span className="text-2xl grayscale group-hover:grayscale-0 transition-all duration-500">{icon}</span>
        <div className="w-2 h-2 rounded-full bg-white/10 group-hover:animate-pulse group-hover:bg-current" />
      </div>
      <p className="text-4xl font-bold mb-1 tracking-tighter">{value}</p>
      <h3 className="font-serif text-lg text-white/90 mb-2 truncate">{title}</h3>
      <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest leading-relaxed">
        {description}
      </p>
    </div>
  );
}

import Link from "next/link";
