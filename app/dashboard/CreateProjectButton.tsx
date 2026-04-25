"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { ModalShell } from "@/app/components/Modal";
import { InputField } from "@/app/components/InputField";
import { Plus, Terminal } from "lucide-react";

export function CreateProjectButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      const data = await res.json();
      if (data.id) {
        setOpen(false);
        setTitle("");
        router.push(`/dashboard/project/${data.id}`);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="primary"
        icon={<Plus size={13} strokeWidth={2.5} />}
        onClick={() => setOpen(true)}
      >
        New Project
      </Button>

      {open && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(250,249,246,0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 100, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <ModalShell
            title="Establish Pipeline"
            subtitle="Define a secure environment for your next creative evolution."
            pillText="Protocol Initialization"
            pillIcon={<Terminal size={10} strokeWidth={2} color="rgba(0,0,0,0.3)" />}
            onClose={() => setOpen(false)}
          >
            <div style={{ marginBottom: "28px" }}>
              <InputField
                label="Pipeline Identifier"
                subLabel="Unique Name"
                placeholder="e.g. Cinematic Vlog 04"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <Button
              variant="primary"
              style={{ width: "100%", justifyContent: "center", padding: "18px", borderRadius: "14px" }}
              onClick={handleCreate}
              disabled={loading || !title.trim()}
            >
              {loading ? "Initializing…" : "Initialize Core"}
            </Button>
            <p style={{
              textAlign: "center", fontFamily: "var(--ui-mono)",
              fontSize: "9px", color: "var(--ui-fg3)",
              marginTop: "14px", letterSpacing: "0.15em", textTransform: "uppercase",
            }}>
              By initializing, you agree to the deployment protocols.
            </p>
          </ModalShell>
        </div>
      )}
    </>
  );
}
