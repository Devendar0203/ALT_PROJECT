import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import EntityBadge from '../components/EntityBadge';
import GraphCanvas from '../components/GraphCanvas';
import { 
  Database, 
  Flame, 
  Bug, 
  ShieldAlert, 
  Share2, 
  RefreshCw, 
  Sparkles, 
  ChevronDown, 
  Cpu, 
  Search, 
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const [entities, setEntities] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [graphPreview, setGraphPreview] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [presetLoading, setPresetLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [actorSearch, setActorSearch] = useState('');

  const sampleAdvisories = [
    {
      name: 'APT28 Advisory',
      id: 'RPT-2026-APT28',
      text: 'Threat actor APT28 deployed Cobalt Strike to compromise financial sector systems by exploiting CVE-2023-38831 via IP 192.168.1.50 and domain darknet-malware.com.'
    },
    {
      name: 'Lazarus Operation',
      id: 'RPT-2026-LAZARUS',
      text: 'El grupo Lazarus utilizo el malware RedLine Stealer para infectar servidores estatales usando la vulnerabilidad CVE-2021-44228 y contactar 10.0.0.15.'
    },
    {
      name: 'Sandworm Campaign',
      id: 'RPT-2026-SANDWORM',
      text: 'Группировка Sandworm распространяет троян AgentTesla через вредоносный домен evil-update.ru и IP адрес 185.220.101.5.'
    },
    {
      name: 'APT41 Zero-Day',
      id: 'RPT-2026-APT41',
      text: 'APT41 utilized zero-day CVE-2024-1709 to deploy PlugX backdoor to attack update-service.cn and C2 IP 45.33.32.156.'
    }
  ];

  const trackedActors = [
    { name: 'APT28', aliases: 'Fancy Bear, Strontium', malware: 'Cobalt Strike, XAgent', campaigns: 4, lastSeen: 'Today 12:42', confidence: '95%' },
    { name: 'Lazarus Group', aliases: 'Hidden Cobra', malware: 'RedLine Stealer', campaigns: 3, lastSeen: 'Today 12:38', confidence: '94%' },
    { name: 'Sandworm', aliases: 'Voodoo Bear', malware: 'AgentTesla', campaigns: 2, lastSeen: 'Today 12:21', confidence: '96%' },
    { name: 'APT41', aliases: 'Double Dragon', malware: 'PlugX', campaigns: 3, lastSeen: 'Today 11:55', confidence: '95%' }
  ];

  const languageMatrix = [
    { code: 'EN', name: 'English', accuracy: '99.4%', status: 'Active' },
    { code: 'ES', name: 'Spanish', accuracy: '97.8%', status: 'Active' },
    { code: 'RU', name: 'Russian', accuracy: '96.2%', status: 'Active' },
    { code: 'HI-EN', name: 'Hinglish', accuracy: '94.5%', status: 'Active' }
  ];

  const pipelineSteps = [
    { step: '01', name: 'XLM-RoBERTa Model', detail: '560M params loaded', latency: '12ms' },
    { step: '02', name: 'Multilingual Token NER', detail: 'Actors, CVEs, IPs, Hashes', latency: '34ms' },
    { step: '03', name: 'Relation Extractor', detail: 'STIX 2.1 taxonomy mapping', latency: '28ms' },
    { step: '04', name: 'Graph Serialization', detail: 'Parameterized Cypher engine', latency: '15ms' }
  ];

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getEntitiesByType('ALL'),
      api.getCampaigns(),
      api.getEntityGraph('Cobalt Strike')
    ])
      .then(([entData, campData, graphData]) => {
        setEntities(entData || []);
        setCampaigns(campData || []);
        setGraphPreview(graphData || { nodes: [], edges: [] });
        setLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIngestPreset = (sample) => {
    setPresetLoading(true);
    setShowPresetsMenu(false);
    setStatusMessage(`Running XLM-RoBERTa pipeline on ${sample.name}...`);
    api.ingestReport(sample.text, sample.id)
      .then(() => {
        setStatusMessage(`Successfully processed & correlated ${sample.name}`);
        setPresetLoading(false);
        loadData();
        setTimeout(() => setStatusMessage(null), 4000);
      })
      .catch((err) => {
        setStatusMessage(`Ingest error: ${err.message}`);
        setPresetLoading(false);
      });
  };

  const typeCounts = entities.reduce((acc, curr) => {
    const t = curr.type || 'OTHER';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const totalEntitiesCount = entities.length || 1;
  const distributionData = [
    { type: 'Threat Actors', key: 'THREAT_ACTOR', color: '#0284c7', count: typeCounts['THREAT_ACTOR'] || 0 },
    { type: 'Malware Strains', key: 'MALWARE', color: '#ef4444', count: typeCounts['MALWARE'] || 0 },
    { type: 'CVE Vulnerabilities', key: 'CVE', color: '#f97316', count: typeCounts['CVE'] || 0 },
    { type: 'IP Addresses', key: 'IP', color: '#10b981', count: typeCounts['IP'] || 0 },
    { type: 'Domains', key: 'DOMAIN', color: '#8b5cf6', count: typeCounts['DOMAIN'] || 0 },
    { type: 'IOC Hashes', key: 'IOC', color: '#64748b', count: typeCounts['IOC'] || 0 }
  ];

  const filteredActors = trackedActors.filter(actor => 
    actor.name.toLowerCase().includes(actorSearch.toLowerCase()) ||
    actor.aliases.toLowerCase().includes(actorSearch.toLowerCase()) ||
    actor.malware.toLowerCase().includes(actorSearch.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Title Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--opencti-border)', paddingBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            CyberGraph-X / Threat Intelligence Overview
          </div>
          <h1 style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>
            Operational Knowledge Overview
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Synced: {lastUpdated}
          </span>

          {/* Quick Actions Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              disabled={presetLoading}
              className="cta-btn cta-btn-primary"
            >
              <Sparkles size={14} className={presetLoading ? 'animate-spin' : ''} />
              <span>Quick Actions</span>
              <ChevronDown size={14} />
            </button>

            {showPresetsMenu && (
              <div style={{ position: 'absolute', right: 0, marginTop: '6px', width: '240px', backgroundColor: 'var(--opencti-card)', border: '1px solid var(--opencti-border)', borderRadius: '8px', zIndex: 50, padding: '4px 0', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                <div style={{ padding: '6px 12px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--opencti-border)' }}>
                  1-Click Advisory Ingestion
                </div>
                {sampleAdvisories.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleIngestPreset(sample)}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12px', color: 'var(--text-primary)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>{sample.name}</span>
                    <span style={{ fontSize: '10px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>Ingest →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={loadData} disabled={loading} className="cta-btn">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} color="var(--text-secondary)" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div style={{ backgroundColor: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '10px 14px', borderRadius: '6px', color: '#38bdf8', fontSize: '12px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={14} className="animate-pulse" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top 5 KPI Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        {/* Total Ingested Nodes */}
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
            <span>Total Graph Nodes</span>
            <Database size={16} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{entities.length}</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: 600 }}>+18.4%</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Live Ingested Entities</span>
        </div>

        {/* Threat Actors */}
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
            <span>Threat Actors</span>
            <Flame size={16} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{typeCounts['THREAT_ACTOR'] || 0}</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#fb923c', fontWeight: 600 }}>+4 active</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Tracked APT Groups</span>
        </div>

        {/* Malware Families */}
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
            <span>Malware Families</span>
            <Bug size={16} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{typeCounts['MALWARE'] || 0}</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#f87171', fontWeight: 600 }}>+2 this week</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Strains & Trojans</span>
        </div>

        {/* CVE Vulnerabilities */}
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
            <span>CVE Exploits</span>
            <ShieldAlert size={16} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{typeCounts['CVE'] || 0}</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#facc15', fontWeight: 600 }}>+6 critical</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Vulnerabilities</span>
        </div>

        {/* Active Campaigns */}
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
            <span>Graph Campaigns</span>
            <Share2 size={16} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{campaigns.length}</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 600 }}>Stable</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Correlated Subgraphs</span>
        </div>

      </div>

      {/* Main 2-Column Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '20px' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Entity Distribution Aggregated Stacked Chart Panel */}
          <div className="panel-card">
            <div className="panel-header">
              <div>
                <div className="panel-title">Entity Type Distribution & Volume Share</div>
                <div className="panel-subtitle">Extracted STIX 2.1 entities mapped in Neo4j graph database</div>
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--opencti-border)' }}>
                {entities.length} Total Nodes
              </span>
            </div>

            {/* Aggregated Horizontal Stacked Bar */}
            <div style={{ height: '12px', width: '100%', backgroundColor: '#050912', borderRadius: '4px', overflow: 'hidden', display: 'flex', border: '1px solid var(--opencti-border)', margin: '8px 0 16px 0' }}>
              {distributionData.map((item, idx) => {
                const pct = (item.count / totalEntitiesCount) * 100;
                if (pct === 0) return null;
                return (
                  <div
                    key={idx}
                    style={{ width: `${pct}%`, backgroundColor: item.color, height: '100%', transition: 'width 0.3s ease' }}
                    title={`${item.type}: ${item.count} (${Math.round(pct)}%)`}
                  />
                );
              })}
            </div>

            {/* Dense Tabular Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {distributionData.map((item, idx) => {
                const pct = Math.round((item.count / totalEntitiesCount) * 100);
                return (
                  <div key={idx} style={{ padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--opencti-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.type}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff' }}>
                      {item.count} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracked Threat Actors Data Table */}
          <div className="panel-card">
            <div className="panel-header">
              <div>
                <div className="panel-title">Tracked Threat Actors & APT Intel</div>
                <div className="panel-subtitle">Correlated threat actors and associated malware families</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: '8px', top: '7px' }} />
                  <input
                    type="text"
                    placeholder="Search actors..."
                    value={actorSearch}
                    onChange={(e) => setActorSearch(e.target.value)}
                    style={{ backgroundColor: '#050912', border: '1px solid var(--opencti-border)', borderRadius: '4px', padding: '4px 8px 4px 26px', color: '#ffffff', fontSize: '11px', outline: 'none', width: '160px' }}
                  />
                </div>
                <button onClick={() => onNavigate && onNavigate('explorer')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Explore Graph</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Actor Name</th>
                  <th>Known Aliases</th>
                  <th>Associated Malware</th>
                  <th>Campaigns</th>
                  <th>Last Observed</th>
                  <th style={{ textAlign: 'right' }}>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {filteredActors.map((actor, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>{actor.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{actor.aliases}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#f87171', fontSize: '11px' }}>{actor.malware}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'center' }}>{actor.campaigns}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '11px' }}>{actor.lastSeen}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#34d399' }}>{actor.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Extracted Entity Tags */}
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">Extracted CTI Entity Matrix</div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{entities.length} items</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {entities.map((item, idx) => (
                <EntityBadge
                  key={idx}
                  type={item.type}
                  text={item.label || item.name || item.id}
                  onClick={() => onNavigate && onNavigate('explorer')}
                />
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* XLM-RoBERTa Pipeline Telemetry */}
          <div className="panel-card">
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={15} color="#38bdf8" />
                <div className="panel-title">NLP Pipeline Telemetry</div>
              </div>
              <span className="badge-success">Operational</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              {pipelineSteps.map((step) => (
                <div key={step.step} style={{ padding: '8px 10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--opencti-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{step.step}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{step.name}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{step.detail}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#38bdf8', backgroundColor: 'rgba(2, 132, 199, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                    {step.latency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Multilingual Support Matrix */}
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">Multilingual CTI Precision</div>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>XLM-RoBERTa</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {languageMatrix.map((lang) => (
                <div key={lang.code} style={{ padding: '8px 10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--opencti-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399' }} />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lang.name}</span>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1px 4px', borderRadius: '3px' }}>{lang.code}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff' }}>{lang.accuracy} acc</span>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Graph Topology Preview */}
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">Graph Topology Subtree</div>
              <button onClick={() => onNavigate && onNavigate('explorer')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Full Graph</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <div style={{ borderRadius: '6px', border: '1px solid var(--opencti-border)', overflow: 'hidden' }}>
              <GraphCanvas graphData={graphPreview} height="190px" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
