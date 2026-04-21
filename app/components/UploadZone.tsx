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
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isFetchingDrive, setIsFetchingDrive] = useState(false);
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

  const fetchDriveFiles = async () => {
    setIsFetchingDrive(true);
    setShowDriveModal(true);
    try {
      const res = await fetch("/api/drive/files");
      const data = await res.json();
      if (res.ok) {
        setDriveFiles(data.files || []);
      } else {
        alert("Failed to fetch drive files: " + data.error);
        setShowDriveModal(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingDrive(false);
    }
  };

  const handleDriveImport = async (fileId: string, fileName: string) => {
    setShowDriveModal(false);
    setIsUploading(true);
    setProgress(20);
    try {
      const importRes = await fetch("/api/drive/import", {
        method: "POST",
        body: JSON.stringify({ fileId, projectId }),
      });
      const data = await importRes.json();
      
      if (!importRes.ok) throw new Error(data.error);
      
      setProgress(80);
      
      await fetch("/api/upload/finalize", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          uploaderId,
          r2Key: data.key,
          fileName: data.fileName,
          fileSize: data.fileSize,
          type: fileType
        }),
      });

      setProgress(100);
      router.refresh();
    } catch (e) {
      alert("Drive Import failed: " + String(e));
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

      <button
        onClick={fetchDriveFiles}
        disabled={isUploading}
        className="w-full py-3 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2"
      >
        <span>☁️</span> Import from Google Drive
      </button>

      {/* Drive Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg text-white">Your Drive Videos</h3>
              <button onClick={() => setShowDriveModal(false)} className="text-white/40 hover:text-white p-2">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              {isFetchingDrive ? (
                <div className="text-center py-10 text-white/40 font-mono text-xs animate-pulse">Scanning Drive...</div>
              ) : driveFiles.length === 0 ? (
                <div className="text-center py-10 text-white/40 text-sm">No video files found in your Drive.</div>
              ) : (
                driveFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {file.thumbnailLink ? (
                        <img src={file.thumbnailLink} alt="" className="w-10 h-10 object-cover rounded-md flex-shrink-0 bg-black" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">🎥</div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate w-48">{file.name}</p>
                        <p className="text-[10px] text-white/40 font-mono mt-1">{(Number(file.size) / (1024*1024)).toFixed(1)} MB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDriveImport(file.id, file.name)}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors shrink-0"
                    >
                      Import
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
