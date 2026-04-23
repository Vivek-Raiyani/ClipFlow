import { syncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import { projects, projectFiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Clock, Play, ShieldAlert, CheckCircle2 } from "lucide-react";
import Image from "next/image";

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

export default async function ReviewPage() {
  const user = await syncUser();
  if (!user) return null;

  const pendingFiles = await db
    .select()
    .from(projectFiles)
    .innerJoin(projects, eq(projectFiles.projectId, projects.id))
    .where(eq(projectFiles.status, "pending"))
    .orderBy(desc(projectFiles.createdAt));

  return (
    <div className="max-w-6xl mx-auto space-y-20">
      <header className="space-y-6 text-center">
        <div className="flex items-center justify-center gap-3 text-[12px] font-bold uppercase tracking-[0.3em] text-black/40 font-mono">
            <Clock className="w-4 h-4" />
            Firewall Protocol
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-black">
          Review Queue
        </h1>
        <p className="text-xl text-black/40 max-w-2xl mx-auto leading-relaxed">
          Files uploaded by your team waiting for your final approval before deployment to production.
        </p>
      </header>

      <div className="space-y-8">
        {pendingFiles.length === 0 ? (
          <div className="p-32 rounded-[3rem] border-2 border-dashed border-black/5 flex flex-col items-center justify-center text-center bg-black/[0.01]">
            <div className="w-20 h-20 rounded-full bg-black/[0.02] flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-black/10" />
            </div>
            <p className="text-black/40 font-bold font-serif text-3xl italic">Inbox is empty</p>
            <p className="text-black/20 text-sm mt-3 font-mono uppercase tracking-widest">Great job! All uploads are currently up to date.</p>
          </div>
        ) : (
          pendingFiles.map((file) => (
            <div 
              key={file.project_files.id} 
              className="group relative bg-white border border-black/[0.03] rounded-[3rem] p-10 transition-all duration-500 hover:border-black/10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.03)]"
            >
              <div className="flex flex-col xl:flex-row items-center gap-12">
                {/* Thumbnail Placeholder */}
                <div className="relative w-full xl:w-96 aspect-video rounded-3xl bg-black/[0.02] overflow-hidden border border-black/[0.05] group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-16 h-16 text-black/5 group-hover:text-black transition-all duration-500" />
                  </div>
                  <div className="absolute bottom-6 right-6 px-3 py-1 rounded-xl bg-black/90 backdrop-blur-md text-white text-[11px] font-mono font-bold tracking-widest">
                    10:24
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Needs Review
                    </div>
                    <span className="text-xs text-black/30 font-bold font-mono uppercase tracking-widest">
                      Uploaded {new Date(file.project_files.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ago
                    </span>
                  </div>

                  <h3 className="text-4xl font-bold text-black tracking-tight group-hover:text-black transition-colors">
                    {file.project_files.fileName}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-black/40 font-bold font-mono uppercase tracking-[0.2em]">
                    <span className="px-3 py-1 rounded-md bg-black/[0.03]">{file.projects.title}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
                    <span>2.4 GB</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
                    <span className="flex items-center gap-2">
                      Ready to push to <YoutubeIcon className="w-4 h-4" /> YouTube
                    </span>
                  </div>
                </div>

                {/* Action */}
                <button className="w-full xl:w-auto px-12 py-6 rounded-3xl bg-black text-white text-xs font-bold uppercase tracking-[0.3em] shadow-2xl shadow-black/10 hover:scale-105 active:scale-95 transition-all duration-500">
                  Review & Push
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
