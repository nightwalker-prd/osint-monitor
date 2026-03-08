"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { GitBranch, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import PanelHeader from "@/components/ui/PanelHeader";
import { networkData, nodeTypeColors, NetworkNode } from "@/lib/mock-data/network-entities";

interface CanvasNode extends NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function GraphPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const nodesRef = useRef<CanvasNode[]>([]);
  const animFrameRef = useRef<number>(0);

  const initNodes = useCallback(() => {
    nodesRef.current = networkData.nodes.map((node, i) => ({
      ...node,
      x: 300 + Math.cos((i / networkData.nodes.length) * Math.PI * 2) * 150 + (Math.random() - 0.5) * 80,
      y: 200 + Math.sin((i / networkData.nodes.length) * Math.PI * 2) * 120 + (Math.random() - 0.5) * 80,
      vx: 0,
      vy: 0,
    }));
  }, []);

  useEffect(() => {
    initNodes();
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();

    const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]));

    const simulate = () => {
      const nodes = nodesRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Simple force simulation
      for (const node of nodes) {
        // Center gravity
        node.vx += (centerX - node.x) * 0.001;
        node.vy += (centerY - node.y) * 0.001;

        // Node repulsion
        for (const other of nodes) {
          if (node.id === other.id) continue;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 120) {
            const force = (120 - dist) / dist * 0.3;
            node.vx += dx * force;
            node.vy += dy * force;
          }
        }
      }

      // Link attraction
      for (const link of networkData.links) {
        const source = nodeMap.get(link.source);
        const target = nodeMap.get(link.target);
        if (!source || !target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 100) * 0.003 * link.strength;
        source.vx += dx / dist * force;
        source.vy += dy / dist * force;
        target.vx -= dx / dist * force;
        target.vy -= dy / dist * force;
      }

      // Apply velocity with damping
      for (const node of nodes) {
        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx;
        node.y += node.vy;
        // Bounds
        node.x = Math.max(30, Math.min(canvas.width - 30, node.x));
        node.y = Math.max(30, Math.min(canvas.height - 30, node.y));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0a0e17";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(30, 41, 59, 0.3)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw links
      for (const link of networkData.links) {
        const source = nodeMap.get(link.source);
        const target = nodeMap.get(link.target);
        if (!source || !target) continue;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${link.strength * 0.25})`;
        ctx.lineWidth = link.strength * 2;
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodesRef.current) {
        const color = nodeTypeColors[node.type] || "#00d4ff";
        const radius = 6 + (node.threat / 100) * 8;
        const isHovered = hoveredNode === node.id;
        const isFiltered = selectedType && node.type !== selectedType;

        ctx.globalAlpha = isFiltered ? 0.2 : 1;

        // Outer glow
        if (node.threat > 80 || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = color.replace(")", ", 0.15)").replace("rgb", "rgba").replace("#", "");
          const gradient = ctx.createRadialGradient(node.x, node.y, radius, node.x, node.y, radius + 8);
          gradient.addColorStop(0, `${color}33`);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${color}33`;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = isHovered ? 2 : 1.5;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        ctx.font = `${isHovered ? "11" : "9"}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = isHovered ? "#e2e8f0" : "#94a3b8";
        ctx.textAlign = "center";
        ctx.fillText(node.name, node.x, node.y + radius + 14);

        ctx.globalAlpha = 1;
      }
    };

    const animate = () => {
      simulate();
      draw();
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [initNodes, hoveredNode, selectedType]);

  const typeFilters = Object.entries(nodeTypeColors);

  return (
    <div className="h-full flex flex-col" style={{ minHeight: 400 }}>
      <PanelHeader
        title="Link Analysis"
        icon={<GitBranch size={14} />}
        status="live"
        count={networkData.nodes.length}
        actions={
          <div className="flex items-center gap-1">
            <button className="p-1 text-osint-text-muted hover:text-osint-cyan transition-colors">
              <ZoomIn size={12} />
            </button>
            <button className="p-1 text-osint-text-muted hover:text-osint-cyan transition-colors">
              <ZoomOut size={12} />
            </button>
            <button className="p-1 text-osint-text-muted hover:text-osint-cyan transition-colors">
              <Maximize2 size={12} />
            </button>
          </div>
        }
      />
      <div ref={containerRef} className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full" />
        {/* Type Legend */}
        <div className="absolute bottom-3 left-3 bg-osint-panel/95 border border-osint-border px-3 py-2 backdrop-blur-sm">
          <div className="text-[9px] font-mono uppercase tracking-widest text-osint-text-muted mb-1.5">Entity Types</div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {typeFilters.map(([type, color]) => (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className={`flex items-center gap-1.5 transition-opacity ${selectedType && selectedType !== type ? "opacity-40" : ""}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-mono text-osint-text-dim uppercase">{type}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Stats overlay */}
        <div className="absolute top-3 right-3 bg-osint-panel/95 border border-osint-border px-2 py-1 backdrop-blur-sm">
          <span className="text-[9px] font-mono text-osint-text-muted">
            {networkData.nodes.length} NODES | {networkData.links.length} LINKS
          </span>
        </div>
      </div>
    </div>
  );
}
