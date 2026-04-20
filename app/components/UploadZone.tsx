"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface UploadZoneProps {
  projectId: string;
  uploaderId: string;
}

export default function UploadZone({ projectId, uploaderId }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileType, setFileType] = useState<"raw" | "draft" | "final">("draft");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(10);

    try {
      const res = await fetch("/api/upload/presigned-url", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          projectId
        }),
      });

      const { signedUrl, key } = await res.json();
      setProgress(30);

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) throw new Error("R2 Upload failed");
      setProgress(80);

      await fetch("/api/upload/finalize", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          uploaderId,
          r2Key: key,
          fileName: file.name,
          fileSize: file.size,
          type: fileType
        }),
      });

      setProgress(100);
      router.refresh();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed. Check console or credentials.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-lg border border-white/5">
        {(["raw", "draft", "final"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFileType(t)}
            className={`flex-1 text-[9px] font-mono uppercase tracking-[0.2em] py-2 rounded-md transition-all ${
              fileType === t ? "bg-white/10 text-white shadow-xl" : "text-white/20 hover:text-white/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`group relative border-2 border-dashed rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden ${
          isUploading 
            ? "border-primary/50 bg-primary/[0.02]" 
            : "border-white/5 bg-white/[0.01] hover:border-primary/30 hover:bg-white/[0.03]"
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
          disabled={isUploading}
        />
        
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-3xl" />

        <div className="relative z-10 p-12 text-center">
          {isUploading ? (
            <div className="space-y-6">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                <div 
                  className="absolute inset-0 border-2 border-primary rounded-full border-t-transparent animate-spin" 
                  style={{ animationDuration: '0.8s' }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-primary font-bold">
                  {progress}%
                </span>
              </div>
              <div className="space-y-2">
                <p className="font-mono text-[10px] text-primary uppercase tracking-[0.5em] animate-pulse">Encrypting Node...</p>
                <div className="max-w-[120px] mx-auto bg-white/5 h-[1px] relative overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-500 absolute left-0 top-0" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto group-hover:border-primary/30 transition-all active:scale-95">
                <span className="text-2xl grayscale group-hover:grayscale-0 transition-all group-hover:scale-110">🛰️</span>
              </div>
              <div>
                <p className="font-serif text-lg mb-1 group-hover:text-primary transition-colors">Beam Data to R2</p>
                <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em]">Zero Egress Publication Protocol</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
