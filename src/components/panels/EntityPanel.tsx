"use client";

import { useState } from "react";
import { Users, ChevronRight, Activity, MapPin, Link2, AlertTriangle } from "lucide-react";
import PanelHeader from "@/components/ui/PanelHeader";
import ThreatBadge from "@/components/ui/ThreatBadge";
import { trackedEntities, entityTypeConfig, TrackedEntity } from "@/lib/mock-data/entities";

function ThreatMeter({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 90) return "#ef4444";
    if (s >= 75) return "#f97316";
    if (s >= 50) return "#f59e0b";
    return "#10b981";
  };
  const color = getColor(score);

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-osint-surface rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-mono font-semibold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

function EntityCard({ entity }: { entity: TrackedEntity }) {
  const [expanded, setExpanded] = useState(false);
  const typeConf = entityTypeConfig[entity.type];
  const statusColors: Record<string, string> = {
    active: "#10b981",
    dormant: "#f59e0b",
    unknown: "#64748b",
    neutralized: "#6366f1",
  };

  const lastSeenDate = new Date(entity.lastSeen);
  const timeAgo = getTimeAgo(lastSeenDate);

  return (
    <div
      className="border border-osint-border hover:border-osint-border-light bg-osint-surface/30 hover:bg-osint-surface/50 transition-all cursor-pointer group"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="px-3 py-2.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-6 h-6 flex items-center justify-center flex-shrink-0 border"
              style={{
                borderColor: `${typeConf.color}40`,
                backgroundColor: `${typeConf.color}10`,
              }}
            >
              <span className="text-[9px] font-mono font-bold" style={{ color: typeConf.color }}>
                {entity.type[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-semibold text-osint-text truncate">{entity.name}</h4>
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: statusColors[entity.status] }}
                />
              </div>
              {entity.alias && entity.alias.length > 0 && (
                <span className="text-[9px] font-mono text-osint-text-muted">
                  AKA: {entity.alias.join(", ")}
                </span>
              )}
            </div>
          </div>
          <ThreatMeter score={entity.threatScore} />
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-osint-text-muted">
          <span className="flex items-center gap-1">
            <MapPin size={9} />
            {entity.location}
          </span>
          <span className="flex items-center gap-1">
            <Link2 size={9} />
            {entity.connections} links
          </span>
          <span className="flex items-center gap-1">
            <Activity size={9} />
            {timeAgo}
          </span>
        </div>

        {/* Recent activity */}
        <div className="mt-2 flex items-center gap-1.5">
          <AlertTriangle size={9} className="text-osint-amber flex-shrink-0" />
          <span className="text-[10px] text-osint-text-dim truncate">{entity.recentActivity}</span>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-2 border-t border-osint-border space-y-2 animate-fade-in">
            <p className="text-[11px] text-osint-text-dim leading-relaxed">{entity.description}</p>
            <div className="flex flex-wrap gap-1">
              {entity.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[9px] font-mono bg-osint-panel border border-osint-border text-osint-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function EntityPanel() {
  const [sortBy, setSortBy] = useState<"threat" | "recent">("threat");

  const sorted = [...trackedEntities].sort((a, b) => {
    if (sortBy === "threat") return b.threatScore - a.threatScore;
    return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
  });

  return (
    <div className="h-full flex flex-col" style={{ minHeight: 300 }}>
      <PanelHeader
        title="Tracked Entities"
        icon={<Users size={14} />}
        status="live"
        count={trackedEntities.length}
        actions={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSortBy("threat")}
              className={`px-2 py-0.5 text-[9px] font-mono border transition-colors ${
                sortBy === "threat"
                  ? "text-osint-cyan border-osint-cyan/30 bg-osint-cyan/10"
                  : "text-osint-text-muted border-osint-border hover:text-osint-text"
              }`}
            >
              THREAT
            </button>
            <button
              onClick={() => setSortBy("recent")}
              className={`px-2 py-0.5 text-[9px] font-mono border transition-colors ${
                sortBy === "recent"
                  ? "text-osint-cyan border-osint-cyan/30 bg-osint-cyan/10"
                  : "text-osint-text-muted border-osint-border hover:text-osint-text"
              }`}
            >
              RECENT
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {sorted.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </div>
  );
}
