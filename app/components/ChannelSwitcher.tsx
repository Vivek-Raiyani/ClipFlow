"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Plus, Check } from "lucide-react";
import { BrandIcon } from "./BrandIcon";

interface Channel {
  id: string;
  youtubeChannelId: string;
  channelTitle: string;
  channelThumbnail: string;
}

export function ChannelSwitcher() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const res = await fetch("/api/youtube/channels");
      const data = await res.json();
      if (data.channels) {
        setChannels(data.channels);
        setActiveChannelId(data.activeChannelId);
      }
    } catch (error) {
      console.error("Failed to fetch channels", error);
    } finally {
      setLoading(false);
    }
  };

  const switchChannel = async (id: string) => {
    try {
      const res = await fetch("/api/youtube/channels/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: id }),
      });
      if (res.ok) {
        setActiveChannelId(id);
        setIsOpen(false);
        // Refresh page or trigger global state update to filter projects
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Failed to switch channel", error);
    }
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  if (loading && channels.length === 0) return (
    <div className="px-2 mb-6">
      <div className="h-10 bg-black/5 animate-pulse rounded-xl" />
    </div>
  );

  return (
    <div className="relative px-2 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg2)] hover:bg-[var(--ui-fg4)] transition-all"
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {activeChannel ? (
            <img
              src={activeChannel.channelThumbnail}
              alt={activeChannel.channelTitle}
              className="w-5 h-5 rounded-full shrink-0 grayscale-[0.2] opacity-90"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[var(--ui-fg4)] flex items-center justify-center shrink-0">
              <BrandIcon name="youtube" size={10} monochrome color="var(--ui-fg3)" />
            </div>
          )}
          <span className="text-[11px] font-medium truncate text-[var(--ui-fg2)]">
            {activeChannel ? activeChannel.channelTitle : "Connect Channel"}
          </span>
        </div>
        <ChevronDown size={12} className={`text-[var(--ui-fg3)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div 
            className="absolute top-full left-2 right-2 mt-2 bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2"
          >
            <div className="px-4 py-2 text-[8.5px] font-bold text-[var(--ui-fg3)] uppercase tracking-[0.2em] font-[family-name:var(--ui-mono)]">
              Your Channels
            </div>
            
            <div className="max-h-[240px] overflow-y-auto">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => switchChannel(channel.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[var(--ui-fg4)] transition-colors"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={channel.channelThumbnail}
                      alt={channel.channelTitle}
                      className={`w-4.5 h-4.5 rounded-full shrink-0 ${channel.id === activeChannelId ? '' : 'grayscale opacity-70'}`}
                    />
                    <span className={`text-[11px] truncate ${channel.id === activeChannelId ? 'text-[var(--ui-fg)] font-medium' : 'text-[var(--ui-fg2)]'}`}>
                      {channel.channelTitle}
                    </span>
                  </div>
                  {channel.id === activeChannelId && (
                    <Check size={11} className="text-[var(--ui-fg)]" />
                  )}
                </button>
              ))}
            </div>

            {channels.length > 0 && <div className="h-px bg-[var(--ui-border)] mx-2 my-2" />}
            
            <a
              href="/api/auth/youtube"
              className="flex items-center gap-2.5 px-4 py-2.5 text-[9px] font-bold text-[var(--ui-fg3)] uppercase tracking-[0.15em] font-[family-name:var(--ui-mono)] hover:text-[var(--ui-fg)] hover:bg-[var(--ui-fg4)] transition-all text-decoration-none"
            >
              <Plus size={12} strokeWidth={2.5} />
              Connect new channel
            </a>
          </div>
        </>
      )}
    </div>
  );
}
