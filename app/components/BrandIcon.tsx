'use client';

import React from 'react';

type BrandName = 
  | 'cloudways' 
  | 'dropbox' 
  | 'gmail' 
  | 'googlecloudstorage' 
  | 'googledrive' 
  | 'instagram' 
  | 'soundcloud' 
  | 'x' 
  | 'youtube';

interface BrandIconProps {
  name: BrandName;
  size?: number;
  className?: string;
  /**
   * If true, the icon will use the current text color (currentColor).
   * This works by using CSS masks.
   */
  monochrome?: boolean;
}

/**
 * BrandIcon component for rendering brand SVGs from /public/icons.
 * Supports monochrome mode to match your Apple-inspired minimalist aesthetic.
 */
export default function BrandIcon({ 
  name, 
  size = 20, 
  className = '', 
  monochrome = true 
}: BrandIconProps) {
  const iconPath = `/icons/${name}.svg`;

  if (monochrome) {
    return (
      <div
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: 'currentColor',
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
