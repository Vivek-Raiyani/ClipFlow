"use client";

interface SettingsClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    youtubeConnected: boolean;
    driveConnected: boolean;
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
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

        {/* Integrations */}
        <div className="stat-card" style={{ borderRadius: "20px", padding: "32px" }}>
          <div className="pd-panel-title" style={{ marginBottom: "24px" }}>Integrations</div>

          {/* YouTube */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--ui-border)" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ui-fg)", marginBottom: "2px" }}>YouTube</div>
              <div style={{ fontFamily: "var(--ui-mono)", fontSize: "9px", color: "var(--ui-fg3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {user.youtubeConnected ? "Connected" : "Not connected"}
              </div>
            </div>
            {user.youtubeConnected ? (
              <div className="yt-status" style={{ margin: 0 }}>
                <div className="yt-dot" />
                <span className="yt-label">Connected</span>
              </div>
            ) : (
              <a href="/api/auth/youtube" className="panel-action-btn" style={{ textDecoration: "none" }}>Connect →</a>
            )}
          </div>

          {/* Google Drive */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ui-fg)", marginBottom: "2px" }}>Google Drive</div>
              <div style={{ fontFamily: "var(--ui-mono)", fontSize: "9px", color: "var(--ui-fg3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {user.driveConnected ? "Connected" : "Not connected"}
              </div>
            </div>
            {user.driveConnected ? (
              <div className="yt-status" style={{ margin: 0 }}>
                <div className="yt-dot" />
                <span className="yt-label">Connected</span>
              </div>
            ) : (
              <a href="/api/auth/drive" className="panel-action-btn" style={{ textDecoration: "none" }}>Connect →</a>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="stat-card" style={{ borderRadius: "20px", padding: "32px", gridColumn: "1 / -1" }}>
          <div className="pd-panel-title" style={{ marginBottom: "24px", color: "#dc2626" }}>Danger Zone</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ui-fg)", marginBottom: "4px" }}>Disconnect YouTube</div>
              <div style={{ fontSize: "12px", color: "var(--ui-fg2)" }}>This will prevent any future publishes. Existing uploads are not affected.</div>
            </div>
            <button className="btn-danger" disabled={!user.youtubeConnected} style={{ opacity: user.youtubeConnected ? 1 : 0.4 }}>
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
