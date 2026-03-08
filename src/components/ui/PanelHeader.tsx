"use client";

import { useState } from "react";
import { Minimize2, Maximize2, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";
import StatusIndicator from "./StatusIndicator";

interface PanelHeaderProps {
  title: string;
  icon?: React.ReactNode;
  status?: "live" | "offline" | "warning" | "processing";
  count?: number;
  onMinimize?: () => void;
  isMinimized?: boolean;
  actions?: React.ReactNode;
}

export default function PanelHeader({ title, icon, status, count, onMinimize, isMinimized, actions }: PanelHeaderProps) {
  return (
    <div className="panel-header group">
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-osint-cyan">{icon}</span>}
        <h3 className="panel-title">{title}</h3>
        {count !== undefined && (
          <span className="px-1.5 py-0.5 text-[10px] font-mono bg-osint-surface border border-osint-border text-osint-text-dim rounded-sm">
            {count}
          </span>
        )}
        {status && <StatusIndicator status={status} showLabel={false} />}
      </div>
      <div className="flex items-center gap-1">
        {actions}
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-1 text-osint-text-muted hover:text-osint-text transition-colors opacity-0 group-hover:opacity-100"
          >
            {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          </button>
        )}
        <button className="p-1 text-osint-text-muted hover:text-osint-text transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={12} />
        </button>
      </div>
    </div>
  );
}
