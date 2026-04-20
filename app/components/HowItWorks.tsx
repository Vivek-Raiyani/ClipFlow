'use client';
import { useEffect, useRef } from 'react';

const steps = [
  {
    num: '01',
    title: 'Editor uploads',
    description: 'Your editor gets a secure upload link. They drag-and-drop the finished video — no account, no credentials needed.',
    accent: 'rgba(168, 85, 247, 0.15)',
    accentBorder: 'rgba(168, 85, 247, 0.2)',
    accentText: '#a855f7',
  },
  {
    num: '02',
    title: 'You review & approve',
    description: 'You get a notification. Open ClipFlow on any device, watch the preview, edit the title and description, then hit Approve.',
    accent: 'rgba(236, 72, 153, 0.12)',
    accentBorder: 'rgba(236, 72, 153, 0.2)',
    accentText: '#ec4899',
  },
  {
    num: '03',
    title: 'We publish to YouTube',
    description: 'ClipFlow\'s servers push the file directly to your channel via the YouTube API. Fast, secure, and zero egress fees.',
    accent: 'rgba(34, 197, 94, 0.1)',
    accentBorder: 'rgba(34, 197, 94, 0.2)',
    accentText: '#22c55e',
  },
];

export default function HowItWorks() {
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
    <section id="how-it-works" ref={ref} style={{
      padding: '120px 24px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <div className="reveal" style={{ marginBottom: '16px' }}>
            <span className="badge">Workflow</span>
          </div>
          <h2 className="reveal reveal-delay-1" style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            Three steps.
            <br />
            <span className="gradient-text">Zero compromise.</span>
          </h2>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2px',
          position: 'relative',
        }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`reveal reveal-delay-${i + 1}`}
              style={{
                padding: '40px 36px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: i === 0 ? '18px 0 0 18px' : i === steps.length - 1 ? '0 18px 18px 0' : '0',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle glow */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${step.accentText}40, transparent)`,
              }} />

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: step.accent,
                border: `1px solid ${step.accentBorder}`,
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: step.accentText,
                marginBottom: '20px',
                letterSpacing: '0.05em',
              }}>
                {step.num}
              </div>

              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginBottom: '12px',
                color: 'var(--text-primary)',
              }}>{step.title}</h3>

              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
