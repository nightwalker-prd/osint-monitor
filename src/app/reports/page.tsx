'use client';

import { useState } from 'react';
import {
  FileText, Download, Eye, Plus, Clock, Shield, AlertTriangle,
  Globe, Users, Radio, MessageSquare, Wallet, ChevronRight, Printer
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  sections: string[];
  classification: string;
}

interface GeneratedReport {
  id: string;
  title: string;
  template: string;
  createdAt: string;
  classification: string;
  status: 'draft' | 'review' | 'final';
  pages: number;
}

const templates: ReportTemplate[] = [
  {
    id: 'threat-brief',
    name: 'Threat Intelligence Brief',
    description: 'Comprehensive overview of active threats, threat actors, and recommended mitigations',
    icon: <Shield className="w-5 h-5" />,
    sections: ['Executive Summary', 'Threat Landscape', 'Active Threat Actors', 'IOC Summary', 'Mitigations', 'Appendix'],
    classification: 'SECRET',
  },
  {
    id: 'incident-report',
    name: 'Incident Response Report',
    description: 'Detailed IR report for active or closed investigations with timeline and evidence',
    icon: <AlertTriangle className="w-5 h-5" />,
    sections: ['Incident Overview', 'Timeline', 'Affected Systems', 'Root Cause Analysis', 'Evidence Log', 'Remediation Steps', 'Lessons Learned'],
    classification: 'TOP_SECRET',
  },
  {
    id: 'dark-web-digest',
    name: 'Dark Web Intelligence Digest',
    description: 'Weekly digest of dark web findings, credential leaks, and emerging threats',
    icon: <Globe className="w-5 h-5" />,
    sections: ['Key Findings', 'Credential Leaks', 'Marketplace Activity', 'Forum Intelligence', 'Emerging Threats', 'Recommendations'],
    classification: 'CONFIDENTIAL',
  },
  {
    id: 'actor-dossier',
    name: 'Threat Actor Dossier',
    description: 'Deep-dive profile on a specific threat actor including TTPs, history, and associations',
    icon: <Users className="w-5 h-5" />,
    sections: ['Actor Profile', 'Known Aliases', 'TTP Analysis (MITRE)', 'Campaign History', 'Infrastructure', 'Associations', 'IOCs'],
    classification: 'SECRET',
  },
  {
    id: 'sigint-summary',
    name: 'SIGINT Collection Summary',
    description: 'Summary of signals intelligence collection activities and key intercepts',
    icon: <Radio className="w-5 h-5" />,
    sections: ['Collection Overview', 'Priority Intercepts', 'Frequency Analysis', 'Communication Patterns', 'Actionable Intelligence'],
    classification: 'TOP_SECRET',
  },
  {
    id: 'finint-report',
    name: 'Financial Intelligence Report',
    description: 'Cryptocurrency tracking, transaction analysis, and sanctions cross-referencing',
    icon: <Wallet className="w-5 h-5" />,
    sections: ['Wallet Overview', 'Transaction Flow Analysis', 'Sanctions Hits', 'Laundering Patterns', 'Seizure Recommendations'],
    classification: 'SECRET',
  },
];

const recentReports: GeneratedReport[] = [
  { id: 'rpt-001', title: 'Weekly Threat Brief — W10 2026', template: 'Threat Intelligence Brief', createdAt: '2026-03-10T16:00:00Z', classification: 'SECRET', status: 'final', pages: 14 },
  { id: 'rpt-002', title: 'IR Report — Operation SHADOW BREACH', template: 'Incident Response Report', createdAt: '2026-03-10T22:00:00Z', classification: 'TOP_SECRET', status: 'draft', pages: 22 },
  { id: 'rpt-003', title: 'Dark Web Digest — Mar 4-10', template: 'Dark Web Intelligence Digest', createdAt: '2026-03-10T12:00:00Z', classification: 'CONFIDENTIAL', status: 'review', pages: 8 },
  { id: 'rpt-004', title: 'Dossier: APT-PHANTOM', template: 'Threat Actor Dossier', createdAt: '2026-03-09T14:00:00Z', classification: 'SECRET', status: 'final', pages: 18 },
  { id: 'rpt-005', title: 'FININT: BlackVault Wallet Tracing', template: 'Financial Intelligence Report', createdAt: '2026-03-10T08:00:00Z', classification: 'SECRET', status: 'review', pages: 11 },
];

const classColors: Record<string, { text: string; bg: string }> = {
  UNCLASSIFIED: { text: 'text-green-400', bg: 'bg-green-500/10' },
  CONFIDENTIAL: { text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  SECRET: { text: 'text-orange-400', bg: 'bg-orange-500/10' },
  TOP_SECRET: { text: 'text-red-400', bg: 'bg-red-500/10' },
};

const statusColors: Record<string, { text: string; bg: string }> = {
  draft: { text: 'text-gray-400', bg: 'bg-gray-500/10' },
  review: { text: 'text-amber-400', bg: 'bg-amber-500/10' },
  final: { text: 'text-green-400', bg: 'bg-green-500/10' },
};

function ReportPreview({ report }: { report: GeneratedReport }) {
  const cc = classColors[report.classification] || classColors.CONFIDENTIAL;
  return (
    <div className="flex-1 flex flex-col bg-[#0a0f1a]">
      {/* Preview Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-100">{report.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
            <span>{report.template}</span>
            <span>{report.pages} pages</span>
            <span>{new Date(report.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 flex items-center gap-1">
            <Printer className="w-3 h-3" /> Print
          </button>
          <button className="px-3 py-1.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 flex items-center gap-1">
            <Download className="w-3 h-3" /> Export PDF
          </button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Paper */}
          <div className="bg-[#0e1524] rounded-lg border border-white/10 shadow-2xl shadow-black/30 p-10">
            {/* Classification Header */}
            <div className={`text-center text-xs font-bold uppercase tracking-[0.3em] ${cc.text} mb-8`}>
              {report.classification.replace('_', ' ')}
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-100 text-center mb-2">{report.title}</h1>
            <div className="text-center text-xs text-gray-500 mb-8">
              Generated: {new Date(report.createdAt).toLocaleDateString()} | Classification: {report.classification.replace('_', ' ')}
            </div>

            <div className="w-16 h-px bg-cyan-500/30 mx-auto mb-8" />

            {/* Simulated Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">1. Executive Summary</h2>
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-11/12" />
                  <div className="h-3 bg-white/5 rounded w-10/12" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-9/12" />
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">2. Key Findings</h2>
                <div className="space-y-3">
                  {['Critical APT intrusion detected at ProtoCorp', 'Zero-day CVE-2026-1847 in active exploitation', 'BlackVault ransomware targeting healthcare'].map((finding, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white/[0.02] p-3 rounded border border-white/5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-gray-300">{finding}</span>
                        <div className="h-2.5 bg-white/5 rounded w-full mt-2" />
                        <div className="h-2.5 bg-white/5 rounded w-10/12 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">3. Threat Landscape</h2>
                <div className="grid grid-cols-2 gap-3">
                  {['Active Threats: 23', 'Monitored Actors: 7', 'Open Alerts: 156', 'SIGINT Intercepts: 1,341'].map((stat, i) => (
                    <div key={i} className="bg-white/[0.02] p-3 rounded border border-white/5">
                      <span className="text-xs text-gray-400">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] text-gray-600 text-center">
                  Page 1 of {report.pages} | {report.classification.replace('_', ' ')} | Distribution: NEED-TO-KNOW
                </div>
              </div>
            </div>

            {/* Classification Footer */}
            <div className={`text-center text-xs font-bold uppercase tracking-[0.3em] ${cc.text} mt-8`}>
              {report.classification.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [view, setView] = useState<'templates' | 'reports'>('reports');
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(recentReports[0]);

  return (
    <div className="flex h-screen bg-[#080d16] text-gray-100">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 bg-[#080d16] flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h1 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" /> Reports Generator
          </h1>
        </div>

        {/* View Toggle */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setView('reports')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
              view === 'reports' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'
            }`}
          >
            Recent Reports
          </button>
          <button
            onClick={() => setView('templates')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
              view === 'templates' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'
            }`}
          >
            Templates
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {view === 'reports' ? (
            recentReports.map((report) => {
              const cc = classColors[report.classification] || classColors.CONFIDENTIAL;
              const sc = statusColors[report.status];
              return (
                <div
                  key={report.id}
                  className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                    selectedReport?.id === report.id ? 'bg-cyan-500/5 border-l-2 border-l-cyan-500' : ''
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${cc.bg} ${cc.text}`}>
                      {report.classification.replace('_', ' ')}
                    </span>
                    <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${sc.bg} ${sc.text}`}>
                      {report.status}
                    </span>
                  </div>
                  <h3 className="text-[11px] text-gray-200 font-medium leading-tight mb-1">{report.title}</h3>
                  <div className="flex items-center gap-2 text-[9px] text-gray-500">
                    <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {new Date(report.createdAt).toLocaleDateString()}</span>
                    <span>{report.pages} pages</span>
                  </div>
                </div>
              );
            })
          ) : (
            templates.map((template) => (
              <div key={template.id} className="p-3 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-cyan-400">{template.icon}</span>
                  <h3 className="text-xs text-gray-200 font-medium">{template.name}</h3>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-2">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.sections.map((s) => (
                    <span key={s} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[8px] uppercase font-bold ${(classColors[template.classification] || classColors.CONFIDENTIAL).text}`}>
                    {template.classification.replace('_', ' ')}
                  </span>
                  <button className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5">
                    Generate <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors">
            <Plus className="w-3 h-3" /> New Report
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {selectedReport ? (
        <ReportPreview report={selectedReport} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a report or template to preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
