'use client';

import { useEffect, useRef, useState, useCallback, createContext, useContext, type ReactNode } from 'react';

/* ─── Types ─── */
export interface SimEvent {
  id: string;
  type: 'incident' | 'alert' | 'intel' | 'intercept' | 'entity_update' | 'metric_tick';
  timestamp: Date;
  data: Record<string, any>;
}

interface SimulatorState {
  isRunning: boolean;
  speed: number; // 1x, 2x, 5x, 10x
  eventCount: number;
  lastEvent: SimEvent | null;
  events: SimEvent[];
}

interface SimulatorContextType {
  state: SimulatorState;
  start: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  subscribe: (handler: (event: SimEvent) => void) => () => void;
}

/* ─── Event Generators ─── */
const incidentLocations = [
  { lat: 51.5074, lng: -0.1278, city: 'London' },
  { lat: 48.8566, lng: 2.3522, city: 'Paris' },
  { lat: 40.7128, lng: -74.006, city: 'New York' },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo' },
  { lat: 55.7558, lng: 37.6173, city: 'Moscow' },
  { lat: 39.9042, lng: 116.4074, city: 'Beijing' },
  { lat: 1.3521, lng: 103.8198, city: 'Singapore' },
  { lat: -23.5505, lng: -46.6333, city: 'Sao Paulo' },
  { lat: 25.2048, lng: 55.2708, city: 'Dubai' },
  { lat: 52.52, lng: 13.405, city: 'Berlin' },
];

const alertTemplates = [
  { title: 'Anomalous outbound traffic detected', severity: 'high', type: 'intrusion' },
  { title: 'New credential dump posted', severity: 'critical', type: 'data_leak' },
  { title: 'Phishing campaign targeting finance', severity: 'medium', type: 'phishing' },
  { title: 'Brute force attempt on VPN gateway', severity: 'high', type: 'intrusion' },
  { title: 'Suspicious DNS query pattern', severity: 'medium', type: 'recon' },
  { title: 'Ransomware signature detected', severity: 'critical', type: 'malware' },
  { title: 'Port scanning from Tor exit node', severity: 'low', type: 'recon' },
  { title: 'Unauthorized API key usage', severity: 'high', type: 'policy' },
];

const intelSources = ['HUMINT', 'SIGINT', 'OSINT', 'CYBER', 'FININT', 'GEOINT'];
const actors = ['APT-PHANTOM', 'VORTEX_BEAR', 'COBALT_SPIDER', 'BlackVault', 'JADE_DRAGON', 'KILLNET_REMNANT', 'LAZARUS_GROUP'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
  return `sim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateEvent(): SimEvent {
  const types: SimEvent['type'][] = ['incident', 'alert', 'intel', 'intercept', 'entity_update', 'metric_tick'];
  const weights = [0.15, 0.25, 0.2, 0.1, 0.1, 0.2];

  // Weighted random selection
  let rand = Math.random();
  let type = types[0];
  for (let i = 0; i < weights.length; i++) {
    rand -= weights[i];
    if (rand <= 0) {
      type = types[i];
      break;
    }
  }

  const now = new Date();

  switch (type) {
    case 'incident': {
      const loc = randomItem(incidentLocations);
      return {
        id: generateId(),
        type: 'incident',
        timestamp: now,
        data: {
          lat: loc.lat + (Math.random() - 0.5) * 2,
          lng: loc.lng + (Math.random() - 0.5) * 2,
          city: loc.city,
          severity: randomItem(['critical', 'high', 'medium', 'low']),
          description: `New threat activity detected near ${loc.city}`,
        },
      };
    }
    case 'alert': {
      const template = randomItem(alertTemplates);
      return {
        id: generateId(),
        type: 'alert',
        timestamp: now,
        data: {
          ...template,
          source: randomItem(['EDR', 'IDS', 'SIEM', 'WAF', 'Dark Web Monitor']),
          actor: Math.random() > 0.5 ? randomItem(actors) : null,
        },
      };
    }
    case 'intel': {
      return {
        id: generateId(),
        type: 'intel',
        timestamp: now,
        data: {
          source: randomItem(intelSources),
          classification: randomItem(['UNCLASSIFIED', 'CONFIDENTIAL', 'SECRET']),
          title: `Intel update — ${randomItem(actors)} activity`,
          priority: randomItem(['routine', 'priority', 'immediate']),
        },
      };
    }
    case 'intercept': {
      return {
        id: generateId(),
        type: 'intercept',
        timestamp: now,
        data: {
          type: randomItem(['comms', 'cyber', 'electronic']),
          actor: randomItem(actors),
          confidence: Math.floor(Math.random() * 40) + 60,
          protocol: randomItem(['HTTPS', 'DNS-Tunnel', 'VSAT', 'IRC', 'Signal']),
        },
      };
    }
    case 'entity_update': {
      return {
        id: generateId(),
        type: 'entity_update',
        timestamp: now,
        data: {
          entity: randomItem(actors),
          field: randomItem(['threat_level', 'last_seen', 'ioc_count', 'activity_score']),
          oldValue: Math.floor(Math.random() * 50) + 30,
          newValue: Math.floor(Math.random() * 50) + 50,
        },
      };
    }
    case 'metric_tick': {
      return {
        id: generateId(),
        type: 'metric_tick',
        timestamp: now,
        data: {
          metric: randomItem(['active_threats', 'monitored_entities', 'alerts_pending', 'intel_sources']),
          delta: Math.floor(Math.random() * 5) - 1,
        },
      };
    }
    default:
      return { id: generateId(), type: 'metric_tick', timestamp: now, data: {} };
  }
}

/* ─── Context ─── */
const SimulatorContext = createContext<SimulatorContextType | null>(null);

export function RealTimeSimulatorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulatorState>({
    isRunning: false,
    speed: 1,
    eventCount: 0,
    lastEvent: null,
    events: [],
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const subscribersRef = useRef<Set<(event: SimEvent) => void>>(new Set());

  const emitEvent = useCallback(() => {
    const event = generateEvent();
    setState((prev) => ({
      ...prev,
      eventCount: prev.eventCount + 1,
      lastEvent: event,
      events: [event, ...prev.events].slice(0, 100), // Keep last 100
    }));
    subscribersRef.current.forEach((handler) => handler(event));
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setState((prev) => ({ ...prev, isRunning: true }));
    const baseInterval = 3000; // 3 seconds at 1x
    intervalRef.current = setInterval(emitEvent, baseInterval / state.speed);
  }, [emitEvent, state.speed]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      const baseInterval = 3000;
      intervalRef.current = setInterval(emitEvent, baseInterval / speed);
    }
  }, [emitEvent]);

  const subscribe = useCallback((handler: (event: SimEvent) => void) => {
    subscribersRef.current.add(handler);
    return () => {
      subscribersRef.current.delete(handler);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <SimulatorContext.Provider value={{ state, start, stop, setSpeed, subscribe }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useRealTimeSimulator() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useRealTimeSimulator must be used within a RealTimeSimulatorProvider');
  }
  return context;
}

/* ─── Simulator Control Bar Component ─── */
import { Play, Pause, FastForward, Zap, Activity } from 'lucide-react';

export function SimulatorControlBar() {
  const { state, start, stop, setSpeed } = useRealTimeSimulator();
  const speeds = [1, 2, 5, 10];

  return (
    <div className="flex items-center gap-3 px-4 py-1.5 bg-[#0a0f1a]/60 border-t border-white/5">
      {/* Play/Pause */}
      <button
        onClick={state.isRunning ? stop : start}
        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
          state.isRunning
            ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
        }`}
      >
        {state.isRunning ? (
          <><Pause className="w-3 h-3" /> Live</>
        ) : (
          <><Play className="w-3 h-3" /> Start Sim</>
        )}
      </button>

      {/* Speed Control */}
      <div className="flex items-center gap-1">
        <FastForward className="w-3 h-3 text-gray-600" />
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border transition-all ${
              state.speed === s
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'border-white/5 text-gray-600 hover:text-gray-400'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Event Counter */}
      <div className="flex items-center gap-1.5 ml-auto">
        <Activity className={`w-3 h-3 ${state.isRunning ? 'text-green-400 animate-pulse' : 'text-gray-600'}`} />
        <span className="text-[10px] text-gray-500">Events:</span>
        <span className="text-[10px] font-mono text-cyan-400">{state.eventCount}</span>
      </div>

      {/* Last Event */}
      {state.lastEvent && (
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-[9px] text-gray-500">
            {state.lastEvent.type}: {JSON.stringify(state.lastEvent.data).slice(0, 60)}...
          </span>
        </div>
      )}
    </div>
  );
}
