import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  tagText: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, tagText, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-[20px] p-[30px] hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div className="w-[42px] h-[42px] rounded-[12px] bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-primary)]">
          {icon}
        </div>
        <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.15em]">{tagText}</span>
      </div>
      <div className="font-serif text-[18px] font-normal text-[var(--text-primary)] mb-2">{title}</div>
      <div className="text-[13px] text-[var(--text-secondary)] leading-[1.65]">{description}</div>
    </div>
  );
}
