export interface GeoIncident {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: "conflict" | "cyber" | "infrastructure" | "surveillance" | "maritime";
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  timestamp: string;
  source: string;
}

export const geoIncidents: GeoIncident[] = [
  {
    id: "INC-001",
    lat: 33.5138,
    lng: 36.2765,
    title: "Signal Activity Detected",
    type: "surveillance",
    severity: "critical",
    description: "Anomalous communications pattern detected in Damascus region. Multiple encrypted transmissions on non-standard frequencies.",
    timestamp: "2024-03-08T04:23:00Z",
    source: "SIGINT Station Alpha",
  },
  {
    id: "INC-002",
    lat: 51.5074,
    lng: -0.1278,
    title: "Cyber Intrusion Alert",
    type: "cyber",
    severity: "high",
    description: "APT group PHANTOM-BEAR detected probing financial sector infrastructure. 14 endpoints compromised.",
    timestamp: "2024-03-08T03:45:00Z",
    source: "NCSC Threat Feed",
  },
  {
    id: "INC-003",
    lat: 26.0667,
    lng: 56.2500,
    title: "Maritime Anomaly",
    type: "maritime",
    severity: "high",
    description: "Unidentified vessel cluster in Strait of Hormuz. 3 vessels with AIS transponders disabled.",
    timestamp: "2024-03-08T02:15:00Z",
    source: "Maritime Surveillance Net",
  },
  {
    id: "INC-004",
    lat: 38.9072,
    lng: -77.0369,
    title: "Infrastructure Alert",
    type: "infrastructure",
    severity: "medium",
    description: "Power grid anomaly detected in DC metro area. Possible coordinated probe of SCADA systems.",
    timestamp: "2024-03-08T01:30:00Z",
    source: "CISA Alert System",
  },
  {
    id: "INC-005",
    lat: 48.8566,
    lng: 2.3522,
    title: "Protest Activity",
    type: "conflict",
    severity: "medium",
    description: "Large-scale demonstrations reported near government district. Estimated 50,000 participants.",
    timestamp: "2024-03-07T22:00:00Z",
    source: "HUMINT Network",
  },
  {
    id: "INC-006",
    lat: 35.6762,
    lng: 139.6503,
    title: "Cyber Campaign Detected",
    type: "cyber",
    severity: "critical",
    description: "State-sponsored APT conducting supply chain attack against semiconductor manufacturers.",
    timestamp: "2024-03-08T05:10:00Z",
    source: "JPCERT/CC",
  },
  {
    id: "INC-007",
    lat: 1.3521,
    lng: 103.8198,
    title: "Financial Anomaly",
    type: "surveillance",
    severity: "medium",
    description: "Suspicious transaction patterns detected across 7 financial institutions. Possible money laundering network.",
    timestamp: "2024-03-08T04:00:00Z",
    source: "FinCEN Alert",
  },
  {
    id: "INC-008",
    lat: 55.7558,
    lng: 37.6173,
    title: "Disinformation Campaign",
    type: "cyber",
    severity: "high",
    description: "Coordinated influence operation detected across social media platforms. 2,400 bot accounts identified.",
    timestamp: "2024-03-08T03:00:00Z",
    source: "Social Media Analysis Unit",
  },
  {
    id: "INC-009",
    lat: -33.8688,
    lng: 151.2093,
    title: "Port Security Alert",
    type: "infrastructure",
    severity: "low",
    description: "Unauthorized drone activity near port facilities. Security protocols elevated.",
    timestamp: "2024-03-08T00:45:00Z",
    source: "Port Authority",
  },
  {
    id: "INC-010",
    lat: 14.5995,
    lng: 120.9842,
    title: "Naval Movement",
    type: "maritime",
    severity: "high",
    description: "Unusual naval deployment detected in South China Sea. 8 vessels repositioning.",
    timestamp: "2024-03-08T05:30:00Z",
    source: "Pacific Fleet Monitor",
  },
];

export const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#10b981",
};

export const typeIcons: Record<string, string> = {
  conflict: "crosshair",
  cyber: "wifi",
  infrastructure: "building",
  surveillance: "eye",
  maritime: "anchor",
};
