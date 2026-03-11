export interface InvestigationCase {
  id: string;
  title: string;
  status: 'active' | 'pending_review' | 'closed' | 'archived';
  priority: 'critical' | 'high' | 'medium' | 'low';
  lead: string;
  team: string[];
  createdAt: string;
  updatedAt: string;
  description: string;
  entities: BoardEntity[];
  connections: BoardConnection[];
  notes: CaseNote[];
  evidence: Evidence[];
  timeline: CaseEvent[];
  tags: string[];
}

export interface BoardEntity {
  id: string;
  type: 'person' | 'organization' | 'ip_address' | 'domain' | 'malware' | 'location' | 'wallet' | 'document';
  label: string;
  description: string;
  x: number;
  y: number;
  pinned: boolean;
  threatLevel?: 'critical' | 'high' | 'medium' | 'low';
  metadata: Record<string, string>;
}

export interface BoardConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  type: 'confirmed' | 'suspected' | 'circumstantial';
  strength: number; // 0-100
}

export interface CaseNote {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  classification: 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
}

export interface Evidence {
  id: string;
  type: 'file' | 'screenshot' | 'log' | 'pcap' | 'memory_dump' | 'report';
  name: string;
  hash?: string;
  addedAt: string;
  addedBy: string;
  size: string;
}

export interface CaseEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  type: 'discovery' | 'action' | 'escalation' | 'evidence' | 'note';
}

export const investigationCases: InvestigationCase[] = [
  {
    id: 'case-001',
    title: 'Operation SHADOW BREACH — ProtoCorp APT Intrusion',
    status: 'active',
    priority: 'critical',
    lead: 'Agent BLACKWOOD',
    team: ['Agent BLACKWOOD', 'Agent CHEN', 'Agent REEVES', 'Agent OKAFOR'],
    createdAt: '2026-03-10T14:30:00Z',
    updatedAt: '2026-03-10T23:15:00Z',
    description: 'Active APT-PHANTOM intrusion into ProtoCorp corporate network. Initial access via compromised software update. Lateral movement confirmed. Credential dump on dark web. Domain admin likely compromised.',
    entities: [
      { id: 'be-001', type: 'organization', label: 'ProtoCorp', description: 'Victim organization — defense contractor', x: 400, y: 300, pinned: true, threatLevel: 'critical', metadata: { sector: 'Defense', employees: '4,200', hq: 'Arlington, VA' } },
      { id: 'be-002', type: 'person', label: 'APT-PHANTOM', description: 'Primary threat actor', x: 100, y: 200, pinned: true, threatLevel: 'critical', metadata: { origin: 'Eastern Europe', type: 'APT', firstSeen: '2019' } },
      { id: 'be-003', type: 'ip_address', label: '185.220.101.42', description: 'C2 server — active beacon', x: 250, y: 100, pinned: false, threatLevel: 'critical', metadata: { hosting: 'BulletProof AS', location: 'Moldova', firstSeen: '2026-01-15' } },
      { id: 'be-004', type: 'malware', label: 'PhantomRAT v3.1', description: 'Remote access trojan', x: 250, y: 400, pinned: false, threatLevel: 'high', metadata: { type: 'RAT', capability: 'Full remote access', detection: '3/67 on VT' } },
      { id: 'be-005', type: 'domain', label: 'phantom-c2.xyz', description: 'C2 domain — active', x: 100, y: 400, pinned: false, threatLevel: 'high', metadata: { registrar: 'NiceNIC', created: '2025-12-01', nameservers: 'bulletproof' } },
      { id: 'be-006', type: 'person', label: 'j.martinez', description: 'Compromised user account', x: 550, y: 200, pinned: false, threatLevel: 'high', metadata: { role: 'Senior Engineer', department: 'R&D', host: 'PCORP-WS-2847' } },
      { id: 'be-007', type: 'domain', label: 'darkforum.onion', description: 'Credential dump location', x: 500, y: 450, pinned: false, threatLevel: 'medium', metadata: { type: 'Tor Forum', thread: '88421' } },
      { id: 'be-008', type: 'document', label: 'SolarBreezeUpdate.exe', description: 'Trojanized software update', x: 400, y: 100, pinned: false, threatLevel: 'critical', metadata: { sha256: 'a1b2c3d4...', size: '4.2 MB', signed: 'Valid (stolen cert)' } },
    ],
    connections: [
      { id: 'bc-001', sourceId: 'be-002', targetId: 'be-003', label: 'operates', type: 'confirmed', strength: 95 },
      { id: 'bc-002', sourceId: 'be-002', targetId: 'be-004', label: 'developed', type: 'confirmed', strength: 90 },
      { id: 'bc-003', sourceId: 'be-002', targetId: 'be-005', label: 'registered', type: 'confirmed', strength: 88 },
      { id: 'bc-004', sourceId: 'be-003', targetId: 'be-001', label: 'beaconing to', type: 'confirmed', strength: 97 },
      { id: 'bc-005', sourceId: 'be-004', targetId: 'be-006', label: 'installed on', type: 'confirmed', strength: 92 },
      { id: 'bc-006', sourceId: 'be-008', targetId: 'be-004', label: 'drops', type: 'confirmed', strength: 96 },
      { id: 'bc-007', sourceId: 'be-006', targetId: 'be-007', label: 'credentials posted to', type: 'confirmed', strength: 73 },
      { id: 'bc-008', sourceId: 'be-008', targetId: 'be-001', label: 'delivered to', type: 'confirmed', strength: 85 },
    ],
    notes: [
      { id: 'cn-001', author: 'Agent BLACKWOOD', content: 'Initial triage complete. PhantomRAT confirmed on 3 endpoints. Beacon interval 30s to C2. Lateral movement via stolen Kerberos tickets. Recommending full network isolation of affected segment.', timestamp: '2026-03-10T15:00:00Z', classification: 'SECRET' },
      { id: 'cn-002', author: 'Agent CHEN', content: 'Malware analysis: PhantomRAT v3.1 uses process hollowing (svchost.exe), custom packer with anti-VM checks. C2 protocol over DNS TXT records with AES-256 encryption. Persistence via scheduled task + WMI subscription.', timestamp: '2026-03-10T18:30:00Z', classification: 'SECRET' },
      { id: 'cn-003', author: 'Agent REEVES', content: 'Dark web credential dump validated. 73% of sampled passwords still active. Domain admin hash cracked in 4 hours (weak password). Immediate forced reset initiated for all AD accounts.', timestamp: '2026-03-10T22:00:00Z', classification: 'TOP_SECRET' },
    ],
    evidence: [
      { id: 'ev-001', type: 'memory_dump', name: 'PCORP-WS-2847_memdump.raw', hash: 'SHA256:a1b2c3d4e5f6...', addedAt: '2026-03-10T15:30:00Z', addedBy: 'Agent CHEN', size: '8.2 GB' },
      { id: 'ev-002', type: 'pcap', name: 'c2_beacon_capture.pcap', hash: 'SHA256:b2c3d4e5f6a7...', addedAt: '2026-03-10T16:00:00Z', addedBy: 'Agent BLACKWOOD', size: '145 MB' },
      { id: 'ev-003', type: 'file', name: 'PhantomRAT_v3.1_unpacked.bin', hash: 'SHA256:c3d4e5f6a7b8...', addedAt: '2026-03-10T18:00:00Z', addedBy: 'Agent CHEN', size: '892 KB' },
      { id: 'ev-004', type: 'log', name: 'ad_auth_anomalies.evtx', hash: 'SHA256:d4e5f6a7b8c9...', addedAt: '2026-03-10T19:00:00Z', addedBy: 'Agent OKAFOR', size: '23 MB' },
      { id: 'ev-005', type: 'screenshot', name: 'credential_dump_listing.png', addedAt: '2026-03-10T22:15:00Z', addedBy: 'Agent REEVES', size: '1.4 MB' },
    ],
    timeline: [
      { id: 'ce-001', timestamp: '2026-03-08T14:00:00Z', event: 'Trojanized SolarBreeze update pushed to ProtoCorp endpoints', actor: 'APT-PHANTOM', type: 'discovery' },
      { id: 'ce-002', timestamp: '2026-03-09T09:00:00Z', event: 'PhantomRAT beacon first detected by EDR (initially suppressed)', actor: 'System', type: 'discovery' },
      { id: 'ce-003', timestamp: '2026-03-10T06:00:00Z', event: 'Lateral movement detected — Kerberos ticket abuse', actor: 'APT-PHANTOM', type: 'discovery' },
      { id: 'ce-004', timestamp: '2026-03-10T14:22:00Z', event: 'Credential dump posted to dark web forum', actor: 'APT-PHANTOM', type: 'evidence' },
      { id: 'ce-005', timestamp: '2026-03-10T14:30:00Z', event: 'Case opened — Operation SHADOW BREACH', actor: 'Agent BLACKWOOD', type: 'action' },
      { id: 'ce-006', timestamp: '2026-03-10T16:00:00Z', event: 'Network segment isolated, forensic collection initiated', actor: 'IR-TEAM-1', type: 'action' },
      { id: 'ce-007', timestamp: '2026-03-10T18:30:00Z', event: 'Malware analysis complete — full TTP report', actor: 'Agent CHEN', type: 'evidence' },
      { id: 'ce-008', timestamp: '2026-03-10T22:00:00Z', event: 'Credential dump validated — forced AD reset', actor: 'Agent REEVES', type: 'escalation' },
      { id: 'ce-009', timestamp: '2026-03-10T23:00:00Z', event: 'CISA notified — cross-sector alert pending', actor: 'Agent BLACKWOOD', type: 'escalation' },
    ],
    tags: ['apt', 'supply_chain', 'active_intrusion', 'credential_leak', 'critical_infrastructure'],
  },
  {
    id: 'case-002',
    title: 'Operation DARK VAULT — BlackVault Healthcare Campaign',
    status: 'active',
    priority: 'critical',
    lead: 'Agent MORALES',
    team: ['Agent MORALES', 'Agent TANAKA', 'Agent SMITH'],
    createdAt: '2026-03-10T06:30:00Z',
    updatedAt: '2026-03-10T21:45:00Z',
    description: 'BlackVault ransomware group targeting healthcare facilities during patient surge. Three hospitals compromised in 48 hours. Double extortion with patient data. FBI coordinating response.',
    entities: [
      { id: 'be-101', type: 'person', label: 'BlackVault', description: 'Ransomware operator', x: 300, y: 200, pinned: true, threatLevel: 'critical', metadata: { type: 'RaaS', origin: 'Brazil', affiliates: '40+' } },
      { id: 'be-102', type: 'organization', label: 'Regional Medical Center', description: 'Latest victim', x: 550, y: 300, pinned: true, threatLevel: 'critical', metadata: { beds: '340', patients: '12,000/yr' } },
      { id: 'be-103', type: 'wallet', label: 'bc1q...v8m4k', description: 'Ransom payment wallet', x: 150, y: 400, pinned: false, threatLevel: 'high', metadata: { balance: '1,240 BTC', transactions: '47' } },
      { id: 'be-104', type: 'malware', label: 'VaultLocker 2.0', description: 'Ransomware payload', x: 300, y: 400, pinned: false, threatLevel: 'critical', metadata: { encryption: 'AES-256/RSA', edr_evasion: 'Yes' } },
    ],
    connections: [
      { id: 'bc-101', sourceId: 'be-101', targetId: 'be-104', label: 'deploys', type: 'confirmed', strength: 98 },
      { id: 'bc-102', sourceId: 'be-104', targetId: 'be-102', label: 'encrypted', type: 'confirmed', strength: 100 },
      { id: 'bc-103', sourceId: 'be-101', targetId: 'be-103', label: 'demands payment to', type: 'confirmed', strength: 95 },
    ],
    notes: [
      { id: 'cn-101', author: 'Agent MORALES', content: 'Pattern analysis: all three hospitals targeted during peak ER hours. Attackers aware of staffing schedules. Suggests insider reconnaissance or social engineering prior to deployment.', timestamp: '2026-03-10T12:00:00Z', classification: 'SECRET' },
    ],
    evidence: [
      { id: 'ev-101', type: 'file', name: 'VaultLocker2.0_sample.exe', hash: 'SHA256:d5e6f7a8b9c0...', addedAt: '2026-03-10T08:00:00Z', addedBy: 'Agent TANAKA', size: '2.1 MB' },
      { id: 'ev-102', type: 'log', name: 'rdp_bruteforce_logs.csv', addedAt: '2026-03-10T10:00:00Z', addedBy: 'Agent SMITH', size: '5.6 MB' },
    ],
    timeline: [
      { id: 'ce-101', timestamp: '2026-03-08T18:00:00Z', event: 'First hospital encrypted — St. James Medical', actor: 'BlackVault', type: 'discovery' },
      { id: 'ce-102', timestamp: '2026-03-09T22:00:00Z', event: 'Second hospital hit — Metro Health System', actor: 'BlackVault', type: 'discovery' },
      { id: 'ce-103', timestamp: '2026-03-10T06:00:00Z', event: 'Third hospital — Regional Medical Center', actor: 'BlackVault', type: 'discovery' },
      { id: 'ce-104', timestamp: '2026-03-10T06:30:00Z', event: 'Case opened — Operation DARK VAULT', actor: 'Agent MORALES', type: 'action' },
      { id: 'ce-105', timestamp: '2026-03-10T18:00:00Z', event: 'FBI Cyber Division engaged', actor: 'Agent MORALES', type: 'escalation' },
    ],
    tags: ['ransomware', 'healthcare', 'fbi', 'patient_data', 'double_extortion'],
  },
  {
    id: 'case-003',
    title: 'Operation SILK THREAD — Semiconductor Espionage',
    status: 'active',
    priority: 'high',
    lead: 'Agent PARK',
    team: ['Agent PARK', 'Agent WILLIAMS'],
    createdAt: '2026-03-07T10:00:00Z',
    updatedAt: '2026-03-10T16:00:00Z',
    description: 'JADE_DRAGON conducting sustained IP theft campaign against semiconductor manufacturers via compromised MSPs. Insider recruitment also detected on dark web forums.',
    entities: [
      { id: 'be-201', type: 'person', label: 'JADE_DRAGON', description: 'Nation-state espionage group', x: 200, y: 250, pinned: true, threatLevel: 'critical', metadata: { origin: 'China', type: 'Nation-State', dwell: '287 days avg' } },
      { id: 'be-202', type: 'organization', label: 'ChipFab Global', description: 'Target semiconductor manufacturer', x: 500, y: 250, pinned: true, threatLevel: 'high', metadata: { sector: 'Semiconductor', revenue: '$8.2B' } },
      { id: 'be-203', type: 'domain', label: 'jade-cloud.cn', description: 'C2 infrastructure', x: 200, y: 450, pinned: false, threatLevel: 'high', metadata: { hosting: 'Alibaba Cloud', created: '2024-06' } },
    ],
    connections: [
      { id: 'bc-201', sourceId: 'be-201', targetId: 'be-202', label: 'targeting', type: 'confirmed', strength: 92 },
      { id: 'bc-202', sourceId: 'be-201', targetId: 'be-203', label: 'operates', type: 'confirmed', strength: 94 },
    ],
    notes: [
      { id: 'cn-201', author: 'Agent PARK', content: 'JADE_DRAGON using compromised MSP credentials for initial access. Average dwell time before detection is 287 days. Recommend audit of all MSP connections across semiconductor sector.', timestamp: '2026-03-08T14:00:00Z', classification: 'TOP_SECRET' },
    ],
    evidence: [
      { id: 'ev-201', type: 'report', name: 'MSP_compromise_analysis.pdf', addedAt: '2026-03-08T16:00:00Z', addedBy: 'Agent PARK', size: '2.8 MB' },
    ],
    timeline: [
      { id: 'ce-201', timestamp: '2026-01-15T00:00:00Z', event: 'MSP compromise detected via anomalous API usage', actor: 'SOC-ALPHA', type: 'discovery' },
      { id: 'ce-202', timestamp: '2026-03-07T10:00:00Z', event: 'Case opened — Operation SILK THREAD', actor: 'Agent PARK', type: 'action' },
      { id: 'ce-203', timestamp: '2026-03-09T10:00:00Z', event: 'Insider recruitment post linked to same campaign', actor: 'Agent WILLIAMS', type: 'evidence' },
    ],
    tags: ['espionage', 'semiconductor', 'msp_compromise', 'insider_threat', 'nation_state'],
  },
];
