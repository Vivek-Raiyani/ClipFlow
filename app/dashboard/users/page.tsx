import { syncUser } from "@/lib/user-sync";
import Link from "next/link";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  ChevronRight, 
  Circle,
  Network
} from "lucide-react";
import { InviteNodeButton } from "@/app/components/InviteNodeButton";
import { db } from "@/lib/db";
import { creatorEditorRelationships, users, invitations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function TeamPage() {
  const user = await syncUser();
  if (!user) return null;

  // Fetch active relations
  const relationships = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: creatorEditorRelationships.status,
    })
    .from(creatorEditorRelationships)
    .innerJoin(users, eq(creatorEditorRelationships.editorId, users.id))
    .where(eq(creatorEditorRelationships.creatorId, user.id));

  // Fetch pending invitations
  const pendingInvites = await db
    .select()
    .from(invitations)
    .where(eq(invitations.creatorId, user.id));

  const allTeam = [
    ...relationships.map((r) => ({
      id: r.id,
      name: r.name || "Unknown",
      role: r.role === 'editor' ? 'Editor' : 'Creator',
      status: 'Active', 
      email: r.email,
    })),
    ...pendingInvites.map((i) => ({
      id: i.id,
      name: i.email,
      role: 'Pending Node',
      status: i.status === 'pending' ? 'Pending' : 'Accepted',
      email: i.email,
    })).filter(i => i.status === 'Pending')
  ];

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit">
            <Network className="w-3 h-3 text-accent" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-accent font-mono italic">Neural Network</span>
          </div>
          <h1 className="text-6xl font-serif font-medium tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
            Personnel
          </h1>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            Manage your high-performance collaboration nodes and secure access permissions.
          </p>
        </div>
        
        <InviteNodeButton />
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 font-mono">
            <span>Network Registry</span>
            <span className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Auth: Admin
            </span>
        </div>
        
        <div className="rounded-[2.5rem] bg-white/[0.01] border border-white/5 overflow-hidden backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">Collaborator</th>
                <th className="px-8 py-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">Protocol Level</th>
                <th className="px-8 py-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">Network Status</th>
                <th className="px-8 py-6 text-[10px] font-mono text-white/20 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {allTeam.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-white/40 text-sm font-mono uppercase tracking-widest italic">
                    Network Registry Empty
                  </td>
                </tr>
              )}
              {allTeam.map((member) => (
                <tr key={member.id} className="group hover:bg-white/[0.03] transition-all relative">
                  <td className="px-8 py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-serif text-2xl text-white/10 group-hover:text-accent group-hover:border-accent/20 transition-all duration-500 transform group-hover:scale-105">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <p className="font-serif text-xl md:text-2xl text-white/90 group-hover:text-white transition-colors">{member.name}</p>
                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        <div className="w-1 h-3 rounded-full bg-accent/40" />
                        <span className="text-[11px] font-bold font-mono text-white/70 uppercase tracking-widest">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${member.status === 'Active' ? 'text-accent' : 'text-white/20'}`}>
                        {member.status === 'Active' ? 'Connected' : 'Pending'}
                      </span>
                      <Circle className={`w-1.5 h-1.5 fill-current ${member.status === 'Active' ? 'text-accent animate-pulse shadow-[0_0_8px_rgba(var(--accent),0.5)]' : 'text-white/10'}`} />
                    </div>
                  </td>
                  <td className="px-8 py-10 text-right">
                    <button className="inline-flex items-center gap-3 px-6 py-2 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group/btn">
                      {member.status === 'Active' ? 'Manage' : 'Resend'} <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform text-accent" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}