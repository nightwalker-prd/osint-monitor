'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Network,
  Clock,
  Users,
  Newspaper,
  Globe,
  Shield,
  MessageSquare,
  Radio,
  Bell,
  Wallet,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  Settings,
  FileText,
  Target,
  Fingerprint,
  Activity,
  Zap,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: JSX.Element;
  href: string;
  badge?: number;
  isNew?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, href: '/' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'Geo Map', icon: <Map className="w-4 h-4" />, href: '/#map' },
      { label: 'Network Graph', icon: <Network className="w-4 h-4" />, href: '/#graph' },
      { label: 'Timeline', icon: <Clock className="w-4 h-4" />, href: '/#timeline' },
      { label: 'Entities', icon: <Users className="w-4 h-4" />, href: '/#entities' },
      { label: 'Intel Feed', icon: <Newspaper className="w-4 h-4" />, href: '/#feed' },
    ],
  },
  {
    title: 'New Panels',
    items: [
      { label: 'Dark Web', icon: <Globe className="w-4 h-4" />, href: '/#darkweb', isNew: true },
      { label: 'Threat Actors', icon: <Fingerprint className="w-4 h-4" />, href: '/#actors', isNew: true },
      { label: 'Sentiment', icon: <MessageSquare className="w-4 h-4" />, href: '/#sentiment', isNew: true },
      { label: 'SIGINT', icon: <Radio className="w-4 h-4" />, href: '/#sigint', isNew: true },
      { label: 'Alerts', icon: <Bell className="w-4 h-4" />, href: '/#alerts', badge: 23, isNew: true },
    ],
  },
  {
    title: 'Workspaces',
    items: [
      { label: 'Investigation', icon: <Target className="w-4 h-4" />, href: '/investigation', isNew: true },
      { label: 'Reports', icon: <FileText className="w-4 h-4" />, href: '/reports', isNew: true },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '/settings', isNew: true },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col h-screen bg-[#080d16] border-r border-white/5 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-100 tracking-tight">NEXUS</span>
              <span className="text-[9px] text-cyan-400 block -mt-0.5 font-mono">OSINT PLATFORM</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto">
            <Shield className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {!collapsed && (
        <div className="px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-400 font-mono">SYSTEM OPERATIONAL</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Activity className="w-3 h-3 text-gray-600" />
            <span className="text-[9px] text-gray-600">47 collectors active</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-2">
            {!collapsed && (
              <div className="px-4 py-1">
                <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">
                  {section.title}
                </span>
              </div>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('#')[0]) && item.href.split('#')[0] !== '/');
              const isDashActive = item.href === '/' && pathname === '/';
              const active = isActive || isDashActive;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-1.5 mx-2 rounded-md text-xs transition-all group ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={active ? 'text-cyan-400' : 'text-gray-600 group-hover:text-gray-400'}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.isNew && (
                        <span className="text-[7px] px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                          NEW
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-white/5 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-[10px]">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
