export interface CryptoWallet {
  id: string;
  address: string;
  chain: 'bitcoin' | 'ethereum' | 'monero' | 'tron';
  label: string;
  balance: string;
  totalReceived: string;
  totalSent: string;
  transactionCount: number;
  riskScore: number; // 0-100
  tags: string[];
  associatedActor?: string;
  firstSeen: string;
  lastActivity: string;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  chain: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'flagged';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  label?: string;
}

export interface SanctionsHit {
  id: string;
  entity: string;
  matchType: 'exact' | 'fuzzy' | 'alias';
  list: string;
  confidence: number;
  details: string;
}

export const trackedWallets: CryptoWallet[] = [
  {
    id: 'w-001',
    address: 'bc1q...v8m4k',
    chain: 'bitcoin',
    label: 'BlackVault Primary',
    balance: '1,240 BTC',
    totalReceived: '4,820 BTC',
    totalSent: '3,580 BTC',
    transactionCount: 347,
    riskScore: 98,
    tags: ['ransomware', 'mixer_output', 'high_volume'],
    associatedActor: 'BlackVault',
    firstSeen: '2024-09-15',
    lastActivity: '2026-03-10T21:30:00Z',
  },
  {
    id: 'w-002',
    address: '0x742d...8f3a',
    chain: 'ethereum',
    label: 'Lazarus DeFi Bridge',
    balance: '12,450 ETH',
    totalReceived: '89,200 ETH',
    totalSent: '76,750 ETH',
    transactionCount: 1247,
    riskScore: 99,
    tags: ['nation_state', 'defi_exploit', 'bridge_attack', 'tornado_cash'],
    associatedActor: 'LAZARUS_GROUP',
    firstSeen: '2025-11-20',
    lastActivity: '2026-03-10T19:00:00Z',
  },
  {
    id: 'w-003',
    address: 'TRX...7n2p',
    chain: 'tron',
    label: 'COBALT_SPIDER Cashout',
    balance: '2.4M USDT',
    totalReceived: '18.7M USDT',
    totalSent: '16.3M USDT',
    transactionCount: 892,
    riskScore: 87,
    tags: ['phishing_proceeds', 'stablecoin', 'high_frequency'],
    associatedActor: 'COBALT_SPIDER',
    firstSeen: '2025-03-10',
    lastActivity: '2026-03-10T16:45:00Z',
  },
  {
    id: 'w-004',
    address: '44AFF...qR8x',
    chain: 'monero',
    label: 'APT-PHANTOM Ops Fund',
    balance: 'Unknown (Monero)',
    totalReceived: 'Unknown',
    totalSent: 'Unknown',
    transactionCount: 0,
    riskScore: 92,
    tags: ['privacy_coin', 'apt_linked', 'untrackable'],
    associatedActor: 'APT-PHANTOM',
    firstSeen: '2023-06-01',
    lastActivity: '2026-03-10T14:00:00Z',
  },
];

export const recentTransactions: Transaction[] = [
  { id: 'tx-001', from: 'bc1q...v8m4k', to: 'bc1q...mixer1', amount: '45 BTC', chain: 'bitcoin', timestamp: '2026-03-10T21:30:00Z', status: 'confirmed', riskLevel: 'critical', label: 'Mixer deposit' },
  { id: 'tx-002', from: '0x742d...8f3a', to: '0xDEAD...tornado', amount: '1,200 ETH', chain: 'ethereum', timestamp: '2026-03-10T19:00:00Z', status: 'confirmed', riskLevel: 'critical', label: 'Tornado fork' },
  { id: 'tx-003', from: '0x742d...8f3a', to: '0xABCD...bridge2', amount: '3,400 ETH', chain: 'ethereum', timestamp: '2026-03-10T17:15:00Z', status: 'flagged', riskLevel: 'critical', label: 'Cross-chain bridge' },
  { id: 'tx-004', from: 'TRX...7n2p', to: 'TRX...exch1', amount: '450K USDT', chain: 'tron', timestamp: '2026-03-10T16:45:00Z', status: 'confirmed', riskLevel: 'high', label: 'Exchange deposit' },
  { id: 'tx-005', from: 'bc1q...ransom3', to: 'bc1q...v8m4k', amount: '450 BTC', chain: 'bitcoin', timestamp: '2026-03-10T15:00:00Z', status: 'confirmed', riskLevel: 'critical', label: 'Ransom payment — Hospital' },
  { id: 'tx-006', from: 'TRX...7n2p', to: 'TRX...otc_desk', amount: '280K USDT', chain: 'tron', timestamp: '2026-03-10T13:30:00Z', status: 'confirmed', riskLevel: 'high', label: 'OTC desk cashout' },
  { id: 'tx-007', from: '0x742d...8f3a', to: '0x1234...layering', amount: '800 ETH', chain: 'ethereum', timestamp: '2026-03-10T11:00:00Z', status: 'confirmed', riskLevel: 'high', label: 'Layering hop 3/7' },
  { id: 'tx-008', from: 'bc1q...v8m4k', to: 'bc1q...cold1', amount: '200 BTC', chain: 'bitcoin', timestamp: '2026-03-10T08:00:00Z', status: 'confirmed', riskLevel: 'medium', label: 'Cold storage' },
];

export const sanctionsHits: SanctionsHit[] = [
  { id: 'sh-001', entity: 'Lazarus Group (Hidden Cobra)', matchType: 'exact', list: 'OFAC SDN', confidence: 99, details: 'Directly sanctioned entity — all associated wallets subject to asset freeze' },
  { id: 'sh-002', entity: 'Tornado Cash', matchType: 'exact', list: 'OFAC SDN', confidence: 99, details: 'Sanctioned mixing service — transactions through Tornado forks also flagged' },
  { id: 'sh-003', entity: 'bc1q...v8m4k (BlackVault)', matchType: 'alias', list: 'FBI Cyber Most Wanted', confidence: 85, details: 'Wallet associated with active FBI investigation into BlackVault ransomware operations' },
  { id: 'sh-004', entity: 'JADE_DRAGON shell company', matchType: 'fuzzy', list: 'EU Sanctions List', confidence: 72, details: 'Possible front company for sanctioned entity — additional verification required' },
];

export const flowData = {
  nodes: [
    { id: 'fn-001', label: 'Victim Orgs', type: 'source', value: 4820 },
    { id: 'fn-002', label: 'BlackVault Primary', type: 'wallet', value: 1240 },
    { id: 'fn-003', label: 'Mixer Services', type: 'mixer', value: 2100 },
    { id: 'fn-004', label: 'Cold Storage', type: 'storage', value: 800 },
    { id: 'fn-005', label: 'OTC Desks', type: 'cashout', value: 1200 },
    { id: 'fn-006', label: 'Exchanges', type: 'cashout', value: 680 },
    { id: 'fn-007', label: 'Unknown', type: 'unknown', value: 40 },
  ],
  links: [
    { source: 'fn-001', target: 'fn-002', value: 4820, label: 'Ransom payments' },
    { source: 'fn-002', target: 'fn-003', value: 2100, label: 'Laundering' },
    { source: 'fn-002', target: 'fn-004', value: 800, label: 'Storage' },
    { source: 'fn-003', target: 'fn-005', value: 1200, label: 'OTC cashout' },
    { source: 'fn-003', target: 'fn-006', value: 680, label: 'Exchange deposit' },
    { source: 'fn-002', target: 'fn-007', value: 40, label: 'Untraced' },
  ],
};

export const finintStats = {
  walletsTracked: 1847,
  totalValueMonitored: '$2.1B',
  flaggedTransactions: 342,
  sanctionsHits: 47,
  activeChainalysis: 12,
  launderingDetected: '$89M',
};
