"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Command, Rocket, Terminal } from "lucide-react";

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
        className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black/90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center gap-3 group"
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
        New Project
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#FAF9F6] border border-black/5 rounded-[2.5rem] max-w-lg w-full p-12 relative overflow-hidden shadow-2xl">
            {/* Ambient Depth Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.02] blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
            
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-black/5 text-black/20 hover:text-black transition-all"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 space-y-12">
              <header className="space-y-4">
                <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-black/[0.03] border border-black/5 w-fit">
                    <Terminal className="w-3 h-3 text-black/40" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 font-mono italic">Protocol Initialization</span>
                </div>
                <h2 className="font-serif text-5xl font-medium tracking-tight text-black italic">
                    Establish Pipeline
                </h2>
                <p className="text-black/40 text-sm leading-relaxed max-w-sm font-sans">
                    Define a high-performance environment for your next creative evolution.
                </p>
              </header>

              <form onSubmit={handleCreate} className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-black/30 text-[9px] uppercase tracking-[0.2em] font-bold font-mono">
                        Pipeline Identifier
                    </label>
                    <span className="text-[9px] font-mono text-black/10 italic">Unique Namespace</span>
                  </div>
                  <div className="relative group">
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. CINEMATIC_VLOG_04" 
                        className="w-full bg-black/[0.02] border border-black/5 rounded-2xl p-6 focus:border-black/10 focus:bg-black/[0.03] outline-none transition-all font-serif text-2xl text-black placeholder:text-black/[0.05]"
                        required
                        autoFocus
                    />
                    <Command className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/5 group-focus-within:text-black/20 transition-colors" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-5">
                  <button 
                    type="submit" 
                    disabled={loading || !title}
                    className="w-full py-6 bg-black text-white rounded-2xl font-bold tracking-[0.25em] uppercase text-[10px] hover:bg-black/90 active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3 shadow-lg shadow-black/5"
                  >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                        </div>
                    ) : (
                        <>
                            <Rocket className="w-4 h-4" />
                            Initialize Core
                        </>
                    )}
                  </button>
                  <p className="text-center text-[9px] font-mono text-black/10 uppercase tracking-[0.2em]">
                    By initializing, you agree to the deployment protocols.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </>
  );
}
