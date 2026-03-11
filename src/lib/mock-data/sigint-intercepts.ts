export interface SIGINTIntercept {
  id: string;
  type: 'comms' | 'electronic' | 'cyber' | 'telemetry';
  classification: 'TOP_SECRET' | 'SECRET' | 'CONFIDENTIAL' | 'UNCLASSIFIED';
  priority: 'flash' | 'immediate' | 'priority' | 'routine';
  source: string;
  targetFrequency?: string;
  protocol?: string;
  originCoords: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  timestamp: string;
  duration?: number; // seconds
  summary: string;
  rawSignature: string;
  associatedActor?: string;
  status: 'intercepted' | 'decrypted' | 'analyzed' | 'disseminated';
  confidence: number; // 0-100
}

export interface FrequencyBand {
  label: string;
  rangeStart: number; // MHz
  rangeEnd: number;
  activity: number; // 0-100
  interceptCount: number;
}

export interface CommPattern {
  hour: number;
  volume: number;
  encrypted: number;
  cleartext: number;
}

export const sigintIntercepts: SIGINTIntercept[] = [
  {
    id: 'sig-001',
    type: 'comms',
    classification: 'TOP_SECRET',
    priority: 'flash',
    source: 'ECHELON-7 / Satellite Intercept',
    targetFrequency: '14.245 GHz (Ku-band)',
    protocol: 'Encrypted VSAT',
    originCoords: { lat: 55.7558, lng: 37.6173 },
    destinationCoords: { lat: 34.0522, lng: -118.2437 },
    timestamp: '2026-03-10T22:14:00Z',
    duration: 342,
    summary: 'Intercepted encrypted satellite communication between known VORTEX_BEAR C2 node and suspected sleeper infrastructure in Los Angeles. Burst transmission pattern consistent with tasking orders.',
    rawSignature: 'VSAT-ENC::KU14.245::BURST[342s]::PKT_CNT:847::ENTROPY:0.997',
    associatedActor: 'VORTEX_BEAR',
    status: 'decrypted',
    confidence: 87,
  },
  {
    id: 'sig-002',
    type: 'cyber',
    classification: 'SECRET',
    priority: 'immediate',
    source: 'TURBINE / Network Tap',
    protocol: 'DNS-over-HTTPS (anomalous)',
    originCoords: { lat: 39.9042, lng: 116.4074 },
    destinationCoords: { lat: 37.5665, lng: 126.9780 },
    timestamp: '2026-03-10T21:38:00Z',
    duration: 7200,
    summary: 'Persistent DNS tunneling channel detected between Beijing node and Seoul-based semiconductor company. Data exfiltration rate ~2.4 MB/hr. Pattern matches JADE_DRAGON toolkit signatures.',
    rawSignature: 'DoH::TUNNEL::EXFIL[2.4MB/h]::QTYPE:TXT::ENTROPY:0.992::BEACON:30s',
    associatedActor: 'JADE_DRAGON',
    status: 'analyzed',
    confidence: 94,
  },
  {
    id: 'sig-003',
    type: 'electronic',
    classification: 'TOP_SECRET',
    priority: 'immediate',
    source: 'SIGAD USN-784 / Ground Station',
    targetFrequency: '2.4 GHz / 5.8 GHz (WiFi)',
    originCoords: { lat: 48.8566, lng: 2.3522 },
    timestamp: '2026-03-10T19:55:00Z',
    duration: 1800,
    summary: 'Electronic emanations captured from diplomatic facility in Paris. Detected unauthorized WiFi access point broadcasting on non-standard channel. TEMPEST analysis suggests data bridge to external receiver.',
    rawSignature: 'ELINT::WIFI::CH149[5745MHz]::PWR:23dBm::SSID_HIDDEN::TEMPEST_BRIDGE',
    status: 'intercepted',
    confidence: 72,
  },
  {
    id: 'sig-004',
    type: 'comms',
    classification: 'SECRET',
    priority: 'priority',
    source: 'PRISM / Fiber Tap',
    protocol: 'Signal Protocol (modified)',
    originCoords: { lat: 25.2048, lng: 55.2708 },
    destinationCoords: { lat: -23.5505, lng: -46.6333 },
    timestamp: '2026-03-10T18:20:00Z',
    duration: 180,
    summary: 'Encrypted messaging session between Dubai-based financial intermediary and Sao Paulo ransomware operator. Modified Signal Protocol with custom key exchange. Likely ransom negotiation for BlackVault operation.',
    rawSignature: 'MSG::SIG_MOD::X3DH_CUSTOM::MSG_CNT:47::MEDIA:0::DURATION:180s',
    associatedActor: 'BlackVault',
    status: 'intercepted',
    confidence: 68,
  },
  {
    id: 'sig-005',
    type: 'telemetry',
    classification: 'TOP_SECRET',
    priority: 'flash',
    source: 'FORNSAT / Geosynchronous',
    targetFrequency: '11.7 GHz (C-band uplink)',
    originCoords: { lat: 39.0392, lng: 125.7625 },
    timestamp: '2026-03-10T16:42:00Z',
    duration: 28,
    summary: 'Short-burst telemetry transmission from Pyongyang military compound. Signature consistent with ballistic missile test preparation telemetry. Cross-referenced with MASINT thermal imagery showing fuel loading.',
    rawSignature: 'TELEM::BURST[28s]::C-BAND::ENCODING:CUSTOM::CHECKSUM:VALID::MILITARY',
    associatedActor: 'LAZARUS_GROUP',
    status: 'disseminated',
    confidence: 96,
  },
  {
    id: 'sig-006',
    type: 'cyber',
    classification: 'CONFIDENTIAL',
    priority: 'routine',
    source: 'XKEYSCORE / Passive Collection',
    protocol: 'IRC (TLS-wrapped)',
    originCoords: { lat: 52.5200, lng: 13.4050 },
    destinationCoords: { lat: 59.9343, lng: 30.3351 },
    timestamp: '2026-03-10T14:10:00Z',
    duration: 3600,
    summary: 'Ongoing IRC session between Berlin-based hacktivist coordinator and St. Petersburg bot herder. Discussion of upcoming DDoS campaign timing against EU financial infrastructure.',
    rawSignature: 'IRC::TLS1.3::SERVER:undernet::CHAN:#ops-planning::NICK_CNT:12',
    associatedActor: 'KILLNET_REMNANT',
    status: 'analyzed',
    confidence: 81,
  },
  {
    id: 'sig-007',
    type: 'electronic',
    classification: 'SECRET',
    priority: 'priority',
    source: 'STATEROOM / Embassy Collection',
    targetFrequency: '900 MHz (GSM)',
    originCoords: { lat: 41.0082, lng: 28.9784 },
    timestamp: '2026-03-10T11:30:00Z',
    duration: 540,
    summary: 'GSM intercept of unencrypted mobile communication near Istanbul financial district. Subject discussing cryptocurrency transfers matching BlackVault ransom payment patterns.',
    rawSignature: 'GSM::A5/1::IMSI:28601XXXXXXXXX::CELL:4721::LAC:1003',
    associatedActor: 'BlackVault',
    status: 'decrypted',
    confidence: 75,
  },
  {
    id: 'sig-008',
    type: 'comms',
    classification: 'CONFIDENTIAL',
    priority: 'routine',
    source: 'FAIRVIEW / Partner Intercept',
    protocol: 'HTTPS (certificate anomaly)',
    originCoords: { lat: 10.8231, lng: 106.6297 },
    destinationCoords: { lat: 1.3521, lng: 103.8198 },
    timestamp: '2026-03-10T08:45:00Z',
    summary: 'TLS traffic with mismatched certificate chain between Ho Chi Minh City phishing infrastructure and Singapore financial target. Cert issued by compromised intermediate CA matching COBALT_SPIDER tooling.',
    rawSignature: 'HTTPS::TLS1.3::CERT_MISMATCH::CA:COMPROMISED_INT::SNI:secure-banking[.]sg',
    associatedActor: 'COBALT_SPIDER',
    status: 'analyzed',
    confidence: 89,
  },
];

export const frequencyBands: FrequencyBand[] = [
  { label: 'HF (3-30 MHz)', rangeStart: 3, rangeEnd: 30, activity: 35, interceptCount: 127 },
  { label: 'VHF (30-300 MHz)', rangeStart: 30, rangeEnd: 300, activity: 52, interceptCount: 243 },
  { label: 'UHF (300-3000 MHz)', rangeStart: 300, rangeEnd: 3000, activity: 78, interceptCount: 589 },
  { label: 'SHF (3-30 GHz)', rangeStart: 3000, rangeEnd: 30000, activity: 65, interceptCount: 334 },
  { label: 'EHF (30-300 GHz)', rangeStart: 30000, rangeEnd: 300000, activity: 22, interceptCount: 48 },
];

export const commPatterns: CommPattern[] = [
  { hour: 0, volume: 45, encrypted: 38, cleartext: 7 },
  { hour: 1, volume: 32, encrypted: 28, cleartext: 4 },
  { hour: 2, volume: 28, encrypted: 25, cleartext: 3 },
  { hour: 3, volume: 22, encrypted: 20, cleartext: 2 },
  { hour: 4, volume: 18, encrypted: 16, cleartext: 2 },
  { hour: 5, volume: 25, encrypted: 20, cleartext: 5 },
  { hour: 6, volume: 38, encrypted: 30, cleartext: 8 },
  { hour: 7, volume: 55, encrypted: 42, cleartext: 13 },
  { hour: 8, volume: 72, encrypted: 58, cleartext: 14 },
  { hour: 9, volume: 85, encrypted: 70, cleartext: 15 },
  { hour: 10, volume: 92, encrypted: 78, cleartext: 14 },
  { hour: 11, volume: 88, encrypted: 74, cleartext: 14 },
  { hour: 12, volume: 78, encrypted: 64, cleartext: 14 },
  { hour: 13, volume: 82, encrypted: 68, cleartext: 14 },
  { hour: 14, volume: 95, encrypted: 82, cleartext: 13 },
  { hour: 15, volume: 90, encrypted: 76, cleartext: 14 },
  { hour: 16, volume: 85, encrypted: 72, cleartext: 13 },
  { hour: 17, volume: 78, encrypted: 65, cleartext: 13 },
  { hour: 18, volume: 68, encrypted: 58, cleartext: 10 },
  { hour: 19, volume: 72, encrypted: 62, cleartext: 10 },
  { hour: 20, volume: 80, encrypted: 70, cleartext: 10 },
  { hour: 21, volume: 75, encrypted: 66, cleartext: 9 },
  { hour: 22, volume: 62, encrypted: 55, cleartext: 7 },
  { hour: 23, volume: 52, encrypted: 46, cleartext: 6 },
];

export const sigintStats = {
  totalIntercepts: 1341,
  activeCollectors: 47,
  decryptionRate: 34.2,
  averageLatency: '2.8s',
  topProtocols: [
    { name: 'HTTPS/TLS', count: 542 },
    { name: 'DNS Tunnel', count: 187 },
    { name: 'VSAT/Satellite', count: 134 },
    { name: 'GSM/LTE', count: 98 },
    { name: 'IRC/Chat', count: 76 },
    { name: 'Custom C2', count: 304 },
  ],
};
