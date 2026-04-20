"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectFile {
  id: string;
  fileName: string;
  version: number;
  status: string;
  type: string;
}

interface YouTubePublishButtonProps {
  projectId: string;
  youtubeVideoId: string | null;
  isYouTubeConnected: boolean;
  approvedFiles: ProjectFile[];
}

type PublishStage = "idle" | "selecting" | "publishing" | "done" | "error";

export default function YouTubePublishButton({
  projectId,
  youtubeVideoId,
  isYouTubeConnected,
  approvedFiles,
}: YouTubePublishButtonProps) {
  const router = useRouter();
  const [stage, setStage] = useState<PublishStage>("idle");
  const [selectedFileId, setSelectedFileId] = useState<string>(
    approvedFiles[0]?.id ?? ""
  );
  const [publishedUrl, setPublishedUrl] = useState<string>(
    youtubeVideoId ? `https://youtu.be/${youtubeVideoId}` : ""
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  // ── Already published ─────────────────────────────────────────────────
  if (youtubeVideoId && stage !== "done") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-400">
            Live on YouTube
          </p>
        </div>
        <a
          href={`https://youtu.be/${youtubeVideoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 glass p-4 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-all group"
        >
          <YoutubeIcon />
          <div className="min-w-0">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Video ID
            </p>
            <p className="font-mono text-sm text-white/80 group-hover:text-white transition-colors truncate">
              {youtubeVideoId}
            </p>
          </div>
          <span className="ml-auto text-white/20 group-hover:text-white/60 transition-colors">
            ↗
          </span>
        </a>
        <p className="text-[10px] text-white/20 font-mono text-center">
          Re-publish to update the video on YouTube
        </p>
        <button
          onClick={() => setStage("selecting")}
          className="w-full py-2.5 border border-white/10 text-white/30 text-[10px] uppercase tracking-widest font-mono hover:border-white/20 hover:text-white/50 transition-all"
        >
          Re-publish
        </button>
      </div>
    );
  }

  // ── Not connected ─────────────────────────────────────────────────────
  if (!isYouTubeConnected) {
    return (
      <div className="space-y-4">
        <p className="text-[10px] text-white/30 font-mono leading-relaxed">
          Connect your YouTube channel to publish approved videos directly
          from ClipFlow.
        </p>
        <a
          href="/api/auth/youtube"
          className="flex items-center justify-center gap-3 w-full py-3.5 bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-semibold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <YoutubeIcon />
          Connect YouTube Channel
        </a>
      </div>
    );
  }

  // ── No approved files ─────────────────────────────────────────────────
  if (approvedFiles.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500/60" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-green-500/60">
            YouTube Connected
          </p>
        </div>
        <p className="text-[10px] text-white/20 font-mono italic">
          No approved files yet. Approve a file to enable publishing.
        </p>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────
  if (stage === "done") {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="glass p-5 bg-red-500/5 border border-red-500/20 text-center space-y-2">
          <p className="text-2xl">🎬</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-400">
            Transmission Complete
          </p>
          <p className="font-serif text-sm text-white/60">
            Video is live on YouTube
          </p>
        </div>
        <a
          href={publishedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] uppercase tracking-widest hover:bg-red-600/30 transition-all"
        >
          <YoutubeIcon />
          View on YouTube ↗
        </a>
        <button
          onClick={() => {
            router.refresh();
            setStage("idle");
          }}
          className="w-full py-2 text-[9px] font-mono text-white/20 hover:text-white/40 uppercase tracking-widest transition-colors"
        >
          Return to workspace
        </button>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────
  if (stage === "error") {
    return (
      <div className="space-y-4">
        <div className="glass p-4 bg-red-500/5 border border-red-500/20">
          <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1">
            Transmission Failed
          </p>
          <p className="text-xs text-white/40 font-mono break-all">{errorMsg}</p>
        </div>
        <button
          onClick={() => setStage("selecting")}
          className="w-full py-2.5 border border-white/10 text-white/30 text-[10px] uppercase tracking-widest hover:border-white/20 hover:text-white/50 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── File selector ─────────────────────────────────────────────────────
  if (stage === "selecting") {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500/60" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-green-500/60">
            YouTube Connected
          </p>
        </div>
        <div>
          <label className="block text-[10px] text-white/30 uppercase font-mono tracking-widest mb-2">
            Select Approved File
          </label>
          <div className="space-y-2">
            {approvedFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`w-full text-left glass p-3 flex items-center gap-3 transition-all ${
                  selectedFileId === file.id
                    ? "border border-primary/40 bg-primary/10"
                    : "border border-transparent hover:bg-white/[0.03]"
                }`}
              >
                <span className="text-base">🎬</span>
                <div className="min-w-0">
                  <p className="text-sm font-serif text-white/80 truncate">
                    {file.fileName}
                  </p>
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                    v{file.version} · {file.type}
                  </p>
                </div>
                {selectedFileId === file.id && (
                  <span className="ml-auto text-primary text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStage("idle")}
            className="flex-1 py-3 border border-white/10 text-white/30 text-[10px] uppercase tracking-widest hover:border-white/20 hover:text-white/50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!selectedFileId}
            className="flex-[2] py-3 bg-red-600/80 hover:bg-red-600 text-white text-[10px] uppercase tracking-widest font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <YoutubeIcon />
            Publish Now
          </button>
        </div>
      </div>
    );
  }

  // ── Publishing in-progress ────────────────────────────────────────────
  if (stage === "publishing") {
    return (
      <div className="space-y-4">
        <div className="glass p-6 text-center border border-red-500/10 bg-red-500/5">
          <div className="flex justify-center mb-3">
            <UploadSpinner />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-400 mb-1">
            Transmitting to YouTube
          </p>
          <p className="text-[9px] font-mono text-white/20">
            Streaming from R2 → YouTube Data API...
          </p>
        </div>
      </div>
    );
  }

  // ── Idle / default ────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500/60" />
        <p className="text-[10px] font-mono uppercase tracking-widest text-green-500/60">
          YouTube Connected
        </p>
      </div>
      <button
        onClick={() => setStage("selecting")}
        className="flex items-center justify-center gap-3 w-full py-3.5 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-300 text-[11px] font-semibold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <YoutubeIcon />
        Publish to YouTube
      </button>
      <p className="text-[9px] text-white/15 font-mono text-center italic">
        {approvedFiles.length} approved file{approvedFiles.length !== 1 ? "s" : ""} ready
      </p>
    </div>
  );

  async function handlePublish() {
    if (!selectedFileId) return;
    setStage("publishing");
    setErrorMsg("");
    try {
      const res = await fetch("/api/youtube/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, fileId: selectedFileId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Unknown error");
        setStage("error");
        return;
      }
      setPublishedUrl(data.youtubeUrl);
      setStage("done");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMsg(err.message);
      setStage("error");
    }
  }
}

function YoutubeIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M15.68 1.87A2.01 2.01 0 0 0 14.27.45C13.02.1 8 .1 8 .1S2.98.1 1.73.45A2.01 2.01 0 0 0 .32 1.87C0 3.13 0 5.7 0 5.7s0 2.57.32 3.83a2.01 2.01 0 0 0 1.41 1.42C2.98 11.3 8 11.3 8 11.3s5.02 0 6.27-.35a2.01 2.01 0 0 0 1.41-1.42C16 8.27 16 5.7 16 5.7s0-2.57-.32-3.83zM6.4 8.14V3.26l4.18 2.44-4.18 2.44z" />
    </svg>
  );
}

function UploadSpinner() {
  return (
    <svg
      className="animate-spin"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "rgb(239 68 68 / 0.7)" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
