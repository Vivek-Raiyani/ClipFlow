'use client';

import { Play } from 'lucide-react';

export type BrandName = 
  | 'cloudways' 
  | 'dropbox' 
  | 'gmail' 
  | 'googlecloudstorage' 
  | 'googledrive' 
  | 'instagram' 
  | 'soundcloud' 
  | 'x' 
  | 'youtube';

export interface BrandIconProps {
  name?: BrandName;
  size?: number;
  className?: string;
  color?: string;
  /**
   * If true, the icon will use the current text color (currentColor) or the color prop.
   * This works by using CSS masks.
   */
  monochrome?: boolean;
}

/**
 * BrandIcon component for rendering brand SVGs from /public/icons.
 * Supports monochrome mode to match your Apple-inspired minimalist aesthetic.
 */
export function BrandIcon({ 
  name, 
  size = 20, 
  className = '', 
  color,
  monochrome = true 
}: BrandIconProps) {
  // If no name is provided, render the ClipFlow default logo (a Play icon)
  if (!name) {
    return <Play size={size} className={className} style={{ color: color || 'inherit' }} fill={color || 'currentColor'} strokeWidth={1.5} />;
  }

  const iconPath = `/icons/${name}.svg`;

  if (monochrome) {
    return (
      <div
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color || 'currentColor',
          WebkitMaskImage: `url(${iconPath})`,
          maskImage: `url(${iconPath})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          display: 'inline-block',
          verticalAlign: 'middle'
        }}
        aria-label={name}
      />
    );
  }

  return (
    <img
      src={iconPath}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{ 
        display: 'inline-block', 
        verticalAlign: 'middle',
        objectFit: 'contain'
      }}
    />
  );
}

export default BrandIcon;
