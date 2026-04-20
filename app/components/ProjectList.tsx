import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { 
  ChevronRight, 
  Circle, 
  Clock, 
  Globe2, 
  Lock,
  Box
} from "lucide-react";

interface ProjectListProps {
  creatorId: string;
}

export default async function ProjectList({ creatorId }: ProjectListProps) {
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.creatorId, creatorId))
    .orderBy(desc(projects.createdAt));

  if (userProjects.length === 0) {
    return (
      <div className="p-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto text-white/10 group-hover:text-white/20 transition-colors">
          <Box className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-white/30 font-serif italic text-xl">No active pipelines detected.</p>
          <p className="text-[10px] text-white/10 font-mono uppercase tracking-[0.2em]">Initialize your first project to begin encryption</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {userProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProjectCard({ project }: { project: any }) {
  const isActive = project.status === 'active';

  return (
    <Link 
      href={`/dashboard/projects/${project.id}`}
      className="flex items-center justify-between px-8 py-7 hover:bg-white/[0.03] transition-all group border-b border-white/[0.03] last:border-0 relative overflow-hidden"
    >
      {/* Side Status Indicator */}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-500 scale-y-0 group-hover:scale-y-100 ${isActive ? 'bg-primary' : 'bg-white/20'}`} />
      
      <div className="flex items-center gap-8 relative z-10">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-serif text-2xl text-white/20 group-hover:text-primary group-hover:border-primary/20 transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-1">
            {project.title.charAt(0).toUpperCase()}
          </div>
          {isActive && (
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-[#050505] shadow-[0_0_10px_rgba(var(--primary),0.4)]" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-white/90 group-hover:text-white transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
            <div className="flex items-center gap-1.5 text-white/40">
              <Clock className="w-3 h-3 text-white/20" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-1.5">
              {project.visibility === 'public' ? <Globe2 className="w-3 h-3 text-accent" /> : <Lock className="w-3 h-3 text-white/20" />}
              <span className={project.visibility === 'public' ? 'text-accent' : 'text-white/40'}>{project.visibility}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12 relative z-10">
        <div className="text-right hidden sm:flex flex-col items-end gap-1">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Pipeline Status</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-white/40'}`}>
              {project.status === 'active' ? 'Operational' : project.status}
            </span>
            <Circle className={`w-1.5 h-1.5 fill-current ${isActive ? 'text-primary animate-pulse' : 'text-white/20'}`} />
          </div>
        </div>
        
        <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.01] group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500">
          <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
