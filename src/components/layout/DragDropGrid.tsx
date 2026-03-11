'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { Maximize2, Minimize2, GripVertical, Layout, Save, RotateCcw } from 'lucide-react';

export interface PanelConfig {
  id: string;
  title: string;
  component: ReactNode;
  defaultWidth: number; // 1-4 columns
  defaultHeight: number; // in grid rows
  minWidth?: number;
  minHeight?: number;
}

interface PanelState {
  id: string;
  order: number;
  width: number;
  height: number;
  visible: boolean;
  minimized: boolean;
}

interface WorkspacePreset {
  name: string;
  icon: string;
  description: string;
  layout: Partial<PanelState>[];
}

const presets: WorkspacePreset[] = [
  {
    name: 'Full Overview',
    icon: '\u25A6',
    description: 'All panels visible in balanced grid',
    layout: [],
  },
  {
    name: 'Geo Focus',
    icon: '\u25C9',
    description: 'Map + Timeline + Incidents prioritized',
    layout: [
      { id: 'map', width: 4, height: 3 },
      { id: 'timeline', width: 2, height: 2 },
      { id: 'alerts', width: 2, height: 2 },
    ],
  },
  {
    name: 'Threat Intel',
    icon: '\u26A0',
    description: 'Actors + Dark Web + Alerts focused',
    layout: [
      { id: 'threat-actors', width: 2, height: 3 },
      { id: 'dark-web', width: 2, height: 3 },
      { id: 'alerts', width: 2, height: 2 },
      { id: 'sigint', width: 2, height: 2 },
    ],
  },
  {
    name: 'Network Analysis',
    icon: '\u2B2F',
    description: 'Graph + Entities + Connections',
    layout: [
      { id: 'graph', width: 3, height: 3 },
      { id: 'entities', width: 1, height: 3 },
      { id: 'intel-feed', width: 2, height: 2 },
    ],
  },
  {
    name: 'SIGINT Center',
    icon: '\u2299',
    description: 'Signals + Sentiment + Comms',
    layout: [
      { id: 'sigint', width: 2, height: 3 },
      { id: 'sentiment', width: 2, height: 3 },
      { id: 'dark-web', width: 2, height: 2 },
      { id: 'alerts', width: 2, height: 2 },
    ],
  },
];

interface DragDropGridProps {
  panels: PanelConfig[];
}

export function DragDropGrid({ panels }: DragDropGridProps) {
  const [panelStates, setPanelStates] = useState<PanelState[]>(
    panels.map((p, i) => ({
      id: p.id,
      order: i,
      width: p.defaultWidth,
      height: p.defaultHeight,
      visible: true,
      minimized: false,
    }))
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string>('Full Overview');
  const [showPresets, setShowPresets] = useState(false);

  const toggleMinimize = useCallback((id: string) => {
    setPanelStates((prev) =>
      prev.map((p) => (p.id === id ? { ...p, minimized: !p.minimized } : p))
    );
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setPanelStates((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
    );
  }, []);

  const cycleWidth = useCallback((id: string) => {
    setPanelStates((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextWidth = p.width >= 4 ? 1 : p.width + 1;
        return { ...p, width: nextWidth };
      })
    );
  }, []);

  const applyPreset = useCallback((preset: WorkspacePreset) => {
    setActivePreset(preset.name);
    if (preset.layout.length === 0) {
      // Full overview — reset all
      setPanelStates((prev) =>
        prev.map((p, i) => {
          const panelConfig = panels.find((pc) => pc.id === p.id);
          return {
            ...p,
            width: panelConfig?.defaultWidth || 2,
            height: panelConfig?.defaultHeight || 2,
            visible: true,
            minimized: false,
            order: i,
          };
        })
      );
    } else {
      const presetIds = preset.layout.map((l) => l.id);
      setPanelStates((prev) =>
        prev.map((p) => {
          const presetConfig = preset.layout.find((l) => l.id === p.id);
          if (presetConfig) {
            return {
              ...p,
              width: presetConfig.width || p.width,
              height: presetConfig.height || p.height,
              visible: true,
              minimized: false,
            };
          }
          return { ...p, visible: false };
        })
      );
    }
  }, [panels]);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    setPanelStates((prev) => {
      const items = [...prev];
      const dragIdx = items.findIndex((p) => p.id === draggedId);
      const dropIdx = items.findIndex((p) => p.id === targetId);
      const [moved] = items.splice(dragIdx, 1);
      items.splice(dropIdx, 0, moved);
      return items.map((p, i) => ({ ...p, order: i }));
    });
    setDraggedId(null);
  };

  const visiblePanels = panelStates
    .filter((ps) => ps.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col h-full">
      {/* Workspace Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a0f1a]/60 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Layout className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Workspace:</span>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="text-xs text-cyan-400 font-mono hover:text-cyan-300 transition-colors"
          >
            {activePreset}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Panel toggles */}
          {panelStates.map((ps) => {
            const panel = panels.find((p) => p.id === ps.id);
            return (
              <button
                key={ps.id}
                onClick={() => toggleVisibility(ps.id)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider border transition-all ${
                  ps.visible
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-white/5 text-gray-600 border-white/5'
                }`}
                title={panel?.title}
              >
                {panel?.title.slice(0, 3).toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Selector Dropdown */}
      {showPresets && (
        <div className="absolute top-12 left-4 z-30 bg-[#0c1220] border border-white/10 rounded-lg shadow-xl shadow-black/50 p-2 w-64">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                applyPreset(preset);
                setShowPresets(false);
              }}
              className={`w-full text-left px-3 py-2 rounded hover:bg-white/5 transition-colors ${
                activePreset === preset.name ? 'bg-cyan-500/10' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{preset.icon}</span>
                <span className={`text-xs font-medium ${
                  activePreset === preset.name ? 'text-cyan-400' : 'text-gray-300'
                }`}>
                  {preset.name}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 ml-6">{preset.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid grid-cols-4 gap-2 auto-rows-[minmax(200px,1fr)]">
          {visiblePanels.map((ps) => {
            const panel = panels.find((p) => p.id === ps.id);
            if (!panel) return null;

            return (
              <div
                key={ps.id}
                className={`rounded-lg border bg-[#0c1220]/80 backdrop-blur-sm overflow-hidden transition-all duration-200 ${
                  draggedId === ps.id
                    ? 'border-cyan-500/50 opacity-50 scale-95'
                    : 'border-white/5 hover:border-white/10'
                } ${ps.minimized ? 'row-span-1' : ''}`}
                style={{
                  gridColumn: `span ${ps.minimized ? 1 : Math.min(ps.width, 4)}`,
                  gridRow: ps.minimized ? 'span 1' : `span ${ps.height}`,
                }}
                draggable
                onDragStart={() => handleDragStart(ps.id)}
                onDragOver={(e) => handleDragOver(e, ps.id)}
                onDrop={() => handleDrop(ps.id)}
              >
                {/* Panel Chrome */}
                <div className="flex items-center justify-between px-2 py-1 bg-white/[0.02] border-b border-white/5 cursor-move">
                  <div className="flex items-center gap-1.5">
                    <GripVertical className="w-3 h-3 text-gray-600" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {panel.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); cycleWidth(ps.id); }}
                      className="p-0.5 rounded hover:bg-white/5 text-gray-600 hover:text-gray-400 transition-colors"
                      title="Resize"
                    >
                      <Layout className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMinimize(ps.id); }}
                      className="p-0.5 rounded hover:bg-white/5 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {ps.minimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Panel Content */}
                {!ps.minimized && (
                  <div className="h-[calc(100%-28px)] overflow-hidden">
                    {panel.component}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
