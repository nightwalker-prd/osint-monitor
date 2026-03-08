"use client";

import dynamic from "next/dynamic";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import DashboardGrid, { GridPanel } from "@/components/layout/DashboardGrid";
import SearchCommand from "@/components/ui/SearchCommand";
import MetricsBar from "@/components/panels/MetricsBar";
import TimelinePanel from "@/components/panels/TimelinePanel";
import EntityPanel from "@/components/panels/EntityPanel";
import IntelFeed from "@/components/panels/IntelFeed";
import GraphPanel from "@/components/panels/GraphPanel";

const MapPanel = dynamic(() => import("@/components/panels/MapPanel"), { ssr: false });

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-osint-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <DashboardGrid>
          {/* Row 1: Metrics */}
          <GridPanel colSpan={12}>
            <MetricsBar />
          </GridPanel>

          {/* Row 2: Map + Graph */}
          <GridPanel colSpan={7} rowSpan={2}>
            <MapPanel />
          </GridPanel>
          <GridPanel colSpan={5} rowSpan={2}>
            <GraphPanel />
          </GridPanel>

          {/* Row 3: Timeline */}
          <GridPanel colSpan={12}>
            <TimelinePanel />
          </GridPanel>

          {/* Row 4: Entities + Intel Feed */}
          <GridPanel colSpan={7}>
            <EntityPanel />
          </GridPanel>
          <GridPanel colSpan={5}>
            <IntelFeed />
          </GridPanel>
        </DashboardGrid>
      </div>
      <SearchCommand />
    </div>
  );
}
