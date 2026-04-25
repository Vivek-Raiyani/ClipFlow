import React from 'react';
import { Plus } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'success';
  icon?: React.ReactNode;
}

export function Button({ variant = 'primary', icon, children, className = '', ...props }: ButtonProps) {
  const baseClass = `btn-${variant}`;
  
  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {icon && icon}
      {children}
    </button>
  );
}
