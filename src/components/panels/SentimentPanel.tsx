'use client';

import { useState } from 'react';
import { MessageSquare, TrendingUp, TrendingDown, Minus, AlertTriangle, Zap, BarChart3, Hash } from 'lucide-react';
import { PanelHeader } from '../ui/PanelHeader';
import { narrativeThreads, sentimentTimeline, topicClusters, type NarrativeThread } from '@/lib/mock-data/sentiment-data';

const sentimentConfig = {
  positive: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  negative: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  neutral: { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30' },
  mixed: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
};

const trendIcons = {
  rising: <TrendingUp className="w-3 h-3 text-amber-400" />,
  falling: <TrendingDown className="w-3 h-3 text-green-400" />,
  stable: <Minus className="w-3 h-3 text-gray-400" />,
  spiking: <Zap className="w-3 h-3 text-red-400" />,
};

function MiniTimeline({ data }: { data: typeof sentimentTimeline }) {
  const maxVol = Math.max(...data.map((d) => d.volume));
  return (
    <div className="flex items-end gap-[3px] h-12 px-3 py-2">
      {data.map((point, i) => {
        const total = point.positive + point.negative + point.neutral;
        const negPct = (point.negative / total) * 100;
        const posPct = (point.positive / total) * 100;
        const height = (point.volume / maxVol) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full rounded-t overflow-hidden" style={{ height: `${height}%` }}>
              <div className="w-full bg-red-500/60" style={{ height: `${negPct}%` }} />
              <div className="w-full bg-gray-500/40" style={{ height: `${100 - negPct - posPct}%` }} />
              <div className="w-full bg-green-500/60" style={{ height: `${posPct}%` }} />
            </div>
            <span className="text-[7px] text-gray-600">{point.timestamp.split('-')[2]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function SentimentPanel() {
  const [view, setView] = useState<'narratives' | 'clusters'>('narratives');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Sentiment & Narratives"
        icon={<MessageSquare className="w-4 h-4" />}
        subtitle={`${narrativeThreads.length} active threads`}
      />

      {/* Mini Sentiment Timeline */}
      <MiniTimeline data={sentimentTimeline} />

      {/* View Toggle */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/5">
        <button
          onClick={() => setView('narratives')}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
            view === 'narratives' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          NARRATIVES
        </button>
        <button
          onClick={() => setView('clusters')}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
            view === 'clusters' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          TOPIC CLUSTERS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {view === 'narratives' ? (
          /* Narrative Threads */
          narrativeThreads.map((thread) => {
            const config = sentimentConfig[thread.sentiment];
            const isExpanded = expandedId === thread.id;

            return (
              <div
                key={thread.id}
                className={`border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors ${
                  isExpanded ? 'bg-white/[0.03]' : ''
                }`}
                onClick={() => setExpandedId(isExpanded ? null : thread.id)}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {trendIcons[thread.trend]}
                      <span className={`text-[9px] uppercase font-bold tracking-wider ${config.color}`}>
                        {thread.sentiment}
                      </span>
                      {thread.isDisinformation && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> DISINFO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span>{thread.volume.toLocaleString()} posts</span>
                      <span className="text-cyan-400 font-mono">{thread.influenceScore}</span>
                    </div>
                  </div>

                  <h4 className="text-xs text-gray-200 leading-tight mb-1.5">{thread.topic}</h4>

                  {/* Intensity Bar */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          thread.intensity > 80 ? 'bg-red-500' : thread.intensity > 50 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${thread.intensity}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono">{thread.intensity}%</span>
                  </div>

                  {/* Platforms */}
                  <div className="flex flex-wrap gap-1">
                    {thread.platforms.map((p) => (
                      <span key={p} className="text-[8px] px-1 py-0.5 rounded bg-white/5 text-gray-500">
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Expanded: Keywords + Sample Posts */}
                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Hash className="w-3 h-3" /> Top Keywords
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {thread.topKeywords.map((kw) => (
                            <span key={kw} className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {thread.samplePosts.map((post, i) => (
                        <div key={i} className="bg-white/[0.02] rounded p-2 border border-white/5">
                          <div className="flex items-center gap-2 mb-1 text-[9px]">
                            <span className="text-cyan-400">{post.platform}</span>
                            <span className="text-gray-400 font-mono">{post.author}</span>
                            <span className="text-gray-600 ml-auto">{post.engagement.toLocaleString()} engagements</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed">{post.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          /* Topic Clusters */
          <div className="p-3 space-y-2">
            {topicClusters.map((cluster) => (
              <div key={cluster.name} className="bg-white/[0.02] rounded p-3 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-200 font-medium">{cluster.name}</span>
                  <span className="text-[10px] font-mono text-gray-400">{cluster.count} posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(cluster.count / 342) * 100}%`,
                        backgroundColor: cluster.color,
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: cluster.sentiment < 0 ? '#ef4444' : '#22c55e' }}
                  >
                    {cluster.sentiment > 0 ? '+' : ''}{cluster.sentiment.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-2 text-[9px] text-gray-600">
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> Sentiment scale: -1.0 (negative) to +1.0 (positive)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
