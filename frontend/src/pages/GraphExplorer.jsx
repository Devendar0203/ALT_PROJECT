import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import GraphCanvas from '../components/GraphCanvas';
import { 
  Search, 
  Layers, 
  Maximize2, 
  Calendar, 
  Plus, 
  Edit3, 
  Link as LinkIcon, 
  ExternalLink, 
  ChevronDown, 
  X,
  Filter
} from 'lucide-react';

export default function GraphExplorer() {
  const [activeSubtab, setActiveSubtab] = useState('Knowledge');
  const [searchTerm, setSearchTerm] = useState('Cobalt Strike');
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGraph = (targetId) => {
    if (!targetId) return;
    setLoading(true);
    api.getEntityGraph(targetId)
      .then((data) => {
        setGraphData(data);
        setLoading(false);
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

  const legendItems = [
    { label: 'Threat Actor', color: '#f59e0b' },
    { label: 'Malware', color: '#ef4444' },
    { label: 'CVE Exploit', color: '#f97316' },
    { label: 'IP Address', color: '#10b981' },
    { label: 'Domain', color: '#0284c7' },
    { label: 'IOC Hash', color: '#64748b' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', backgroundColor: 'var(--opencti-bg)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--opencti-border)' }}>
      
      {/* Sub-navigation Tab Bar */}
      <div style={{ backgroundColor: 'var(--opencti-header)', borderBottom: '1px solid var(--opencti-border)', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {subtabs.map((tab) => {
            const isActive = activeSubtab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubtab(tab)}
                style={{
                  padding: '12px 16px',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #00b4d8' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Quick Query Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search graph entity..."
              onKeyDown={(e) => e.key === 'Enter' && fetchGraph(searchTerm)}
              style={{
                backgroundColor: '#050912',
                border: '1px solid var(--opencti-border)',
                borderRadius: '4px',
                padding: '5px 10px 5px 30px',
                color: '#ffffff',
                fontSize: '12px',
                outline: 'none',
                width: '220px'
              }}
            />
          </div>
          <button 
            onClick={() => fetchGraph(searchTerm)}
            className="cta-btn cta-btn-primary"
            style={{ fontSize: '11px', padding: '5px 12px' }}
          >
            Query
          </button>
        </div>
      </div>

      {/* Main Investigation Workspace */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', minHeight: 0 }}>
        
        {/* Central Graph Canvas */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--opencti-bg)' }}>
          
          {/* Legend Banner */}
          <div style={{ position: 'absolute', top: '12px', left: '16px', zIndex: 20, backgroundColor: 'rgba(11, 17, 30, 0.85)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--opencti-border)', display: 'flex', alignItems: 'center', gap: '14px', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={12} /> Legend:
            </span>
            {legendItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#ffffff' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
              Querying Neo4j Aura Graph Topology...
            </div>
          ) : (
            <GraphCanvas
              graphData={graphData}
              onNodeClick={(node) => setSelectedNode(node)}
            />
          )}

          {/* Bottom Floating Control Bar */}
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(11, 17, 30, 0.95)', border: '1px solid var(--opencti-border)', padding: '6px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 20, backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8', padding: '2px 6px', borderRadius: '3px', backgroundColor: 'rgba(2, 132, 199, 0.2)', border: '1px solid rgba(2, 132, 199, 0.4)' }}>2D</span>
            <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--opencti-border)' }} />
            <Layers size={14} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            <Maximize2 size={14} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            <Calendar size={14} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--opencti-border)' }} />
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={12} color="var(--text-muted)" style={{ position: 'absolute', left: '6px' }} />
              <input
                type="text"
                placeholder="Search results..."
                style={{ backgroundColor: '#050912', border: '1px solid var(--opencti-border)', borderRadius: '4px', padding: '3px 6px 3px 22px', fontSize: '11px', color: '#ffffff', outline: 'none', width: '140px' }}
              />
            </div>

            <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--opencti-border)' }} />
            <Plus size={14} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            <Edit3 size={14} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            <LinkIcon size={14} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Right Selected Object Inspector Drawer */}
        {selectedNode && (
          <div style={{ width: '320px', backgroundColor: 'var(--opencti-sidebar)', borderLeft: '1px solid var(--opencti-border)', padding: '16px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', overflowY: 'auto', zIndex: 30 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Inspector Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--opencti-border)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>1 Objects Selected</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Object Dropdown Selector */}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Object</span>
                <div style={{ marginTop: '4px', padding: '8px 10px', borderRadius: '4px', backgroundColor: '#050912', border: '1px solid var(--opencti-border)', color: '#ffffff', fontSize: '12px', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>[{selectedNode.id || 'T1049'}] {selectedNode.label}</span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </div>
              </div>

              {/* Value Field */}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Value</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px', wordBreak: 'break-all' }}>
                  [{selectedNode.id || 'T1049'}] {selectedNode.label}
                </div>
              </div>

              {/* Type Chip */}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Type</span>
                <div style={{ marginTop: '4px' }}>
                  <span className="badge-success">
                    {selectedNode.type === 'THREAT_ACTOR' ? 'Threat Actor' : selectedNode.type === 'MALWARE' ? 'Malware Strain' : selectedNode.type === 'CVE' ? 'Vulnerability' : selectedNode.type}
                  </span>
                </div>
              </div>

              {/* Platform Creation Date */}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Platform Creation Date</span>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '2px' }}>
                  July 1, 2025 at 2:58:49 AM
                </div>
              </div>

              {/* Description Block */}
              <div style={{ borderTop: '1px solid var(--opencti-border)', paddingTop: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Description</span>
                <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)', backgroundColor: '#050912', padding: '10px', borderRadius: '6px', border: '1px solid var(--opencti-border)', lineHeight: 1.6 }}>
                  Adversaries may attempt to get a listing of network connections to or from the compromised system they are currently accessing or from remote systems by querying for information over the network.
                </div>
              </div>

            </div>

            {/* Expand Action Button */}
            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--opencti-border)' }}>
              <button 
                onClick={() => fetchGraph(selectedNode.label)}
                className="cta-btn cta-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Expand Subgraph Topology
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
