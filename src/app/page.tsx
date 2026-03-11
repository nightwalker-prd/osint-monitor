'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { DragDropGrid, type PanelConfig } from '@/components/layout/DragDropGrid';
import { CrossPanelFilterProvider, GlobalFilterBar } from '@/components/contexts/CrossPanelFilterContext';
import { RealTimeSimulatorProvider, SimulatorControlBar } from '@/components/hooks/RealTimeSimulator';
import { EntityDetailDrawer } from '@/components/ui/EntityDetailDrawer';

/* ─── Panels ─── */
import { MapPanel } from '@/components/panels/MapPanel';
import { GraphPanel } from '@/components/panels/GraphPanel';
import { TimelinePanel } from '@/components/panels/TimelinePanel';
import { EntityPanel } from '@/components/panels/EntityPanel';
import { IntelFeed } from '@/components/panels/IntelFeed';
import { MetricsBar } from '@/components/panels/MetricsBar';
import { DarkWebPanel } from '@/components/panels/DarkWebPanel';
import { ThreatActorPanel } from '@/components/panels/ThreatActorPanel';
import { SentimentPanel } from '@/components/panels/SentimentPanel';
import { SIGINTPanel } from '@/components/panels/SIGINTPanel';
import { AlertsPanel } from '@/components/panels/AlertsPanel';

const panelConfigs: PanelConfig[] = [
  { id: 'map', title: 'Geo Map', component: <MapPanel />, defaultWidth: 2, defaultHeight: 2 },
  { id: 'graph', title: 'Network Graph', component: <GraphPanel />, defaultWidth: 2, defaultHeight: 2 },
  { id: 'dark-web', title: 'Dark Web', component: <DarkWebPanel />, defaultWidth: 2, defaultHeight: 2 },
  { id: 'threat-actors', title: 'Threat Actors', component: <ThreatActorPanel />, defaultWidth: 2, defaultHeight: 2 },
  { id: 'timeline', title: 'Timeline', component: <TimelinePanel />, defaultWidth: 2, defaultHeight: 1 },
  { id: 'entities', title: 'Entities', component: <EntityPanel />, defaultWidth: 1, defaultHeight: 2 },
  { id: 'intel-feed', title: 'Intel Feed', component: <IntelFeed />, defaultWidth: 1, defaultHeight: 2 },
  { id: 'sigint', title: 'SIGINT', component: <SIGINTPanel />, defaultWidth: 2, defaultHeight: 2 },
  { id: 'sentiment', title: 'Sentiment', component: <SentimentPanel />, defaultWidth: 2, defaultHeight: 2 },
  { id: 'alerts', title: 'Alerts', component: <AlertsPanel />, defaultWidth: 2, defaultHeight: 2 },
];

export default function DashboardPage() {
  const [drawerEntity, setDrawerEntity] = useState<string | null>(null);

  return (
    <CrossPanelFilterProvider>
      <RealTimeSimulatorProvider>
        <div className="flex h-screen bg-[#080d16] text-gray-100 overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <TopBar />

            {/* Metrics Bar */}
            <MetricsBar />

            {/* Global Filter Bar */}
            <GlobalFilterBar />

            {/* Drag & Drop Grid with all panels */}
            <div className="flex-1 overflow-hidden">
              <DragDropGrid panels={panelConfigs} />
            </div>

            {/* Real-time Simulator Control */}
            <SimulatorControlBar />
          </div>

          {/* Entity Detail Drawer (overlay) */}
          {drawerEntity && (
            <EntityDetailDrawer
              entityId={drawerEntity}
              onClose={() => setDrawerEntity(null)}
            />
          )}
        </div>
      </RealTimeSimulatorProvider>
    </CrossPanelFilterProvider>
  );
}
