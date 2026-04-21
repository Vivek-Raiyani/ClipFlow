"use client";

import { useState } from "react";
import { UserPlus, X, Loader2, Mail } from "lucide-react";

export function InviteNodeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to invite member");

      setStatus("success");
      setMessage("Invitation dispatched successfully.");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        setEmail("");
        // Optionally trigger a router.refresh() here to show updated pending list
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 bg-white text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center gap-3 group"
      >
        <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        Invite Node
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-card-bg border border-card-border p-8 rounded-3xl w-full max-w-md shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif italic text-fg-color">Establish Connection</h2>
              <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                Deploy an automated invitation to a new protocol node.
              </p>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Target Email Vector
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-fg-color transition-colors"
                  required
                />
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-xs font-mono border ${status === 'success' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "loading" || status === "success"}
                className="w-full py-3 bg-fg-color text-bg-color rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Dispatch Payload'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
