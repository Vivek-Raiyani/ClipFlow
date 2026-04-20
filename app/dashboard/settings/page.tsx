"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Fingerprint, 
  ShieldCheck, 
  Video, 
  Database,
  Lock,
  ChevronRight,
  Sun,
  Moon,
  Cloud,
  ExternalLink
} from "lucide-react";
import { syncUser } from "@/lib/user-sync";

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // This is a client-side layout for demonstration of theme switching
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // In a real app, this would be a server component, but for the theme demo
  // we'll fetch or pass down the user data. For now, let's mock the refresh logic.
  // The user actually used async syncUser() in the previous version.
  
  return (
    <div className="space-y-16 max-w-5xl mx-auto pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary font-mono italic">Security Protocol 7.1</span>
          </div>
          <h1 className="text-6xl font-serif font-medium tracking-tight bg-gradient-to-b from-fg-color to-fg-color/40 bg-clip-text text-transparent italic">
            Configurations
          </h1>
          <p className="text-muted text-sm max-w-sm leading-relaxed font-sans">
            Tailor your ecosystem and connection parameters for peak performance.
          </p>
        </div>

        {/* Theme Switcher Widget - Very Apple */}
        <div className="flex p-1 bg-card-bg border border-card-border rounded-2xl backdrop-blur-xl">
           <button 
             onClick={() => setTheme('light')}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 ${theme === 'light' ? 'bg-white text-black shadow-lg shadow-black/10' : 'text-muted hover:text-fg-color'}`}
           >
             <Sun className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Studio</span>
           </button>
           <button 
             onClick={() => setTheme('dark')}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'text-muted hover:text-fg-color'}`}
           >
             <Moon className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Midnight</span>
           </button>
        </div>
      </header>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-12">
        
        {/* Account Module */}
        <section className="space-y-6">
          <SectionHeader title="Entity Credentials" subtitle="Identity management and secure identifiers" />
          
          <div className="glass p-8 md:p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <DetailItem icon={User} label="Primary Identity" value="Test User" />
              <DetailItem icon={Mail} label="Access Token Node" value="tu8459171@gmail.com" />
              <DetailItem icon={Fingerprint} label="Creator Namespace" value="4abdef8f-d0b3-446c-9512-29356ddc7823" mono />
              <DetailItem icon={ShieldCheck} label="Account Standing" value="Operational (Pro Tier)" accent="accent" />
            </div>
            
            <div className="pt-8 border-t border-card-border">
                <button className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary hover:tracking-[0.3em] transition-all flex items-center gap-2 group">
                    Rotate Security Keys <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
        </section>

        {/* Integrations Module */}
        <section className="space-y-6">
          <SectionHeader title="Neural Bridges" subtitle="Cloud synchronization and API interconnects" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntegrationCard 
               icon={Video} 
               label="YouTube Core" 
               description="Automated deployment and version sync"
               status="Inactive"
               color="#FF0000"
               connected={false}
            />
            <IntegrationCard 
               icon={Database} 
               label="Cloudflare R2" 
               description="High-performance binary asset storage"
               status="Locked"
               color="#F38020"
               connected={false}
               disabled
            />
          </div>
        </section>

        {/* Global Configuration */}
        <section className="space-y-6">
           <SectionHeader title="Global Protocols" subtitle="System-wide preferences and defaults" />
           <div className="glass overflow-hidden divide-y divide-card-border">
              <ToggleRow title="Auto-Deployment" description="Automatically process and sync finalized project files" defaultChecked />
              <ToggleRow title="Biometric Verification" description="Require secure confirmation before significant pipeline changes" />
              <ToggleRow title="Advanced Telemetry" description="Share anonymized performance data to optimize processing nodes" defaultChecked />
           </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-serif text-fg-color/90 italic">{title}</h2>
      <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em]">{subtitle}</p>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, mono, accent }: { icon: any; label: string; value: string; mono?: boolean; accent?: string }) {
  return (
    <div className="space-y-3 group">
      <div className="flex items-center gap-2">
        <Icon className="w-3 h-3 text-muted" />
        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className={`text-xl font-serif ${mono ? 'font-mono text-sm tracking-tighter' : ''} ${accent === 'accent' ? 'text-accent' : 'text-fg-color'}`}>
        {value}
      </p>
    </div>
  );
}

function IntegrationCard({ icon: Icon, label, description, status, color, connected, disabled }: { icon: any; label: string; description: string; status: string; color: string; connected: boolean; disabled?: boolean }) {
  return (
    <div className={`glass p-8 flex flex-col justify-between gap-8 group transition-all duration-500 hover:-translate-y-1 ${disabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
       <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3" style={{ color: color }}>
             <Icon className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[9px] font-mono text-muted uppercase tracking-widest font-bold">Status</span>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-fg-color">{status}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-accent animate-pulse' : 'bg-white/10'}`} />
             </div>
          </div>
       </div>
       
       <div className="space-y-2">
          <h3 className="text-xl font-serif italic text-fg-color">{label}</h3>
          <p className="text-[10px] text-muted font-mono uppercase tracking-widest leading-relaxed">{description}</p>
       </div>
       
       <button className={`w-full py-3 rounded-xl border font-bold uppercase text-[10px] tracking-[0.2em] transition-all
          ${connected ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-fg-color text-bg-color border-transparent hover:scale-[1.02] active:scale-95 shadow-lg shadow-fg-color/5'}
       `}>
          {connected ? 'Disconnect' : 'Establish Link'}
       </button>
    </div>
  );
}

function ToggleRow({ title, description, defaultChecked }: { title: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-8 group hover:bg-white/[0.01] transition-colors">
       <div className="space-y-1">
          <h4 className="text-lg font-serif text-fg-color/90">{title}</h4>
          <p className="text-[10px] text-muted font-mono uppercase tracking-widest">{description}</p>
       </div>
       <button 
         onClick={() => setChecked(!checked)}
         className={`w-12 h-6 rounded-full transition-all duration-300 relative ${checked ? 'bg-primary' : 'bg-card-border'}`}
       >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`} />
       </button>
    </div>
  );
}
