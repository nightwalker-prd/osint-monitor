export interface NarrativeThread {
  id: string;
  topic: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  intensity: number; // 0-100
  volume: number;
  trend: 'rising' | 'falling' | 'stable' | 'spiking';
  platforms: string[];
  topKeywords: string[];
  influenceScore: number; // 0-100
  firstDetected: string;
  lastUpdated: string;
  relatedEntities: string[];
  isDisinformation: boolean;
  samplePosts: SamplePost[];
}

export interface SamplePost {
  platform: string;
  author: string;
  content: string;
  engagement: number;
  timestamp: string;
}

export interface SentimentDataPoint {
  timestamp: string;
  positive: number;
  negative: number;
  neutral: number;
  volume: number;
}

export const narrativeThreads: NarrativeThread[] = [
  {
    id: 'nt-001',
    topic: 'Critical infrastructure vulnerability — power grid SCADA systems',
    sentiment: 'negative',
    intensity: 88,
    volume: 14500,
    trend: 'spiking',
    platforms: ['Twitter/X', 'Reddit', 'Telegram', 'Mastodon'],
    topKeywords: ['SCADA', 'power grid', 'vulnerability', 'CVE-2026', 'blackout', 'ICS'],
    influenceScore: 92,
    firstDetected: '2026-03-09T08:00:00Z',
    lastUpdated: '2026-03-10T23:30:00Z',
    relatedEntities: ['VORTEX_BEAR', 'CISA'],
    isDisinformation: false,
    samplePosts: [
      { platform: 'Twitter/X', author: '@ics_security_watch', content: 'BREAKING: New CVE affecting Siemens SIMATIC controllers used in 60% of US power substations. Patch NOT available. #SCADA #ICS', engagement: 8400, timestamp: '2026-03-10T14:22:00Z' },
      { platform: 'Reddit', author: 'u/grid_defender', content: 'Can confirm. Our utility received emergency advisory from CISA overnight. All hands on deck.', engagement: 2100, timestamp: '2026-03-10T16:45:00Z' },
    ],
  },
  {
    id: 'nt-002',
    topic: 'Alleged state-sponsored disinformation campaign targeting elections',
    sentiment: 'mixed',
    intensity: 76,
    volume: 32000,
    trend: 'rising',
    platforms: ['Twitter/X', 'Facebook', 'YouTube', 'TikTok', 'Telegram'],
    topKeywords: ['election', 'bot network', 'deepfake', 'manipulation', 'foreign interference'],
    influenceScore: 85,
    firstDetected: '2026-03-05T12:00:00Z',
    lastUpdated: '2026-03-10T22:15:00Z',
    relatedEntities: ['APT-PHANTOM', 'VORTEX_BEAR'],
    isDisinformation: true,
    samplePosts: [
      { platform: 'Twitter/X', author: '@disinfowatch_eu', content: 'Our analysis identified 4,200+ coordinated inauthentic accounts pushing identical election narratives across 12 EU countries. Thread:', engagement: 15600, timestamp: '2026-03-10T10:00:00Z' },
      { platform: 'Telegram', author: 'InfoOps Monitor', content: 'New deepfake video of candidate circulating. Production quality extremely high. AI detection tools flagging at only 62% confidence.', engagement: 5400, timestamp: '2026-03-10T18:30:00Z' },
    ],
  },
  {
    id: 'nt-003',
    topic: 'Cryptocurrency exchange hack — $340M stolen',
    sentiment: 'negative',
    intensity: 95,
    volume: 89000,
    trend: 'falling',
    platforms: ['Twitter/X', 'Reddit', 'Discord', 'Telegram'],
    topKeywords: ['hack', 'exchange', 'stolen', 'Lazarus', 'DeFi', 'bridge exploit'],
    influenceScore: 98,
    firstDetected: '2026-03-08T03:00:00Z',
    lastUpdated: '2026-03-10T20:00:00Z',
    relatedEntities: ['LAZARUS_GROUP'],
    isDisinformation: false,
    samplePosts: [
      { platform: 'Twitter/X', author: '@zachxbt', content: 'Funds are now moving through Tornado Cash forks. At least $120M already laundered through 47 intermediate wallets. On-chain analysis thread:', engagement: 42000, timestamp: '2026-03-09T08:15:00Z' },
      { platform: 'Reddit', author: 'u/defi_detective', content: 'Bridge exploit used same signature as previous Lazarus attacks. Smart contract audit missed the reentrancy vector in the cross-chain callback.', engagement: 8900, timestamp: '2026-03-09T12:30:00Z' },
    ],
  },
  {
    id: 'nt-004',
    topic: 'New ransomware gang targeting hospitals during surge',
    sentiment: 'negative',
    intensity: 82,
    volume: 6700,
    trend: 'rising',
    platforms: ['Twitter/X', 'Reddit', 'Mastodon', 'LinkedIn'],
    topKeywords: ['ransomware', 'hospital', 'BlackVault', 'healthcare', 'patient safety', 'FBI'],
    influenceScore: 78,
    firstDetected: '2026-03-10T06:00:00Z',
    lastUpdated: '2026-03-10T23:00:00Z',
    relatedEntities: ['BlackVault'],
    isDisinformation: false,
    samplePosts: [
      { platform: 'Twitter/X', author: '@haborResearch', content: 'BlackVault has hit 3 hospitals in 48 hours. They are specifically targeting during high patient volume periods. This is a life-safety issue now.', engagement: 6200, timestamp: '2026-03-10T14:00:00Z' },
    ],
  },
  {
    id: 'nt-005',
    topic: 'Semiconductor IP theft campaign — industry alert',
    sentiment: 'negative',
    intensity: 65,
    volume: 3200,
    trend: 'stable',
    platforms: ['LinkedIn', 'Twitter/X', 'Industry Forums'],
    topKeywords: ['semiconductor', 'IP theft', 'JADE_DRAGON', 'trade secret', 'MSP compromise'],
    influenceScore: 60,
    firstDetected: '2026-03-07T09:00:00Z',
    lastUpdated: '2026-03-10T16:00:00Z',
    relatedEntities: ['JADE_DRAGON'],
    isDisinformation: false,
    samplePosts: [
      { platform: 'LinkedIn', author: 'CISO at ChipFab Global', content: 'Industry advisory: we are seeing coordinated attempts to recruit insiders at major fabs. If approached via unusual channels, report immediately to your security team.', engagement: 1800, timestamp: '2026-03-09T10:00:00Z' },
    ],
  },
  {
    id: 'nt-006',
    topic: 'Pro-hacktivist narrative — "corporate data should be free"',
    sentiment: 'positive',
    intensity: 45,
    volume: 18000,
    trend: 'stable',
    platforms: ['Twitter/X', 'Reddit', 'Mastodon', '4chan'],
    topKeywords: ['data freedom', 'transparency', 'leak', 'whistleblower', 'corporate greed'],
    influenceScore: 52,
    firstDetected: '2026-02-20T00:00:00Z',
    lastUpdated: '2026-03-10T19:00:00Z',
    relatedEntities: ['KILLNET_REMNANT'],
    isDisinformation: false,
    samplePosts: [
      { platform: 'Mastodon', author: '@freethebytes', content: 'Another day, another corporation hiding security breaches. If they wont tell the public, someone else will. #DataFreedom', engagement: 3400, timestamp: '2026-03-10T12:00:00Z' },
    ],
  },
];

export const sentimentTimeline: SentimentDataPoint[] = [
  { timestamp: '2026-03-04', positive: 320, negative: 180, neutral: 500, volume: 1000 },
  { timestamp: '2026-03-05', positive: 280, negative: 420, neutral: 450, volume: 1150 },
  { timestamp: '2026-03-06', positive: 310, negative: 380, neutral: 480, volume: 1170 },
  { timestamp: '2026-03-07', positive: 250, negative: 520, neutral: 430, volume: 1200 },
  { timestamp: '2026-03-08', positive: 180, negative: 890, neutral: 380, volume: 1450 },
  { timestamp: '2026-03-09', positive: 200, negative: 780, neutral: 420, volume: 1400 },
  { timestamp: '2026-03-10', positive: 220, negative: 650, neutral: 460, volume: 1330 },
];

export const topicClusters = [
  { name: 'Cyber Attacks', count: 342, sentiment: -0.72, color: '#ef4444' },
  { name: 'Data Breaches', count: 218, sentiment: -0.85, color: '#f97316' },
  { name: 'Nation-State Ops', count: 156, sentiment: -0.68, color: '#eab308' },
  { name: 'Policy & Regulation', count: 134, sentiment: 0.15, color: '#22c55e' },
  { name: 'Industry Response', count: 98, sentiment: 0.42, color: '#3b82f6' },
  { name: 'Hacktivist Movement', count: 87, sentiment: 0.05, color: '#8b5cf6' },
];
