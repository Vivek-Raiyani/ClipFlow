import { syncUser } from "@/lib/user-sync";
import ProjectList from "@/app/components/ProjectList";
import CreateProjectButton from "@/app/components/CreateProjectButton";
import { FolderGit2, Search, Filter } from "lucide-react";

export default async function ProjectsPage() {
  const user = await syncUser();
  if (!user) return null;

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 w-fit">
            <FolderGit2 className="w-3 h-3 text-white/40" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 font-mono italic">Central Repository</span>
          </div>
          <h1 className="text-6xl font-serif font-medium tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
            Portfolio
          </h1>
          <p className="text-white/40 text-sm max-w-md leading-relaxed font-sans">
            A comprehensive archive of your active workstreams and finalized deployments.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-white/20 focus-within:border-white/20 focus-within:bg-white/[0.04] transition-all group">
                <Search className="w-4 h-4 group-focus-within:text-white transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Pipelines..." 
                    className="bg-transparent border-none outline-none text-[11px] uppercase tracking-widest font-bold placeholder:text-white/10 text-white w-40"
                />
            </div>
            <CreateProjectButton />
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 font-mono">
            <span>Archive Index</span>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                    <Filter className="w-3 h-3" />
                    <span>Filter</span>
                </div>
                <span>Sort: Recently Accessed</span>
            </div>
        </div>
        <div className="rounded-[2.5rem] bg-white/[0.01] border border-white/5 overflow-hidden backdrop-blur-sm">
          <ProjectList creatorId={user.id} />
        </div>
      </section>
    </div>
  );
}
