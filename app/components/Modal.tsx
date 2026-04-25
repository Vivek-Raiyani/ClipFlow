import React from 'react';
import { X, Play } from 'lucide-react';
import { Button } from './Button';

interface ModalShellProps {
  title: string;
  subtitle?: string;
  pillText?: string;
  pillIcon?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}

export function ModalShell({ title, subtitle, pillText, pillIcon, onClose, children, maxWidth = 440 }: ModalShellProps) {
  return (
    <div className="modal-shell" style={{ maxWidth: `${maxWidth}px`, margin: '0 auto' }}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        <X size={14} strokeWidth={2} />
      </button>
      
      {pillText && (
        <div className="modal-pill">
          {pillIcon}
          <span>{pillText}</span>
        </div>
      )}
      
      <div className="modal-title">{title}</div>
      {subtitle && <div className="modal-sub">{subtitle}</div>}
      
      {children}
    </div>
  );
}
