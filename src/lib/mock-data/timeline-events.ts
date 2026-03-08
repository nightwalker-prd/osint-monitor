export interface TimelineEvent {
  id: string;
  title: string;
  type: "incident" | "intel" | "comms" | "movement" | "cyber" | "financial";
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  description: string;
  source: string;
  entities: string[];
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: "EVT-001",
    title: "PHANTOM-BEAR C2 Server Activated",
    type: "cyber",
    severity: "critical",
    timestamp: "2024-03-08T05:30:00Z",
    description: "New command & control infrastructure detected. Server fingerprint matches known APT tooling.",
    source: "Threat Intelligence Platform",
    entities: ["PHANTOM-BEAR", "Viktor Petrov"],
  },
  {
    id: "EVT-002",
    title: "Encrypted Funds Transfer - $2.4M",
    type: "financial",
    severity: "high",
    timestamp: "2024-03-08T05:10:00Z",
    description: "Large crypto transfer detected from Wallet 0x7f2 through 3 mixing services to unknown endpoint.",
    source: "Blockchain Analysis Unit",
    entities: ["Shadow Finance Ltd", "Crypto Wallet 0x7f2"],
  },
  {
    id: "EVT-003",
    title: "SIGINT Intercept - Damascus Region",
    type: "comms",
    severity: "critical",
    timestamp: "2024-03-08T04:45:00Z",
    description: "Burst transmission intercepted. Pattern matches ALPHA-7 operational cadence. Duration: 14 seconds.",
    source: "SIGINT Station Alpha",
    entities: ["ALPHA-7", "Yusuf Al-Rashid", "Damascus Safe House"],
  },
  {
    id: "EVT-004",
    title: "Asset Movement - Istanbul",
    type: "movement",
    severity: "medium",
    timestamp: "2024-03-08T04:20:00Z",
    description: "Tracked individual departed Istanbul Hub. Destination: unknown. Traveling under alias documentation.",
    source: "HUMINT Network",
    entities: ["Elena Voronova", "Istanbul Hub"],
  },
  {
    id: "EVT-005",
    title: "Supply Chain Compromise Detected",
    type: "cyber",
    severity: "critical",
    timestamp: "2024-03-08T04:00:00Z",
    description: "Malicious code injected into firmware update pipeline. 14 downstream targets potentially affected.",
    source: "JPCERT/CC",
    entities: ["PHANTOM-BEAR"],
  },
  {
    id: "EVT-006",
    title: "Maritime Surveillance Update",
    type: "movement",
    severity: "high",
    timestamp: "2024-03-08T03:30:00Z",
    description: "3 vessels with disabled AIS transponders now heading east. Speed consistent with cargo vessels.",
    source: "Maritime Surveillance Net",
    entities: ["Meridian Trading Co"],
  },
  {
    id: "EVT-007",
    title: "Disinformation Campaign Escalation",
    type: "intel",
    severity: "high",
    timestamp: "2024-03-08T03:00:00Z",
    description: "Bot network expanded to 2,400 accounts. Coordinated messaging targeting NATO alliance credibility.",
    source: "Social Media Analysis Unit",
    entities: ["PHANTOM-BEAR", "Viktor Petrov"],
  },
  {
    id: "EVT-008",
    title: "Safe House Surveillance Positive",
    type: "intel",
    severity: "medium",
    timestamp: "2024-03-08T02:30:00Z",
    description: "Thermal imaging confirms 4-6 individuals present at Damascus location. Vehicle activity observed.",
    source: "ISR Platform",
    entities: ["Damascus Safe House", "Hassan Mahmoud"],
  },
  {
    id: "EVT-009",
    title: "Financial Network Probe",
    type: "financial",
    severity: "medium",
    timestamp: "2024-03-08T02:00:00Z",
    description: "Meridian Trading Co shell company identified in Singapore. Connected to 3 known front organizations.",
    source: "FinCEN Alert",
    entities: ["Meridian Trading Co", "Shadow Finance Ltd"],
  },
  {
    id: "EVT-010",
    title: "Drone Signature Cataloged",
    type: "movement",
    severity: "low",
    timestamp: "2024-03-08T01:15:00Z",
    description: "UAV electronic signature matched to previously unidentified platform. Added to threat database.",
    source: "EW Monitoring Station",
    entities: ["Drone Sig #4419"],
  },
  {
    id: "EVT-011",
    title: "Berlin Meeting Intelligence",
    type: "intel",
    severity: "high",
    timestamp: "2024-03-08T00:45:00Z",
    description: "Post-meeting analysis complete. 3 new persons of interest identified. Financial links established.",
    source: "HUMINT Network",
    entities: ["Viktor Petrov", "Meridian Trading Co"],
  },
  {
    id: "EVT-012",
    title: "SCADA Probe Detected",
    type: "cyber",
    severity: "medium",
    timestamp: "2024-03-08T00:15:00Z",
    description: "Reconnaissance activity against DC metro power grid SCADA systems. 47 probes logged in 2-hour window.",
    source: "CISA Alert System",
    entities: ["PHANTOM-BEAR"],
  },
];

export const eventTypeConfig: Record<string, { color: string; label: string }> = {
  incident: { color: "#ef4444", label: "INCIDENT" },
  intel: { color: "#00d4ff", label: "INTEL" },
  comms: { color: "#8b5cf6", label: "COMMS" },
  movement: { color: "#10b981", label: "MOVEMENT" },
  cyber: { color: "#f97316", label: "CYBER" },
  financial: { color: "#f59e0b", label: "FINANCIAL" },
};
