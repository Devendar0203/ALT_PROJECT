import React from 'react';
import { 
  Search, 
  Sparkles, 
  Upload, 
  Bell, 
  Clock, 
  User, 
  SlidersHorizontal,
  Bookmark,
  Share2,
  MoreVertical,
  FileText
} from 'lucide-react';

export default function Header({ activeTab, onIngestClick }) {
  return (
    <header className="bg-[#0b1320] border-b border-[#1b2a40] sticky top-0 z-30 flex flex-col">
      {/* Top Search Bar & Utility Actions */}
      <div className="h-14 px-6 flex items-center justify-between gap-4 border-b border-[#1b2a40]">
        
        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl relative flex items-center">
          <Search size={15} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search the platform..."
            className="w-full bg-[#060b14] border border-[#1b2a40] rounded-md pl-9 pr-20 py-1.5 text-xs text-slate-100 outline-none focus:border-sky-500 transition-colors"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]">
              <SlidersHorizontal size={13} />
            </button>
          </div>
        </div>

        {/* Right Utility Cluster */}
        <div className="flex items-center gap-3">
          {/* Ask Ariane AI Assistant Pill Button */}
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40 text-xs font-medium hover:bg-purple-900/60 transition-colors">
            <Sparkles size={13} className="text-purple-400" />
            <span>Ask Ariane</span>
          </button>

          <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]">
            <Upload size={15} />
          </button>
          <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]">
            <Clock size={15} />
          </button>
          <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]">
            <Bell size={15} />
          </button>

          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User size={14} />
          </div>

          <button 
            onClick={onIngestClick}
            className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors shadow-2xs"
          >
            + Ingest
          </button>
        </div>
      </div>

      {/* Page Breadcrumbs & Title Bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4 bg-[#070d19]">
        <div>
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Analyses</span>
            <span>/</span>
            <span className="text-sky-400 hover:underline cursor-pointer">Reports</span>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-xs">Toolkit: AI-Assisted Development and Persistent Threat...</span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-3">
            <span>Toolkit: AI-Assisted Development and Persistent Threat Operations</span>
          </h1>
        </div>

        {/* Title Action Icons & Update Button */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded bg-[#0f1a2c] border border-[#1b2a40] text-slate-400 hover:text-slate-200">
            <FileText size={15} />
          </button>
          <button className="p-1.5 rounded bg-[#0f1a2c] border border-[#1b2a40] text-slate-400 hover:text-slate-200">
            <Bell size={15} />
          </button>
          <button className="p-1.5 rounded bg-[#0f1a2c] border border-[#1b2a40] text-slate-400 hover:text-slate-200">
            <Bookmark size={15} />
          </button>
          <button className="p-1.5 rounded bg-[#0f1a2c] border border-[#1b2a40] text-slate-400 hover:text-slate-200">
            <MoreVertical size={15} />
          </button>
          
          <button className="px-3 py-1.5 rounded bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 transition-colors">
            Update
          </button>
        </div>
      </div>
    </header>
  );
}
