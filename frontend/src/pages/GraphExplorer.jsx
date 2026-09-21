import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import GraphCanvas from '../components/GraphCanvas';
import { 
  Network, 
  Search, 
  Info, 
  Filter, 
  Maximize2, 
  Plus, 
  Edit3, 
  Eye, 
  EyeOff, 
  Link as LinkIcon, 
  Calendar, 
  Box, 
  Layers, 
  ExternalLink,
  ChevronDown,
  X
} from 'lucide-react';

export default function GraphExplorer() {
  const [activeSubtab, setActiveSubtab] = useState('Knowledge');
  const [searchTerm, setSearchTerm] = useState('Cobalt Strike');
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [is3D, setIs3D] = useState(false);

  const fetchGraph = (targetId) => {
    if (!targetId) return;
    setLoading(true);
    api.getEntityGraph(targetId)
      .then((data) => {
        setGraphData(data);
        setLoading(false);
        // Default select first node if available
        if (data?.nodes?.length > 0 && !selectedNode) {
          setSelectedNode(data.nodes[0]);
        }
      })
      .catch((err) => {
        console.error("Graph fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGraph(searchTerm);
  }, []);

  const subtabs = ['Overview', 'Knowledge', 'Content', 'Entities', 'Observables', 'Data'];

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] bg-[#070d19] overflow-hidden">
      
      {/* Horizontal Sub-Navigation Tab Bar */}
      <div className="px-6 border-b border-[#1b2a40] bg-[#09101d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {subtabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubtab(tab)}
              className={`opencti-subtab ${activeSubtab === tab ? 'opencti-subtab-active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Quick Graph Search Input */}
        <div className="flex items-center gap-2 py-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search graph entity..."
              onKeyDown={(e) => e.key === 'Enter' && fetchGraph(searchTerm)}
              className="opencti-input text-xs pl-8 py-1 w-56"
            />
          </div>
          <button 
            onClick={() => fetchGraph(searchTerm)}
            className="opencti-btn-primary px-3 py-1 rounded text-xs"
          >
            Query
          </button>
        </div>
      </div>

      {/* Main Investigation Workspace (Canvas + Right Inspector Drawer) */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Full-bleed Graph Canvas Container */}
        <div className="flex-1 relative bg-[#070d19] flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-mono text-xs">
              Querying OpenCTI Knowledge Graph Topology...
            </div>
          ) : (
            <GraphCanvas
              graphData={graphData}
              onNodeClick={(node) => setSelectedNode(node)}
            />
          )}

          {/* Bottom Floating Control Toolbar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 graph-toolbar px-3 py-1.5 flex items-center gap-3 text-xs text-slate-300 z-20">
            <button 
              onClick={() => setIs3D(!is3D)}
              className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors ${is3D ? 'bg-sky-600 text-white' : 'hover:bg-white/[0.08] text-slate-300'}`}
            >
              3D
            </button>
            <div className="h-4 w-px bg-[#1b2a40]" />
            <button className="p-1 rounded hover:bg-white/[0.08] text-slate-300" title="Layout Mode">
              <Layers size={15} />
            </button>
            <button className="p-1 rounded hover:bg-white/[0.08] text-slate-300" title="Zoom to Fit">
              <Maximize2 size={15} />
            </button>
            <button className="p-1 rounded hover:bg-white/[0.08] text-slate-300" title="Date Range">
              <Calendar size={15} />
            </button>
            <div className="h-4 w-px bg-[#1b2a40]" />
            
            {/* Search within results */}
            <div className="relative flex items-center">
              <Search size={13} className="absolute left-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search these results..."
                className="bg-[#060b14] border border-[#1b2a40] rounded text-[11px] pl-7 pr-2 py-0.5 w-44 text-slate-200 outline-none focus:border-sky-500"
              />
            </div>

            <div className="h-4 w-px bg-[#1b2a40]" />
            <button className="p-1 rounded hover:bg-white/[0.08] text-slate-300" title="Add Object">
              <Plus size={15} />
            </button>
            <button className="p-1 rounded hover:bg-white/[0.08] text-slate-300" title="Edit">
              <Edit3 size={15} />
            </button>
            <button className="p-1 rounded hover:bg-white/[0.08] text-slate-300" title="Connect Links">
              <LinkIcon size={15} />
            </button>
          </div>
        </div>

        {/* Right Selected Object Inspector Drawer */}
        {selectedNode && (
          <div className="w-80 bg-[#0c1626] border-l border-[#1b2a40] p-4 flex flex-col justify-between overflow-y-auto text-xs font-sans z-30">
            <div>
              {/* Inspector Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1b2a40]">
                <span className="text-[11px] font-mono text-slate-400">1 Objects Selected</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-slate-400 hover:text-slate-200">
                    <ExternalLink size={14} />
                  </button>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Object Dropdown Selector */}
              <div className="mt-3">
                <label className="text-[11px] text-slate-400 font-medium">Object</label>
                <div className="mt-1 p-2 rounded bg-[#060b14] border border-[#1b2a40] text-slate-200 font-mono text-xs flex items-center justify-between">
                  <span className="truncate">[{selectedNode.id || 'T1049'}] {selectedNode.label}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>

              {/* Value Field */}
              <div className="mt-4">
                <label className="text-[11px] text-slate-400 font-medium">Value</label>
                <div className="mt-1 font-mono text-xs text-slate-100 break-all font-semibold">
                  [{selectedNode.id || 'T1049'}] {selectedNode.label}
                </div>
              </div>

              {/* Type Badge Chip */}
              <div className="mt-4">
                <label className="text-[11px] text-slate-400 font-medium">Type</label>
                <div className="mt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                    {selectedNode.type === 'THREAT_ACTOR' ? 'Threat Actor' : selectedNode.type === 'MALWARE' ? 'Malware' : selectedNode.type === 'CVE' ? 'Vulnerability' : 'Attack Pattern'}
                  </span>
                </div>
              </div>

              {/* Creation Date */}
              <div className="mt-4">
                <label className="text-[11px] text-slate-400 font-medium">Platform Creation Date</label>
                <div className="mt-1 font-mono text-xs text-slate-300">
                  July 1, 2025 at 2:58:49 AM
                </div>
              </div>

              {/* Description Block */}
              <div className="mt-4 pt-3 border-t border-[#1b2a40]">
                <label className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                  <span>Description</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </label>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans bg-[#060b14]/60 p-2.5 rounded border border-[#1b2a40]/60">
                  Adversaries may attempt to get a listing of network connections to or from the compromised system they are currently accessing or from remote systems by querying for information over the network.
                  <br /><br />
                  An adversary who gains access to a system that is part of a cloud-based environment may map out Virtual Private Clouds or Virtual Networks in order to determine what systems and services are connected.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#1b2a40]">
              <button 
                onClick={() => fetchGraph(selectedNode.label)}
                className="w-full py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors shadow-2xs"
              >
                Expand Subgraph Relationships
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
