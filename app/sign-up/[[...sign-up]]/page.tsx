import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: "fixed",
          top: "-15%",
          right: "-10%",
          width: 600,
          height: 600,
          background: "rgba(168,85,247,0.1)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-15%",
          left: "-10%",
          width: 600,
          height: 600,
          background: "rgba(236,72,153,0.06)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <SignUp
          appearance={{
            variables: {
              colorBackground: "#0d0d0d",
              colorText: "#f3f4f6",
              colorTextSecondary: "#9ca3af",
              colorInputBackground: "rgba(255,255,255,0.04)",
              colorInputText: "#f3f4f6",
              colorPrimary: "#a855f7",
              colorDanger: "#f87171",
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
            },
            elements: {
              card: {
                background: "rgba(14,14,14,0.9)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 8px 80px rgba(0,0,0,0.6), 0 0 60px rgba(168,85,247,0.06)",
              },
              headerTitle: {
                color: "#f3f4f6",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              },
              headerSubtitle: { color: "#9ca3af" },
              socialButtonsBlockButton: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f3f4f6",
              },
              dividerLine: { background: "rgba(255,255,255,0.07)" },
              dividerText: { color: "#6b7280" },
              formFieldLabel: { color: "#9ca3af", fontSize: "12px" },
              formFieldInput: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f3f4f6",
              },
              formButtonPrimary: {
                background: "#a855f7",
                color: "#fff",
              },
              footerActionLink: { color: "#a855f7" },
            },
          }}
        />
      </div>
    </div>
  );
}
