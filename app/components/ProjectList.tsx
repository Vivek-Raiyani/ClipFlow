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
      <div className="p-32 text-center space-y-8">
        <div className="w-24 h-24 rounded-[3rem] bg-black/[0.02] border border-black/[0.05] flex items-center justify-center mx-auto text-black/10">
          <Box className="w-12 h-12" />
        </div>
        <div className="space-y-3">
          <p className="text-black/40 font-serif italic text-4xl">No active pipelines detected.</p>
          <p className="text-xs text-black/20 font-mono font-bold uppercase tracking-[0.3em]">Initialize your first project to begin encryption</p>
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
      className="flex items-center justify-between px-12 py-10 hover:bg-black/[0.01] transition-all group border-b border-black/[0.03] last:border-0 relative overflow-hidden"
    >
      {/* Side Status Indicator */}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-12 rounded-r-full transition-all duration-500 scale-y-0 group-hover:scale-y-100 ${isActive ? 'bg-black' : 'bg-black/10'}`} />
      
      <div className="flex items-center gap-10 relative z-10">
        <div className="relative">
          <div className="w-20 h-20 rounded-[2rem] bg-black/[0.03] border border-black/5 flex items-center justify-center font-serif text-4xl text-black/20 group-hover:text-black group-hover:border-black/10 transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-2">
            {project.title.charAt(0).toUpperCase()}
          </div>
          {isActive && (
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full border-[3px] border-white shadow-sm" />
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-4xl text-black/90 group-hover:text-black transition-colors tracking-tight font-bold">
            {project.title}
          </h3>
          <div className="flex items-center gap-6 text-[11px] font-mono font-bold tracking-[0.25em] uppercase">
            <div className="flex items-center gap-2 text-black/40">
              <Clock className="w-3.5 h-3.5 opacity-40" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
            <div className="flex items-center gap-2">
              {project.visibility === 'public' ? <Globe2 className="w-3.5 h-3.5 text-black/60" /> : <Lock className="w-3.5 h-3.5 text-black/20" />}
              <span className="text-black/40">{project.visibility}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-16 relative z-10">
        <div className="text-right hidden sm:flex flex-col items-end gap-2">
          <p className="text-[10px] font-mono text-black/20 uppercase tracking-[0.3em] font-bold">Pipeline Status</p>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-black' : 'text-black/40'}`}>
              {project.status === 'active' ? 'Operational' : project.status}
            </span>
            <Circle className={`w-2 h-2 fill-current ${isActive ? 'text-black animate-pulse' : 'text-black/10'}`} />
          </div>
        </div>
        
        <div className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center bg-black/[0.01] group-hover:border-black/20 group-hover:bg-black/[0.02] transition-all duration-500">
          <ChevronRight className="w-7 h-7 text-black/20 group-hover:text-black transition-all group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
