"use client";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchCommand() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-osint-panel border border-osint-border shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-osint-border">
          <Search size={16} className="text-osint-text-muted" />
          <input autoFocus placeholder="Search entities, locations, events, intel..." className="flex-1 bg-transparent text-sm text-osint-text placeholder:text-osint-text-muted outline-none" />
          <button onClick={() => setOpen(false)} className="text-osint-text-muted hover:text-osint-text"><X size={14} /></button>
        </div>
        <div className="px-4 py-8 text-center text-xs text-osint-text-muted font-mono">BEGIN TYPING TO SEARCH INTELLIGENCE DATABASE</div>
      </div>
    </div>
  );
}
