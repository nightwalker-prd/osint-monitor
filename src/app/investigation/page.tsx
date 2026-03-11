'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Pin, PinOff, Plus, Trash2, Save, Download, Link2, MessageSquare,
  ChevronLeft, Search, Filter, ZoomIn, ZoomOut, Maximize2,
  FileText, Clock, Users, AlertTriangle, Eye
} from 'lucide-react';
import { investigationCases, type InvestigationCase, type BoardEntity, type BoardConnection } from '@/lib/mock-data/investigation-board';

const entityTypeColors: Record<string, { bg: string; border: string; text: string }> = {
  person: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  organization: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  ip_address: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  domain: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  malware: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  location: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  wallet: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  document: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
};

const threatColors: Record<string, string> = {
  critical: 'border-red-500',
  high: 'border-orange-500',
  medium: 'border-yellow-500',
  low: 'border-blue-500',
};

const priorityColors: Record<string, { text: string; bg: string }> = {
  critical: { text: 'text-red-400', bg: 'bg-red-500/10' },
  high: { text: 'text-orange-400', bg: 'bg-orange-500/10' },
  medium: { text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  low: { text: 'text-blue-400', bg: 'bg-blue-500/10' },
};

function CaseSelector({
  cases,
  selectedId,
  onSelect,
}: {
  cases: InvestigationCase[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-72 border-r border-white/5 bg-[#080d16] flex flex-col h-full">
      <div className="p-3 border-b border-white/5">
        <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Investigation Cases</h2>
        <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1 border border-white/5">
          <Search className="w-3 h-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search cases..."
            className="bg-transparent text-xs text-gray-300 placeholder-gray-600 outline-none w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {cases.map((c) => {
          const pColor = priorityColors[c.priority];
          return (
            <div
              key={c.id}
              className={`p-3 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/[0.02] ${
                selectedId === c.id ? 'bg-cyan-500/5 border-l-2 border-l-cyan-500' : ''
              }`}
              onClick={() => onSelect(c.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  c.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                }`} />
                <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${pColor.bg} ${pColor.text}`}>
                  {c.priority}
                </span>
                <span className="text-[9px] text-gray-500 capitalize">{c.status}</span>
              </div>
              <h3 className="text-[11px] text-gray-200 font-medium leading-tight mb-1">{c.title}</h3>
              <div className="flex items-center gap-2 text-[9px] text-gray-500">
                <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" /> {c.team.length}</span>
                <span className="flex items-center gap-0.5"><Pin className="w-2.5 h-2.5" /> {c.entities.length}</span>
                <span className="flex items-center gap-0.5"><Link2 className="w-2.5 h-2.5" /> {c.connections.length}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/5">
        <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors">
          <Plus className="w-3 h-3" /> New Case
        </button>
      </div>
    </div>
  );
}

function InvestigationBoard({ caseData }: { caseData: InvestigationCase }) {
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<'board' | 'timeline' | 'evidence' | 'notes'>('board');
  const boardRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { key: 'board', label: 'Board', icon: <Maximize2 className="w-3 h-3" /> },
    { key: 'timeline', label: 'Timeline', icon: <Clock className="w-3 h-3" /> },
    { key: 'evidence', label: 'Evidence', icon: <FileText className="w-3 h-3" /> },
    { key: 'notes', label: 'Notes', icon: <MessageSquare className="w-3 h-3" /> },
  ];

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Case Header */}
      <div className="px-4 py-3 border-b border-white/5 bg-[#0a0f1a]/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-100">{caseData.title}</h2>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
              <span>Lead: <span className="text-gray-300">{caseData.lead}</span></span>
              <span>Team: <span className="text-gray-300">{caseData.team.length} agents</span></span>
              <span>Updated: <span className="text-gray-300">{new Date(caseData.updatedAt).toLocaleString()}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 flex items-center gap-1">
              <Save className="w-3 h-3" /> Save
            </button>
            <button className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 flex items-center gap-1">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab.key
                ? 'text-cyan-400 border-cyan-400 bg-cyan-500/5'
                : 'text-gray-500 border-transparent hover:text-gray-400'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'board' && (
          <div className="relative h-full">
            {/* Zoom Controls */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
              <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))} className="p-1.5 rounded bg-[#0c1220] border border-white/10 text-gray-400 hover:text-white">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))} className="p-1.5 rounded bg-[#0c1220] border border-white/10 text-gray-400 hover:text-white">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Board Canvas */}
            <div
              ref={boardRef}
              className="h-full overflow-auto bg-[#060a12] bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[length:24px_24px]"
            >
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: '800px', minHeight: '600px', position: 'relative' }}>
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '800px', minHeight: '600px' }}>
                  {caseData.connections.map((conn) => {
                    const source = caseData.entities.find((e) => e.id === conn.sourceId);
                    const target = caseData.entities.find((e) => e.id === conn.targetId);
                    if (!source || !target) return null;
                    const lineColor = conn.type === 'confirmed' ? '#22d3ee' : conn.type === 'suspected' ? '#f59e0b' : '#6b7280';
                    return (
                      <g key={conn.id}>
                        <line
                          x1={source.x + 60}
                          y1={source.y + 30}
                          x2={target.x + 60}
                          y2={target.y + 30}
                          stroke={lineColor}
                          strokeWidth={Math.max(1, conn.strength / 40)}
                          strokeDasharray={conn.type === 'circumstantial' ? '4,4' : conn.type === 'suspected' ? '8,4' : 'none'}
                          opacity={0.6}
                        />
                        <text
                          x={(source.x + target.x) / 2 + 60}
                          y={(source.y + target.y) / 2 + 25}
                          fill="#6b7280"
                          fontSize="9"
                          textAnchor="middle"
                        >
                          {conn.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Entity Nodes */}
                {caseData.entities.map((entity) => {
                  const colors = entityTypeColors[entity.type] || entityTypeColors.person;
                  const borderColor = entity.threatLevel ? threatColors[entity.threatLevel] : 'border-white/10';
                  return (
                    <div
                      key={entity.id}
                      className={`absolute w-[120px] rounded-lg ${colors.bg} border-2 ${borderColor} p-2 cursor-move hover:shadow-lg hover:shadow-black/30 transition-shadow group`}
                      style={{ left: entity.x, top: entity.y }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[8px] uppercase font-bold tracking-wider ${colors.text}`}>
                          {entity.type.replace('_', ' ')}
                        </span>
                        {entity.pinned && <Pin className="w-2.5 h-2.5 text-cyan-400" />}
                      </div>
                      <div className="text-[10px] font-bold text-gray-200 leading-tight mb-0.5">{entity.label}</div>
                      <div className="text-[8px] text-gray-500 line-clamp-2">{entity.description}</div>
                      {entity.threatLevel && (
                        <div className={`mt-1 text-[8px] uppercase font-bold ${
                          entity.threatLevel === 'critical' ? 'text-red-400' : entity.threatLevel === 'high' ? 'text-orange-400' : 'text-yellow-400'
                        }`}>
                          {entity.threatLevel}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="p-4 overflow-y-auto h-full scrollbar-thin">
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />
              {caseData.timeline.map((event, i) => {
                const typeColors: Record<string, string> = {
                  discovery: 'bg-cyan-500',
                  action: 'bg-green-500',
                  escalation: 'bg-red-500',
                  evidence: 'bg-amber-500',
                  note: 'bg-purple-500',
                };
                return (
                  <div key={event.id} className="relative mb-4">
                    <div className={`absolute left-[-18px] w-2.5 h-2.5 rounded-full ${typeColors[event.type] || 'bg-gray-500'} border-2 border-[#080d16]`} />
                    <div className="bg-white/[0.02] rounded p-3 border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                        <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                          event.type === 'escalation' ? 'bg-red-500/10 text-red-400' :
                          event.type === 'action' ? 'bg-green-500/10 text-green-400' :
                          event.type === 'evidence' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-cyan-500/10 text-cyan-400'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300">{event.event}</p>
                      <span className="text-[9px] text-gray-500">{event.actor}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="p-4 overflow-y-auto h-full scrollbar-thin">
            <div className="space-y-2">
              {caseData.evidence.map((ev) => {
                const typeIcons: Record<string, string> = {
                  file: 'FILE', screenshot: 'IMG', log: 'LOG', pcap: 'PCAP', memory_dump: 'MEM', report: 'RPT',
                };
                return (
                  <div key={ev.id} className="flex items-center gap-3 p-3 rounded bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-mono font-bold text-gray-400">{typeIcons[ev.type] || 'FILE'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-200 font-mono">{ev.name}</div>
                      <div className="flex items-center gap-3 text-[9px] text-gray-500">
                        <span>{ev.size}</span>
                        <span>{ev.addedBy}</span>
                        <span>{new Date(ev.addedAt).toLocaleString()}</span>
                      </div>
                      {ev.hash && <div className="text-[8px] font-mono text-gray-600 mt-0.5">{ev.hash}</div>}
                    </div>
                    <button className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-cyan-400">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="p-4 overflow-y-auto h-full scrollbar-thin">
            <div className="space-y-3">
              {caseData.notes.map((note) => {
                const classColors: Record<string, string> = {
                  UNCLASSIFIED: 'text-green-400 bg-green-500/10',
                  CONFIDENTIAL: 'text-yellow-400 bg-yellow-500/10',
                  SECRET: 'text-orange-400 bg-orange-500/10',
                  TOP_SECRET: 'text-red-400 bg-red-500/10',
                };
                return (
                  <div key={note.id} className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300 font-medium">{note.author}</span>
                        <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${classColors[note.classification] || ''}`}>
                          {note.classification.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-500">{new Date(note.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{note.content}</p>
                  </div>
                );
              })}

              {/* Add Note */}
              <div className="bg-white/[0.02] rounded-lg p-3 border border-dashed border-white/10">
                <textarea
                  placeholder="Add investigation note..."
                  className="w-full bg-transparent text-xs text-gray-300 placeholder-gray-600 outline-none resize-none h-20"
                />
                <div className="flex items-center justify-between mt-2">
                  <select className="bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 px-2 py-1 outline-none">
                    <option>UNCLASSIFIED</option>
                    <option>CONFIDENTIAL</option>
                    <option>SECRET</option>
                    <option>TOP SECRET</option>
                  </select>
                  <button className="px-3 py-1 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20">
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvestigationPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(investigationCases[0].id);
  const selectedCase = investigationCases.find((c) => c.id === selectedCaseId);

  return (
    <div className="flex h-screen bg-[#080d16] text-gray-100">
      <CaseSelector
        cases={investigationCases}
        selectedId={selectedCaseId}
        onSelect={setSelectedCaseId}
      />
      {selectedCase ? (
        <InvestigationBoard caseData={selectedCase} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600">
          Select a case to begin investigation
        </div>
      )}
    </div>
  );
}
