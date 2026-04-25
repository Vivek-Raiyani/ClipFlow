"use client";
// Safelist themes: data-theme="business" data-theme="dim" data-theme="clipflow"

import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { InputField } from '../components/InputField';
import { ModalShell } from '../components/Modal';
import { FileCard } from '../components/FileCard';
import { ProjectCard } from '../components/ProjectCard';
import { UploadZone } from '../components/UploadZone';
import { FeatureCard } from '../components/FeatureCard';
import { HowItWorksStep } from '../components/HowItWorksStep';
import {
  Plus,
  UserPlus,
  Hash,
  Terminal,
  Check,
  X as XIcon,
  ShieldCheck,
  CloudOff,
  UploadCloud,
  Mail
} from 'lucide-react';

export default function UIComponentsPage() {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="components-showcase">
      <div className="container mx-auto max-w-6xl" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <h1 className="modal-title" style={{ marginBottom: 0 }}>ClipFlow UI Component System</h1>
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(e) => document.documentElement.setAttribute('data-theme', e.target.value)}
            defaultValue="clipflow"
          >
            <option disabled>Select Theme</option>
            <option value="clipflow">Default (ClipFlow)</option>
            <option value="dim">Dim</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* ── BUTTONS ── */}
        <div className="components-section">
          <div className="section-label">01 — Buttons</div>
          <div className="components-row">
            <Button variant="primary" icon={<Plus size={14} strokeWidth={2.5} />}>
              New Project
            </Button>
            <Button variant="ghost" icon={<UserPlus size={13} strokeWidth={2} />} onClick={() => setShowInviteModal(true)}>
              Invite Editor
            </Button>
            <Button variant="danger">Reject</Button>
            <Button variant="success">Approve</Button>
          </div>
        </div>

        {/* ── BADGES ── */}
        <div className="components-section">
          <div className="section-label">02 — Status Badges</div>
          <div className="components-row" style={{ alignItems: 'center' }}>
            <Badge variant="default" dot>Pending</Badge>
            <Badge variant="black" dot>1 File</Badge>
            <Badge variant="green" dot>Approved</Badge>
            <Badge variant="amber" dot>Needs Review</Badge>
            <Badge variant="red" dot>Rejected</Badge>
          </div>
        </div>

        {/* ── INPUT ── */}
        <div className="components-section">
          <div className="section-label">03 — Input Field</div>
          <div style={{ maxWidth: '420px' }}>
            <InputField
              label="Pipeline Identifier"
              subLabel="Unique Namespace"
              placeholder="e.g. CINEMATIC_VLOG_04"
              icon={<Hash size={16} strokeWidth={1.5} color="rgba(0,0,0,0.12)" />}
            />
          </div>
        </div>

        {/* ── MODALS (Inline for demo) ── */}
        <div className="components-section">
          <div className="section-label">04 — Modals</div>
          <div className="components-row">
            {/* Create Project Demo */}
            <ModalShell
              title="Establish Pipeline"
              subtitle="Define a high-performance environment for your next creative evolution."
              pillText="Protocol Initialization"
              pillIcon={<Terminal size={10} strokeWidth={2} color="rgba(0,0,0,0.3)" />}
              onClose={() => { }}
            >
              <div style={{ marginBottom: '32px' }}>
                <InputField
                  label="Pipeline Identifier"
                  subLabel="Unique Namespace"
                  placeholder="e.g. CINEMATIC_VLOG_04"
                  style={{ fontSize: '20px' }}
                />
              </div>
              <Button variant="primary" style={{ width: '100%', justifyContent: 'center', padding: '18px', borderRadius: '14px' }}>
                Initialize Core
              </Button>
              <p style={{ textAlign: 'center', fontFamily: 'var(--ui-mono)', fontSize: '9px', color: 'var(--ui-fg3)', marginTop: '14px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                By initializing, you agree to the deployment protocols.
              </p>
            </ModalShell>

            {/* Invite Editor Demo */}
            <ModalShell
              title="Add Editor"
              maxWidth={400}
              onClose={() => { }}
            >
              <div style={{ fontFamily: 'var(--ui-mono)', fontSize: '9px', color: 'var(--ui-fg3)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '28px' }}>
                Send a secure invitation to join your network.
              </div>
              <div style={{ marginBottom: '24px' }}>
                <InputField
                  label="Email Address"
                  placeholder="editor@example.com"
                  style={{ fontSize: '16px', fontFamily: 'var(--ui-sans)' }}
                />
              </div>
              <Button variant="primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', borderRadius: '14px' }}>
                Send Invitation
              </Button>
            </ModalShell>
          </div>
        </div>

        {/* ── FILE CARD ── */}
        <div className="components-section">
          <div className="section-label">05 — File Review Card</div>
          <div style={{ maxWidth: '600px' }}>
            <FileCard
              fileName='"I built a SaaS in 24 hours" — Final_v3.mp4'
              fileDetail='2.4 GB · @Editor_Mike · Ready to push'
              duration="10:24"
              statusText="Needs Review"
              statusVariant="amber"
              uploadedAt="Uploaded 2h ago"
            />
          </div>
        </div>

        {/* ── PROJECT CARD ── */}
        <div className="components-section">
          <div className="section-label">06 — Project List Item</div>
          <div style={{ background: 'white', border: '1px solid var(--ui-border)', borderRadius: '20px', overflow: 'hidden', maxWidth: '800px' }}>
            <ProjectCard
              title="Cinematic Vlog 04"
              avatarChar="C"
              date="Apr 23, 2026"
              visibility="Private"
              statusValue="Operational"
              statusActive={true}
            />
            <ProjectCard
              title="Travel Diary EP 7"
              avatarChar="T"
              date="Mar 10, 2026"
              visibility="Public"
              statusValue="Archived"
              archived={true}
            />
          </div>
        </div>

        {/* ── UPLOAD ZONE ── */}
        <div className="components-section">
          <div className="section-label">07 — Upload Zone</div>
          <UploadZone />
        </div>

        {/* ── FEATURES GRID ── */}
        <div className="components-section">
          <div className="section-label">08 — Features Grid</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <FeatureCard
              icon={<ShieldCheck size={18} strokeWidth={1.75} />}
              tagText="01"
              title="Decoupled Access"
              description="Editors upload to your secure firewall. You approve from yours."
            />
            <FeatureCard
              icon={<CloudOff size={18} strokeWidth={1.75} />}
              tagText="02"
              title="Zero Egress Fees"
              description="Built on Cloudflare R2. Move massive 4K files without paying a cent."
            />
            <FeatureCard
              icon={<UploadCloud size={18} strokeWidth={1.75} />}
              tagText="03"
              title="One-Click Publish"
              description="Review, set visibility, and push to YouTube with a single tap."
            />
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div className="components-section">
          <div className="section-label">09 — How It Works Steps</div>
          <div className="step-row">
            <HowItWorksStep
              stepNumber={1}
              title="Editor uploads"
              description="Your editor gets a secure link. Drag-and-drop — no account needed."
            />
            <HowItWorksStep
              stepNumber={2}
              title="You review & approve"
              description="Get notified. Open ClipFlow, preview on any device, hit Approve."
            />
            <HowItWorksStep
              stepNumber={3}
              title="We publish to YouTube"
              description="ClipFlow pushes directly via YouTube API. Fast and zero egress."
            />
          </div>
        </div>
      </div>

      {/* Global Modals for interactive demo */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ModalShell
            title="Add Editor"
            maxWidth={400}
            onClose={() => setShowInviteModal(false)}
          >
            <div style={{ fontFamily: 'var(--ui-mono)', fontSize: '9px', color: 'var(--ui-fg3)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '28px' }}>
              Send a secure invitation to join your network.
            </div>
            <div style={{ marginBottom: '24px' }}>
              <InputField
                label="Email Address"
                placeholder="editor@example.com"
                style={{ fontSize: '16px', fontFamily: 'var(--ui-sans)' }}
                icon={<Mail size={16} strokeWidth={1.5} color="rgba(0,0,0,0.12)" />}
              />
            </div>
            <Button variant="primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', borderRadius: '14px' }}>
              Send Invitation
            </Button>
          </ModalShell>
        </div>
      )}
    </div>
  );
}