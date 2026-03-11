'use client';

import { useState } from 'react';
import { Globe, AlertTriangle, Eye, ExternalLink, Shield, Clock, Filter } from 'lucide-react';
import { PanelHeader } from '../ui/PanelHeader';
import { darkWebResults, darkWebStats, type DarkWebResult } from '@/lib/mock-data/dark-web-results';

const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-500' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-500' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-500' },
};

const sourceIcons: Record<string, string> = {
  tor_forum: 'TOR',
  paste_site: 'PST',
  marketplace: 'MKT',
  leak_db: 'LDB',
  irc_channel: 'IRC',
  telegram: 'TG',
};

export function DarkWebPanel() {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedSeverity
    ? darkWebResults.filter((r) => r.severity === selectedSeverity)
    : darkWebResults;

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Dark Web Monitor"
        icon={<Globe className="w-4 h-4" />}
        subtitle={`${darkWebStats.totalResults} results | ${darkWebStats.criticalFindings} critical`}
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-2 p-3 border-b border-white/5">
        <div className="text-center">
          <div className="text-xs text-gray-500">Monitored</div>
          <div className="text-sm font-mono text-cyan-400">{darkWebStats.sourcesMonitored}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Crawled</div>
          <div className="text-sm font-mono text-cyan-400">{darkWebStats.onionSitesCrawled}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">New Today</div>
          <div className="text-sm font-mono text-amber-400">{darkWebStats.newToday}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Avg Discovery</div>
          <div className="text-sm font-mono text-green-400">{darkWebStats.averageDiscoveryTime}</div>
        </div>
      </div>

      {/* Severity Filter */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <Filter className="w-3 h-3 text-gray-500" />
        {['critical', 'high', 'medium', 'low'].map((sev) => {
          const config = severityConfig[sev as keyof typeof severityConfig];
          const count = darkWebResults.filter((r) => r.severity === sev).length;
          return (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(selectedSeverity === sev ? null : sev)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border transition-all ${
                selectedSeverity === sev
                  ? `${config.bg} ${config.border} ${config.color}`
                  : 'border-white/10 text-gray-500 hover:border-white/20'
              }`}
            >
              {sev} ({count})
            </button>
          );
        })}
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.map((result) => {
          const config = severityConfig[result.severity];
          const isExpanded = expandedId === result.id;

          return (
            <div
              key={result.id}
              className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                isExpanded ? 'bg-white/[0.03]' : ''
              }`}
              onClick={() => setExpandedId(isExpanded ? null : result.id)}
            >
              <div className="p-3">
                <div className="flex items-start gap-2">
                  {/* Source Badge */}
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-gray-400">
                      {sourceIcons[result.source]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${config.color}`}>
                        {result.severity}
                      </span>
                      {result.verified && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                          VERIFIED
                        </span>
                      )}
                      {result.credentialCount && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          {result.credentialCount.toLocaleString()} CREDS
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-medium text-gray-200 leading-tight mb-1">
                      {result.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                      {result.snippet}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 ml-10 space-y-2">
                    <div className="flex items-center gap-4 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        <span className="font-mono text-gray-400">{result.url}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Discovered: {new Date(result.discoveredAt).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {result.mentions} mentions
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-gray-400 border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {result.relatedEntities.length > 0 && (
                      <div className="flex items-center gap-2 text-[10px]">
                        <Shield className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-500">Linked:</span>
                        {result.relatedEntities.map((entity) => (
                          <span key={entity} className="text-cyan-400 font-mono">
                            {entity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
