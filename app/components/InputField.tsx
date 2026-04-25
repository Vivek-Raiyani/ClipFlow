import React from 'react';
import { ChevronRight } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

export function InputField({ label, subLabel, icon, containerStyle, className = '', ...props }: InputFieldProps) {
  return (
    <div className="input-group" style={containerStyle}>
      <div className="input-label">
        {label}
        {subLabel && <span>{subLabel}</span>}
      </div>
      <div style={{ position: 'relative' }}>
        <input className={`input-field ${className}`} {...props} />
        {icon && (
          <div style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
