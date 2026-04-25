import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--ui-bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px",
    }}>
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px", justifyContent: "center", marginBottom: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "var(--ui-fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{ fontSize: "16px", fontWeight: 500, letterSpacing: "-0.02em" }}>ClipFlow</span>
        </div>
        <div style={{ fontFamily: "var(--ui-serif)", fontSize: "22px", fontStyle: "italic", color: "var(--ui-fg)", marginBottom: "6px" }}>
          Start your pipeline.
        </div>
        <div style={{ fontFamily: "var(--ui-mono)", fontSize: "9px", color: "var(--ui-fg3)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>
          Free during private beta
        </div>
      </div>
      <SignUp />
    </div>
  );
}
