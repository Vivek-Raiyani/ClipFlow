import { syncUser } from "@/lib/user-sync";
import { db } from "@/lib/db";
import { projects, projectFiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { CheckCircle2, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";

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

export default async function PublishedPage() {
  const user = await syncUser();
  if (!user) return null;

  const publishedFiles = await db
    .select()
    .from(projectFiles)
    .innerJoin(projects, eq(projectFiles.projectId, projects.id))
    .where(eq(projectFiles.status, "approved"))
    .orderBy(desc(projectFiles.createdAt));

  return (
    <div className="max-w-full space-y-24">
      <header className="flex flex-col xl:flex-row justify-between items-start gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.3em] text-black/40 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            Deployment History
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-black">
            Published
          </h1>
          <p className="text-xl text-black/40 max-w-2xl leading-relaxed">
            A comprehensive record of all assets successfully pushed to your YouTube channels. 
            Track performance and metadata from this central registry.
          </p>
        </div>
      </header>

      <div className="space-y-12">
        <div className="flex items-center justify-between px-10 text-[11px] font-bold uppercase tracking-[0.3em] text-black/20 font-mono">
            <span>Archive Registry</span>
            <span>Total Assets: {publishedFiles.length}</span>
        </div>

        <div className="bg-white border border-black/[0.03] rounded-[3rem] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/[0.03] bg-black/[0.01]">
                <th className="px-12 py-8 text-[11px] font-mono font-bold text-black/30 uppercase tracking-[0.3em]">Asset</th>
                <th className="px-12 py-8 text-[11px] font-mono font-bold text-black/30 uppercase tracking-[0.3em]">Destination</th>
                <th className="px-12 py-8 text-[11px] font-mono font-bold text-black/30 uppercase tracking-[0.3em]">Deployment Date</th>
                <th className="px-12 py-8 text-[11px] font-mono font-bold text-black/30 uppercase tracking-[0.3em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {publishedFiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-12 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-black/[0.02] flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-black/10" />
                      </div>
                      <p className="font-serif text-3xl text-black/20 italic">No published assets found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                publishedFiles.map((file) => (
                  <tr key={file.project_files.id} className="group hover:bg-black/[0.01] transition-all">
                    <td className="px-12 py-12">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-2xl bg-black/[0.02] border border-black/[0.05] flex items-center justify-center text-black/10 group-hover:bg-black group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                          <YoutubeIcon className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-serif text-2xl text-black font-bold group-hover:text-black transition-colors">
                            {file.project_files.fileName}
                          </p>
                          <p className="text-[11px] font-mono text-black/30 uppercase tracking-[0.2em] italic font-bold">
                            Project: {file.projects.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-12">
                      <div className="flex items-center gap-3">
                          <YoutubeIcon className="w-4 h-4 text-red-500" />
                          <span className="text-xs font-bold font-mono text-black/60 uppercase tracking-widest">YouTube Channel</span>
                      </div>
                    </td>
                    <td className="px-12 py-12">
                      <div className="flex items-center gap-3 text-black/40 font-bold font-mono text-xs uppercase tracking-widest">
                        <Calendar className="w-4 h-4 opacity-30" />
                        {new Date(file.project_files.createdAt!).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-12 py-12 text-right">
                      <Link 
                        href={`https://youtube.com/watch?v=${file.projects.youtubeVideoId}`} 
                        target="_blank"
                        className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/5"
                      >
                        View Live <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
