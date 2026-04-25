"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

const themes = [
  { id: "clipflow", label: "ClipFlow (Light)" },
  { id: "dim", label: "Dim (Dark)" },
  { id: "business", label: "Business" },
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("clipflow");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "clipflow";
    setCurrentTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  if (!mounted) {
    return (
      <select className="select select-sm select-ghost text-[12px]" disabled>
        <option>Theme...</option>
      </select>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Palette size={14} className="text-[var(--text-secondary)] hidden sm:block" />
      <select 
        className="select select-sm select-ghost text-[12px] bg-transparent border-[var(--border-subtle)] focus:outline-none focus:border-[var(--primary)]"
        value={currentTheme}
        onChange={(e) => handleThemeChange(e.target.value)}
        aria-label="Theme Switcher"
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
}
