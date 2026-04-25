"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

export function Hero() {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center pt-12 pb-20 px-8 text-center relative overflow-hidden">
      <div className="inline-flex items-center gap-[7px] px-[13px] py-[5px] rounded-full bg-[var(--border-subtle)] border border-[var(--border-strong)] font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--text-secondary)] mb-7 animate-in fade-in slide-in-from-bottom-4">
        <span className="w-[5px] h-[5px] rounded-full bg-purple-500"></span>
        For paranoid creators
      </div>
      <h1 className="font-serif italic text-[clamp(44px,7vw,82px)] font-normal tracking-[-0.025em] leading-[1.04] max-w-[800px] mb-6 text-[var(--text-primary)] animate-in fade-in slide-in-from-bottom-8 delay-200">
        Your Channel's<br />
        <span className="text-[var(--text-muted)]">Security Layer.</span>
      </h1>
      <p className="text-[clamp(15px,2vw,18px)] text-[var(--text-secondary)] max-w-[500px] leading-[1.68] mb-9 animate-in fade-in slide-in-from-bottom-12 delay-300">
        Editors upload videos here. You approve them. We push to YouTube via API.
        <strong className="text-[var(--text-primary)] font-medium"> No passwords shared. No 2 GB downloads.</strong>
      </p>
      <div className="flex gap-3 flex-wrap justify-center mb-16 animate-in fade-in slide-in-from-bottom-16 delay-500">
        <Button variant="primary" className="!px-[30px] !py-[13px] !rounded-full !text-[13px] !font-medium hover:scale-[1.02]">Start Interactive Demo</Button>
        <Button variant="ghost" className="!px-[28px] !py-[12px] !rounded-full !text-[13px]">Join Waitlist</Button>
      </div>

      {/* Mock app window */}
      <div className="w-full max-w-[780px] rounded-[20px] overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-[0_24px_80px_rgba(0,0,0,0.05)] animate-in fade-in zoom-in-95 delay-700">
        <div className="h-10 bg-[var(--bg-elevated)] border-b border-[var(--border-strong)] flex items-center justify-between px-[14px]">
          <div className="flex gap-[5px]">
            <div className="w-[9px] h-[9px] rounded-full" style={{ background: "rgba(255,95,86,0.6)" }}></div>
            <div className="w-[9px] h-[9px] rounded-full" style={{ background: "rgba(255,189,46,0.6)" }}></div>
            <div className="w-[9px] h-[9px] rounded-full" style={{ background: "rgba(39,201,63,0.6)" }}></div>
          </div>
          <div className="flex items-center gap-[5px] bg-black/5 border border-[var(--border-strong)] rounded-[5px] px-[10px] py-[3px] font-mono text-[10px] text-[var(--text-muted)]">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            clipflow.app/dashboard
          </div>
          <div style={{ width: "40px" }}></div>
        </div>
        <div className="flex h-[300px] text-left">
          <div className="w-[180px] bg-[var(--bg-elevated)] border-r border-[var(--border-strong)] py-5 px-[14px] shrink-0">
            <div className="flex items-center gap-[9px] mb-5">
              <div className="w-[30px] h-[30px] rounded-full bg-[var(--primary)] shrink-0"></div>
              <div>
                <div className="text-[11px] font-semibold text-[var(--text-primary)]">Main Channel</div>
                <div className="font-mono text-[9px] text-[var(--text-muted)] mt-[1px]">2.1M Subs</div>
              </div>
            </div>
            <div className="flex items-center justify-between px-[10px] py-[9px] rounded-[10px] text-[11px] mb-[2px] bg-black/5 text-[var(--text-primary)] font-medium">Pending Review <span className="bg-[var(--primary)] text-white text-[8px] font-bold px-[5px] py-[1px] rounded-[4px]">1</span></div>
            <div className="flex items-center justify-between px-[10px] py-[9px] rounded-[10px] text-[11px] mb-[2px] text-[var(--text-secondary)]">Published</div>
            <div className="flex items-center justify-between px-[10px] py-[9px] rounded-[10px] text-[11px] mb-[2px] text-[var(--text-secondary)]">Editors</div>
          </div>
          <div className="flex-1 p-5 overflow-hidden">
            <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-[3px]">Pending Uploads</div>
            <div className="text-[10px] text-[var(--text-secondary)] mb-4">Files uploaded by <strong className="text-[var(--text-primary)]">@Editor_Mike</strong> waiting for approval.</div>
            <div className="bg-[var(--bg-deep)] border border-[var(--border-strong)] rounded-[11px] p-[14px] flex gap-[13px] items-center">
              <div className="w-[96px] h-[54px] rounded-[7px] bg-gradient-to-br from-[#ddd8d0] to-[#c8c3ba] shrink-0 relative flex items-center justify-center">
                <div className="w-[18px] h-[18px] rounded-full bg-white/80 flex items-center justify-center">
                  <svg width="7" height="8" viewBox="0 0 10 12" fill="#0a0a0a"><polygon points="0,0 10,6 0,12" /></svg>
                </div>
                <div className="absolute bottom-1 right-1 font-mono text-[8px] text-white/65">10:24</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex gap-[7px] items-center mb-[5px]">
                  <span className="font-mono text-[8px] font-bold bg-[#b45309]/10 border border-[#b45309]/20 text-[#b45309] px-[6px] py-[2px] rounded-[4px] tracking-[0.12em]">NEEDS REVIEW</span>
                  <span className="font-mono text-[9px] text-[var(--text-muted)]">Uploaded 2h ago</span>
                </div>
                <div className="text-[11px] font-semibold text-[var(--text-primary)] mb-[3px] truncate">"I built a SaaS in 24 hours" — Final_v3.mp4</div>
                <div className="font-mono text-[9px] text-[var(--text-muted)]">2.4 GB · Ready to push to YouTube</div>
              </div>
              <button className="px-[14px] py-[7px] bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-full text-[11px] font-medium text-[var(--text-primary)] shrink-0 whitespace-nowrap hover:bg-black/5 transition-colors">Review & Push</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
