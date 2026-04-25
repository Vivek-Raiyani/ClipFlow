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
        className="w-full flex items-center justify-between p-2 rounded-xl border border-black/5 bg-black/[0.02] hover:bg-black/[0.04] transition-all"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {activeChannel ? (
            <img
              src={activeChannel.channelThumbnail}
              alt={activeChannel.channelTitle}
              className="w-6 h-6 rounded-full shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center shrink-0">
              <BrandIcon name="youtube" size={12} monochrome />
            </div>
          )}
          <span className="text-xs font-medium truncate text-black/80">
            {activeChannel ? activeChannel.channelTitle : "Connect Channel"}
          </span>
        </div>
        <ChevronDown size={14} className={`text-black/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-2 right-2 mt-1 bg-white border border-black/10 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="px-3 py-2 text-[10px] font-bold text-black/40 uppercase tracking-wider">
              Your Channels
            </div>
            
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => switchChannel(channel.id)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-black/5 transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <img
                    src={channel.channelThumbnail}
                    alt={channel.channelTitle}
                    className="w-5 h-5 rounded-full shrink-0"
                  />
                  <span className="text-xs text-black/70 truncate">
                    {channel.channelTitle}
                  </span>
                </div>
                {channel.id === activeChannelId && (
                  <Check size={12} className="text-black/80" />
                )}
              </button>
            ))}

            <div className="h-px bg-black/5 my-1" />
            
            <a
              href="/api/auth/youtube"
              className="flex items-center gap-2 px-3 py-2 text-xs text-black/60 hover:text-black hover:bg-black/5 transition-all"
            >
              <Plus size={14} />
              Connect new channel
            </a>
          </div>
        </>
      )}
    </div>
  );
}
