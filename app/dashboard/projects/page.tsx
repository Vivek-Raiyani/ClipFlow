import { syncUser } from "@/lib/user-sync";
import ProjectList from "@/app/components/ProjectList";
import CreateProjectButton from "@/app/components/CreateProjectButton";
import { FolderGit2, Search, Filter } from "lucide-react";

export default async function ProjectsPage() {
  const user = await syncUser();
  if (!user) return null;

  return (
    <div className="space-y-20 max-w-full">
      <header className="flex flex-col xl:flex-row justify-between items-start gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.3em] text-black/40 font-mono">
            <FolderGit2 className="w-4 h-4" />
            Central Repository
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-black">
            Projects
          </h1>
          <p className="text-xl text-black/40 max-w-2xl leading-relaxed">
            A comprehensive archive of your active workstreams and finalized deployments. 
            Manage team access and project-specific assets from a single interface.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/[0.02] border border-black/[0.05] text-black/20 focus-within:border-black/20 focus-within:bg-black/[0.03] transition-all group">
                <Search className="w-5 h-5 group-focus-within:text-black transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Projects..." 
                    className="bg-transparent border-none outline-none text-[13px] uppercase tracking-widest font-bold placeholder:text-black/10 text-black w-64"
                />
            </div>
            <CreateProjectButton />
        </div>
      </header>

      <section className="space-y-10">
        <div className="flex items-center justify-between px-10 text-[11px] font-bold uppercase tracking-[0.3em] text-black/20 font-mono">
            <span>Archive Index</span>
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 hover:text-black transition-colors cursor-pointer">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </div>
                <span>Sort: Recently Accessed</span>
            </div>
        </div>
        <div className="bg-white border border-black/[0.03] rounded-[3rem] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.02)]">
          <ProjectList creatorId={user.id} />
        </div>
      </section>
    </div>
  );
}
