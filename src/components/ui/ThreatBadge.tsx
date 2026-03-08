"use client";
import { clsx } from "clsx";

interface ThreatBadgeProps {
  level: "critical" | "high" | "medium" | "low";
  size?: "sm" | "md";
}

const badgeConfig = {
  critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", label: "CRITICAL" },
  high: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30", label: "HIGH" },
  medium: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", label: "MEDIUM" },
  low: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30", label: "LOW" },
};

export default function ThreatBadge({ level, size = "md" }: ThreatBadgeProps) {
  const config = badgeConfig[level];
  return (
    <span className={clsx("font-mono uppercase tracking-wider border", config.bg, config.text, config.border, size === "sm" ? "text-[8px] px-1 py-0.5" : "text-[10px] px-1.5 py-0.5")}>
      {config.label}
    </span>
  );
}
