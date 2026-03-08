"use client";

import { useState } from "react";
import { Clock, ChevronRight, Filter } from "lucide-react";
import PanelHeader from "@/components/ui/PanelHeader";
import ThreatBadge from "@/components/ui/ThreatBadge";
import { timelineEvents, eventTypeConfig, TimelineEvent } from "@/lib/mock-data/timeline-events";

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const typeConf = eventTypeConfig[event.type];
  const time = new Date(event.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex gap-3 group">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-3 h-3 rounded-full border-2 flex-shrink-0 mt-1 transition-all group-hover:scale-125"
          style={{
            borderColor: typeConf.color,
            backgroundColor: event.severity === "critical" ? typeConf.color : "transparent",
            boxShadow: event.severity === "critical" ? `0 0 8px ${typeConf.color}50` : "none",
          }}
        />
        {!isLast && (
          <div className="w-px flex-1 min-h-[32px] bg-osint-border group-hover:bg-osint-border-light transition-colors" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border"
                style={{
                  color: typeConf.color,
                  borderColor: `${typeConf.color}40`,
                  backgroundColor: `${typeConf.color}10`,
                }}
              >
                {typeConf.label}
              </span>
              <ThreatBadge level={event.severity} size="sm" />
              <span className="text-[10px] font-mono text-osint-text-muted ml-auto flex-shrink-0">{time} UTC</span>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium text-osint-text hover:text-osint-cyan transition-colors text-left flex items-center gap-1"
            >
              <ChevronRight
                size={10}
                className={`transition-transform flex-shrink-0 ${expanded ? "rotate-90" : ""}`}
              />
              <span className="truncate">{event.title}</span>
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-2 ml-3.5 space-y-2 animate-fade-in">
            <p className="text-[11px] text-osint-text-dim leading-relaxed">{event.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-osint-text-muted">
                SRC: {event.source}
              </span>
              {event.entities.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {event.entities.map((e) => (
                    <span
                      key={e}
                      className="px-1.5 py-0.5 text-[9px] font-mono bg-osint-surface border border-osint-border text-osint-text-dim"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TimelinePanel() {
  const [filterType, setFilterType] = useState<string | null>(null);

  const filtered = filterType
    ? timelineEvents.filter((e) => e.type === filterType)
    : timelineEvents;

  return (
    <div className="h-full flex flex-col" style={{ minHeight: 300 }}>
      <PanelHeader
        title="Temporal Analysis"
        icon={<Clock size={14} />}
        status="live"
        count={filtered.length}
        actions={
          <button className="p-1 text-osint-text-muted hover:text-osint-cyan transition-colors">
            <Filter size={12} />
          </button>
        }
      />
      {/* Type filter bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-osint-border overflow-x-auto">
        <button
          onClick={() => setFilterType(null)}
          className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider border transition-colors flex-shrink-0 ${
            !filterType
              ? "bg-osint-cyan/10 text-osint-cyan border-osint-cyan/30"
              : "text-osint-text-muted border-osint-border hover:text-osint-text"
          }`}
        >
          ALL
        </button>
        {Object.entries(eventTypeConfig).map(([type, conf]) => (
          <button
            key={type}
            onClick={() => setFilterType(filterType === type ? null : type)}
            className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider border transition-colors flex-shrink-0 ${
              filterType === type
                ? "border-opacity-30"
                : "text-osint-text-muted border-osint-border hover:text-osint-text"
            }`}
            style={
              filterType === type
                ? {
                    color: conf.color,
                    borderColor: `${conf.color}50`,
                    backgroundColor: `${conf.color}15`,
                  }
                : undefined
            }
          >
            {conf.label}
          </button>
        ))}
      </div>
      {/* Timeline content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filtered.map((event, i) => (
          <TimelineItem key={event.id} event={event} isLast={i === filtered.length - 1} />
        ))}
      </div>
    </div>
  );
}
