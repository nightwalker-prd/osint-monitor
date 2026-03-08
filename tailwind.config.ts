import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}","./src/components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        osint: { bg:"#0a0e17", panel:"#111827", surface:"#1a2332", border:"#1e293b", "border-light":"#334155", cyan:"#00d4ff", amber:"#f59e0b", red:"#ef4444", green:"#10b981", purple:"#8b5cf6", text:"#e2e8f0", "text-dim":"#94a3b8", "text-muted":"#64748b" },
      },
      fontFamily: { sans:["Inter","system-ui","sans-serif"], mono:["JetBrains Mono","monospace"] },
      animation: { "pulse-slow":"pulse 3s cubic-bezier(0.4,0,0.6,1) infinite", "fade-in":"fadeIn 0.3s ease-in-out" },
      keyframes: { fadeIn: { "0%":{opacity:"0"}, "100%":{opacity:"1"} } },
      boxShadow: { glow:"0 0 15px rgba(0,212,255,0.15)", "glow-red":"0 0 15px rgba(239,68,68,0.15)" },
    },
  },
  plugins: [],
};
export default config;
