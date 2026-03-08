"use client";

import { Shield, Users, AlertTriangle, Radio, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { direction: "up" | "down"; value: string };
  color: string;
  pulse?: boolean;
}

function MetricCard({ label, value, icon, trend, color, pulse }: MetricCardProps) {
  return (
    <div className="bg-osint-surface/50 border border-osint-border hover:border-osint-border-light transition-all group px-4 py-3 flex-1 min-w-0">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-osint-text-muted block mb-1">
            {label}
          </span>
          <span className="text-xl font-mono font-bold block" style={{ color }}>
            {value}
          </span>
        </div>
        <div
          className="w-8 h-8 flex items-center justify-center border flex-shrink-0"
          style={{
            borderColor: `${color}30`,
            backgroundColor: `${color}08`,
          }}
        >
          <span style={{ color }} className={pulse ? "animate-pulse" : ""}>
            {icon}
          </span>
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.direction === "up" ? (
            <TrendingUp size={10} className="text-osint-red" />
          ) : (
            <TrendingDown size={10} className="text-osint-green" />
          )}
          <span
            className={`text-[10px] font-mono ${
              trend.direction === "up" ? "text-red-400" : "text-green-400"
            }`}
          >
            {trend.value}
          </span>
          <span className="text-[9px] font-mono text-osint-text-muted">vs 24h</span>
        </div>
      )}
    </div>
  );
}

export default function MetricsBar() {
  const metrics: MetricCardProps[] = [
    {
      label: "Active Threats",
      value: 14,
      icon: <Shield size={16} />,
      color: "#ef4444",
      trend: { direction: "up", value: "+3" },
      pulse: true,
    },
    {
      label: "Monitored Entities",
      value: 247,
      icon: <Users size={16} />,
      color: "#00d4ff",
      trend: { direction: "up", value: "+12" },
    },
    {
      label: "Alerts Today",
      value: 38,
      icon: <AlertTriangle size={16} />,
      color: "#f59e0b",
      trend: { direction: "down", value: "-7" },
    },
    {
      label: "Sources Active",
      value: "12/15",
      icon: <Radio size={16} />,
      color: "#10b981",
    },
  ];

  return (
    <div className="flex gap-3 w-full">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
