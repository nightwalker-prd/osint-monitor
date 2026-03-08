"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Shield, Wifi, Clock } from "lucide-react";
import StatusIndicator from "@/components/ui/StatusIndicator";
import ThreatBadge from "@/components/ui/ThreatBadge";

export default function TopBar() {
  const [time, setTime] = useState("");
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setUtcTime(now.toUTCString().slice(17, 25) + " UTC");
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-12 bg-osint-panel border-b border-osint-border flex items-center justify-between px-4 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-osint-cyan" />
          <span className="text-xs font-semibold text-osint-text tracking-wide">OPERATION SENTINEL</span>
        </div>
        <div className="h-4 w-px bg-osint-border" />
        <ThreatBadge level="high" label="THREAT LEVEL: ELEVATED" pulse />
      </div>

      {/* Center - Search */}
      <button className="flex items-center gap-2 px-3 py-1.5 bg-osint-surface border border-osint-border text-osint-text-muted hover:text-osint-text hover:border-osint-border-light transition-colors min-w-[280px]">
        <Search size={13} />
        <span className="text-xs">Search entities, locations, events...</span>
        <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-osint-panel border border-osint-border rounded-sm">
          Cmd+K
        </kbd>
      </button>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <StatusIndicator status="live" label="CONNECTED" />
        <div className="h-4 w-px bg-osint-border" />
        <div className="flex items-center gap-2">
          <Wifi size={12} className="text-osint-green" />
          <span className="text-[10px] font-mono text-osint-text-dim">12 SOURCES</span>
        </div>
        <div className="h-4 w-px bg-osint-border" />
        <button className="relative p-1.5 text-osint-text-muted hover:text-osint-text transition-colors">
          <Bell size={14} />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-osint-red text-white text-[8px] font-mono flex items-center justify-center rounded-full">
            3
          </span>
        </button>
        <div className="h-4 w-px bg-osint-border" />
        <div className="flex items-center gap-2 text-osint-text-dim">
          <Clock size={12} />
          <div className="text-right">
            <div className="text-[10px] font-mono leading-none">{time}</div>
            <div className="text-[9px] font-mono text-osint-text-muted leading-none mt-0.5">{utcTime}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
