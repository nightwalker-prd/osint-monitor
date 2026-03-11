'use client';

import { useState } from 'react';
import {
  Settings, Database, Bell, Key, Palette, Shield, Globe, Radio,
  MessageSquare, Wallet, Check, X, ChevronRight, ToggleLeft, ToggleRight,
  Plus, Trash2, Eye, EyeOff, RefreshCw
} from 'lucide-react';

type SettingsTab = 'sources' | 'alerts' | 'api' | 'preferences';

interface DataSource {
  id: string;
  name: string;
  type: string;
  icon: JSX.Element;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  enabled: boolean;
  recordCount: number;
}

interface AlertRuleConfig {
  id: string;
  name: string;
  enabled: boolean;
  condition: string;
  action: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  triggerCount: number;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string;
  created: string;
  permissions: string[];
}

const dataSources: DataSource[] = [
  { id: 'ds-001', name: 'OSINT Aggregator', type: 'OSINT', icon: <Globe className="w-4 h-4" />, status: 'connected', lastSync: '2 min ago', enabled: true, recordCount: 24500 },
  { id: 'ds-002', name: 'Dark Web Crawler', type: 'Dark Web', icon: <Shield className="w-4 h-4" />, status: 'connected', lastSync: '15 min ago', enabled: true, recordCount: 1247 },
  { id: 'ds-003', name: 'SIGINT Collector', type: 'SIGINT', icon: <Radio className="w-4 h-4" />, status: 'syncing', lastSync: 'Syncing...', enabled: true, recordCount: 1341 },
  { id: 'ds-004', name: 'Threat Intel Feed', type: 'CTI', icon: <Shield className="w-4 h-4" />, status: 'connected', lastSync: '5 min ago', enabled: true, recordCount: 8920 },
  { id: 'ds-005', name: 'Social Media Monitor', type: 'Social', icon: <MessageSquare className="w-4 h-4" />, status: 'connected', lastSync: '1 min ago', enabled: true, recordCount: 156000 },
  { id: 'ds-006', name: 'Blockchain Analytics', type: 'FININT', icon: <Wallet className="w-4 h-4" />, status: 'connected', lastSync: '8 min ago', enabled: true, recordCount: 1847 },
  { id: 'ds-007', name: 'Email Gateway', type: 'Email', icon: <MessageSquare className="w-4 h-4" />, status: 'error', lastSync: 'Connection failed', enabled: true, recordCount: 0 },
  { id: 'ds-008', name: 'Vulnerability Scanner', type: 'Vuln', icon: <Shield className="w-4 h-4" />, status: 'disconnected', lastSync: 'Never', enabled: false, recordCount: 0 },
];

const alertRules: AlertRuleConfig[] = [
  { id: 'ar-001', name: 'Critical C2 Detection', enabled: true, condition: 'EDR beacon to known C2 IP', action: 'Auto-escalate to IR team, isolate host', severity: 'critical', triggerCount: 12 },
  { id: 'ar-002', name: 'Credential Leak Alert', enabled: true, condition: 'Dark web mention of org domain + credentials', action: 'Notify SOC, begin validation', severity: 'critical', triggerCount: 34 },
  { id: 'ar-003', name: 'Zero-Day in Wild', enabled: true, condition: 'CVE with no patch + active exploitation', action: 'Flash alert to all teams, block at perimeter', severity: 'critical', triggerCount: 3 },
  { id: 'ar-004', name: 'Ransomware Indicator', enabled: true, condition: 'Known ransomware signature or behavior', action: 'Isolate segment, engage IR team', severity: 'high', triggerCount: 8 },
  { id: 'ar-005', name: 'DDoS Warning', enabled: true, condition: 'SIGINT/OSINT indicates planned attack', action: 'Engage CDN, notify targets, pre-position defenses', severity: 'high', triggerCount: 5 },
  { id: 'ar-006', name: 'Insider Threat Indicator', enabled: true, condition: 'Anomalous data access pattern + dark web recruitment post', action: 'Notify CI team, begin behavioral analysis', severity: 'medium', triggerCount: 2 },
  { id: 'ar-007', name: 'Anomalous Scan Activity', enabled: false, condition: 'Port scan volume > 300% baseline', action: 'Log, correlate with threat actors', severity: 'low', triggerCount: 22 },
];

const apiKeys: APIKey[] = [
  { id: 'ak-001', name: 'Production Dashboard', key: 'osk_prod_a1b2c3d4e5f6...', lastUsed: '2 min ago', created: '2026-01-15', permissions: ['read:all', 'write:alerts'] },
  { id: 'ak-002', name: 'SIEM Integration', key: 'osk_siem_f7e8d9c0b1a2...', lastUsed: '5 min ago', created: '2026-02-01', permissions: ['read:alerts', 'read:intel', 'write:incidents'] },
  { id: 'ak-003', name: 'Mobile App', key: 'osk_mob_c3d4e5f6a7b8...', lastUsed: '1 hour ago', created: '2026-02-20', permissions: ['read:alerts', 'read:metrics'] },
];

const statusColors: Record<string, { dot: string; text: string }> = {
  connected: { dot: 'bg-green-500', text: 'text-green-400' },
  disconnected: { dot: 'bg-gray-500', text: 'text-gray-400' },
  error: { dot: 'bg-red-500', text: 'text-red-400' },
  syncing: { dot: 'bg-amber-500 animate-pulse', text: 'text-amber-400' },
};

const sevColors: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10',
  high: 'text-orange-400 bg-orange-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  low: 'text-blue-400 bg-blue-500/10',
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('sources');
  const [sources, setSources] = useState(dataSources);
  const [rules, setRules] = useState(alertRules);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const tabs: { key: SettingsTab; label: string; icon: JSX.Element }[] = [
    { key: 'sources', label: 'Data Sources', icon: <Database className="w-4 h-4" /> },
    { key: 'alerts', label: 'Alert Rules', icon: <Bell className="w-4 h-4" /> },
    { key: 'api', label: 'API Keys', icon: <Key className="w-4 h-4" /> },
    { key: 'preferences', label: 'Preferences', icon: <Palette className="w-4 h-4" /> },
  ];

  const toggleSource = (id: string) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  return (
    <div className="min-h-screen bg-[#080d16] text-gray-100">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0f1a]/80">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" /> Configuration
          </h1>
          <p className="text-xs text-gray-500 mt-1">Manage data sources, alert rules, API access, and preferences</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Tab Navigation */}
          <div className="w-48 flex-shrink-0">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'sources' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-200">Data Sources</h2>
                  <button className="px-3 py-1.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Source
                  </button>
                </div>
                <div className="space-y-2">
                  {sources.map((source) => {
                    const sc = statusColors[source.status];
                    return (
                      <div key={source.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                          {source.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-200">{source.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{source.type}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px]">
                            <span className="flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              <span className={sc.text}>{source.status}</span>
                            </span>
                            <span className="text-gray-500">Last sync: {source.lastSync}</span>
                            {source.recordCount > 0 && (
                              <span className="text-gray-500">{source.recordCount.toLocaleString()} records</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-cyan-400">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleSource(source.id)}
                            className={`transition-colors ${source.enabled ? 'text-cyan-400' : 'text-gray-600'}`}
                          >
                            {source.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-200">Alert Rules</h2>
                  <button className="px-3 py-1.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> New Rule
                  </button>
                </div>
                <div className="space-y-2">
                  {rules.map((rule) => (
                    <div key={rule.id} className={`p-4 rounded-lg border transition-colors ${
                      rule.enabled ? 'bg-white/[0.02] border-white/5' : 'bg-white/[0.01] border-white/[0.03] opacity-60'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${sevColors[rule.severity]}`}>
                            {rule.severity}
                          </span>
                          <span className="text-xs font-medium text-gray-200">{rule.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-500 font-mono">{rule.triggerCount} triggers</span>
                          <button
                            onClick={() => toggleRule(rule.id)}
                            className={`transition-colors ${rule.enabled ? 'text-cyan-400' : 'text-gray-600'}`}
                          >
                            {rule.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider">Condition:</span>
                          <p className="text-gray-400 mt-0.5">{rule.condition}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider">Action:</span>
                          <p className="text-gray-400 mt-0.5">{rule.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-200">API Keys</h2>
                  <button className="px-3 py-1.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Generate Key
                  </button>
                </div>
                <div className="space-y-2">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-200">{key.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowKeys((prev) => ({ ...prev, [key.id]: !prev[key.id] }))}
                            className="p-1 rounded hover:bg-white/5 text-gray-500"
                          >
                            {showKeys[key.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-black/30 rounded px-3 py-1.5 font-mono text-[11px] text-cyan-400 mb-2">
                        {showKeys[key.id] ? key.key : key.key.replace(/[a-z0-9]/gi, '*')}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-gray-500">
                        <span>Last used: {key.lastUsed}</span>
                        <span>Created: {key.created}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {key.permissions.map((p) => (
                          <span key={p} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/10">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-sm font-bold text-gray-200">Preferences</h2>

                {/* Theme */}
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <h3 className="text-xs font-bold text-gray-300 mb-3">Appearance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-300">Theme</span>
                        <p className="text-[10px] text-gray-500">Dashboard color scheme</p>
                      </div>
                      <div className="flex gap-2">
                        {['Midnight', 'Palantir Dark', 'Matrix Green', 'Stealth'].map((theme, i) => (
                          <button
                            key={theme}
                            className={`px-3 py-1 rounded text-[10px] border transition-all ${
                              i === 1 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-300">Compact Mode</span>
                        <p className="text-[10px] text-gray-500">Reduce padding for more data density</p>
                      </div>
                      <ToggleLeft className="w-6 h-6 text-gray-600 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-300">Animation Effects</span>
                        <p className="text-[10px] text-gray-500">Glow, pulse, and transition effects</p>
                      </div>
                      <ToggleRight className="w-6 h-6 text-cyan-400 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <h3 className="text-xs font-bold text-gray-300 mb-3">Notifications</h3>
                  <div className="space-y-3">
                    {['Critical Alerts', 'Dark Web Mentions', 'SIGINT Flash Traffic', 'Report Ready', 'System Updates'].map((item, i) => (
                      <div key={item} className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">{item}</span>
                        {i < 3 ? (
                          <ToggleRight className="w-6 h-6 text-cyan-400 cursor-pointer" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-600 cursor-pointer" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data */}
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <h3 className="text-xs font-bold text-gray-300 mb-3">Data & Privacy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-300">Data Retention</span>
                        <p className="text-[10px] text-gray-500">How long to keep collected intelligence</p>
                      </div>
                      <select className="bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 px-2 py-1 outline-none">
                        <option>30 days</option>
                        <option>90 days</option>
                        <option>1 year</option>
                        <option>Indefinite</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-300">Default Classification</span>
                        <p className="text-[10px] text-gray-500">Default classification for new reports</p>
                      </div>
                      <select className="bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 px-2 py-1 outline-none">
                        <option>UNCLASSIFIED</option>
                        <option>CONFIDENTIAL</option>
                        <option>SECRET</option>
                        <option>TOP SECRET</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
