'use client';

import { useState } from 'react';
import { Radio, Lock, Unlock, MapPin, Clock, Wifi, ChevronRight, Signal, Satellite } from 'lucide-react';
import { PanelHeader } from '../ui/PanelHeader';
import {
  sigintIntercepts,
  frequencyBands,
  commPatterns,
  sigintStats,
  type SIGINTIntercept,
} from '@/lib/mock-data/sigint-intercepts';

const classificationColors = {
  TOP_SECRET: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  SECRET: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  CONFIDENTIAL: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  UNCLASSIFIED: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
};

const priorityColors = {
  flash: 'text-red-400 animate-pulse',
  immediate: 'text-orange-400',
  priority: 'text-yellow-400',
  routine: 'text-gray-400',
};

const typeIcons: Record<string, JSX.Element> = {
  comms: <Satellite className="w-3.5 h-3.5" />,
  electronic: <Wifi className="w-3.5 h-3.5" />,
  cyber: <Lock className="w-3.5 h-3.5" />,
  telemetry: <Signal className="w-3.5 h-3.5" />,
};

function FrequencyBars() {
  return (
    <div className="px-3 py-2 border-b border-white/5">
      <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5">Frequency Band Activity</div>
      <div className="space-y-1">
        {frequencyBands.map((band) => (
          <div key={band.label} className="flex items-center gap-2">
            <span className="text-[8px] text-gray-500 w-24 truncate">{band.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  band.activity > 70 ? 'bg-red-500' : band.activity > 40 ? 'bg-amber-500' : 'bg-cyan-500/60'
                }`}
                style={{ width: `${band.activity}%` }}
              />
            </div>
            <span className="text-[8px] text-gray-500 font-mono w-6 text-right">{band.interceptCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommPatternChart() {
  const maxVol = Math.max(...commPatterns.map((d) => d.volume));
  return (
    <div className="px-3 py-2 border-b border-white/5">
      <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5">24h Communication Pattern</div>
      <div className="flex items-end gap-[2px] h-10">
        {commPatterns.map((point) => (
          <div key={point.hour} className="flex-1 flex flex-col">
            <div
              className="w-full rounded-t bg-red-500/60"
              style={{ height: `${(point.encrypted / maxVol) * 40}px` }}
            />
            <div
              className="w-full bg-cyan-500/40"
              style={{ height: `${(point.cleartext / maxVol) * 40}px` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-[7px] text-gray-600">00:00</span>
        <span className="text-[7px] text-gray-600">12:00</span>
        <span className="text-[7px] text-gray-600">23:00</span>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <span className="flex items-center gap-1 text-[8px] text-gray-500">
          <span className="w-2 h-2 rounded bg-red-500/60" /> Encrypted
        </span>
        <span className="flex items-center gap-1 text-[8px] text-gray-500">
          <span className="w-2 h-2 rounded bg-cyan-500/40" /> Cleartext
        </span>
      </div>
    </div>
  );
}

export function SIGINTPanel() {
  const [selectedIntercept, setSelectedIntercept] = useState<string | null>(null);
  const [view, setView] = useState<'intercepts' | 'analysis'>('intercepts');

  const selected = selectedIntercept
    ? sigintIntercepts.find((i) => i.id === selectedIntercept)
    : null;

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="SIGINT Dashboard"
        icon={<Radio className="w-4 h-4" />}
        subtitle={`${sigintStats.totalIntercepts} intercepts | ${sigintStats.activeCollectors} collectors`}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 p-3 border-b border-white/5">
        <div className="text-center">
          <div className="text-[9px] text-gray-500">Decryption Rate</div>
          <div className="text-sm font-mono text-cyan-400">{sigintStats.decryptionRate}%</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-500">Avg Latency</div>
          <div className="text-sm font-mono text-green-400">{sigintStats.averageLatency}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-500">Active Collectors</div>
          <div className="text-sm font-mono text-amber-400">{sigintStats.activeCollectors}</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/5">
        <button
          onClick={() => setView('intercepts')}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
            view === 'intercepts' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-gray-500'
          }`}
        >
          INTERCEPTS
        </button>
        <button
          onClick={() => setView('analysis')}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
            view === 'analysis' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-gray-500'
          }`}
        >
          ANALYSIS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {view === 'analysis' ? (
          <>
            <FrequencyBars />
            <CommPatternChart />
            {/* Protocol Distribution */}
            <div className="p-3">
              <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-2">Top Protocols</div>
              <div className="space-y-1.5">
                {sigintStats.topProtocols.map((proto) => (
                  <div key={proto.name} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-24 truncate">{proto.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-500/60"
                        style={{ width: `${(proto.count / 542) * 100}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono">{proto.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : !selected ? (
          /* Intercept List */
          sigintIntercepts.map((intercept) => {
            const classConfig = classificationColors[intercept.classification];
            return (
              <div
                key={intercept.id}
                className="p-3 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                onClick={() => setSelectedIntercept(intercept.id)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{typeIcons[intercept.type]}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${classConfig.bg} ${classConfig.text} ${classConfig.border} border`}>
                      {intercept.classification.replace('_', ' ')}
                    </span>
                    <span className={`text-[9px] font-bold uppercase ${priorityColors[intercept.priority]}`}>
                      {intercept.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-gray-500 font-mono">{intercept.confidence}%</span>
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                  </div>
                </div>

                <p className="text-[11px] text-gray-300 leading-tight mb-1.5 line-clamp-2">
                  {intercept.summary}
                </p>

                <div className="flex items-center gap-3 text-[9px] text-gray-500">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(intercept.timestamp).toLocaleTimeString()}
                  </span>
                  {intercept.targetFrequency && (
                    <span className="flex items-center gap-0.5">
                      <Radio className="w-2.5 h-2.5" />
                      {intercept.targetFrequency}
                    </span>
                  )}
                  <span className="font-mono text-gray-400">{intercept.source.split('/')[0]}</span>
                  {intercept.associatedActor && (
                    <span className="text-cyan-400 font-mono ml-auto">{intercept.associatedActor}</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          /* Intercept Detail */
          <div className="p-3">
            <button
              onClick={() => setSelectedIntercept(null)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 mb-3 flex items-center gap-1"
            >
              <ChevronRight className="w-3 h-3 rotate-180" /> Back to list
            </button>

            <div className="space-y-3">
              {/* Classification Banner */}
              <div className={`p-2 rounded text-center font-bold text-xs uppercase tracking-widest ${classificationColors[selected.classification].bg} ${classificationColors[selected.classification].text} ${classificationColors[selected.classification].border} border`}>
                {selected.classification.replace('_', ' ')} // {selected.priority.toUpperCase()}
              </div>

              <div className="text-[10px] text-gray-500">
                <span className="font-mono text-gray-300">{selected.source}</span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">{selected.summary}</p>

              {/* Raw Signature */}
              <div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Raw Signature</div>
                <div className="bg-black/40 rounded p-2 border border-white/5">
                  <code className="text-[10px] font-mono text-green-400 break-all">{selected.rawSignature}</code>
                </div>
              </div>

              {/* Coordinates */}
              <div className="flex gap-4">
                <div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Origin</div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span className="font-mono text-gray-300">
                      {selected.originCoords.lat.toFixed(4)}, {selected.originCoords.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
                {selected.destinationCoords && (
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Destination</div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span className="font-mono text-gray-300">
                        {selected.destinationCoords.lat.toFixed(4)}, {selected.destinationCoords.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/[0.02] rounded p-2 border border-white/5">
                  <div className="text-[9px] text-gray-500">Status</div>
                  <div className="text-[11px] text-gray-300 capitalize">{selected.status}</div>
                </div>
                <div className="bg-white/[0.02] rounded p-2 border border-white/5">
                  <div className="text-[9px] text-gray-500">Confidence</div>
                  <div className="text-[11px] font-mono text-cyan-400">{selected.confidence}%</div>
                </div>
                {selected.duration && (
                  <div className="bg-white/[0.02] rounded p-2 border border-white/5">
                    <div className="text-[9px] text-gray-500">Duration</div>
                    <div className="text-[11px] font-mono text-gray-300">{selected.duration}s</div>
                  </div>
                )}
                {selected.protocol && (
                  <div className="bg-white/[0.02] rounded p-2 border border-white/5">
                    <div className="text-[9px] text-gray-500">Protocol</div>
                    <div className="text-[11px] text-gray-300">{selected.protocol}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
