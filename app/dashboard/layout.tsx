import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex text-white relative">
      {/* Sidebar - Sleek Glassmorphic Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/dashboard" className="font-serif text-2xl font-bold tracking-tight hover:text-primary transition-colors">
            ClipFlow
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono mt-1">Creator Suite</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <NavLink href="/dashboard" icon="📊">Overview</NavLink>
          <NavLink href="/dashboard/projects" icon="📁">Projects</NavLink>
          <NavLink href="/dashboard/analytics" icon="📈">Analytics</NavLink>
          <NavLink href="/dashboard/users" icon="👥">Team</NavLink>
          <NavLink href="/dashboard/settings" icon="⚙️">Settings</NavLink>
        </nav>

        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="glass p-4 flex items-center justify-between">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/40 uppercase">System</p>
              <p className="text-[11px] font-semibold text-accent leading-tight">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen relative">
        {/* Background Ambient Orbs for Dashboard */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group text-sm font-medium text-white/60 hover:text-white"
    >
      <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">{icon}</span>
      {children}
    </Link>
  );
}