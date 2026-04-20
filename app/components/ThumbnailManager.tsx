"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Thumbnail {
  id: string;
  r2Key: string;
  isMain: boolean;
  createdAt: string;
}

interface ThumbnailManagerProps {
  projectId: string;
  youtubeVideoId: string | null;
}

export default function ThumbnailManager({ projectId, youtubeVideoId }: ThumbnailManagerProps) {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPushing, setIsPushing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchThumbnails();
  }, [projectId]);

  const fetchThumbnails = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/thumbnails`);
      const data = await res.json();
      if (res.ok) setThumbnails(data.thumbnails);
    } catch (err) {
      console.error("Failed to fetch thumbnails", err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get presigned URL
      const res = await fetch("/api/upload/presigned-url", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          projectId
        }),
      });
      const { signedUrl, key } = await res.json();

      // 2. Upload to R2
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      // 3. Finalize in DB
      await fetch("/api/upload/thumbnail", {
        method: "POST",
        body: JSON.stringify({ projectId, r2Key: key }),
      });

      await fetchThumbnails();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload failed", err);
      alert("Thumbnail upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const pushToYouTube = async (thumbnailId: string) => {
    if (!youtubeVideoId) {
      alert("Publish the video first before pushing thumbnails.");
      return;
    }

    setIsPushing(thumbnailId);
    try {
      const res = await fetch("/api/youtube/thumbnail", {
        method: "POST",
        body: JSON.stringify({ projectId, thumbnailId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Thumbnail pushed to YouTube successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Push failed", err);
      alert("Failed to push thumbnail");
    } finally {
      setIsPushing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-accent">Thumbnail Assets</h3>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-[10px] font-mono border border-accent/20 px-3 py-1 hover:bg-accent/10 transition-colors uppercase tracking-widest text-accent flex items-center gap-2"
        >
          {isUploading ? "Uploading..." : "+ Add New"}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
          accept="image/*"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {thumbnails.map((thumb) => (
          <div key={thumb.id} className="glass group relative aspect-video overflow-hidden border border-white/5 hover:border-accent/40 transition-all">
            {/* Aspect ratio container for the thumbnail would go here, currently just a placeholder background */}
            <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-xs font-mono text-white/10 uppercase tracking-tighter">
              {thumb.r2Key.split('/').pop()}
            </div>
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
              <button 
                onClick={() => pushToYouTube(thumb.id)}
                disabled={!!isPushing || !youtubeVideoId}
                className={`w-full py-2 text-[9px] font-mono font-bold uppercase tracking-widest transition-all ${
                  youtubeVideoId 
                    ? "bg-accent text-black hover:bg-accent/80" 
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                {isPushing === thumb.id ? "Pushing..." : "Push to YouTube"}
              </button>
              {!youtubeVideoId && (
                <p className="text-[8px] text-white/40 font-mono text-center">Video not published yet</p>
              )}
            </div>
          </div>
        ))}

        {thumbnails.length === 0 && !isUploading && (
          <div className="col-span-2 glass border-dashed border-white/10 py-10 text-center">
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">No thumbnails detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
