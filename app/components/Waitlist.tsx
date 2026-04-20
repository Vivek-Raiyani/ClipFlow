'use client';
import { useState, useRef, useEffect } from 'react';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    await new Promise(r => setTimeout(r, 900));
    setStatus('done');
  };

  return (
    <section id="waitlist" ref={ref} style={{
      padding: '140px 24px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Center glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-narrow" style={{ textAlign: 'center', position: 'relative' }}>
        <div className="reveal" style={{ marginBottom: '16px' }}>
          <span className="badge">Private Beta</span>
        </div>

        <h2 className="reveal reveal-delay-1" style={{
          fontSize: 'clamp(32px, 6vw, 58px)',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: '16px',
        }}>
          Don&apos;t let slow internet
          <br />
          <span className="gradient-text">stop your upload.</span>
        </h2>

        <p className="reveal reveal-delay-2 text-secondary" style={{
          fontSize: '16px',
          lineHeight: 1.7,
          marginBottom: '44px',
          maxWidth: '440px',
          margin: '0 auto 44px',
        }}>
          Currently in private beta with 50 YouTubers.
          Join the list to get early access.
        </p>

        <div className="reveal reveal-delay-3" style={{ maxWidth: '420px', margin: '0 auto' }}>
          {status === 'done' ? (
            <div style={{
              padding: '20px 24px',
              background: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: 'rgba(34,197,94,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                You&apos;re on the list.
              </span>
              <span style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: '#22c55e',
              }}>
                // Request received. You are #142 in queue.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@studio.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                style={{ paddingRight: '120px' }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  position: 'absolute',
                  right: '6px', top: '6px', bottom: '6px',
                  padding: '0 18px',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  opacity: status === 'loading' ? 0.6 : 1,
                }}
              >
                {status === 'loading' ? '...' : 'JOIN'}
              </button>
            </form>
          )}
        </div>

        {/* Social proof */}
        <div className="reveal reveal-delay-4" style={{
          marginTop: '56px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          opacity: 0.25,
          filter: 'grayscale(1)',
        }}>
          {['YouTube', 'Dropbox', 'Drive', 'Cloudflare'].map(s => (
            <span key={s} style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
