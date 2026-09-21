import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import GraphCanvas from '../components/GraphCanvas';
import EntityBadge from '../components/EntityBadge';
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
  Filter,
  FileText,
  Shield,
  Code,
  Tag,
  Download,
  Copy,
  Check
} from 'lucide-react';

export default function GraphExplorer() {
  const [activeSubtab, setActiveSubtab] = useState('Knowledge');
  const [searchTerm, setSearchTerm] = useState('Cobalt Strike');
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(graphData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      {/* Main Tab Content Workspace */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', minHeight: 0, overflow: 'hidden' }}>
        
        {/* 1. OVERVIEW TAB */}
        {activeSubtab === 'Overview' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              {/* Report Metadata */}
              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-title">Report Metadata</div>
                  <span className="badge-critical">TLP:AMBER</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Report Name:</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                      Toolkit: AI-Assisted Development and Persistent Threat Operations
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Author / Source:</span>
                    <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>CyberGraph-X CTI Engine</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Publication Date:</span>
                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '2px' }}>July 1, 2025 at 2:58:49 AM</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Confidence Score:</span>
                    <div style={{ color: '#34d399', fontWeight: 600, marginTop: '2px' }}>96% High Confidence</div>
                  </div>
                </div>
              </div>

              {/* Executive Summary Stats */}
              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-title">Correlated Subgraph Metrics</div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>STIX 2.1</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', border: '1px solid var(--opencti-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Nodes</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{graphData.nodes?.length || 0}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', border: '1px solid var(--opencti-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Relationships</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{graphData.edges?.length || 0}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', border: '1px solid var(--opencti-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Entity</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38bdf8', marginTop: '4px' }}>{searchTerm}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', border: '1px solid var(--opencti-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Graph Engine</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#c084fc', marginTop: '4px' }}>Neo4j Aura</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Description Narrative */}
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">Threat Advisory Overview</div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                This knowledge report synthesizes correlated threat intelligence regarding active cyber campaigns. 
                Extracted entities include threat actor groups (such as APT28 and Lazarus Group), malware payloads (Cobalt Strike, RedLine Stealer, PlugX), associated CVE vulnerability exploits, and Command & Control IP/Domain infrastructure indicators.
              </p>
            </div>
          </div>
        )}

        {/* 2. KNOWLEDGE TAB (GRAPH CANVAS VIEW) */}
        {activeSubtab === 'Knowledge' && (
          <>
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
          </>
        )}

        {/* 3. CONTENT TAB */}
        {activeSubtab === 'Content' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">Raw CTI Advisory & NLP Highlighted Content</div>
                <span className="badge-info">XLM-RoBERTa Tagged</span>
              </div>
              <div style={{ backgroundColor: '#050912', padding: '16px', borderRadius: '6px', border: '1px solid var(--opencti-border)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.8, color: '#f8fafc' }}>
                Threat actor <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>APT28</span> deployed malware <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>Cobalt Strike</span> to compromise financial sector infrastructure by exploiting zero-day vulnerability <span style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#f97316', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(249, 115, 22, 0.4)' }}>CVE-2023-38831</span> using Command & Control server IP address <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>192.168.1.50</span> and domain <span style={{ backgroundColor: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(2, 132, 199, 0.4)' }}>darknet-malware.com</span>.
              </div>
            </div>
          </div>
        )}

        {/* 4. ENTITIES TAB */}
        {activeSubtab === 'Entities' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">Extracted STIX 2.1 Entities</div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{graphData.nodes?.length || 0} Entities Found</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Canonical Label</th>
                    <th>Node ID</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(graphData.nodes || []).map((node, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className={node.type === 'THREAT_ACTOR' ? 'badge-high' : node.type === 'MALWARE' ? 'badge-critical' : 'badge-success'}>
                          {node.type}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>{node.label}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '11px' }}>{node.id}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          onClick={() => {
                            setSelectedNode(node);
                            setActiveSubtab('Knowledge');
                          }} 
                          style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
                        >
                          View in Graph →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. OBSERVABLES TAB */}
        {activeSubtab === 'Observables' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">Technical Observables & Indicators (IOCs)</div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10b981' }}>Live STIX Observables</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Observable Type</th>
                    <th>Value / Indicator</th>
                    <th>STIX Score</th>
                    <th>Correlation Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge-success">IP</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 600 }}>192.168.1.50</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#f87171' }}>90 / 100</td>
                    <td><span className="badge-critical">Malicious C2</span></td>
                  </tr>
                  <tr>
                    <td><span className="badge-info">Domain</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>darknet-malware.com</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#f87171' }}>95 / 100</td>
                    <td><span className="badge-critical">C2 Infrastructure</span></td>
                  </tr>
                  <tr>
                    <td><span className="badge-high">CVE</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#fb923c', fontWeight: 600 }}>CVE-2023-38831</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#facc15' }}>88 / 100</td>
                    <td><span className="badge-high">Exploited Zero-Day</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. DATA TAB */}
        {activeSubtab === 'Data' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">Raw STIX 2.1 Graph Payload</div>
                <button onClick={handleCopyJson} className="cta-btn">
                  {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre style={{ backgroundColor: '#050912', padding: '16px', borderRadius: '6px', border: '1px solid var(--opencti-border)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#38bdf8', overflowX: 'auto', maxHeight: '400px' }}>
                {JSON.stringify(graphData, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
