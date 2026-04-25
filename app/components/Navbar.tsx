import Link from 'next/link';
import { Button } from './Button';

export function Navbar() {
  return (
    <nav className="sticky top-6 z-50 flex items-center justify-between px-10 h-[60px] bg-[var(--glass-bg)] backdrop-blur-[20px] border border-[var(--border-subtle)] rounded-full max-w-5xl mx-auto mt-6 mb-8">
      <Link className="flex items-center gap-[9px] no-underline" href="/">
        <div className="w-[30px] h-[30px] rounded-[9px] bg-[var(--primary)] text-[var(--bg-surface)] flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <span className="text-[14px] font-medium tracking-[-0.02em]">ClipFlow</span>
      </Link>
      <div className="hidden md:flex gap-1">
        <Link className="px-[13px] py-[6px] rounded-full text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all" href="#">Features</Link>
        <Link className="px-[13px] py-[6px] rounded-full text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all" href="#">How it works</Link>
        <Link className="px-[13px] py-[6px] rounded-full text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all" href="#">Pricing</Link>
      </div>
      <div className="flex items-center gap-2">
        <Link className="px-4 py-[7px] border border-[var(--border-strong)] rounded-full text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] transition-all" href="/dashboard">Dashboard</Link>
        <Button variant="primary" className="px-4 py-[7px] !rounded-full !text-[12px] !font-medium">Get Started</Button>
      </div>
    </nav>
  );
}
