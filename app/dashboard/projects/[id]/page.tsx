import { db } from "@/lib/db";
import { projects, projectFiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { syncUser } from "@/lib/user-sync";
import UploadZone from "@/app/components/UploadZone";
import FileActions from "@/app/components/FileActions";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const user = await syncUser();
  if (!user) return null;

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, params.id),
  });

  if (!project) notFound();

  const files = await db.select()
    .from(projectFiles)
    .where(eq(projectFiles.projectId, project.id))
    .orderBy(desc(projectFiles.createdAt));

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <header className="flex justify-between items-end animate-fade-in">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-mono">Workspace</p>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">{project.visibility}</p>
          </div>
          <h1 className="text-5xl font-serif font-medium tracking-tight truncate max-w-2xl">{project.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4 hidden md:block">
            <p className="text-xs text-white/40 font-mono uppercase">Status</p>
            <p className="text-[10px] text-accent font-mono uppercase tracking-widest">{project.status}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
        {/* Left Column: File Log */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-serif">Revision History</h2>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{files.length} Versions</span>
          </div>

          <div className="space-y-4">
            {files.length === 0 ? (
              <div className="glass p-20 text-center flex flex-col items-center justify-center border-dashed border-white/10 bg-white/[0.01]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-4 grayscale opacity-20">📁</div>
                <p className="text-white/20 font-serif italic text-lg">Waiting for first encrypted transmission...</p>
                <p className="text-[10px] text-white/10 font-mono uppercase tracking-widest mt-2">Initialize upload protocol to begin recording history</p>
              </div>
            ) : (
              files.map(file => (
                <FileRow key={file.id} file={file} />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Sidebar Controls */}
        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h3 className="font-serif text-xl">Secure Upload</h3>
            </div>
            <div className="glass p-2 bg-white/[0.02]">
              <UploadZone projectId={project.id} uploaderId={user.id} />
            </div>
            <p className="text-[10px] text-white/20 mt-4 leading-relaxed italic text-center font-mono uppercase tracking-tighter">
              E2E Encryption Enabled • Direct R2 Tunnel
            </p>
          </section>

          <section className="glass p-8 border-l-2 border-primary/20">
            <h3 className="font-serif text-xl mb-6 text-primary">Metadata Configuration</h3>
            <div className="space-y-6">
              <div className="group">
                <p className="text-[10px] text-white/20 uppercase font-mono mb-1 tracking-widest group-hover:text-white/40 transition-colors">Target Audience</p>
                <p className="font-serif text-sm border-b border-white/5 pb-2">{project.visibility || 'Public'}</p>
              </div>
              <div className="group">
                <p className="text-[10px] text-white/20 uppercase font-mono mb-1 tracking-widest group-hover:text-white/40 transition-colors">Indexing Tags</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.tags?.split(',').map((tag: string) => (
                    <span key={tag} className="text-[9px] font-mono bg-white/5 text-white/40 px-2 py-0.5 rounded border border-white/10">{tag.trim()}</span>
                  )) || <span className="text-[10px] font-serif italic text-white/10">No tags configured</span>}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function FileRow({ file }: { file: any }) {
  return (
    <div className="glass p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.01] hover:bg-white/[0.04] transition-all group border-b-2 border-transparent hover:border-primary/20">
      <div className="flex items-center gap-5 overflow-hidden">
        <div className="w-10 h-10 flex-shrink-0 glass flex items-center justify-center text-lg grayscale group-hover:grayscale-0 transition-all">
          {file.type === 'video' ? '🎬' : '📄'}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-serif text-lg truncate group-hover:text-primary transition-colors">{file.fileName}</h4>
            <span className="text-[9px] font-mono bg-white/5 text-white/30 px-1.5 py-0.5 rounded border border-white/10 uppercase">v{file.version}</span>
          </div>
          <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
            <span className="w-1 h-1 rounded-full bg-white/5" />
            <span className="truncate">SIG: {file.uploaderId.slice(0, 12)}...</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 sm:mt-0 ml-auto sm:ml-0">
        <StatusBadge status={file.status} />
        <div className="h-8 w-[1px] bg-white/5 hidden sm:block" />
        <FileActions fileId={file.id} currentStatus={file.status} />
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/20 hover:text-white">
          ⬇️
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    approved: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    pending: 'bg-white/5 text-white/40 border-white/10',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.2em] border ${styles[status as keyof typeof styles] || styles.pending}`}>
      {status}
    </span>
  );
}
