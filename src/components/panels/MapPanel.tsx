"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { Map as MapIcon, Layers, ZoomIn, Filter } from "lucide-react";
import PanelHeader from "@/components/ui/PanelHeader";
import ThreatBadge from "@/components/ui/ThreatBadge";
import { geoIncidents, severityColors, GeoIncident } from "@/lib/mock-data/geo-incidents";
import "leaflet/dist/leaflet.css";

function PulsingMarker({ incident }: { incident: GeoIncident }) {
  const color = severityColors[incident.severity];
  const radius = incident.severity === "critical" ? 10 : incident.severity === "high" ? 8 : 6;

  return (
    <CircleMarker
      center={[incident.lat, incident.lng]}
      radius={radius}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        weight: 1.5,
        opacity: 0.8,
      }}
    >
      <Popup>
        <div className="min-w-[220px] p-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-osint-text-muted">{incident.id}</span>
            <ThreatBadge level={incident.severity} size="sm" />
          </div>
          <h4 className="text-sm font-semibold text-osint-text mb-1">{incident.title}</h4>
          <p className="text-[11px] text-osint-text-dim leading-relaxed mb-2">{incident.description}</p>
          <div className="flex items-center justify-between text-[10px] font-mono text-osint-text-muted pt-2 border-t border-osint-border">
            <span>{incident.source}</span>
            <span>{new Date(incident.timestamp).toLocaleTimeString("en-US", { hour12: false })}</span>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-3 left-3 z-[1000] bg-osint-panel/95 border border-osint-border px-3 py-2 backdrop-blur-sm">
      <div className="text-[9px] font-mono uppercase tracking-widest text-osint-text-muted mb-1.5">Threat Level</div>
      <div className="flex items-center gap-3">
        {Object.entries(severityColors).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-mono text-osint-text-dim uppercase">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MapPanel() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const filtered = filter
    ? geoIncidents.filter((i) => i.severity === filter)
    : geoIncidents;

  if (!mounted) {
    return (
      <div className="h-full flex flex-col">
        <PanelHeader title="Geospatial Intelligence" icon={<MapIcon size={14} />} status="processing" count={geoIncidents.length} />
        <div className="flex-1 bg-osint-bg flex items-center justify-center">
          <span className="text-xs font-mono text-osint-text-muted animate-pulse">LOADING MAP DATA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ minHeight: 400 }}>
      <PanelHeader
        title="Geospatial Intelligence"
        icon={<MapIcon size={14} />}
        status="live"
        count={filtered.length}
        actions={
          <div className="flex items-center gap-1">
            <button className="p-1 text-osint-text-muted hover:text-osint-cyan transition-colors">
              <Layers size={12} />
            </button>
            <button className="p-1 text-osint-text-muted hover:text-osint-cyan transition-colors">
              <Filter size={12} />
            </button>
          </div>
        }
      />
      <div className="flex-1 relative">
        <MapContainer
          center={[30, 20]}
          zoom={2.5}
          className="h-full w-full"
          zoomControl={true}
          attributionControl={false}
          style={{ background: "#0a0e17" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {filtered.map((incident) => (
            <PulsingMarker key={incident.id} incident={incident} />
          ))}
        </MapContainer>
        <MapLegend />
        {/* Coordinate display */}
        <div className="absolute top-3 right-3 z-[1000] bg-osint-panel/95 border border-osint-border px-2 py-1 backdrop-blur-sm">
          <span className="text-[9px] font-mono text-osint-text-muted">
            {filtered.length} INCIDENTS TRACKED | GLOBAL VIEW
          </span>
        </div>
      </div>
    </div>
  );
}
