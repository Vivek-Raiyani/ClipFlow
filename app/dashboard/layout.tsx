"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  Users, 
  Settings, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
  Circle
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#FAF9F6] text-[#111111] overflow-hidden font-sans selection:bg-black/10 transition-colors duration-500">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-84 border-r border-black/5 bg-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Project Switcher Section */}
        <div className="p-8">
          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/[0.02] cursor-pointer transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-serif font-bold overflow-hidden shadow-sm">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-lg">
                  M
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base font-bold tracking-tight text-black flex items-center gap-1">
                  Main Channel
                  <ChevronDown className="w-4 h-4 text-black/30 group-hover:text-black/60 transition-colors" />
                </span>
                <span className="text-xs text-black/40 font-medium">2.1M Subs</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-full hover:bg-black/5 text-black/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-6 overflow-y-auto space-y-2 custom-scrollbar">
          <div className="space-y-1.5">
            <NavLink href="/dashboard" icon={LayoutDashboard} active={pathname === "/dashboard"}>
              Dashboard
            </NavLink>
            <NavLink 
              href="/dashboard/review" 
              icon={Clock} 
              active={pathname.startsWith("/dashboard/review")}
              badge="1"
            >
              Pending Review
            </NavLink>
            <NavLink href="/dashboard/published" icon={CheckCircle2} active={pathname.startsWith("/dashboard/published")}>
              Published
            </NavLink>
            <NavLink href="/dashboard/users" icon={Users} active={pathname.startsWith("/dashboard/users")}>
              Editors
            </NavLink>
          </div>

          <div className="pt-10 px-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/30 mb-6 font-mono">Workspace</h3>
            <div className="space-y-1.5 -mx-4">
               <NavLink href="/dashboard/projects" icon={Circle} active={pathname.startsWith("/dashboard/projects")}>
                 All Projects
               </NavLink>
            </div>
          </div>
        </div>

        {/* Footer/Settings Section */}
        <div className="p-8 space-y-6">
          <NavLink href="/dashboard/settings" icon={Settings} active={pathname.startsWith("/dashboard/settings")}>
            Settings
          </NavLink>
          
          <div className="pt-6 border-t border-black/5">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/[0.02] border border-black/[0.03]">
              <div className="flex items-center gap-4">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 rounded-full" } }} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-black/80">Vivek Raiyani</span>
                  <span className="text-[10px] text-black/40 font-mono tracking-tight uppercase">Admin</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-black/20" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-8 h-20 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <span className="font-serif text-xl font-bold tracking-tight">ClipFlow</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-black/5 text-black/60"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-[1800px] mx-auto min-h-full">
            <div className="p-12 md:p-24 lg:p-36">
              {children}
            </div>
          </div>
          
          <footer className="px-20 py-16 mt-auto border-t border-black/[0.03] flex justify-between items-center">
             <p className="text-[10px] text-black/20 font-mono tracking-widest uppercase">ClipFlow v2.0</p>
             <div className="flex items-center gap-8 opacity-20 text-[10px] uppercase tracking-[0.2em] font-bold">
                <span className="hover:opacity-100 transition-opacity cursor-pointer">Support</span>
                <span className="hover:opacity-100 transition-opacity cursor-pointer">Security</span>
             </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function NavLink({ 
  href, 
  icon: Icon, 
  children, 
  active, 
  badge 
}: { 
  href: string; 
  icon: any; 
  children: React.ReactNode; 
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`
        group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ease-out
        ${active 
          ? "bg-black/[0.05] text-black" 
          : "text-black/40 hover:text-black hover:bg-black/[0.02]"}
      `}
    >
      <div className="flex items-center gap-4">
        <Icon className={`w-4 h-4 transition-transform duration-500 group-hover:scale-110 ${active ? "text-black" : "text-inherit opacity-40 group-hover:opacity-100"}`} />
        <span className={`text-[14px] tracking-tight whitespace-nowrap font-medium ${active ? "font-bold" : ""}`}>
          {children}
        </span>
      </div>
      {badge ? (
        <div className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold min-w-[1.2rem] flex items-center justify-center animate-in zoom-in duration-500">
          {badge}
        </div>
      ) : active && (
        <div className="w-1 h-1 bg-black rounded-full opacity-20" />
      )}
    </Link>
  );
}
