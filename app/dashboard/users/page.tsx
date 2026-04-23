import { syncUser } from "@/lib/user-sync";
import Link from "next/link";
import { 
  Users, 
  Shield, 
  ChevronRight, 
  Circle,
  Network,
  MoreVertical,
  Mail
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
      <header className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 font-mono">
            <Network className="w-3 h-3" />
            Collaboration Network
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-black">
            Editors
          </h1>
          <p className="text-lg text-black/40 max-w-lg leading-relaxed">
            Manage your high-performance collaboration nodes and secure access permissions.
          </p>
        </div>
        
        <InviteNodeButton />
      </header>

      <section className="space-y-8">
        <div className="flex items-center justify-between px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-black/20 font-mono">
            <span>Editor Registry</span>
            <span className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Auth: Admin
            </span>
        </div>
        
        <div className="bg-white border border-black/[0.03] rounded-[2.5rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/[0.03] bg-black/[0.01]">
                <th className="px-8 py-6 text-[10px] font-mono text-black/30 uppercase tracking-widest">Collaborator</th>
                <th className="px-8 py-6 text-[10px] font-mono text-black/30 uppercase tracking-widest">Access Level</th>
                <th className="px-8 py-6 text-[10px] font-mono text-black/30 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-mono text-black/30 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {allTeam.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-black/[0.02] flex items-center justify-center">
                        <Users className="w-8 h-8 text-black/10" />
                      </div>
                      <p className="font-serif text-xl text-black/20 italic">Network Registry Empty</p>
                      <p className="text-xs text-black/10 font-mono tracking-widest uppercase">Awaiting node invitation</p>
                    </div>
                  </td>
                </tr>
              )}
              {allTeam.map((member) => (
                <tr key={member.id} className="group hover:bg-black/[0.01] transition-all relative">
                  <td className="px-8 py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-black/[0.02] border border-black/[0.05] flex items-center justify-center font-serif text-2xl text-black/10 group-hover:bg-black group-hover:text-white transition-all duration-500 transform group-hover:scale-105">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <p className="font-serif text-xl text-black font-bold group-hover:text-black transition-colors">{member.name}</p>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-black/30 uppercase tracking-widest">
                          <Mail className="w-2.5 h-2.5" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-3 rounded-full bg-black/10" />
                        <span className="text-[11px] font-bold font-mono text-black/60 uppercase tracking-widest">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                    <div className="flex items-center gap-3">
                      <Circle className={`w-1.5 h-1.5 fill-current ${member.status === 'Active' ? 'text-black' : 'text-black/10'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${member.status === 'Active' ? 'text-black' : 'text-black/20'}`}>
                        {member.status === 'Active' ? 'Active' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-10 text-right">
                    <button className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/[0.03] border border-black/[0.05] text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black hover:bg-black/5 transition-all group/btn">
                      {member.status === 'Active' ? 'Manage' : 'Resend'} <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
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