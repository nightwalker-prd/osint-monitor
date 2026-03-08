"use client";

import { clsx } from "clsx";

type ThreatLevel = "critical" | "high" | "medium" | "low" | "info";

interface ThreatBadgeProps {
  level: ThreatLevel;
  label?: string;
  pulse?: boolean;
  size?: "sm" | "md";
}

const config: Record<ThreatLevel, { bg: string; text: string; border: string; dot: string; defaultLabel: string }> = {
  critical: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-400",
    defaultLabel: "CRITICAL",
  },
  high: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
    dot: "bg-orange-400",
    defaultLabel: "HIGH",
  },
  medium: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    defaultLabel: "MEDIUM",
  },
  low: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/30",
    dot: "bg-green-400",
    defaultLabel: "LOW",
  },
  info: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    dot: "bg-cyan-400",
    defaultLabel: "INFO",
  },
};

export default function ThreatBadge({ level, label, pulse = false, size = "sm" }: ThreatBadgeProps) {
  const c = config[level];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 border font-mono uppercase tracking-wider",
        c.bg, c.text, c.border,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full", c.dot, pulse && "animate-pulse")} />
      {label || c.defaultLabel}
    </span>
  );
}
