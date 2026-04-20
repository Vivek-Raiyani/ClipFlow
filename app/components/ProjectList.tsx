import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

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
      <div className="p-12 text-center">
        <p className="text-white/20 font-serif italic text-lg">No active pipelines detected.</p>
        <p className="text-[10px] text-white/10 font-mono uppercase tracking-widest mt-2">Initialize your first project to begin encryption</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {userProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link 
      href={`/dashboard/projects/${project.id}`}
      className="flex items-center justify-between p-6 hover:bg-white/[0.03] transition-all group relative overflow-hidden"
    >
      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="relative z-10 flex items-center gap-6">
        <div className="w-12 h-12 glass flex items-center justify-center font-serif text-2xl text-white/20 group-hover:text-primary group-hover:border-primary/30 transition-all">
          {project.title.charAt(0)}
        </div>
        <div>
          <h3 className="font-serif text-xl mb-1 group-hover:translate-x-1 transition-transform inline-block">
            {project.title}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.1em]">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="text-[10px] font-mono text-accent uppercase tracking-[0.1em]">
              {project.visibility}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-8">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-mono text-white/20 uppercase mb-0.5">Status</p>
          <p className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
            project.status === 'active' ? 'text-green-500' : 'text-white/40'
          }`}>
            {project.status}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
          <span className="text-white/20 group-hover:text-primary transition-colors">→</span>
        </div>
      </div>
    </Link>
  );
}
