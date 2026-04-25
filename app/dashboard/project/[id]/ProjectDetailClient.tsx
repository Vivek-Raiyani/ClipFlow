"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Badge } from "@/app/components/Badge";
import { ModalShell } from "@/app/components/Modal";
import { InputField } from "@/app/components/InputField";
import { Mail } from "lucide-react";

interface ProjectFile {
  id: string;
  fileName: string;
  fileSize: number | null;
  type: string;
  status: string;
  version: number;
  createdAt: string;
  uploaderName: string | null;
  uploaderEmail: string | null;
}

interface Editor {
  id: string;
  editorId: string;
  name: string | null;
  email: string | null;
  status: string;
}

interface Thumbnail {
  id: string;
  r2Key: string;
  isMain: boolean;
}

interface Project {
  id: string;
  title: string;
  status: string;
  visibility: string;
  createdAt: string;
  description: string | null;
  youtubeVideoId: string | null;
}

interface ProjectDetailClientProps {
  project: Project;
  files: ProjectFile[];
  editors: Editor[];
  thumbnails: Thumbnail[];
  isYouTubeConnected: boolean;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatRelTime(dateStr: string) {
  const d = new Date(dateStr);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ProjectDetailClient({
  project: initialProject,
  files: initialFiles,
  editors: initialEditors,
  thumbnails,
  isYouTubeConnected,
}: ProjectDetailClientProps) {
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [files, setFiles] = useState(initialFiles);
  const [editors, setEditors] = useState(initialEditors);
  const [activeTab, setActiveTab] = useState<"raw" | "draft" | "final">("final");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleFileStatus = async (fileId: string, status: "approved" | "rejected") => {
    const res = await fetch(`/api/files/${fileId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status } : f));
      showToast(`File ${status}`, "success");
    } else {
      showToast("Action failed", "error");
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/publish`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setProject(p => ({ ...p, status: "published", youtubeVideoId: data.youtubeVideoId }));
        showToast("Published to YouTube!", "success");
        router.refresh();
      } else {
        showToast(data.error ?? "Publish failed", "error");
      }
    } finally {
      setPublishing(false);
    }
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
      showToast("Editor access revoked", "success");
    }
  };

  const filteredFiles = files.filter(f => f.type === activeTab);
  const approvedFinalCount = files.filter(f => f.type === "final" && f.status === "approved").length;

  return (
    <div className="pd-layout">
      {/* Main */}
      <main className="pd-main">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/dashboard">Dashboard</a>
          <span className="breadcrumb-sep">›</span>
          <span style={{ color: "var(--ui-fg)" }}>{project.title}</span>
        </div>

        {/* Title row */}
        <div className="pd-title-row">
          <div>
            <div className="pd-title">{project.title}</div>
          </div>
          <div className="pd-pills">
            {project.status === "active" && (
              <span className="pd-pill active">
                <span className="pd-pill-dot" />Operational
              </span>
            )}
            {project.status === "published" && (
              <span className="pd-pill" style={{ color: "#16a34a", borderColor: "rgba(22,163,74,0.25)", background: "rgba(22,163,74,0.06)" }}>
                Published
              </span>
            )}
            {project.status === "archived" && (
              <span className="pd-pill">Archived</span>
            )}
            <span className="pd-pill">
              {project.visibility === "private" ? "Private" : project.visibility === "public" ? "Public" : "Unlisted"}
            </span>
            <span className="pd-pill">
              Created {mounted ? new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "..."}
            </span>
          </div>
        </div>

        {/* Segmented control */}
        <div className="seg-control">
          {(["raw", "draft", "final"] as const).map(tab => (
            <button
              key={tab}
              className={`seg-btn${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Files */}
        <div className="files-section-header">
          <div className="files-title">Uploaded Files</div>
          <div className="files-count">{filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}</div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="files-table">
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div className="empty-title">No {activeTab} files yet</div>
              <div className="empty-sub">Share your upload link with editors to start receiving {activeTab} files.</div>
            </div>
          </div>
        ) : (
          <div className="files-table">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="file-row"
                style={file.status === "rejected" ? { opacity: 0.55 } : {}}
              >
                <div className={`file-thumb-sm ${file.status}`}>
                  <div className="play-sm">
                    <svg width="6" height="7" viewBox="0 0 10 12" fill="#0a0a0a"><polygon points="0,0 10,6 0,12"/></svg>
                  </div>
                </div>
                <div className="file-row-info">
                  <div className="file-row-name">{file.fileName}</div>
                  <div className="file-row-meta">
                    <span>{formatBytes(file.fileSize)}</span>
                    <span>·</span>
                    <span>{file.uploaderName ?? file.uploaderEmail ?? "Unknown"}</span>
                    <span>·</span>
                    <span>{mounted ? formatRelTime(file.createdAt) : "..."}</span>
                    <span>·</span>
                    <span style={{
                      fontWeight: 700,
                      color: file.status === "approved" ? "#16a34a" : file.status === "rejected" ? "#dc2626" : "#b45309"
                    }}>
                      {file.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="file-row-actions">
                  {file.status === "pending" && (
                    <>
                      <Button variant="danger" onClick={() => handleFileStatus(file.id, "rejected")}>Reject</Button>
                      <Button variant="success" onClick={() => handleFileStatus(file.id, "approved")}>Approve</Button>
                    </>
                  )}
                  {file.status === "approved" && (
                    <button className="btn-success" style={{ opacity: 1 }}>✓ Approved</button>
                  )}
                  {file.status === "rejected" && (
                    <button className="btn-danger" style={{ opacity: 0.7, cursor: "default" }}>Rejected</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Right sidebar */}
      <aside className="pd-sidebar">
        {/* YouTube */}
        <div className="pd-panel">
          <div className="pd-panel-title">YouTube</div>
          {isYouTubeConnected ? (
            <>
              <div className="yt-status">
                <div className="yt-dot" />
                <div className="yt-label">Channel Connected</div>
              </div>
              {project.youtubeVideoId ? (
                <a
                  href={`https://youtu.be/${project.youtubeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px", background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: "12px", color: "#16a34a", fontFamily: "var(--ui-mono)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  ↗ View on YouTube
                </a>
              ) : (
                <>
                  <button
                    className="yt-pub-btn"
                    onClick={handlePublish}
                    disabled={publishing || approvedFinalCount === 0}
                  >
                    <svg width="14" height="11" viewBox="0 0 16 12" fill="currentColor">
                      <path d="M15.68 1.87A2.01 2.01 0 0 0 14.27.45C13.02.1 8 .1 8 .1S2.98.1 1.73.45A2.01 2.01 0 0 0 .32 1.87C0 3.13 0 5.7 0 5.7s0 2.57.32 3.83a2.01 2.01 0 0 0 1.41 1.42C2.98 11.3 8 11.3 8 11.3s5.02 0 6.27-.35a2.01 2.01 0 0 0 1.41-1.42C16 8.27 16 5.7 16 5.7s0-2.57-.32-3.83zM6.4 8.14V3.26l4.18 2.44-4.18 2.44z"/>
                    </svg>
                    {publishing ? "Publishing…" : "Publish to YouTube"}
                  </button>
                  <p style={{ fontFamily: "var(--ui-mono)", fontSize: "8.5px", color: "var(--ui-fg3)", textAlign: "center", marginTop: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {approvedFinalCount} approved final file{approvedFinalCount !== 1 ? "s" : ""} ready
                  </p>
                </>
              )}
            </>
          ) : (
            <a href="/api/auth/youtube" className="yt-connect-btn">
              Connect YouTube Channel
            </a>
          )}
        </div>

        {/* Project Info */}
        <div className="pd-panel">
          <div className="pd-panel-title">Project Info</div>
          <div className="pd-panel-row">
            <span className="pd-panel-key">Status</span>
            <span className="pd-panel-val" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {project.status === "active" && <span className="pd-pill-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--ui-fg)", display: "inline-block" }} />}
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          <div className="pd-panel-row">
            <span className="pd-panel-key">Visibility</span>
            <span className="pd-panel-val">{project.visibility.charAt(0).toUpperCase() + project.visibility.slice(1)}</span>
          </div>
          <div className="pd-panel-row">
            <span className="pd-panel-key">Created</span>
            <span className="pd-panel-val">{mounted ? new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "..."}</span>
          </div>
          <div className="pd-panel-row">
            <span className="pd-panel-key">Total files</span>
            <span className="pd-panel-val">{files.length}</span>
          </div>
        </div>

        {/* Editors */}
        <div className="pd-panel">
          <div className="pd-panel-title">
            Editors
            <button className="panel-action-btn" onClick={() => setShowInviteModal(true)}>+ Invite</button>
          </div>
          {editors.length === 0 ? (
            <p style={{ fontFamily: "var(--ui-mono)", fontSize: "9px", color: "var(--ui-fg3)", textTransform: "uppercase", letterSpacing: "0.15em" }}>No editors yet</p>
          ) : (
            editors.map(editor => (
              <div key={editor.id} className="editor-item">
                <div className="editor-avatar">
                  {(editor.name ?? editor.email ?? "E")[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="editor-name">{editor.name ?? editor.email}</div>
                  <div className="editor-role">Upload-only · Active</div>
                </div>
                <button className="editor-revoke" onClick={() => handleRevoke(editor.editorId)}>Revoke</button>
              </div>
            ))
          )}
        </div>

        {/* Thumbnails */}
        <div className="pd-panel">
          <div className="pd-panel-title">
            Thumbnails
            <button className="panel-action-btn">+ Add</button>
          </div>
          <div className="thumb-grid">
            {thumbnails.map(t => (
              <div key={t.id} className="thumb-cell" />
            ))}
            <div className="thumb-cell-add">+</div>
          </div>
        </div>
      </aside>

      {/* Invite Modal */}
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

      {/* Toast */}
      {toast && (
        <div className="toast-wrap">
          <div className={`toast ${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </div>
  );
}
