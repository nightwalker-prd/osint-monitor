"use client";

import { ReactNode } from "react";

interface DashboardGridProps {
  children: ReactNode;
}

export default function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <div className="flex-1 overflow-auto p-3 grid-scanline">
      <div className="grid grid-cols-12 gap-3 h-full auto-rows-min" style={{ minHeight: "calc(100vh - 3rem)" }}>
        {children}
      </div>
    </div>
  );
}

interface GridPanelProps {
  children: ReactNode;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
}

export function GridPanel({ children, colSpan = 6, rowSpan = 1, className = "" }: GridPanelProps) {
  return (
    <div
      className={`panel col-span-${colSpan} ${rowSpan > 1 ? `row-span-${rowSpan}` : ""} ${className}`}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: rowSpan > 1 ? `span ${rowSpan} / span ${rowSpan}` : undefined,
      }}
    >
      {children}
    </div>
  );
}
