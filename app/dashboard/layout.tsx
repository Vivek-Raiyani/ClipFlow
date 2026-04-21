"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Folder, 
  BarChart, 
  Users, 
  Settings, 
  Menu, 
  X,
  ChevronRight,
  Activity
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[var(--bg-color)] text-[var(--fg-color)] overflow-hidden font-sans selection:bg-primary/30 transition-colors duration-500">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Structural, not just floating */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-3xl flex flex-col transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Header/Logo Section */}
        <div className="h-20 flex items-center justify-between px-8 mb-4">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight leading-none">ClipFlow</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-black/30 mt-1 font-medium italic">Pro Suite</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-full hover:bg-black/5 text-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 overflow-y-auto space-y-1 custom-scrollbar">
          <div className="px-4 py-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/20 mb-4">Workspace</h3>
            <div className="space-y-3">
              <NavLink href="/dashboard" icon={LayoutDashboard} active={pathname === "/dashboard"}>Overview</NavLink>
              <NavLink href="/dashboard/projects" icon={Folder} active={pathname.startsWith("/dashboard/projects")}>Projects</NavLink>
              <NavLink href="/dashboard/analytics" icon={BarChart} active={pathname.startsWith("/dashboard/analytics")}>Analytics</NavLink>
            </div>
          </div>

          <div className="px-4 py-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/20 mb-6">Management</h3>
            <div className="space-y-3">
              <NavLink href="/dashboard/users" icon={Users} active={pathname.startsWith("/dashboard/users")}>Team</NavLink>
              <NavLink href="/dashboard/settings" icon={Settings} active={pathname.startsWith("/dashboard/settings")}>Settings</NavLink>
            </div>
          </div>
        </div>

        {/* Footer/User Section */}
        <div className="p-6">
          <div className="p-1 rounded-2xl bg-black/[0.01] border border-black/5 backdrop-blur-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-0.5 rounded-full ring-1 ring-black/10">
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-full" } }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-black/90">Personal Account</span>
                  <span className="text-[9px] text-black/40 font-mono tracking-tight text-accent/80 font-mono">Status: Active</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-black/20" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header - Sleek top bar */}
        <header className="lg:hidden flex items-center justify-between px-6 h-16 border-b border-[var(--card-border)] bg-[var(--bg-color)]/80 backdrop-blur-md sticky top-0 z-30">
          <Link href="/dashboard" className="font-serif text-lg font-bold tracking-tight">ClipFlow</Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--fg-color)]/60 active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Subtle Ambient Depth */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-black/[0.01] blur-[120px] rounded-full -z-10 opacity-50" />
          
          <div className="max-w-[1600px] mx-auto min-h-full">
            <div className="p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              {children}
            </div>
          </div>
          
          {/* Subtle page footer */}
          <footer className="p-12 mt-auto border-t border-black/5 flex flex-col items-center gap-4">
             <div className="flex items-center gap-6 opacity-30 text-[10px] uppercase tracking-[0.2em] font-medium text-black">
                <span className="hover:text-black transition-colors cursor-pointer">Support</span>
                <span className="hover:text-black transition-colors cursor-pointer">API Docs</span>
                <span className="hover:text-black transition-colors cursor-pointer">Security</span>
             </div>
             <p className="text-[10px] text-black/20 font-mono italic">v2.4.1 // build_stable_0420</p>
          </footer>
        </div>
      </main>

    </div>
  );
}

function NavLink({ href, icon: Icon, children, active }: { href: string; icon: any; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`
        group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ease-out
        ${active 
          ? "bg-black/5 text-black shadow-sm" 
          : "text-black/40 hover:text-black hover:bg-black/[0.03]"}
      `}
    >
      <div className="flex items-center gap-4">
        <Icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${active ? "text-black" : "text-inherit opacity-40 group-hover:opacity-100"}`} />
        <span className="text-[15px] font-medium tracking-tight whitespace-nowrap">{children}</span>
      </div>
      {active && <div className="w-1.5 h-1.5 bg-black rounded-full shadow-sm animate-in fade-in zoom-in duration-300" />}
    </Link>
  );
}
