export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  type: 'apt' | 'cybercrime' | 'hacktivist' | 'insider' | 'nation_state';
  origin: string;
  originFlag: string;
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  active: boolean;
  firstSeen: string;
  lastActivity: string;
  description: string;
  ttps: MitreTTP[];
  targets: string[];
  associatedMalware: string[];
  iocs: string[];
  activityTimeline: ActivityPoint[];
  connections: string[]; // IDs of connected actors
}

export interface MitreTTP {
  id: string;
  tactic: string;
  technique: string;
  description: string;
}

export interface ActivityPoint {
  date: string;
  intensity: number; // 0-100
  label?: string;
}

export const threatActors: ThreatActor[] = [
  {
    id: 'ta-001',
    name: 'APT-PHANTOM',
    aliases: ['GhostNet', 'ShadowPlex', 'UNC4491'],
    type: 'apt',
    origin: 'Eastern Europe',
    originFlag: 'RU',
    threatLevel: 'critical',
    active: true,
    firstSeen: '2019-06-15',
    lastActivity: '2026-03-10T18:30:00Z',
    description: 'Sophisticated APT group specializing in supply-chain attacks against defense and aerospace sectors. Known for custom implants and living-off-the-land techniques. Strong ties to state intelligence apparatus.',
    ttps: [
      { id: 'T1195.002', tactic: 'Initial Access', technique: 'Supply Chain Compromise: Software Supply Chain', description: 'Compromises build systems of trusted software vendors' },
      { id: 'T1059.001', tactic: 'Execution', technique: 'PowerShell', description: 'Uses obfuscated PowerShell for payload delivery' },
      { id: 'T1003.001', tactic: 'Credential Access', technique: 'LSASS Memory', description: 'Dumps credentials from LSASS process memory' },
      { id: 'T1048.002', tactic: 'Exfiltration', technique: 'Exfiltration Over Asymmetric Encrypted Non-C2 Protocol', description: 'Uses DNS tunneling for data exfiltration' },
      { id: 'T1027.002', tactic: 'Defense Evasion', technique: 'Software Packing', description: 'Custom packer to evade AV detection' },
    ],
    targets: ['Defense', 'Aerospace', 'Government', 'Energy'],
    associatedMalware: ['PhantomRAT', 'GhostLoader', 'ShadowDNS', 'SpectreDrop'],
    iocs: ['185.220.101[.]42', 'phantom-c2[.]xyz', 'SHA256:a1b2c3d4e5f6...', 'UA: Mozilla/5.0 PhantomKit/3.1'],
    activityTimeline: [
      { date: '2025-09', intensity: 30 },
      { date: '2025-10', intensity: 45 },
      { date: '2025-11', intensity: 62 },
      { date: '2025-12', intensity: 38 },
      { date: '2026-01', intensity: 71, label: 'SolarBreeze campaign' },
      { date: '2026-02', intensity: 85, label: 'Defense contractor breach' },
      { date: '2026-03', intensity: 92, label: 'Active operations detected' },
    ],
    connections: ['ta-003', 'ta-005'],
  },
  {
    id: 'ta-002',
    name: 'COBALT_SPIDER',
    aliases: ['FIN-WebStrike', 'GoldDigger', 'UNC3389'],
    type: 'cybercrime',
    origin: 'Southeast Asia',
    originFlag: 'VN',
    threatLevel: 'high',
    active: true,
    firstSeen: '2021-03-22',
    lastActivity: '2026-03-09T14:00:00Z',
    description: 'Financially motivated cybercrime syndicate operating phishing-as-a-service and credential harvesting infrastructure. Responsible for over $180M in estimated losses across banking and e-commerce sectors.',
    ttps: [
      { id: 'T1566.001', tactic: 'Initial Access', technique: 'Spearphishing Attachment', description: 'Sophisticated phishing campaigns with industry-specific lures' },
      { id: 'T1185', tactic: 'Collection', technique: 'Browser Session Hijacking', description: 'Real-time session hijacking for banking credentials' },
      { id: 'T1105', tactic: 'Command and Control', technique: 'Ingress Tool Transfer', description: 'Downloads additional payloads post-compromise' },
      { id: 'T1565.001', tactic: 'Impact', technique: 'Stored Data Manipulation', description: 'Modifies transaction records to cover tracks' },
    ],
    targets: ['Banking', 'E-commerce', 'Cryptocurrency', 'Payment Processors'],
    associatedMalware: ['WebInject Pro', 'CobaltStealer', 'SpiderBot'],
    iocs: ['103.45.67[.]89', 'cobalt-phish[.]com', 'SHA256:f7e8d9c0b1a2...'],
    activityTimeline: [
      { date: '2025-09', intensity: 55 },
      { date: '2025-10', intensity: 48 },
      { date: '2025-11', intensity: 72, label: 'Black Friday campaign' },
      { date: '2025-12', intensity: 80, label: 'Holiday fraud surge' },
      { date: '2026-01', intensity: 60 },
      { date: '2026-02', intensity: 45 },
      { date: '2026-03', intensity: 68 },
    ],
    connections: ['ta-004'],
  },
  {
    id: 'ta-003',
    name: 'VORTEX_BEAR',
    aliases: ['StormForge', 'APT-VX', 'TEMP.Vortex'],
    type: 'nation_state',
    origin: 'Russia',
    originFlag: 'RU',
    threatLevel: 'critical',
    active: true,
    firstSeen: '2017-11-08',
    lastActivity: '2026-03-10T22:00:00Z',
    description: 'State-sponsored cyber warfare unit with destructive capabilities. Known for NotPetya-style wiper attacks, election interference, and critical infrastructure targeting. Operates with near-unlimited resources.',
    ttps: [
      { id: 'T1190', tactic: 'Initial Access', technique: 'Exploit Public-Facing Application', description: 'Rapid weaponization of newly disclosed CVEs' },
      { id: 'T1485', tactic: 'Impact', technique: 'Data Destruction', description: 'MBR wipers and file system encryption without recovery keys' },
      { id: 'T1583.001', tactic: 'Resource Development', technique: 'Domains', description: 'Massive infrastructure of lookalike domains' },
      { id: 'T1557.001', tactic: 'Credential Access', technique: 'LLMNR/NBT-NS Poisoning', description: 'Network-level credential interception' },
      { id: 'T1498', tactic: 'Impact', technique: 'Network Denial of Service', description: 'DDoS as smokescreen for data exfiltration' },
    ],
    targets: ['Critical Infrastructure', 'Government', 'Media', 'Elections', 'Energy Grid'],
    associatedMalware: ['VortexWiper', 'BearTrap', 'StormShell', 'IceBreaker'],
    iocs: ['91.234.56[.]78', 'vortex-ops[.]ru', 'SHA256:c3d4e5f6a7b8...'],
    activityTimeline: [
      { date: '2025-09', intensity: 40 },
      { date: '2025-10', intensity: 55 },
      { date: '2025-11', intensity: 70 },
      { date: '2025-12', intensity: 88, label: 'Grid attack attempt' },
      { date: '2026-01', intensity: 65 },
      { date: '2026-02', intensity: 75, label: 'Exploit stockpile detected' },
      { date: '2026-03', intensity: 95, label: 'Active zero-day exploitation' },
    ],
    connections: ['ta-001', 'ta-006'],
  },
  {
    id: 'ta-004',
    name: 'BlackVault',
    aliases: ['DarkLocker', 'VaultCrypt'],
    type: 'cybercrime',
    origin: 'Brazil',
    originFlag: 'BR',
    threatLevel: 'high',
    active: true,
    firstSeen: '2024-08-10',
    lastActivity: '2026-03-10T21:45:00Z',
    description: 'Emerging ransomware-as-a-service operation with custom encryptor claiming full EDR evasion. Rapidly growing affiliate network with aggressive double-extortion tactics.',
    ttps: [
      { id: 'T1486', tactic: 'Impact', technique: 'Data Encrypted for Impact', description: 'Custom AES-256/RSA hybrid encryption' },
      { id: 'T1490', tactic: 'Impact', technique: 'Inhibit System Recovery', description: 'Deletes shadow copies and backup catalogs' },
      { id: 'T1021.001', tactic: 'Lateral Movement', technique: 'Remote Desktop Protocol', description: 'RDP for lateral movement with stolen creds' },
      { id: 'T1567.002', tactic: 'Exfiltration', technique: 'Exfiltration to Cloud Storage', description: 'Exfils to Mega.nz before encryption' },
    ],
    targets: ['Healthcare', 'Manufacturing', 'Legal', 'Education'],
    associatedMalware: ['VaultLocker 2.0', 'VaultStealer', 'CryptDrop'],
    iocs: ['200.15.33[.]44', 'blackvault-pay[.]onion', 'SHA256:d5e6f7a8b9c0...'],
    activityTimeline: [
      { date: '2025-09', intensity: 15 },
      { date: '2025-10', intensity: 25 },
      { date: '2025-11', intensity: 40 },
      { date: '2025-12', intensity: 55 },
      { date: '2026-01', intensity: 70, label: 'Affiliate surge' },
      { date: '2026-02', intensity: 82 },
      { date: '2026-03', intensity: 90, label: 'Hospital attack wave' },
    ],
    connections: ['ta-002'],
  },
  {
    id: 'ta-005',
    name: 'JADE_DRAGON',
    aliases: ['APT-Silk', 'PandaForge', 'TEMP.Jade'],
    type: 'nation_state',
    origin: 'China',
    originFlag: 'CN',
    threatLevel: 'critical',
    active: true,
    firstSeen: '2016-02-20',
    lastActivity: '2026-03-10T15:30:00Z',
    description: 'Long-running state-sponsored espionage group focused on intellectual property theft in semiconductor, biotech, and advanced manufacturing sectors. Known for patience and stealth — average dwell time 287 days.',
    ttps: [
      { id: 'T1199', tactic: 'Initial Access', technique: 'Trusted Relationship', description: 'Compromises MSPs to reach high-value targets' },
      { id: 'T1560.001', tactic: 'Collection', technique: 'Archive via Utility', description: 'Uses 7-Zip to stage stolen IP for exfiltration' },
      { id: 'T1071.001', tactic: 'Command and Control', technique: 'Web Protocols', description: 'C2 over HTTPS mimicking legitimate cloud APIs' },
      { id: 'T1078.002', tactic: 'Persistence', technique: 'Domain Accounts', description: 'Creates stealthy service accounts for persistence' },
    ],
    targets: ['Semiconductor', 'Biotech', 'Advanced Manufacturing', 'Research Labs'],
    associatedMalware: ['JadeRAT', 'SilkWorm', 'DragonDoor', 'PandaProxy'],
    iocs: ['42.120.88[.]55', 'jade-cloud[.]cn', 'SHA256:e7f8a9b0c1d2...'],
    activityTimeline: [
      { date: '2025-09', intensity: 50 },
      { date: '2025-10', intensity: 52 },
      { date: '2025-11', intensity: 58 },
      { date: '2025-12', intensity: 55 },
      { date: '2026-01', intensity: 60, label: 'MSP compromise wave' },
      { date: '2026-02', intensity: 68 },
      { date: '2026-03', intensity: 72, label: 'Semiconductor IP theft' },
    ],
    connections: ['ta-001'],
  },
  {
    id: 'ta-006',
    name: 'KILLNET_REMNANT',
    aliases: ['KillNet 2.0', 'CyberLegion'],
    type: 'hacktivist',
    origin: 'Russia',
    originFlag: 'RU',
    threatLevel: 'medium',
    active: true,
    firstSeen: '2023-01-05',
    lastActivity: '2026-03-10T20:00:00Z',
    description: 'Successor group to the original KillNet hacktivist collective. Focuses on DDoS attacks and website defacement with political motivation. Suspected GRU guidance.',
    ttps: [
      { id: 'T1498.001', tactic: 'Impact', technique: 'Direct Network Flood', description: 'Volumetric DDoS attacks using botnet infrastructure' },
      { id: 'T1491.002', tactic: 'Impact', technique: 'External Defacement', description: 'Website defacement with propaganda messages' },
      { id: 'T1595.002', tactic: 'Reconnaissance', technique: 'Vulnerability Scanning', description: 'Mass scanning for vulnerable web applications' },
    ],
    targets: ['Government Websites', 'Banking', 'Healthcare', 'Transportation'],
    associatedMalware: ['KillBot', 'LegionDDoS'],
    iocs: ['77.88.44[.]22', 'killnet-ops[.]ru', 'SHA256:f8a9b0c1d2e3...'],
    activityTimeline: [
      { date: '2025-09', intensity: 35 },
      { date: '2025-10', intensity: 42 },
      { date: '2025-11', intensity: 50 },
      { date: '2025-12', intensity: 60 },
      { date: '2026-01', intensity: 48 },
      { date: '2026-02', intensity: 55 },
      { date: '2026-03', intensity: 65, label: 'EU bank targeting' },
    ],
    connections: ['ta-003'],
  },
  {
    id: 'ta-007',
    name: 'LAZARUS_GROUP',
    aliases: ['Hidden Cobra', 'ZINC', 'Labyrinth Chollima'],
    type: 'nation_state',
    origin: 'North Korea',
    originFlag: 'KP',
    threatLevel: 'critical',
    active: true,
    firstSeen: '2009-07-04',
    lastActivity: '2026-03-10T18:30:00Z',
    description: 'Prolific state-sponsored group conducting both espionage and financially-motivated operations. Responsible for major cryptocurrency heists and destructive attacks against financial infrastructure.',
    ttps: [
      { id: 'T1566.002', tactic: 'Initial Access', technique: 'Spearphishing Link', description: 'Fake job offers targeting crypto developers' },
      { id: 'T1059.007', tactic: 'Execution', technique: 'JavaScript', description: 'Trojanized npm packages for supply chain attacks' },
      { id: 'T1531', tactic: 'Impact', technique: 'Account Access Removal', description: 'Wipes logs and locks out defenders during heists' },
    ],
    targets: ['Cryptocurrency', 'Financial Institutions', 'Defense', 'Media'],
    associatedMalware: ['AppleJeus', 'BLINDINGCAN', 'DTrack', 'ThreatNeedle'],
    iocs: ['175.45.176[.]99', 'lazarus-c2[.]xyz', 'SHA256:a9b0c1d2e3f4...'],
    activityTimeline: [
      { date: '2025-09', intensity: 60 },
      { date: '2025-10', intensity: 72 },
      { date: '2025-11', intensity: 58 },
      { date: '2025-12', intensity: 80, label: '$340M DeFi heist' },
      { date: '2026-01', intensity: 45 },
      { date: '2026-02', intensity: 55 },
      { date: '2026-03', intensity: 70, label: 'Exchange targeting' },
    ],
    connections: [],
  },
];
