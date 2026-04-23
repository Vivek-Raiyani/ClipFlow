import { db } from "@/lib/db";
import { projects, projectFiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { syncUser } from "@/lib/user-sync";
import UploadZone from "@/app/components/UploadZone";
import FileActions from "@/app/components/FileActions";
import YouTubePublishButton from "@/app/components/YouTubePublishButton";
import ThumbnailManager from "@/app/components/ThumbnailManager";
import { auth } from "@clerk/nextjs/server";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileVideo, 
  Download, 
  Info,
  Image as ImageIcon
} from "lucide-react";

const YoutubeIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default async function ProjectDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ yt_connected?: string, yt_error?: string }> }) {
  const { id } = await params;
  const { yt_connected, yt_error } = await searchParams;
  const user = await syncUser();
  if (!user) return null;

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
  });

  if (!project) notFound();

  const files = await db.select()
    .from(projectFiles)
    .where(eq(projectFiles.projectId, project.id))
    .orderBy(desc(projectFiles.createdAt));

  const approvedFiles = files.filter(f => f.status === "approved");

  return (
    <div className="space-y-16 pb-20">
      {yt_connected && (
        <div className="p-4 rounded-2xl bg-black text-white text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          YouTube channel connected successfully. Protocol bridge complete.
        </div>
      )}
      {yt_error && (
        <div className="p-4 rounded-2xl bg-red-500 text-white text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-4 h-4" />
          Protocol Error: {yt_error}
        </div>
      )}

      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 font-mono">
            <span className="px-2 py-0.5 rounded-md bg-black/5 border border-black/5">Project</span>
            <span className="w-1 h-1 rounded-full bg-black/10" />
            <span>{project.visibility}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-black truncate max-w-4xl">
            {project.title}
          </h1>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <div className="px-5 py-2.5 rounded-full bg-black/[0.03] border border-black/[0.05] text-[10px] font-bold uppercase tracking-widest text-black/60">
             {project.status}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: File Log */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex items-center justify-between border-b border-black/[0.03] pb-6">
            <h2 className="text-2xl font-serif font-bold text-black">Revision History</h2>
            <span className="text-[10px] font-mono font-bold text-black/20 uppercase tracking-[0.2em]">{files.length} Versions</span>
          </div>

          <div className="space-y-4">
            {files.length === 0 ? (
              <div className="p-20 rounded-[2.5rem] border-2 border-dashed border-black/5 bg-black/[0.01] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-black/[0.02] flex items-center justify-center mb-4">
                  <FileVideo className="w-8 h-8 text-black/10" />
                </div>
                <p className="text-black/30 font-serif text-xl italic">Waiting for first transmission...</p>
                <p className="text-[10px] text-black/10 font-mono font-bold uppercase tracking-[0.2em] mt-2">Initialize upload protocol to begin history</p>
              </div>
            ) : (
              files.map(file => (
                <FileRow key={file.id} file={file} />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Sidebar Controls */}
        <div className="lg:col-span-4 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <h3 className="font-serif text-xl font-bold">Secure Upload</h3>
            </div>
            <div className="bg-white border border-black/[0.03] rounded-[2rem] p-2 shadow-sm">
              <UploadZone projectId={project.id} uploaderId={user.id} />
            </div>
            <div className="flex items-center justify-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest text-black/20">
               <Info className="w-3 h-3" />
               E2E Encryption • Direct R2 Tunnel
            </div>
          </section>

          <section className="bg-white border border-black/[0.03] rounded-[2.5rem] p-10 shadow-sm space-y-8">
            <h3 className="font-serif text-2xl font-bold text-black">Metadata</h3>
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] text-black/30 uppercase font-mono font-bold tracking-widest">Visibility</p>
                <p className="font-serif text-lg text-black">{project.visibility || 'Public'}</p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] text-black/30 uppercase font-mono font-bold tracking-widest">Indexing Tags</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.split(',').map((tag: string) => (
                    <span key={tag} className="text-[10px] font-bold font-mono bg-black/[0.03] text-black/60 px-3 py-1 rounded-full border border-black/[0.05]">{tag.trim()}</span>
                  )) || <span className="text-sm font-serif italic text-black/20">No tags configured</span>}
                </div>
              </div>
            </div>
          </section>

          {/* YouTube Publisher Component */}
          {user.role === "creator" && (
            <section className="bg-white border border-black/[0.03] rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <h3 className="font-serif text-2xl font-bold text-black flex items-center gap-3">
                <YoutubeIcon className="w-6 h-6 text-red-600" />
                Publishing
              </h3>
              <YouTubePublishButton 
                projectId={project.id}
                youtubeVideoId={project.youtubeVideoId}
                isYouTubeConnected={!!user.youtubeRefreshToken}
                approvedFiles={approvedFiles}
              />
            </section>
          )}

          {/* Thumbnail Management */}
          {user.role === "creator" && (
            <section className="bg-white border border-black/[0.03] rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <h3 className="font-serif text-2xl font-bold text-black flex items-center gap-3">
                <ImageIcon className="w-6 h-6" />
                Thumbnail
              </h3>
              <ThumbnailManager 
                projectId={project.id} 
                youtubeVideoId={project.youtubeVideoId} 
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FileRow({ file }: { file: any }) {
  return (
    <div className="bg-white border border-black/[0.03] rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-500 hover:border-black/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)] group">
      <div className="flex items-center gap-6 overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-black/[0.02] border border-black/[0.05] flex items-center justify-center text-black/10 group-hover:bg-black group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
          {file.type === 'video' ? <FileVideo className="w-6 h-6" /> : '📄'}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-serif text-xl font-bold text-black truncate group-hover:text-black transition-colors">{file.fileName}</h4>
            <span className="text-[10px] font-bold font-mono bg-black/[0.03] text-black/30 px-2 py-0.5 rounded-md border border-black/[0.05] uppercase tracking-widest">v{file.version}</span>
          </div>
          <p className="text-black/30 text-[10px] font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
            <span className="w-1 h-1 rounded-full bg-black/10" />
            <span className="truncate">SIG: {file.uploaderId.slice(0, 12)}...</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
        <StatusBadge status={file.status} />
        <div className="h-10 w-[1px] bg-black/[0.03] hidden md:block" />
        <div className="flex items-center gap-3">
            <FileActions fileId={file.id} currentStatus={file.status} />
            <button className="w-12 h-12 rounded-2xl bg-black/[0.03] border border-black/[0.05] flex items-center justify-center hover:bg-black hover:text-white transition-all text-black/30">
              <Download className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    approved: 'bg-black text-white border-black',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    pending: 'bg-black/[0.03] text-black/40 border-black/[0.05]',
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] border ${styles[status as keyof typeof styles] || styles.pending}`}>
      {status}
    </span>
  );
}
