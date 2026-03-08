"use client";

import { useState } from "react";
import { Radio, ExternalLink, Clock } from "lucide-react";
import PanelHeader from "@/components/ui/PanelHeader";
import ThreatBadge from "@/components/ui/ThreatBadge";
import { intelFeedItems, categoryColors, IntelItem } from "@/lib/mock-data/intel-feed";

function FeedItem({ item }: { item: IntelItem }) {
  const catColor = categoryColors[item.category] || "#64748b";
  const time = new Date(item.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="px-3 py-2.5 border-b border-osint-border hover:bg-osint-surface/30 transition-colors group cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {/* Category + severity + time */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border flex-shrink-0"
              style={{
                color: catColor,
                borderColor: `${catColor}40`,
                backgroundColor: `${catColor}10`,
              }}
            >
              {item.category}
            </span>
            <ThreatBadge level={item.severity} size="sm" />
            {item.isNew && (
              <span className="text-[8px] font-mono uppercase tracking-widest px-1 py-0.5 bg-osint-cyan/10 text-osint-cyan border border-osint-cyan/30 animate-pulse">
                NEW
              </span>
            )}
            <span className="text-[10px] font-mono text-osint-text-muted ml-auto flex-shrink-0 flex items-center gap-1">
              <Clock size={8} />
              {time}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xs font-medium text-osint-text group-hover:text-osint-cyan transition-colors truncate">
            {item.title}
          </h4>

          {/* Summary */}
          <p className="text-[10px] text-osint-text-dim mt-1 line-clamp-2 leading-relaxed">
            {item.summary}
          </p>

          {/* Source */}
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[9px] font-mono text-osint-text-muted">
              SRC: {item.source}
            </span>
            <ExternalLink
              size={10}
              className="text-osint-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntelFeed() {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filtered = filterCategory
    ? intelFeedItems.filter((item) => item.category === filterCategory)
    : intelFeedItems;

  const newCount = intelFeedItems.filter((i) => i.isNew).length;

  return (
    <div className="h-full flex flex-col" style={{ minHeight: 300 }}>
      <PanelHeader
        title="Intelligence Feed"
        icon={<Radio size={14} />}
        status="live"
        count={intelFeedItems.length}
        actions={
          <span className="text-[9px] font-mono text-osint-cyan">
            {newCount} NEW
          </span>
        }
      />
      {/* Category filter bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-osint-border overflow-x-auto">
        <button
          onClick={() => setFilterCategory(null)}
          className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider border transition-colors flex-shrink-0 ${
            !filterCategory
              ? "bg-osint-cyan/10 text-osint-cyan border-osint-cyan/30"
              : "text-osint-text-muted border-osint-border hover:text-osint-text"
          }`}
        >
          ALL
        </button>
        {Object.entries(categoryColors).map(([cat, color]) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider border transition-colors flex-shrink-0 ${
              filterCategory === cat
                ? ""
                : "text-osint-text-muted border-osint-border hover:text-osint-text"
            }`}
            style={
              filterCategory === cat
                ? { color, borderColor: `${color}50`, backgroundColor: `${color}15` }
                : undefined
            }
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Feed list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
