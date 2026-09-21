import React, { useState } from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Compass, 
  Target, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Briefcase, 
  Calendar, 
  Eye, 
  Flame, 
  Shield, 
  Cpu, 
  Users, 
  MapPin, 
  ChevronLeft, 
  Layers,
  Network
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const [analysesOpen, setAnalysesOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'dashboard_overview', label: 'Dashboards', icon: LayoutDashboard },
    { id: 'investigations', label: 'Investigations', icon: Compass },
    { id: 'pir', label: 'PIR', icon: Target },
  ];

  const analysesSubItems = [
    { id: 'reports', label: 'Reports', active: activeTab === 'search' },
    { id: 'groupings', label: 'Groupings' },
    { id: 'malware_analyses', label: 'Malware analyses' },
    { id: 'security_coverages', label: 'Security coverages' },
    { id: 'notes', label: 'Notes' },
  ];

  const bottomNavItems = [
    { id: 'cases', label: 'Cases', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'observations', label: 'Observations', icon: Eye },
    { id: 'explorer', label: 'Threats', icon: Flame },
    { id: 'arsenal', label: 'Arsenal', icon: Shield },
    { id: 'techniques', label: 'Techniques', icon: Cpu },
    { id: 'entities', label: 'Entities', icon: Users },
    { id: 'locations', label: 'Locations', icon: MapPin },
  ];

  return (
    <aside className={`h-screen bg-[#0b1320] border-r border-[#1b2a40] flex flex-col justify-between transition-all duration-200 sticky top-0 z-40 ${collapsed ? 'w-16' : 'w-60'}`}>
      
      {/* Top OpenCTI Brand */}
      <div>
        <div className="h-14 px-4 flex items-center gap-3 border-b border-[#1b2a40]">
          <div className="w-7 h-7 rounded bg-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
            <Network size={18} />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                OpenCTI
              </span>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
                v6.5
              </span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="py-3 px-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-110px)] text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-[#122035] text-white font-semibold border-l-2 border-sky-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f1a2c]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={16} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {/* Collapsible Analyses Accordion */}
          <div className="pt-1">
            <button
              onClick={() => setAnalysesOpen(!analysesOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-[#0f1a2c] rounded-md font-medium"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-sky-400" />
                {!collapsed && <span className="text-white font-semibold">Analyses</span>}
              </div>
              {!collapsed && (
                analysesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              )}
            </button>

            {analysesOpen && !collapsed && (
              <div className="pl-9 pr-2 py-1 space-y-1 border-l border-[#1b2a40] ml-5 my-1">
                {analysesSubItems.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      if (sub.id === 'reports') setActiveTab('search');
                      else setActiveTab('explorer');
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded text-xs transition-colors ${
                      sub.active
                        ? 'text-sky-400 bg-sky-950/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f1a2c]'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Nav Items */}
          <div className="pt-1 space-y-0.5">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
                    isActive
                      ? 'bg-[#122035] text-white font-semibold border-l-2 border-sky-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f1a2c]'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={16} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-[#1b2a40]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-slate-400 hover:text-slate-200 hover:bg-[#0f1a2c] rounded-md transition-colors text-xs"
        >
          <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

    </aside>
  );
}
