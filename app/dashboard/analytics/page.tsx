"use client";

import React from "react";
import { 
  LineChart, 
  BarChart, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  Zap, 
  Globe2, 
  ShieldCheck,
  Signal
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 w-fit">
            <Activity className="w-3 h-3 text-secondary" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono italic">Intelligence Node 4</span>
          </div>
          <h1 className="text-6xl font-serif font-medium tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
            Metrics
          </h1>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            Real-time telemetry and audience behavior analysis for your global content footprints.
          </p>
        </div>
        
        <div className="flex items-center gap-6 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
           <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] font-bold">Signal Strength</span>
              <div className="flex items-center gap-2">
                 <Signal className="w-4 h-4 text-secondary animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Optimal</span>
              </div>
           </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricTile label="Impressions" value="0.0k" icon={Globe2} color="white" />
        <MetricTile label="Throughput" value="0%" icon={Zap} color="secondary" />
        <MetricTile label="Retention" value="00:00" icon={Activity} color="white" />
        <MetricTile label="Conversion" value="+0" icon={TrendingUp} color="accent" />
      </section>

      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
           <div className="space-y-2">
              <h2 className="text-2xl font-serif italic text-white/90">Temporal Analysis</h2>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-[0.2em]">Network data streams</p>
           </div>
           <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-white/20">
              <span className="hover:text-white cursor-pointer transition-colors">24H</span>
              <span className="text-white">7D</span>
              <span className="hover:text-white cursor-pointer transition-colors">30D</span>
              <span className="hover:text-white cursor-pointer transition-colors">ALL</span>
           </div>
        </div>
        
        <div className="glass p-24 text-center border-dashed border border-white/10 group hover:border-secondary/30 transition-all duration-700">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto text-white/10 group-hover:text-secondary group-hover:scale-110 transition-all duration-500">
               <LineChart className="w-8 h-8" />
            </div>
            <div className="space-y-2">
               <p className="text-white/30 font-serif italic text-2xl">Awaiting initial transmission.</p>
               <p className="text-[10px] text-white/10 font-mono uppercase tracking-[0.3em] leading-relaxed">
                  Data streams will initialize once your first asset deployment is finalized.
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricTile({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="group glass p-8 space-y-8 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-1">
       <div className="flex justify-between items-start">
          <div className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center ${color === 'secondary' ? 'text-secondary' : color === 'accent' ? 'text-accent' : 'text-white/40'}`}>
             <Icon className="w-5 h-5" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-white/5 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
       </div>
       <div className="space-y-2">
          <p className="text-4xl font-mono tracking-tighter font-medium text-white">{value}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{label}</p>
       </div>
    </div>
  );
}