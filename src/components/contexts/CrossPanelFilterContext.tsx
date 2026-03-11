'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface FilterState {
  selectedEntity: string | null;
  selectedThreatLevel: ('critical' | 'high' | 'medium' | 'low')[];
  dateRange: { start: string; end: string } | null;
  selectedActors: string[];
  searchQuery: string;
  activePanel: string | null;
}

interface FilterContextType {
  filters: FilterState;
  setSelectedEntity: (entity: string | null) => void;
  toggleThreatLevel: (level: 'critical' | 'high' | 'medium' | 'low') => void;
  setDateRange: (range: { start: string; end: string } | null) => void;
  toggleActor: (actorId: string) => void;
  setSearchQuery: (query: string) => void;
  setActivePanel: (panelId: string | null) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

const defaultFilters: FilterState = {
  selectedEntity: null,
  selectedThreatLevel: [],
  dateRange: null,
  selectedActors: [],
  searchQuery: '',
  activePanel: null,
};

const FilterContext = createContext<FilterContextType | null>(null);

export function CrossPanelFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setSelectedEntity = useCallback((entity: string | null) => {
    setFilters((prev) => ({ ...prev, selectedEntity: entity }));
  }, []);

  const toggleThreatLevel = useCallback((level: 'critical' | 'high' | 'medium' | 'low') => {
    setFilters((prev) => ({
      ...prev,
      selectedThreatLevel: prev.selectedThreatLevel.includes(level)
        ? prev.selectedThreatLevel.filter((l) => l !== level)
        : [...prev.selectedThreatLevel, level],
    }));
  }, []);

  const setDateRange = useCallback((range: { start: string; end: string } | null) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  }, []);

  const toggleActor = useCallback((actorId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedActors: prev.selectedActors.includes(actorId)
        ? prev.selectedActors.filter((a) => a !== actorId)
        : [...prev.selectedActors, actorId],
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setActivePanel = useCallback((panelId: string | null) => {
    setFilters((prev) => ({ ...prev, activePanel: panelId }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters =
    filters.selectedEntity !== null ||
    filters.selectedThreatLevel.length > 0 ||
    filters.dateRange !== null ||
    filters.selectedActors.length > 0 ||
    filters.searchQuery !== '';

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSelectedEntity,
        toggleThreatLevel,
        setDateRange,
        toggleActor,
        setSearchQuery,
        setActivePanel,
        clearAllFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useCrossPanelFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useCrossPanelFilter must be used within a CrossPanelFilterProvider');
  }
  return context;
}

/* ─── Global Filter Bar Component ─── */
import { X, Search, Calendar, Shield, Users } from 'lucide-react';

export function GlobalFilterBar() {
  const { filters, setSearchQuery, toggleThreatLevel, clearAllFilters, hasActiveFilters, setSelectedEntity } =
    useCrossPanelFilter();

  const threatLevels = ['critical', 'high', 'medium', 'low'] as const;
  const threatColors = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/30',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#0a0f1a]/80 border-b border-white/5 backdrop-blur-sm">
      {/* Search */}
      <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1 flex-1 max-w-xs border border-white/5 focus-within:border-cyan-500/30">
        <Search className="w-3 h-3 text-gray-500" />
        <input
          type="text"
          placeholder="Filter across all panels..."
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs text-gray-300 placeholder-gray-600 outline-none w-full"
        />
      </div>

      {/* Threat Level Toggles */}
      <div className="flex items-center gap-1">
        <Shield className="w-3 h-3 text-gray-600" />
        {threatLevels.map((level) => (
          <button
            key={level}
            onClick={() => toggleThreatLevel(level)}
            className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider border transition-all ${
              filters.selectedThreatLevel.includes(level)
                ? threatColors[level]
                : 'border-white/5 text-gray-600 hover:text-gray-400'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Active Entity */}
      {filters.selectedEntity && (
        <div className="flex items-center gap-1 bg-cyan-500/10 text-cyan-400 rounded px-2 py-0.5 border border-cyan-500/30">
          <Users className="w-3 h-3" />
          <span className="text-[10px] font-mono">{filters.selectedEntity}</span>
          <button onClick={() => setSelectedEntity(null)} className="hover:text-white">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-red-400 transition-colors"
        >
          <X className="w-3 h-3" /> Clear
        </button>
      )}
    </div>
  );
}
