'use client';

import { useState } from 'react';
import { Bell, Check, ArrowUpRight, Clock, X, Filter, AlertTriangle, Shield, Ban, Eye, Siren } from 'lucide-react';
import { PanelHeader } from '../ui/PanelHeader';
import { alertsQueue, alertStats, type Alert } from '@/lib/mock-data/alerts-queue';

const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500', glow: 'shadow-red-500/20' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-500', glow: '' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-500', glow: '' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-500', glow: '' },
};

const statusConfig: Record<string, { label: string; color: string; icon: JSX.Element }> = {
  new: { label: 'NEW', color: 'text-red-400', icon: <Siren className="w-3 h-3" /> },
  acknowledged: { label: 'ACK', color: 'text-amber-400', icon: <Eye className="w-3 h-3" /> },
  investigating: { label: 'INVESTIGATING', color: 'text-cyan-400', icon: <Shield className="w-3 h-3" /> },
  escalated: { label: 'ESCALATED', color: 'text-purple-400', icon: <ArrowUpRight className="w-3 h-3" /> },
  resolved: { label: 'RESOLVED', color: 'text-green-400', icon: <Check className="w-3 h-3" /> },
  false_positive: { label: 'FALSE POS', color: 'text-gray-500', icon: <Ban className="w-3 h-3" /> },
};

const typeIcons: Record<string, string> = {
  intrusion: 'INT',
  data_leak: 'DLP',
  malware: 'MAL',
  phishing: 'PHI',
  ddos: 'DDS',
  insider: 'INS',
  policy: 'POL',
  recon: 'RCN',
};

export function AlertsPanel() {
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localAlerts, setLocalAlerts] = useState(alertsQueue);

  const filtered = localAlerts
    .filter((a) => !filterSeverity || a.severity === filterSeverity)
    .filter((a) => !filterStatus || a.status === filterStatus);

  const updateAlertStatus = (id: string, newStatus: Alert['status']) => {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Alerts Center"
        icon={<Bell className="w-4 h-4" />}
        subtitle={`${alertStats.unresolved} unresolved | ${alertStats.avgResponseTime} avg response`}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 p-3 border-b border-white/5">
        {(['critical', 'high', 'medium', 'low'] as const).map((sev) => {
          const config = severityConfig[sev];
          return (
            <div key={sev} className="text-center">
              <div className={`text-sm font-mono font-bold ${config.color}`}>{alertStats[sev]}</div>
              <div className="text-[8px] text-gray-500 uppercase">{sev}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="px-3 py-2 border-b border-white/5 space-y-1">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-gray-600" />
          {['critical', 'high', 'medium', 'low'].map((sev) => {
            const config = severityConfig[sev as keyof typeof severityConfig];
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
                className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider border transition-all ${
                  filterSeverity === sev
                    ? `${config.bg} ${config.border} ${config.color}`
                    : 'border-white/5 text-gray-600 hover:text-gray-400'
                }`}
              >
                {sev}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3" />
          {['new', 'acknowledged', 'investigating', 'escalated'].map((st) => {
            const config = statusConfig[st];
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(filterStatus === st ? null : st)}
                className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider border transition-all ${
                  filterStatus === st
                    ? `bg-white/10 border-white/20 ${config.color}`
                    : 'border-white/5 text-gray-600 hover:text-gray-400'
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.map((alert) => {
          const sevConfig = severityConfig[alert.severity];
          const statConfig = statusConfig[alert.status];
          const isExpanded = expandedId === alert.id;

          return (
            <div
              key={alert.id}
              className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                alert.severity === 'critical' && alert.status === 'new' ? 'border-l-2 border-l-red-500' : ''
              } ${isExpanded ? 'bg-white/[0.03]' : ''}`}
            >
              <div
                className="p-3 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded flex items-center justify-center ${sevConfig.bg} border ${sevConfig.border}`}>
                      <span className="text-[8px] font-mono font-bold text-gray-300">{typeIcons[alert.type]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${sevConfig.dot} ${alert.status === 'new' ? 'animate-pulse' : ''}`} />
                        <span className={`text-[9px] uppercase font-bold tracking-wider ${sevConfig.color}`}>
                          {alert.severity}
                        </span>
                        <span className={`text-[9px] flex items-center gap-0.5 ${statConfig.color}`}>
                          {statConfig.icon} {statConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.ttl && alert.status !== 'resolved' && (
                      <span className="text-[9px] text-red-400 flex items-center gap-0.5 font-mono">
                        <Clock className="w-2.5 h-2.5" /> {alert.ttl}m
                      </span>
                    )}
                    <span className="text-[9px] text-gray-500 font-mono">
                      {alert.correlationCount} corr.
                    </span>
                  </div>
                </div>

                <h4 className="text-xs text-gray-200 leading-tight mb-1 ml-9">{alert.title}</h4>
                <p className="text-[10px] text-gray-500 line-clamp-1 ml-9">{alert.description}</p>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-3 pb-3 ml-9 space-y-3">
                  <p className="text-[11px] text-gray-400 leading-relaxed">{alert.description}</p>

                  {/* Indicators */}
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Indicators</div>
                    <div className="flex flex-wrap gap-1">
                      {alert.indicators.map((ioc) => (
                        <span key={ioc} className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                          {ioc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Related Entities */}
                  {alert.relatedEntities.length > 0 && (
                    <div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Linked Entities</div>
                      <div className="flex gap-1">
                        {alert.relatedEntities.map((e) => (
                          <span key={e} className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {alert.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded text-[8px] bg-white/5 text-gray-500 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  {alert.status !== 'resolved' && alert.status !== 'false_positive' && (
                    <div className="flex items-center gap-2 pt-1">
                      {alert.status === 'new' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateAlertStatus(alert.id, 'acknowledged'); }}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      {(alert.status === 'new' || alert.status === 'acknowledged') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateAlertStatus(alert.id, 'investigating'); }}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                        >
                          Investigate
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); updateAlertStatus(alert.id, 'escalated'); }}
                        className="px-2 py-1 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
                      >
                        Escalate
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateAlertStatus(alert.id, 'resolved'); }}
                        className="px-2 py-1 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors flex items-center gap-0.5"
                      >
                        <Check className="w-3 h-3" /> Resolve
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateAlertStatus(alert.id, 'false_positive'); }}
                        className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10 transition-colors ml-auto"
                      >
                        False Positive
                      </button>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[9px] text-gray-600 pt-1">
                    <span>Source: {alert.source}</span>
                    {alert.assignee && <span>Assigned: <span className="text-gray-400">{alert.assignee}</span></span>}
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
