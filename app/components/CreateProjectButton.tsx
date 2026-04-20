"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({ title }),
      });

      if (res.ok) {
        setTitle("");
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create project", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-white text-black rounded-full font-semibold text-sm hover:scale-105 transition-all active:scale-95 flex items-center gap-2 group"
      >
        <span className="text-lg group-hover:rotate-90 transition-transform">+</span>
        New Project
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass max-w-md w-full p-10 animate-fade-in relative overflow-hidden">
            {/* Ambient Background Ornament */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10">
              <header className="mb-8 text-center">
                <p className="text-[10px] uppercase font-mono tracking-[0.3em] text-primary mb-2">Protocol Initialization</p>
                <h2 className="font-serif text-3xl font-medium tracking-tight">Create Project</h2>
              </header>

              <form onSubmit={handleCreate} className="space-y-8">
                <div>
                  <label className="block text-white/30 text-[10px] uppercase tracking-widest font-mono mb-3">Project Identifier</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cinematic Vlog #42" 
                    className="w-full bg-white/[0.03] border border-white/5 p-4 focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all font-serif text-lg text-white placeholder:text-white/10"
                    required
                    autoFocus
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    type="submit" 
                    disabled={loading || !title}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-primary/80 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    {loading ? 'Transmitting...' : 'Initialize Pipeline'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 text-[10px] font-mono uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                  >
                    Abort Terminal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
