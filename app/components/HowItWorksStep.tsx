import React from 'react';

interface HowItWorksStepProps {
  stepNumber: number;
  title: string;
  description: string;
}

export function HowItWorksStep({ stepNumber, title, description }: HowItWorksStepProps) {
  const formattedNumber = stepNumber.toString().padStart(2, '0');
  
  const colors = [
    'from-transparent via-purple-500/50 to-transparent bg-purple-500/10 border-purple-500/20 text-purple-500',
    'from-transparent via-pink-500/40 to-transparent bg-pink-500/10 border-pink-500/20 text-pink-500',
    'from-transparent via-green-500/40 to-transparent bg-green-500/10 border-green-500/20 text-green-500'
  ];
  
  const colorIndex = (stepNumber - 1) % 3;
  const colorClasses = colors[colorIndex].split(' ');
  const gradientClass = colorClasses.slice(0, 3).join(' ');
  const numClasses = colorClasses.slice(3).join(' ');

  return (
    <div className="p-9 bg-[var(--bg-surface)] relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center font-mono text-[11px] font-bold tracking-[0.05em] mb-4 border ${numClasses}`}>{formattedNumber}</div>
      <div className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] mb-[9px]">{title}</div>
      <div className="text-[13px] text-[var(--text-secondary)] leading-[1.72]">{description}</div>
    </div>
  );
}
