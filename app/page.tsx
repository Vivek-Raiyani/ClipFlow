import Link from "next/link";
import { BrandIcon } from "./components/BrandIcon";
import { Hero } from "./components/Hero";
import { FeatureCard } from "./components/FeatureCard";
import { HowItWorksStep } from "./components/HowItWorksStep";
import { WaitlistSection } from "./components/WaitlistSection";
import { ShieldCheck, CloudOff, UploadCloud, Smartphone, Users, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ background: "var(--ui-bg)", color: "var(--ui-fg)", minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="lp-nav">
        <Link href="/" className="lp-nav-logo">
          <div className="lp-nav-logomark">
            <BrandIcon size={12} color="white" />
          </div>
          <span className="lp-nav-logotext">ClipFlow</span>
        </Link>
        <div className="lp-nav-links">
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#how-it-works" className="lp-nav-link">How it works</a>
          <a href="#waitlist" className="lp-nav-link">Waitlist</a>
        </div>
        <div className="lp-nav-cta">
          <Link href="/dashboard" className="lp-nav-dash">Dashboard</Link>
          <Link href="/sign-up" className="lp-btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <Hero />

      {/* Features */}
      <section id="features" style={{ padding: "100px 40px", borderTop: "1px solid var(--ui-border)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div className="ui-badge" style={{ marginBottom: "14px" }}>Features</div>
            <h2 style={{ fontFamily: "var(--ui-sans)", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ui-fg)", lineHeight: 1.1, marginBottom: "14px" }}>
              Engineered for <em style={{ fontStyle: "italic", color: "var(--ui-fg2)" }}>scale</em>
            </h2>
            <p style={{ fontSize: "16px", color: "var(--ui-fg2)", lineHeight: 1.68, maxWidth: "440px", margin: "0 auto" }}>
              The technical stack that powers the next generation of content production pipelines.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
            <FeatureCard icon={<ShieldCheck size={18} strokeWidth={1.75}/>} tagText="01" title="Decoupled Access" description="Editors upload to your secure firewall. You approve from yours. No more sharing YouTube passwords." />
            <FeatureCard icon={<CloudOff size={18} strokeWidth={1.75}/>} tagText="02" title="Zero Egress Fees" description="Built on Cloudflare R2. Move massive 4K files to YouTube server-to-server without paying a cent." />
            <FeatureCard icon={<UploadCloud size={18} strokeWidth={1.75}/>} tagText="03" title="One-Click Publish" description="Review metadata, set visibility, and push to YouTube with a single tap. The file never touches your device." />
            <FeatureCard icon={<Smartphone size={18} strokeWidth={1.75}/>} tagText="04" title="Mobile Approval" description="Get notified when a video is ready. Preview and hit Publish from your phone, anywhere in the world." />
            <FeatureCard icon={<Users size={18} strokeWidth={1.75}/>} tagText="05" title="Multi-Editor Teams" description="Invite unlimited editors with scoped upload-only access. Revoke in one click, no password resets required." />
            <FeatureCard icon={<Activity size={18} strokeWidth={1.75}/>} tagText="06" title="Full Audit Trail" description="Every upload, approval, and publish is timestamped and logged. Know exactly who did what and when." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "100px 40px", borderTop: "1px solid var(--ui-border)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div className="ui-badge" style={{ marginBottom: "14px" }}>Workflow</div>
            <h2 style={{ fontFamily: "var(--ui-sans)", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ui-fg)", lineHeight: 1.1 }}>
              Three steps.<br />
              <em style={{ fontStyle: "italic", color: "var(--ui-fg2)" }}>Zero compromise.</em>
            </h2>
          </div>
          <div className="step-row">
            <HowItWorksStep stepNumber={1} title="Editor uploads" description="Your editor gets a secure upload link. Drag-and-drop the finished video — no account, no credentials needed." />
            <HowItWorksStep stepNumber={2} title="You review & approve" description="Get a notification. Open ClipFlow on any device, watch the preview, edit the metadata, then hit Approve." />
            <HowItWorksStep stepNumber={3} title="We publish to YouTube" description="ClipFlow's servers push the file directly to your channel via YouTube API. Fast, secure, zero egress fees." />
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <WaitlistSection />

      {/* Footer */}
      <footer className="lp-footer">
        <div className="footer-text">Built for creators who travel.</div>
        <div className="footer-nav">
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <Link href="/terms" className="footer-link">Terms of Service</Link>
          <Link href="/contact" className="footer-link">Contact</Link>
        </div>
        <div className="footer-text" style={{ opacity: 0.5 }}>© 2026 ClipFlow Inc. All rights reserved.</div>
      </footer>
    </div>
  );
}
