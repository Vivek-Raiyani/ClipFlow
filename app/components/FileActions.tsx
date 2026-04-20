"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FileActionsProps {
  fileId: string;
  currentStatus: string;
}

export default function FileActions({ fileId, currentStatus }: FileActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${fileId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== "pending") return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleStatusUpdate("rejected")}
        disabled={loading}
        className="px-3 py-1.5 border border-red-500/30 text-red-500 text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
      <button
        onClick={() => handleStatusUpdate("approved")}
        disabled={loading}
        className="px-3 py-1.5 border border-green-500/30 text-green-500 text-[10px] uppercase tracking-widest hover:bg-green-500/10 transition-colors disabled:opacity-50"
      >
        Approve
      </button>
    </div>
  );
}
