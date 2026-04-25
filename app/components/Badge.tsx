import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'black' | 'green' | 'amber' | 'red';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ variant = 'default', dot = false, children, className = '', style }: BadgeProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'black': return 'badge-black';
      case 'green': return 'badge-green';
      case 'amber': return 'badge-amber';
      case 'red': return 'badge-red';
      default: return '';
    }
  };

  return (
    <span className={`ui-badge ${getVariantClass()} ${className}`} style={style}>
      {dot && <span className="badge-dot" style={variant === 'default' ? { background: 'var(--ui-fg)' } : variant === 'black' ? { background: 'var(--ui-bg)' } : {}} />}
      {children}
    </span>
  );
}
