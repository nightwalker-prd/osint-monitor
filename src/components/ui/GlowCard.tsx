"use client";
import { clsx } from "clsx";

interface GlowCardProps {
  children: React.ReactNode;
  color?: "cyan" | "red" | "amber" | "green" | "purple";
  className?: string;
  onClick?: () => void;
}

const glowColors = {
  cyan: "hover:shadow-glow border-osint-cyan/20",
  red: "hover:shadow-glow-red border-osint-red/20",
  amber: "hover:border-osint-amber/30",
  green: "hover:border-osint-green/30",
  purple: "hover:border-osint-purple/30",
};

export default function GlowCard({ children, color = "cyan", className, onClick }: GlowCardProps) {
  return (
    <div className={clsx("bg-osint-surface/50 border border-osint-border transition-all duration-300", glowColors[color], onClick && "cursor-pointer", className)} onClick={onClick}>
      {children}
    </div>
  );
}
