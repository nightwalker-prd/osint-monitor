"use client";

import { useState } from "react";
import {
  LayoutDashboard, Map, GitBranch, Clock, Users, Radio, Settings,
  ChevronLeft, ChevronRight, Shield, Eye
} from "lucide-react";
import { clsx } from "clsx";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, active: true },
  { id: "map", label: "Geospatial", icon: <Map size={18} /> },
  { id: "graph", label: "Link Analysis", icon: <GitBranch size={18} /> },
  { id: "timeline", label: "Timeline", icon: <Clock size={18} /> },
  { id: "entities", label: "Entities", icon: <Users size={18} />, badge: 24 },
  { id: "feeds", label: "Intel Feeds", icon: <Radio size={18} />, badge: 7 },
];

const bottomItems: NavItem[] = [
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState("dashboard");

  return (
    <aside
      className={clsx(
        "h-screen bg-osint-panel border-r border-osint-border flex flex-col transition-all duration-300 relative z-20",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-osint-border">
        <div className="w-8 h-8 bg-osint-cyan/10 border border-osint-cyan/30 flex items-center justify-center flex-shrink-0">
          <Eye size={16} className="text-osint-cyan" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <div className="text-sm font-semibold text-osint-text tracking-wide">OSINT</div>
            <div className="text-[10px] font-mono text-osint-text-muted tracking-widest">MONITOR v0.1</div>
          </div>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 group relative",
              activeId === item.id
                ? "bg-osint-cyan/10 text-osint-cyan border-l-2 border-osint-cyan"
                : "text-osint-text-dim hover:text-osint-text hover:bg-osint-surface/50 border-l-2 border-transparent"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="flex-1 text-left truncate animate-fade-in">{item.label}</span>
            )}
            {!collapsed && item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-osint-surface border border-osint-border rounded-sm">
                {item.badge}
              </span>
            )}
            {collapsed && item.badge && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-osint-cyan rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="py-3 px-2 border-t border-osint-border space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200",
              activeId === item.id
                ? "bg-osint-cyan/10 text-osint-cyan"
                : "text-osint-text-dim hover:text-osint-text hover:bg-osint-surface/50"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="animate-fade-in">{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-osint-panel border border-osint-border flex items-center justify-center text-osint-text-muted hover:text-osint-cyan transition-colors z-30"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
