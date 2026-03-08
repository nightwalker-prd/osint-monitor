"use client";

import { clsx } from "clsx";

interface GlowCardProps {
  children: React.ReactNode;
  color?: "cyan" | "amber" | "red" | "green" | "purple";
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const glowColors = {
  cyan: "hover:border-osint-cyan/30 hover:shadow-glow",
  amber: "hover:border-osint-amber/30 hover:shadow-glow-amber",
  red: "hover:border-osint-red/30 hover:shadow-glow-red",
  green: "hover:border-osint-green/30 hover:shadow-glow-green",
  purple: "hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]",
};

const activeGlow = {
  cyan: "border-osint-cyan/20 shadow-glow",
  amber: "border-osint-amber/20 shadow-glow-amber",
  red: "border-osint-red/20 shadow-glow-red",
  green: "border-osint-green/20 shadow-glow-green",
  purple: "border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]",
};

export default function GlowCard({ children, color = "cyan", className, hover = true, onClick }: GlowCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-osint-panel border border-osint-border rounded-sm transition-all duration-300",
        hover && glowColors[color],
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
