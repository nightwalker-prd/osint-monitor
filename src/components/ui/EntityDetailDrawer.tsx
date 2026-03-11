'use client';

import { useState } from 'react';
import { X, User, Building, Globe, Server, Bug, MapPin, Wallet, FileText, Activity, Link, Shield, Clock, ChevronRight } from 'lucide-react';
import { threatActors } from '@/lib/mock-data/threat-actors';
import { alertsQueue } from '@/lib/mock-data/alerts-queue';
import { darkWebResults } from '@/lib/mock-data/dark-web-results';
import { sigintIntercepts } from '@/lib/mock-data/sigint-intercepts';

interface EntityDetailDrawerProps {
  entityId: string | null;
  entityType?: string;
  onClose: () => void;
}

type Tab = 'profile' | 'activity' | 'connections' | 'intel';

const typeIcons: Record<string, JSX.Element> = {
  person: <User className="w-4 h-4" />,
  organization: <Building className="w-4 h-4" />,
  domain: <Globe className="w-4 h-4" />,
  ip_address: <Server className="w-4 h-4" />,
  malware: <Bug className="w-4 h-4" />,
  location: <MapPin className="w-4 h-4" />,
  wallet: <Wallet className="w-4 h-4" />,
  document: <FileText className="w-4 h-4" />,
};

function findEntityData(entityId: string) {
  // Check threat actors
  const actor = threatActors.find((a) => a.name === entityId || a.id === entityId);
  if (actor) {
    return {
      type: 'threat_actor',
      name: actor.name,
      description: actor.description,
      threatLevel: actor.threatLevel,
      metadata: {
        Type: actor.type.replace('_', ' ').toUpperCase(),
        Origin: `${actor.originFlag} ${actor.origin}`,
        'First Seen': actor.firstSeen,
        'Last Active': new Date(actor.lastActivity).toLocaleString(),
        Status: actor.active ? 'ACTIVE' : 'INACTIVE',
        Aliases: actor.aliases.join(', '),
      },
      ttps: actor.ttps,
      malware: actor.associatedMalware,
      targets: actor.targets,
      iocs: actor.iocs,
      timeline: actor.activityTimeline,
      connections: actor.connections,
    };
  }

  // Generic fallback
  return {
    type: 'unknown',
    name: entityId,
    description: 'Entity details not found in local database.',
    threatLevel: 'medium' as const,
    metadata: { ID: entityId },
    ttps: [],
    malware: [],
    targets: [],
    iocs: [],
    timeline: [],
    connections: [],
  };
}

export function EntityDetailDrawer({ entityId, onClose }: EntityDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  if (!entityId) return null;

  const data = findEntityData(entityId);
  const relatedAlerts = alertsQueue.filter((a) => a.relatedEntities.includes(entityId));
  const relatedDarkWeb = darkWebResults.filter((r) => r.relatedEntities.includes(entityId));
  const relatedSignals = sigintIntercepts.filter((s) => s.associatedActor === entityId);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'activity', label: 'Activity', count: data.timeline.length },
    { key: 'connections', label: 'Connections', count: data.connections.length },
    { key: 'intel', label: 'Intel', count: relatedAlerts.length + relatedDarkWeb.length + relatedSignals.length },
  ];

  const threatColors = {
    critical: 'text-red-400 bg-red-500/10 border-red-500/30',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    low: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-[#0c1220] border-l border-white/10 z-50 flex flex-col shadow-2xl shadow-black/50 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
              {typeIcons[data.type] || <User className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-100 font-mono">{data.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${threatColors[data.threatLevel]}`}>
                  {data.threatLevel}
                </span>
                <span className="text-[10px] text-gray-500 capitalize">{data.type.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.key
                  ? 'text-cyan-400 border-cyan-400 bg-cyan-500/5'
                  : 'text-gray-500 border-transparent hover:text-gray-400'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 text-[8px] px-1 py-0.5 rounded bg-white/10">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {activeTab === 'profile' && (
            <div className="p-4 space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed">{data.description}</p>

              {/* Metadata Grid */}
              <div className="space-y-1">
                {Object.entries(data.metadata).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{key}</span>
                    <span className="text-[11px] text-gray-300 font-mono">{value}</span>
                  </div>
                ))}
              </div>

              {/* TTPs */}
              {data.ttps.length > 0 && (
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> MITRE ATT&CK TTPs
                  </div>
                  <div className="space-y-1">
                    {data.ttps.map((ttp: any) => (
                      <div key={ttp.id} className="px-2 py-1.5 rounded bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-cyan-400">{ttp.id}</span>
                          <span className="text-[9px] text-gray-500">{ttp.tactic}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{ttp.technique}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Targets */}
              {data.targets.length > 0 && (
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Target Sectors</div>
                  <div className="flex flex-wrap gap-1">
                    {data.targets.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[9px] bg-red-500/10 text-red-400 border border-red-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* IOCs */}
              {data.iocs.length > 0 && (
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">IOCs</div>
                  <div className="space-y-0.5">
                    {data.iocs.map((ioc: string) => (
                      <div key={ioc} className="text-[10px] font-mono text-amber-400/80 bg-white/[0.02] px-2 py-1 rounded">
                        {ioc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="p-4 space-y-3">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Activity Over Time</div>
              {data.timeline.length > 0 ? (
                <>
                  <div className="flex items-end gap-1 h-20">
                    {data.timeline.map((point: any, i: number) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t ${
                            point.intensity > 80 ? 'bg-red-500' : point.intensity > 50 ? 'bg-amber-500' : 'bg-cyan-500/60'
                          }`}
                          style={{ height: `${point.intensity}%` }}
                        />
                        <span className="text-[7px] text-gray-600">{point.date?.split('-').slice(1).join('/')}</span>
                      </div>
                    ))}
                  </div>
                  {data.timeline
                    .filter((p: any) => p.label)
                    .map((point: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-[10px]">
                        <span className="text-gray-500">{point.date}</span>
                        <span className="text-gray-300">{point.label}</span>
                        <span className={`ml-auto font-mono ${point.intensity > 80 ? 'text-red-400' : 'text-amber-400'}`}>
                          {point.intensity}%
                        </span>
                      </div>
                    ))}
                </>
              ) : (
                <div className="text-xs text-gray-600 text-center py-8">No activity data available</div>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="p-4 space-y-2">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Known Connections</div>
              {data.connections.length > 0 ? (
                data.connections.map((connId: string) => {
                  const connected = threatActors.find((a) => a.id === connId);
                  if (!connected) return null;
                  const colors = threatColors[connected.threatLevel];
                  return (
                    <div key={connId} className="flex items-center gap-3 p-2 rounded bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] cursor-pointer transition-colors">
                      <Link className="w-3 h-3 text-cyan-400" />
                      <div className="flex-1">
                        <div className="text-xs font-mono text-gray-200">{connected.name}</div>
                        <div className="text-[9px] text-gray-500">{connected.origin}</div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${colors}`}>
                        {connected.threatLevel}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-600" />
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-gray-600 text-center py-8">No known connections</div>
              )}
            </div>
          )}

          {activeTab === 'intel' && (
            <div className="p-4 space-y-4">
              {/* Related Alerts */}
              {relatedAlerts.length > 0 && (
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Related Alerts ({relatedAlerts.length})</div>
                  <div className="space-y-1">
                    {relatedAlerts.map((alert) => (
                      <div key={alert.id} className="p-2 rounded bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                          <span className="text-[10px] text-gray-300">{alert.title}</span>
                        </div>
                        <span className="text-[9px] text-gray-500">{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Dark Web */}
              {relatedDarkWeb.length > 0 && (
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Dark Web Mentions ({relatedDarkWeb.length})</div>
                  <div className="space-y-1">
                    {relatedDarkWeb.map((result) => (
                      <div key={result.id} className="p-2 rounded bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-gray-300 mb-0.5">{result.title}</div>
                        <div className="text-[9px] text-gray-500">{result.source} | {result.mentions} mentions</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related SIGINT */}
              {relatedSignals.length > 0 && (
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">SIGINT Intercepts ({relatedSignals.length})</div>
                  <div className="space-y-1">
                    {relatedSignals.map((sig) => (
                      <div key={sig.id} className="p-2 rounded bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-gray-300 mb-0.5 line-clamp-2">{sig.summary}</div>
                        <div className="text-[9px] text-gray-500">{sig.classification} | {sig.source.split('/')[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relatedAlerts.length === 0 && relatedDarkWeb.length === 0 && relatedSignals.length === 0 && (
                <div className="text-xs text-gray-600 text-center py-8">No related intelligence found</div>
              )}
            </div>
          )}
        </div>

        {/* Footer Risk Score */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Composite Risk Score</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    data.threatLevel === 'critical' ? 'bg-red-500' : data.threatLevel === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: data.threatLevel === 'critical' ? '92%' : data.threatLevel === 'high' ? '72%' : '48%' }}
                />
              </div>
              <span className={`text-sm font-mono font-bold ${
                data.threatLevel === 'critical' ? 'text-red-400' : data.threatLevel === 'high' ? 'text-orange-400' : 'text-yellow-400'
              }`}>
                {data.threatLevel === 'critical' ? '92' : data.threatLevel === 'high' ? '72' : '48'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
