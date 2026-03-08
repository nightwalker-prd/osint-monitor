export interface TrackedEntity {
  id: string;
  name: string;
  type: "person" | "organization" | "location" | "device" | "financial";
  alias?: string[];
  threatScore: number; // 0-100
  status: "active" | "dormant" | "unknown" | "neutralized";
  lastSeen: string;
  location: string;
  description: string;
  connections: number;
  recentActivity: string;
  tags: string[];
}

export const trackedEntities: TrackedEntity[] = [
  {
    id: "ENT-001",
    name: "PHANTOM-BEAR",
    type: "organization",
    alias: ["APT-29B", "COZY DUKE"],
    threatScore: 95,
    status: "active",
    lastSeen: "2024-03-08T05:30:00Z",
    location: "Moscow, Russia",
    description: "State-sponsored advanced persistent threat group. Specializes in cyber espionage and supply chain attacks.",
    connections: 12,
    recentActivity: "C2 server activation detected",
    tags: ["APT", "state-sponsored", "cyber"],
  },
  {
    id: "ENT-002",
    name: "ALPHA-7",
    type: "organization",
    alias: ["The Network"],
    threatScore: 92,
    status: "active",
    lastSeen: "2024-03-08T04:45:00Z",
    location: "Damascus, Syria",
    description: "Clandestine operational network with multi-regional reach. Engaged in weapons procurement and logistics.",
    connections: 8,
    recentActivity: "Encrypted burst transmission intercepted",
    tags: ["weapons", "logistics", "MENA"],
  },
  {
    id: "ENT-003",
    name: "Yusuf Al-Rashid",
    type: "person",
    alias: ["Abu Nour", "The Engineer"],
    threatScore: 85,
    status: "active",
    lastSeen: "2024-03-08T04:23:00Z",
    location: "Damascus Region",
    description: "Key operational figure in ALPHA-7. Suspected technical facilitator for encrypted communications network.",
    connections: 5,
    recentActivity: "Signal activity in Damascus region",
    tags: ["ALPHA-7", "technical", "facilitator"],
  },
  {
    id: "ENT-004",
    name: "Viktor Petrov",
    type: "person",
    alias: ["Ghost", "V.P."],
    threatScore: 78,
    status: "active",
    lastSeen: "2024-03-08T03:00:00Z",
    location: "Berlin, Germany",
    description: "Former intelligence operative. Now linked to PHANTOM-BEAR operations and financial networks.",
    connections: 7,
    recentActivity: "Attended Berlin meeting, new financial links",
    tags: ["PHANTOM-BEAR", "intelligence", "finance"],
  },
  {
    id: "ENT-005",
    name: "Shadow Finance Ltd",
    type: "financial",
    threatScore: 88,
    status: "active",
    lastSeen: "2024-03-08T05:10:00Z",
    location: "Cayman Islands",
    description: "Shell company used for laundering operational funds. Connected to multiple threat networks.",
    connections: 6,
    recentActivity: "$2.4M crypto transfer through mixing services",
    tags: ["money-laundering", "shell-company", "crypto"],
  },
  {
    id: "ENT-006",
    name: "Elena Voronova",
    type: "person",
    alias: ["Lena", "NIGHTINGALE"],
    threatScore: 72,
    status: "active",
    lastSeen: "2024-03-08T04:20:00Z",
    location: "Istanbul, Turkey",
    description: "Intelligence courier. Moves between European and Middle Eastern networks. Uses alias documentation.",
    connections: 4,
    recentActivity: "Departed Istanbul Hub under alias",
    tags: ["courier", "PHANTOM-BEAR", "Europe-MENA"],
  },
  {
    id: "ENT-007",
    name: "Meridian Trading Co",
    type: "financial",
    threatScore: 80,
    status: "active",
    lastSeen: "2024-03-08T02:00:00Z",
    location: "Singapore",
    description: "Front organization for procurement and financial transactions. Linked to 3 other shell companies.",
    connections: 5,
    recentActivity: "New shell company identified in Singapore",
    tags: ["front-org", "procurement", "Asia"],
  },
  {
    id: "ENT-008",
    name: "Hassan Mahmoud",
    type: "person",
    threatScore: 68,
    status: "active",
    lastSeen: "2024-03-08T02:30:00Z",
    location: "Damascus, Syria",
    description: "Logistics coordinator for ALPHA-7. Manages safe houses and ground transportation.",
    connections: 3,
    recentActivity: "Present at Damascus safe house",
    tags: ["ALPHA-7", "logistics", "ground-ops"],
  },
];

export const entityTypeConfig: Record<string, { color: string; icon: string }> = {
  person: { color: "#00d4ff", icon: "User" },
  organization: { color: "#ef4444", icon: "Building2" },
  location: { color: "#10b981", icon: "MapPin" },
  device: { color: "#8b5cf6", icon: "Cpu" },
  financial: { color: "#f59e0b", icon: "Banknote" },
};
