'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.3s ease, border-color 0.3s ease',
      background: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.5), rgba(236,72,153,0.4))',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>ClipFlow</span>
        </Link>

        {/* Center Links */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[
            { label: 'Features', href: '#features' },
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Pricing', href: '#pricing' },
          ].map(link => (
            <a key={link.label} href={link.href} style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '9999px',
              transition: 'color 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}>
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/dashboard" style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            padding: '7px 14px',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}>
            Dashboard
          </Link>
          <Link href="/sign-up" className="btn btn-primary" style={{ fontSize: '13px', padding: '7px 16px' }}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
