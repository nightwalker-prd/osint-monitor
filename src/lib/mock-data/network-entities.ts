export interface NetworkNode {
  id: string;
  name: string;
  type: "person" | "organization" | "location" | "event" | "device" | "financial";
  threat: number; // 0-100
  group: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  type: "communication" | "financial" | "association" | "location" | "operational";
  strength: number; // 0-1
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export const networkData: NetworkData = {
  nodes: [
    { id: "N001", name: "ALPHA-7", type: "organization", threat: 92, group: 1 },
    { id: "N002", name: "Yusuf Al-Rashid", type: "person", threat: 85, group: 1 },
    { id: "N003", name: "Viktor Petrov", type: "person", threat: 78, group: 2 },
    { id: "N004", name: "Shadow Finance Ltd", type: "financial", threat: 88, group: 1 },
    { id: "N005", name: "Damascus Safe House", type: "location", threat: 70, group: 1 },
    { id: "N006", name: "PHANTOM-BEAR", type: "organization", threat: 95, group: 2 },
    { id: "N007", name: "Encrypted Node X-47", type: "device", threat: 65, group: 2 },
    { id: "N008", name: "Berlin Meeting 03/05", type: "event", threat: 60, group: 3 },
    { id: "N009", name: "Elena Voronova", type: "person", threat: 72, group: 2 },
    { id: "N010", name: "Meridian Trading Co", type: "financial", threat: 80, group: 3 },
    { id: "N011", name: "Port Said Warehouse", type: "location", threat: 55, group: 3 },
    { id: "N012", name: "Operation NIGHTFALL", type: "event", threat: 90, group: 1 },
    { id: "N013", name: "Hassan Mahmoud", type: "person", threat: 68, group: 1 },
    { id: "N014", name: "Crypto Wallet 0x7f2", type: "financial", threat: 75, group: 2 },
    { id: "N015", name: "Istanbul Hub", type: "location", threat: 62, group: 3 },
    { id: "N016", name: "Drone Sig #4419", type: "device", threat: 58, group: 1 },
  ],
  links: [
    { source: "N001", target: "N002", type: "operational", strength: 0.9 },
    { source: "N001", target: "N004", type: "financial", strength: 0.85 },
    { source: "N002", target: "N005", type: "location", strength: 0.7 },
    { source: "N002", target: "N013", type: "communication", strength: 0.8 },
    { source: "N003", target: "N006", type: "operational", strength: 0.95 },
    { source: "N003", target: "N009", type: "association", strength: 0.75 },
    { source: "N006", target: "N007", type: "operational", strength: 0.88 },
    { source: "N006", target: "N014", type: "financial", strength: 0.65 },
    { source: "N008", target: "N003", type: "association", strength: 0.7 },
    { source: "N008", target: "N010", type: "financial", strength: 0.6 },
    { source: "N009", target: "N014", type: "financial", strength: 0.72 },
    { source: "N010", target: "N011", type: "location", strength: 0.68 },
    { source: "N010", target: "N004", type: "financial", strength: 0.78 },
    { source: "N012", target: "N001", type: "operational", strength: 0.92 },
    { source: "N012", target: "N002", type: "operational", strength: 0.88 },
    { source: "N013", target: "N005", type: "location", strength: 0.65 },
    { source: "N013", target: "N016", type: "operational", strength: 0.7 },
    { source: "N015", target: "N010", type: "location", strength: 0.58 },
    { source: "N015", target: "N003", type: "location", strength: 0.55 },
    { source: "N001", target: "N006", type: "communication", strength: 0.45 },
  ],
};

export const nodeTypeColors: Record<string, string> = {
  person: "#00d4ff",
  organization: "#ef4444",
  location: "#10b981",
  event: "#f59e0b",
  device: "#8b5cf6",
  financial: "#f97316",
};
