'use client';

import { useState } from 'react';
import { Users, ChevronRight, Activity, Target, Bug, Fingerprint, TrendingUp } from 'lucide-react';
import { PanelHeader } from '../ui/PanelHeader';
import { threatActors, type ThreatActor } from '@/lib/mock-data/threat-actors';

const threatColors = {
  critical: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', bar: 'bg-red-500' },
  high: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', bar: 'bg-orange-500' },
  medium: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', bar: 'bg-yellow-500' },
  low: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', bar: 'bg-blue-500' },
};

const typeLabels: Record<string, { label: string; color: string }> = {
  apt: { label: 'APT', color: 'text-red-400' },
  cybercrime: { label: 'CYBERCRIME', color: 'text-amber-400' },
  hacktivist: { label: 'HACKTIVIST', color: 'text-purple-400' },
  insider: { label: 'INSIDER', color: 'text-orange-400' },
  nation_state: { label: 'NATION STATE', color: 'text-red-500' },
};

function ActivitySparkline({ data }: { data: { intensity: number }[] }) {
  const max = Math.max(...data.map((d) => d.intensity));
  return (
    <div className="flex items-end gap-[2px] h-8">
      {data.map((point, i) => (
        <div
          key={i}
          className={`w-3 rounded-t transition-all ${
            point.intensity > 80 ? 'bg-red-500' : point.intensity > 50 ? 'bg-amber-500' : 'bg-cyan-500/60'
          }`}
          style={{ height: `${(point.intensity / max) * 100}%` }}
          title={`${point.intensity}%`}
        />
      ))}
    </div>
  );
}

function TTPBadge({ ttp }: { ttp: { id: string; tactic: string; technique: string } }) {
  return (
    <div className="px-2 py-1 rounded bg-white/5 border border-white/10 group relative">
      <span className="text-[9px] font-mono text-cyan-400">{ttp.id}</span>
      <span className="text-[9px] text-gray-500 ml-1">{ttp.technique}</span>
    </div>
  );
}

export function ThreatActorPanel() {
  const [selectedActor, setSelectedActor] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filtered = filterType
    ? threatActors.filter((a) => a.type === filterType)
    : threatActors;

  const selected = selectedActor
    ? threatActors.find((a) => a.id === selectedActor)
    : null;

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Threat Actors"
        icon={<Users className="w-4 h-4" />}
        subtitle={`${threatActors.length} tracked | ${threatActors.filter((a) => a.active).length} active`}
      />

      {/* Type Filter */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 overflow-x-auto">
        {Object.entries(typeLabels).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFilterType(filterType === key ? null : key)}
            className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider border whitespace-nowrap transition-all ${
              filterType === key
                ? `bg-white/10 border-white/20 ${val.color}`
                : 'border-white/5 text-gray-600 hover:text-gray-400'
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {!selected ? (
        /* Actor List */
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((actor) => {
            const colors = threatColors[actor.threatLevel];
            const typeInfo = typeLabels[actor.type];
            return (
              <div
                key={actor.id}
                className="p-3 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                onClick={() => setSelectedActor(actor.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors.bar} ${actor.active ? 'animate-pulse' : 'opacity-50'}`} />
                    <span className="text-sm font-bold text-gray-200 font-mono">{actor.name}</span>
                    <span className="text-[9px] text-gray-600">{actor.originFlag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} ${colors.border} border uppercase font-bold`}>
                      {actor.threatLevel}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {actor.aliases.slice(0, 2).join(', ')}
                    </span>
                  </div>
                  <ActivitySparkline data={actor.activityTimeline} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Actor Detail View */
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-3">
            <button
              onClick={() => setSelectedActor(null)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 mb-3 flex items-center gap-1"
            >
              <ChevronRight className="w-3 h-3 rotate-180" /> Back to list
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${threatColors[selected.threatLevel].bar} ${selected.active ? 'animate-pulse' : ''}`} />
              <h3 className="text-lg font-bold text-gray-100 font-mono">{selected.name}</h3>
              <span className="text-xs text-gray-500">{selected.originFlag} {selected.origin}</span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed mb-4">{selected.description}</p>

            {/* Aliases */}
            <div className="mb-4">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Fingerprint className="w-3 h-3" /> Known Aliases
              </div>
              <div className="flex flex-wrap gap-1">
                {selected.aliases.map((alias) => (
                  <span key={alias} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-300 border border-white/10 font-mono">
                    {alias}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="mb-4">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Activity Timeline
              </div>
              <div className="flex items-end gap-1 h-16">
                {selected.activityTimeline.map((point, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        point.intensity > 80 ? 'bg-red-500' : point.intensity > 50 ? 'bg-amber-500' : 'bg-cyan-500/60'
                      }`}
                      style={{ height: `${point.intensity}%` }}
                    />
                    <span className="text-[8px] text-gray-600">{point.date.split('-')[1]}/{point.date.split('-')[2] || ''}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MITRE ATT&CK TTPs */}
            <div className="mb-4">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Target className="w-3 h-3" /> MITRE ATT&CK TTPs
              </div>
              <div className="space-y-1">
                {selected.ttps.map((ttp) => (
                  <TTPBadge key={ttp.id} ttp={ttp} />
                ))}
              </div>
            </div>

            {/* Targets */}
            <div className="mb-4">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Target Sectors</div>
              <div className="flex flex-wrap gap-1">
                {selected.targets.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Malware */}
            <div className="mb-4">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Bug className="w-3 h-3" /> Associated Malware
              </div>
              <div className="flex flex-wrap gap-1">
                {selected.associatedMalware.map((m) => (
                  <span key={m} className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* IOCs */}
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Indicators of Compromise</div>
              <div className="space-y-0.5">
                {selected.iocs.map((ioc) => (
                  <div key={ioc} className="text-[10px] font-mono text-amber-400/80 bg-white/[0.02] px-2 py-1 rounded">
                    {ioc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
