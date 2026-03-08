"use client";
import { clsx } from "clsx";

interface StatusIndicatorProps {
  status: "live" | "offline" | "warning" | "processing";
  label?: string;
  showLabel?: boolean;
}

const statusConfig = {
  live: { color: "bg-osint-green", label: "LIVE", textColor: "text-green-400" },
  offline: { color: "bg-osint-red", label: "OFFLINE", textColor: "text-red-400" },
  warning: { color: "bg-osint-amber", label: "WARNING", textColor: "text-amber-400" },
  processing: { color: "bg-osint-cyan", label: "PROCESSING", textColor: "text-cyan-400" },
};

export default function StatusIndicator({ status, label, showLabel = true }: StatusIndicatorProps) {
  const config = statusConfig[status];
  return (
    <div className="flex items-center gap-1.5">
      <span className={clsx("w-1.5 h-1.5 rounded-full", config.color, status === "live" && "animate-pulse-slow")} />
      {showLabel && (
        <span className={clsx("text-[10px] font-mono uppercase tracking-wider", config.textColor)}>
          {label || config.label}
        </span>
      )}
    </div>
  );
}
