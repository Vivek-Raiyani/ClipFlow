'use client';

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Badge */}
      <div className="reveal visible" style={{ marginBottom: '28px' }}>
        <span className="badge badge-accent">
          For paranoid creators
        </span>
      </div>

      {/* Headline */}
      <h1 className="reveal visible" style={{
        fontSize: 'clamp(48px, 8vw, 92px)',
        fontWeight: 500,
        letterSpacing: '-0.02em',
        lineHeight: 1.04,
        maxWidth: '840px',
        marginBottom: '28px',
        fontFamily: 'var(--font-serif)'
      }}>
        Your Channel&apos;s{' '}
        <span className="gradient-text">Security Layer.</span>
      </h1>

      {/* Sub */}
      <p className="reveal visible reveal-delay-1" style={{
        fontSize: 'clamp(16px, 2vw, 20px)',
        color: 'var(--text-secondary)',
        maxWidth: '520px',
        lineHeight: 1.65,
        fontWeight: 400,
        marginBottom: '36px',
      }}>
        Editors upload videos here. You approve them.
        We push to YouTube via API.{' '}
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
          No passwords shared. No 2 GB downloads.
        </span>
      </p>

      {/* CTAs */}
      <div className="reveal visible reveal-delay-2" style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '72px',
      }}>
        <a 
          href="#demo" 
          className="btn" 
          style={{ 
            padding: '13px 32px', 
            fontSize: '14px',
            background: 'rgba(168,85,247,0.08)',
            border: '1px solid rgba(168,85,247,0.15)',
            color: '#a855f7',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#000';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = '#000';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(168,85,247,0.08)';
            e.currentTarget.style.color = '#a855f7';
            e.currentTarget.style.borderColor = 'rgba(168,85,247,0.15)';
          }}
        >
          Start Interactive Demo
        </a>
        <a href="#waitlist" className="btn btn-ghost" style={{ padding: '13px 32px', fontSize: '14px' }}>
          Join Waitlist
        </a>
      </div>

      {/* Mock App Window */}
      <div className="reveal visible reveal-delay-3 animate-float" style={{
        width: '100%',
        maxWidth: '820px',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 20px 80px rgba(0,0,0,0.04)',
      }}>
        {/* Window Chrome */}
        <div style={{
          height: '44px',
          background: '#f5f5f7',
          borderBottom: '1px solid rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '6px',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['rgba(255,95,86,0.6)', 'rgba(255,189,46,0.6)', 'rgba(39,201,63,0.6)'].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, border: `1px solid ${c}` }} />
            ))}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.04)',
            borderRadius: '6px',
            padding: '4px 12px',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(0,0,0,0.25)' }}>
              clipflow.app/dashboard
            </span>
          </div>
          <div style={{ width: 48 }} />
        </div>

        {/* App Body */}
        <div style={{ display: 'flex', height: '340px' }}>
          {/* Sidebar */}
          <div style={{
            width: '200px',
            background: '#fafafa',
            borderRight: '1px solid rgba(0,0,0,0.04)',
            padding: '24px 16px',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{
                width: 34, height: 34,
                borderRadius: '50%',
                background: '#000',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>Main Channel</div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>2.1M Subs</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { label: 'Pending Review', active: true, badge: '1' },
                { label: 'Published', active: false },
                { label: 'Editors', active: false },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: item.active ? 'rgba(0,0,0,0.04)' : 'transparent',
                  fontSize: '12px',
                  color: item.active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: item.active ? 500 : 400,
                  cursor: 'pointer',
                }}>
                  {item.label}
                  {item.badge && (
                    <span style={{
                      background: '#000',
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}>{item.badge}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: '24px', overflow: 'hidden' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}>Pending Uploads</div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginBottom: '20px',
            }}>
              Files uploaded by{' '}
              <span style={{ color: 'var(--text-primary)' }}>@Editor_Mike</span>
              {' '}waiting for approval.
            </div>

            {/* Video Card */}
            <div style={{
              background: '#faf9f6',
              border: '1px solid rgba(0,0,0,0.04)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}>
              {/* Thumbnail */}
              <div style={{
                width: '120px',
                aspectRatio: '16/9',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '8px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                }} />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                <span style={{
                  position: 'absolute', bottom: 4, right: 6,
                  fontSize: '9px', fontFamily: 'var(--font-mono)',
                  color: 'rgba(255,255,255,0.5)',
                }}>10:24</span>
              </div>

              {/* Meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700,
                    color: '#000',
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    padding: '2px 7px', borderRadius: '4px',
                    letterSpacing: '0.12em',
                  }}>NEEDS REVIEW</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Uploaded 2h ago</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  &quot;I built a SaaS in 24 hours&quot; — Final_v3.mp4
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  2.4 GB · Ready to push to YouTube
                </div>
              </div>

              {/* Action */}
              <button style={{
                padding: '8px 16px',
                background: '#ffffff',
                color: '#000',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                flexShrink: 0,
              }}>
                Review & Push
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '200px',
        background: 'linear-gradient(to top, var(--bg-deep), transparent)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}
