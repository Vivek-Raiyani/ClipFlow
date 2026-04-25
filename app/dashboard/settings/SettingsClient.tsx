"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { BrandIcon } from "@/app/components/BrandIcon";

interface Channel {
  id: string;
  title: string;
  thumbnail: string;
  connectedAt: string;
}

interface SettingsClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    youtubeConnected: boolean;
    driveConnected: boolean;
  };
  channels: Channel[];
}

export function SettingsClient({ user, channels: initialChannels }: SettingsClientProps) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDisconnect = async (id: string) => {
    if (!confirm("Are you sure you want to disconnect this channel? This will stop any active pipelines for this channel.")) return;

    try {
      const res = await fetch("/api/youtube/channels/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: id }),
      });
      if (res.ok) {
        setChannels(channels.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="dash-header">
        <div>
          <div className="dash-header-title">Settings</div>
          <div className="dash-header-sub">Manage your account and integrations</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "900px" }}>
        {/* Profile */}
        <div className="stat-card" style={{ borderRadius: "20px", padding: "32px" }}>
          <div className="pd-panel-title" style={{ marginBottom: "24px" }}>Profile</div>
          <div className="pd-panel-row">
            <span className="pd-panel-key">Name</span>
            <span className="pd-panel-val">{user.name ?? "—"}</span>
          </div>
          <div className="pd-panel-row">
            <span className="pd-panel-key">Email</span>
            <span className="pd-panel-val" style={{ fontFamily: "var(--ui-sans)", fontSize: "12px" }}>{user.email}</span>
          </div>
          <div className="pd-panel-row">
            <span className="pd-panel-key">Role</span>
            <span className="pd-panel-val">Creator</span>
          </div>
        </div>

        {/* Google Drive Integration */}
        <div className="stat-card" style={{ borderRadius: "20px", padding: "32px" }}>
          <div className="pd-panel-title" style={{ marginBottom: "24px" }}>Cloud Storage</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--ui-bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BrandIcon name="googledrive" size={16} monochrome />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ui-fg)" }}>Google Drive</div>
                <div style={{ fontSize: "11px", color: "var(--ui-fg3)" }}>{user.driveConnected ? "Connected" : "Not connected"}</div>
              </div>
            </div>
            {user.driveConnected ? (
              <span className="ui-badge badge-green">
                <div className="badge-dot" />
                Active
              </span>
            ) : (
              <a href="/api/auth/drive" className="panel-action-btn" style={{ textDecoration: "none" }}>Connect →</a>
            )}
          </div>
        </div>

        {/* YouTube Integrations - Full Width */}
        <div className="stat-card" style={{ borderRadius: "20px", padding: "32px", gridColumn: "1 / -1" }}>
          <div className="pd-panel-title" style={{ marginBottom: "24px" }}>
            YouTube Channels
            <a href="/api/auth/youtube" className="panel-action-btn" style={{ textDecoration: "none" }}>+ Connect Channel</a>
          </div>

          {channels.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--ui-bg2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <BrandIcon name="youtube" size={24} monochrome color="var(--ui-fg3)" />
              </div>
              <div style={{ fontSize: "14px", color: "var(--ui-fg2)", marginBottom: "16px" }}>No channels connected yet</div>
              <a href="/api/auth/youtube" className="btn-primary" style={{ padding: "10px 20px" }}>Connect First Channel</a>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    border: "1px solid var(--ui-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--ui-bg)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img
                      src={channel.thumbnail}
                      alt={channel.title}
                      style={{ width: "36px", height: "36px", borderRadius: "50%" }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ui-fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {channel.title}
                      </div>
                      <div style={{ fontFamily: "var(--ui-mono)", fontSize: "8px", color: "var(--ui-fg3)", textTransform: "uppercase" }}>
                        Connected {mounted ? new Date(channel.connectedAt).toLocaleDateString() : "..."}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect(channel.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--ui-fg3)",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ui-fg3)")}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
