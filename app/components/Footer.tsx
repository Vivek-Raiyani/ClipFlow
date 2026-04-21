export default function Footer() {
  return (
    <footer style={{
      padding: '60px 24px',
      borderTop: '1px solid rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      textAlign: 'center',
    }}>
      <p style={{
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'rgba(0,0,0,0.15)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>BUILT FOR CREATORS WHO TRAVEL.</p>
      <p style={{
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'rgba(0,0,0,0.15)',
        letterSpacing: '0.1em',
      }}>© 2026 CLIPFLOW INC.</p>
    </footer>
  );
}
