export default function Footer() {
  return (
    <footer style={{
      padding: '40px 24px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      textAlign: 'center',
    }}>
      <p style={{
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'rgba(255,255,255,0.18)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>BUILT FOR CREATORS WHO TRAVEL.</p>
      <p style={{
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'rgba(255,255,255,0.18)',
        letterSpacing: '0.08em',
      }}>© 2025 CLIPFLOW INC.</p>
    </footer>
  );
}
