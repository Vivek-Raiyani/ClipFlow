'use client';
import { useEffect, useRef } from 'react';

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    tag: '01',
    title: 'Decoupled Access',
    description: 'Editors upload to your secure firewall. You approve from yours. No more sharing YouTube passwords with contractors.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    tag: '02',
    title: 'Zero Egress Fees',
    description: 'Built on Cloudflare R2. Move massive 4K files to YouTube server-to-server without paying a cent in bandwidth.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    tag: '03',
    title: 'Mobile Approval',
    description: 'Get notified when a video is ready. Preview and hit Publish from your phone, anywhere in the world.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    tag: '04',
    title: 'One-Click Publish',
    description: 'Review metadata, set visibility, and push to YouTube with a single tap. The 2 GB file never touches your device.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    tag: '05',
    title: 'Multi-Editor Teams',
    description: 'Invite unlimited editors with scoped upload-only access. Revoke in one click, no password resets required.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    tag: '06',
    title: 'Full Audit Trail',
    description: 'Every upload, approval, and publish is timestamped and logged. Know exactly who did what and when.',
  },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={ref} style={{
      padding: '120px 24px',
      position: 'relative',
    }}>
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <div className="reveal" style={{ marginBottom: '16px' }}>
            <span className="badge">Features</span>
          </div>
          <h2 className="reveal reveal-delay-1" style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            Engineered for{' '}
            <span className="gradient-text-accent">scale</span>
          </h2>
          <p className="reveal reveal-delay-2 text-secondary" style={{
            fontSize: '17px',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            The technical stack that powers the next generation of content production pipelines.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {features.map((f, i) => (
            <div
              key={f.tag}
              className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '18px',
                padding: '28px',
                transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.13)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(168,85,247,0.1)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Icon + Tag row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a855f7',
                }}>
                  {f.icon}
                </div>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                }}>{f.tag}</span>
              </div>

              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginBottom: '10px',
                color: 'var(--text-primary)',
              }}>{f.title}</h3>

              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
              }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
