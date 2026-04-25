"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { ModalShell } from "@/app/components/Modal";
import { InputField } from "@/app/components/InputField";
import { UserPlus, Mail, Clock } from "lucide-react";

interface Editor {
  id: string;
  editorId: string;
  name: string | null;
  email: string | null;
  status: string;
  joinedAt: string;
}

interface PendingInvite {
  id: string;
  email: string;
  createdAt: string;
}

interface TeamClientProps {
  editors: Editor[];
  pendingInvites: PendingInvite[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function TeamClient({ editors: initialEditors, pendingInvites }: TeamClientProps) {
  const router = useRouter();
  const [editors, setEditors] = useState(initialEditors);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Invitation sent!", "success");
        setShowInviteModal(false);
        setInviteEmail("");
        router.refresh();
      } else {
        showToast(data.error ?? "Invite failed", "error");
      }
    } finally {
      setInviting(false);
    }
  };

  const handleRevoke = async (editorId: string) => {
    const res = await fetch(`/api/team/${editorId}`, { method: "DELETE" });
    if (res.ok) {
      setEditors(prev => prev.filter(e => e.editorId !== editorId));
      showToast("Editor access revoked");
    }
  };

  return (
    <div>
      <div className="dash-header">
        <div>
          <div className="dash-header-title">Editors</div>
          <div className="dash-header-sub">{editors.length} active · {pendingInvites.length} pending</div>
        </div>
        <div className="dash-header-actions">
          <Button
            variant="ghost"
            icon={<UserPlus size={13} strokeWidth={2} />}
            onClick={() => setShowInviteModal(true)}
          >
            Invite Editor
          </Button>
        </div>
      </div>

      {/* Active editors */}
      <div className="dash-proj-header">
        <div className="dash-proj-title">Active Editors</div>
        <div className="dash-proj-count">{editors.length} total</div>
      </div>

      <div className="proj-list" style={{ marginBottom: "28px" }}>
        {editors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <UserPlus size={22} strokeWidth={1.5} />
            </div>
            <div className="empty-title">No editors yet</div>
            <div className="empty-sub">Invite your video editors. They&apos;ll get upload-only access — no YouTube credentials needed.</div>
            <Button variant="ghost" icon={<UserPlus size={13} strokeWidth={2} />} onClick={() => setShowInviteModal(true)}>
              Invite First Editor
            </Button>
          </div>
        ) : (
          editors.map(editor => (
            <div key={editor.id} style={{ display: "flex", alignItems: "center", gap: "18px", padding: "20px 28px", borderBottom: "1px solid var(--ui-border)" }}>
              <div className="editor-avatar" style={{ width: "40px", height: "40px", fontSize: "13px", borderRadius: "12px" }}>
                {(editor.name ?? editor.email ?? "E")[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ui-fg)", marginBottom: "3px" }}>
                  {editor.name ?? editor.email}
                </div>
                <div style={{ fontFamily: "var(--ui-mono)", fontSize: "10px", color: "var(--ui-fg3)" }}>
                  {editor.email} · Upload-only · Joined {formatDate(editor.joinedAt)}
                </div>
              </div>
              <span className="ui-badge badge-green" style={{ marginRight: "8px" }}>
                <span className="badge-dot" />Active
              </span>
              <button className="editor-revoke" onClick={() => handleRevoke(editor.editorId)} style={{ fontSize: "10px" }}>
                Revoke Access
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
        <>
          <div className="dash-proj-header">
            <div className="dash-proj-title">Pending Invitations</div>
            <div className="dash-proj-count">{pendingInvites.length} pending</div>
          </div>
          <div className="proj-list">
            {pendingInvites.map(invite => (
              <div key={invite.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 28px", borderBottom: "1px solid var(--ui-border)", opacity: 0.7 }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--ui-fg4)", border: "1px solid var(--ui-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clock size={16} strokeWidth={1.5} color="var(--ui-fg3)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--ui-fg)", marginBottom: "2px" }}>{invite.email}</div>
                  <div style={{ fontFamily: "var(--ui-mono)", fontSize: "9px", color: "var(--ui-fg3)" }}>Invited {formatDate(invite.createdAt)}</div>
                </div>
                <span className="ui-badge badge-amber"><span className="badge-dot" />Pending</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Invite modal */}
      {showInviteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(250,249,246,0.85)", backdropFilter: "blur(12px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ModalShell title="Add Editor" maxWidth={400} onClose={() => setShowInviteModal(false)}>
            <div style={{ fontFamily: "var(--ui-mono)", fontSize: "9px", color: "var(--ui-fg3)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "28px" }}>
              Send a secure invitation to join your network.
            </div>
            <div style={{ marginBottom: "24px" }}>
              <InputField
                label="Email Address"
                placeholder="editor@example.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleInvite()}
                icon={<Mail size={16} strokeWidth={1.5} color="rgba(0,0,0,0.12)" />}
              />
            </div>
            <Button variant="primary" style={{ width: "100%", justifyContent: "center", padding: "16px", borderRadius: "14px" }} onClick={handleInvite} disabled={inviting}>
              {inviting ? "Sending…" : "Send Invitation"}
            </Button>
          </ModalShell>
        </div>
      )}

      {toast && (
        <div className="toast-wrap">
          <div className={`toast ${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </div>
  );
}
