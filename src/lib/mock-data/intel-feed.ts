export interface IntelItem {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "SIGINT" | "HUMINT" | "OSINT" | "CYBER" | "FININT" | "GEOINT";
  timestamp: string;
  source: string;
  summary: string;
  isNew: boolean;
}

export const intelFeedItems: IntelItem[] = [
  {
    id: "INTEL-001",
    title: "APT Infrastructure Expansion Detected",
    severity: "critical",
    category: "CYBER",
    timestamp: "2024-03-08T05:32:00Z",
    source: "Threat Intelligence Platform",
    summary: "PHANTOM-BEAR deploying 4 new C2 nodes across Eastern European hosting providers. TLS certificates fingerprinted.",
    isNew: true,
  },
  {
    id: "INTEL-002",
    title: "Financial Anomaly Alert - High Priority",
    severity: "critical",
    category: "FININT",
    timestamp: "2024-03-08T05:15:00Z",
    source: "Blockchain Analysis Unit",
    summary: "Cascading crypto transfers totaling $2.4M traced through 3 mixing services. Final destination wallet under analysis.",
    isNew: true,
  },
  {
    id: "INTEL-003",
    title: "SIGINT Collection Update - ALPHA-7",
    severity: "high",
    category: "SIGINT",
    timestamp: "2024-03-08T04:50:00Z",
    source: "Station Alpha",
    summary: "New transmission pattern identified. Frequency hopping sequence decoded. Operational window: 0200-0500 UTC.",
    isNew: true,
  },
  {
    id: "INTEL-004",
    title: "Human Source Report - Istanbul Network",
    severity: "high",
    category: "HUMINT",
    timestamp: "2024-03-08T04:25:00Z",
    source: "Case Officer BRAVO-6",
    summary: "Source reports increased logistics activity at Istanbul Hub. New courier identified traveling under alias.",
    isNew: false,
  },
  {
    id: "INTEL-005",
    title: "Satellite Imagery Analysis Complete",
    severity: "medium",
    category: "GEOINT",
    timestamp: "2024-03-08T03:40:00Z",
    source: "NRO Tasking",
    summary: "Port Said warehouse shows increased vehicle activity. 3 new cargo containers delivered in 48-hour period.",
    isNew: false,
  },
  {
    id: "INTEL-006",
    title: "Social Media Monitoring Alert",
    severity: "high",
    category: "OSINT",
    timestamp: "2024-03-08T03:10:00Z",
    source: "Open Source Center",
    summary: "Coordinated bot network amplifying anti-NATO narratives. 2,400 accounts across 3 platforms identified.",
    isNew: false,
  },
  {
    id: "INTEL-007",
    title: "Maritime Domain Awareness Update",
    severity: "medium",
    category: "GEOINT",
    timestamp: "2024-03-08T02:45:00Z",
    source: "Maritime Fusion Center",
    summary: "AIS-dark vessels positively identified via SAR imagery. Heading consistent with known smuggling routes.",
    isNew: false,
  },
  {
    id: "INTEL-008",
    title: "Cyber Threat Bulletin - SCADA Systems",
    severity: "medium",
    category: "CYBER",
    timestamp: "2024-03-08T01:00:00Z",
    source: "CISA",
    summary: "Advisory issued for critical infrastructure operators. New exploit targeting Siemens S7-1500 PLCs.",
    isNew: false,
  },
  {
    id: "INTEL-009",
    title: "Financial Network Mapping Update",
    severity: "low",
    category: "FININT",
    timestamp: "2024-03-08T00:30:00Z",
    source: "FinCEN Liaison",
    summary: "3 new shell companies linked to Meridian Trading Co identified in Panama, BVI, and Cyprus registries.",
    isNew: false,
  },
  {
    id: "INTEL-010",
    title: "Threat Actor Profile Updated",
    severity: "low",
    category: "OSINT",
    timestamp: "2024-03-07T23:00:00Z",
    source: "Analysis Division",
    summary: "Elena Voronova profile enhanced with new biometric data and alias documentation from Berlin meeting.",
    isNew: false,
  },
];

export const categoryColors: Record<string, string> = {
  SIGINT: "#8b5cf6",
  HUMINT: "#00d4ff",
  OSINT: "#10b981",
  CYBER: "#f97316",
  FININT: "#f59e0b",
  GEOINT: "#06b6d4",
};
