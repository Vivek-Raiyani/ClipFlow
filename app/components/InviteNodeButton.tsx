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
      setMessage("Invitation sent successfully.");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        setEmail("");
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
        className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/5 flex items-center gap-3 group"
      >
        <UserPlus className="w-4 h-4" />
        Invite Editor
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-md">
          <div className="bg-white border border-black/[0.05] p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl space-y-8 relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-black/[0.03] text-black/20 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-3">
              <h2 className="text-3xl font-serif font-bold text-black">Add Editor</h2>
              <p className="text-[10px] font-mono text-black/40 uppercase tracking-[0.2em] font-bold">
                Send a secure invitation to join your network.
              </p>
            </div>

            <form onSubmit={handleInvite} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@example.com"
                  className="w-full bg-black/[0.02] border border-black/[0.05] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-black/20 text-black transition-colors"
                  required
                />
              </div>

              {message && (
                <div className={`p-5 rounded-2xl text-xs font-bold border ${status === 'success' ? 'bg-black text-white border-black' : 'bg-red-50/5 border-red-500/10 text-red-500'}`}>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "loading" || status === "success"}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Invitation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
