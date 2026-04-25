"use client";

import { useState } from "react";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section id="waitlist" style={{ padding: "120px 40px", textAlign: "center", position: "relative", borderTop: "1px solid var(--ui-border)" }}>
      {/* Purple glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "240px", background: "radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative" }}>
        <div className="ui-badge" style={{ marginBottom: "16px" }}>Private Beta</div>
        <h2 style={{ fontFamily: "var(--ui-sans)", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ui-fg)", lineHeight: 1.1, marginBottom: "14px" }}>
          Don&apos;t let slow internet<br />
          <em style={{ fontStyle: "italic", color: "var(--ui-fg2)" }}>stop your upload.</em>
        </h2>
        <p style={{ fontSize: "15px", color: "var(--ui-fg2)", lineHeight: 1.7, textAlign: "center", margin: "0 auto 40px", maxWidth: "400px" }}>
          Currently in private beta with 50 YouTubers. Join the list to get early access.
        </p>
        {submitted ? (
          <div style={{ fontFamily: "var(--ui-mono)", fontSize: "12px", fontWeight: 700, color: "#16a34a", letterSpacing: "0.15em", textTransform: "uppercase", padding: "18px 32px", background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: "9999px", display: "inline-block" }}>
            ✓ You&apos;re on the list!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="waitlist-form">
            <input
              type="email"
              className="waitlist-input"
              placeholder="name@studio.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="waitlist-submit">Join</button>
          </form>
        )}
        <div style={{ marginTop: "60px", display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", opacity: 0.25 }}>
          {["YouTube", "Dropbox", "Drive", "Cloudflare"].map(name => (
            <span key={name} style={{ fontFamily: "var(--ui-mono)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
