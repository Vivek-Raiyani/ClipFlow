"use client";

import { useState, useEffect } from "react";
import { Clock, Check, X, FileVideo, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PendingFile {
  id: string;
  projectId: string;
  projectTitle: string;
  fileName: string;
  fileSize: number | null;
  type: string;
  createdAt: string | Date;
}

interface PendingReviewClientProps {
  initialFiles: PendingFile[];
}

export function PendingReviewClient({ initialFiles }: PendingReviewClientProps) {
  const [files, setFiles] = useState(initialFiles);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = async (fileId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/files/${fileId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
      }
    } catch (error) {
      console.error("Failed to update file status", error);
    }
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="dash-header">
        <div>
          <div className="dash-header-title">Pending Review</div>
          <div className="dash-header-sub">Files awaiting your approval across all projects</div>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="stat-card" style={{ padding: "80px 0", textAlign: "center", borderRadius: "24px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--ui-bg2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Clock size={24} className="text-[var(--ui-fg3)]" />
          </div>
          <div className="empty-title">All caught up!</div>
          <div className="empty-sub">No files are currently pending review in this workspace.</div>
        </div>
      ) : (
        <div className="files-table">
          {files.map((file) => (
            <div key={file.id} className="file-row" style={{ padding: "20px 24px" }}>
              <div className="file-thumb-sm">
                <FileVideo size={20} className="text-black/20" />
              </div>
              <div className="file-row-info">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <div className="file-row-name" style={{ margin: 0 }}>{file.fileName}</div>
                  <span className="ui-badge" style={{ fontSize: "8px", padding: "2px 6px" }}>{file.type}</span>
                </div>
                <div className="file-row-meta">
                  <Link href={`/dashboard/project/${file.projectId}`} className="hover:underline text-[var(--ui-fg2)]">
                    {file.projectTitle}
                  </Link>
                  <span>·</span>
                  <span>{formatBytes(file.fileSize)}</span>
                  <span>·</span>
                  <span>{mounted ? new Date(file.createdAt).toLocaleDateString() : "..."}</span>
                </div>
              </div>
              <div className="file-row-actions">
                <button 
                  className="btn-danger" 
                  style={{ padding: "8px", borderRadius: "10px" }}
                  onClick={() => handleAction(file.id, "rejected")}
                >
                  <X size={14} />
                </button>
                <button 
                  className="btn-success" 
                  style={{ padding: "8px", borderRadius: "10px" }}
                  onClick={() => handleAction(file.id, "approved")}
                >
                  <Check size={14} />
                </button>
                <Link href={`/dashboard/project/${file.projectId}`} className="panel-action-btn" style={{ padding: "8px" }}>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
