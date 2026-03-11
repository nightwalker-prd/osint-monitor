export interface Alert {
  id: string;
  type: 'intrusion' | 'data_leak' | 'malware' | 'phishing' | 'ddos' | 'insider' | 'policy' | 'recon';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'investigating' | 'escalated' | 'resolved' | 'false_positive';
  assignee?: string;
  relatedEntities: string[];
  indicators: string[];
  correlationCount: number;
  ttl?: number; // minutes until auto-escalate
  tags: string[];
}

export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  condition: string;
  action: string;
  triggerCount: number;
}

export const alertsQueue: Alert[] = [
  {
    id: 'alert-001',
    type: 'intrusion',
    severity: 'critical',
    title: 'Active C2 beacon detected — ProtoCorp network',
    description: 'Endpoint EDR flagged persistent outbound beaconing to known APT-PHANTOM C2 infrastructure (185.220.101.42) every 30 seconds. Host: PCORP-WS-2847. User: j.martinez. PhantomRAT signature confirmed.',
    source: 'EDR / CrowdStrike',
    timestamp: '2026-03-10T23:12:00Z',
    status: 'new',
    relatedEntities: ['APT-PHANTOM', 'ProtoCorp'],
    indicators: ['185.220.101[.]42', 'PhantomRAT v3.1', 'PCORP-WS-2847'],
    correlationCount: 7,
    ttl: 15,
    tags: ['apt', 'c2', 'active_compromise', 'high_value_target'],
  },
  {
    id: 'alert-002',
    type: 'data_leak',
    severity: 'critical',
    title: 'Credential dump verified — 12.4K accounts exposed',
    description: 'Dark web crawler confirmed authenticity of ProtoCorp credential dump. Sample validation shows 73% of credentials still active. Domain admin hash included in the set.',
    source: 'Dark Web Monitor',
    timestamp: '2026-03-10T22:45:00Z',
    status: 'acknowledged',
    assignee: 'SOC-ALPHA',
    relatedEntities: ['ProtoCorp', 'APT-PHANTOM'],
    indicators: ['12,400 credentials', 'AD domain admin hash', 'darkforum.onion/thread/88421'],
    correlationCount: 12,
    ttl: 30,
    tags: ['credentials', 'verified', 'domain_admin', 'immediate_action'],
  },
  {
    id: 'alert-003',
    type: 'malware',
    severity: 'critical',
    title: 'Zero-day exploit in active use — CVE-2026-1847',
    description: 'FortiGate zero-day (CVE-2026-1847) now confirmed in active exploitation. VORTEX_BEAR observed using this against 14 targets in the last 6 hours. No vendor patch available.',
    source: 'Threat Intel Platform',
    timestamp: '2026-03-10T22:00:00Z',
    status: 'escalated',
    assignee: 'IR-TEAM-1',
    relatedEntities: ['VORTEX_BEAR'],
    indicators: ['CVE-2026-1847', 'FortiGate < 7.4.3', '14 confirmed targets'],
    correlationCount: 23,
    tags: ['zero_day', 'no_patch', 'active_exploitation', 'critical_infra'],
  },
  {
    id: 'alert-004',
    type: 'ddos',
    severity: 'high',
    title: 'DDoS preparation — EU banking targets identified',
    description: 'SIGINT intercept confirmed KILLNET_REMNANT planning coordinated DDoS against 6 EU banking institutions. Attack window: next 48-72 hours. Botnet capacity estimated at 800 Gbps.',
    source: 'SIGINT / IRC Intercept',
    timestamp: '2026-03-10T20:30:00Z',
    status: 'investigating',
    assignee: 'CYBER-COMMAND',
    relatedEntities: ['KILLNET_REMNANT'],
    indicators: ['800 Gbps capacity', '6 EU banks targeted', '48-72hr window'],
    correlationCount: 5,
    ttl: 60,
    tags: ['ddos', 'banking', 'preemptive', 'eu_targets'],
  },
  {
    id: 'alert-005',
    type: 'insider',
    severity: 'high',
    title: 'Insider recruitment attempt — semiconductor sector',
    description: 'Forum monitoring detected active recruitment post targeting insiders at major semiconductor fabs. Offering $50K-200K for design documents. Pattern consistent with JADE_DRAGON proxy operations.',
    source: 'Dark Web Monitor',
    timestamp: '2026-03-10T19:15:00Z',
    status: 'investigating',
    assignee: 'CI-TEAM',
    relatedEntities: ['JADE_DRAGON'],
    indicators: ['darkforum.onion/thread/88590', '$50K-200K bounty', 'semiconductor targets'],
    correlationCount: 3,
    tags: ['insider_threat', 'espionage', 'semiconductor', 'nation_state'],
  },
  {
    id: 'alert-006',
    type: 'malware',
    severity: 'high',
    title: 'BlackVault ransomware — third hospital hit in 48hrs',
    description: 'Regional Medical Center confirmed as third healthcare target of BlackVault ransomware. Patient data encryption in progress. Ransom demand: 450 BTC. FBI notified.',
    source: 'Healthcare ISAC',
    timestamp: '2026-03-10T18:00:00Z',
    status: 'escalated',
    assignee: 'IR-TEAM-2',
    relatedEntities: ['BlackVault'],
    indicators: ['VaultLocker 2.0', '450 BTC demand', 'Regional Medical Center'],
    correlationCount: 8,
    tags: ['ransomware', 'healthcare', 'patient_safety', 'fbi_notified'],
  },
  {
    id: 'alert-007',
    type: 'phishing',
    severity: 'medium',
    title: 'Spearphishing campaign — COBALT_SPIDER banking kit',
    description: 'New phishing kit deployment detected targeting 40+ EU/MENA banking institutions. Real-time OTP interception capability. 12 language variants identified. Infrastructure traced to COBALT_SPIDER.',
    source: 'Email Security Gateway',
    timestamp: '2026-03-10T16:30:00Z',
    status: 'acknowledged',
    assignee: 'SOC-BETA',
    relatedEntities: ['COBALT_SPIDER'],
    indicators: ['12 language variants', '40+ bank targets', 'OTP interception'],
    correlationCount: 4,
    tags: ['phishing', 'banking', 'otp_bypass', 'multi_language'],
  },
  {
    id: 'alert-008',
    type: 'recon',
    severity: 'medium',
    title: 'Port scanning surge — defense contractor IPs',
    description: 'Anomalous increase in port scanning activity targeting Class B range associated with defense contractor networks. 400% increase over baseline. Source IPs rotating through Tor exit nodes.',
    source: 'IDS / Suricata',
    timestamp: '2026-03-10T14:00:00Z',
    status: 'investigating',
    assignee: 'SOC-ALPHA',
    relatedEntities: ['APT-PHANTOM'],
    indicators: ['400% scan increase', 'Tor exit nodes', 'defense contractor range'],
    correlationCount: 6,
    tags: ['recon', 'scanning', 'tor', 'defense'],
  },
  {
    id: 'alert-009',
    type: 'policy',
    severity: 'medium',
    title: 'Unauthorized cloud storage access — GovCloud secrets',
    description: 'Leaked .env files from government contractor now confirmed accessible. 47 unique API keys and secrets exposed. Automated rotation initiated for known services.',
    source: 'Cloud Security Posture',
    timestamp: '2026-03-10T12:00:00Z',
    status: 'acknowledged',
    assignee: 'CLOUD-SEC',
    relatedEntities: ['GovCloud_Sys'],
    indicators: ['47 API keys', '.env files', 'leakdb.onion'],
    correlationCount: 2,
    tags: ['cloud', 'secrets', 'api_keys', 'government'],
  },
  {
    id: 'alert-010',
    type: 'recon',
    severity: 'low',
    title: 'Researcher doxing compilation detected',
    description: 'Paste site compilation containing PII of 23 security researchers who published APT-PHANTOM threat intel. Likely retaliatory. Researchers notified via secure channel.',
    source: 'Dark Web Monitor',
    timestamp: '2026-03-10T10:00:00Z',
    status: 'resolved',
    assignee: 'INTEL-TEAM',
    relatedEntities: ['APT-PHANTOM'],
    indicators: ['23 researcher profiles', 'strongpaste.onion', 'retaliation'],
    correlationCount: 1,
    tags: ['doxing', 'retaliation', 'researchers'],
  },
];

export const alertRules: AlertRule[] = [
  { id: 'rule-001', name: 'Critical C2 Detection', enabled: true, condition: 'EDR beacon to known C2 IP', action: 'Auto-escalate to IR team, isolate host', triggerCount: 12 },
  { id: 'rule-002', name: 'Credential Leak Alert', enabled: true, condition: 'Dark web mention of org domain + credentials', action: 'Notify SOC, begin validation', triggerCount: 34 },
  { id: 'rule-003', name: 'Zero-Day in Wild', enabled: true, condition: 'CVE with no patch + active exploitation', action: 'Flash alert to all teams, block at perimeter', triggerCount: 3 },
  { id: 'rule-004', name: 'Ransomware Indicator', enabled: true, condition: 'Known ransomware signature or behavior', action: 'Isolate segment, engage IR team', triggerCount: 8 },
  { id: 'rule-005', name: 'DDoS Warning', enabled: true, condition: 'SIGINT/OSINT indicates planned attack', action: 'Engage CDN, notify targets, pre-position defenses', triggerCount: 5 },
  { id: 'rule-006', name: 'Anomalous Scan Activity', enabled: true, condition: 'Port scan volume > 300% baseline', action: 'Log, correlate with threat actors, alert if targeted', triggerCount: 22 },
];

export const alertStats = {
  total: 847,
  critical: 23,
  high: 89,
  medium: 234,
  low: 501,
  unresolved: 156,
  avgResponseTime: '4.7 min',
  falsePositiveRate: 12.3,
};
