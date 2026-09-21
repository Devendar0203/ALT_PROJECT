import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import EntityBadge from '../components/EntityBadge';
import { ShieldAlert, Cpu, Globe, Flame, Layers, Bug, FileText, ArrowUpRight, Sparkles, RefreshCw, Zap, ExternalLink } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const [entities, setEntities] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presetLoading, setPresetLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const sampleAdvisories = [
    {
      name: 'APT28 Campaign',
      id: 'RPT-2026-APT28',
      text: 'Threat actor APT28 deployed Cobalt Strike to compromise financial sector systems by exploiting CVE-2023-38831 via IP 192.168.1.50 and domain darknet-malware.com.'
    },
    {
      name: 'Lazarus Operacion',
      id: 'RPT-2026-LAZARUS',
      text: 'El grupo Lazarus utilizo el malware RedLine Stealer para infectar servidores estatales usando la vulnerabilidad CVE-2021-44228 y contactar 10.0.0.15.'
    },
    {
      name: 'Sandworm Advisory',
      id: 'RPT-2026-SANDWORM',
      text: 'Группировка Sandworm распространяет троян AgentTesla через вредоносный домен evil-update.ru и IP адрес 185.220.101.5.'
    }
  ];

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getEntitiesByType('ALL'), api.getCampaigns()])
      .then(([entData, campData]) => {
        setEntities(entData || []);
        setCampaigns(campData || []);
        setLoading(false);
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
    setStatusMessage(`Processing XLM-RoBERTa pipeline on ${sample.name}...`);
    api.ingestReport(sample.text, sample.id)
      .then(() => {
        setStatusMessage(`Successfully ingested ${sample.name}!`);
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

  const totalEntities = entities.length || 1;
  const typePercentages = [
    { type: 'Threat Actor', key: 'THREAT_ACTOR', color: '#f59e0b', count: typeCounts['THREAT_ACTOR'] || 0 },
    { type: 'Malware', key: 'MALWARE', color: '#ef4444', count: typeCounts['MALWARE'] || 0 },
    { type: 'CVE', key: 'CVE', color: '#a855f7', count: typeCounts['CVE'] || 0 },
    { type: 'IP Address', key: 'IP', color: '#10b981', count: typeCounts['IP'] || 0 },
    { type: 'Domain', key: 'DOMAIN', color: '#0284c7', count: typeCounts['DOMAIN'] || 0 },
    { type: 'IOC Hash', key: 'IOC', color: '#6366f1', count: typeCounts['IOC'] || 0 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Executive Header & Quick Actions Banner */}
      <div className="cyber-card" style={{ padding: '24px 28px', background: 'linear-gradient(135deg, #131b2e 0%, #0f172a 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#38bdf8" />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>
              Threat Intelligence Operational Dashboard
            </h2>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
            Real-time cross-lingual CTI correlation, entity extraction metrics, and campaign tracking
          </p>
        </div>

        {/* Preset Sample Advisories Quick Launch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#f59e0b" /> Ingest Presets:
          </span>
          {sampleAdvisories.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleIngestPreset(sample)}
              disabled={presetLoading}
              className="cyber-btn"
              style={{
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #334155',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              + {sample.name}
            </button>
          ))}
          <button
            onClick={loadData}
            className="cyber-btn"
            style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {statusMessage && (
        <div style={{ backgroundColor: 'rgba(2, 132, 199, 0.15)', border: '1px solid #0284c7', padding: '12px 20px', borderRadius: '8px', color: '#38bdf8', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={16} /> {statusMessage}
        </div>
      )}

      {/* Primary KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="cyber-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Ingested Entities</span>
            <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '6px', borderRadius: '8px' }}>
              <Cpu size={18} color="#38bdf8" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#38bdf8' }}>{entities.length}</div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', fontWeight: '600' }}>↑ Active in Knowledge Graph</div>
        </div>

        <div className="cyber-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Threat Actors</span>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '6px', borderRadius: '8px' }}>
              <ShieldAlert size={18} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b' }}>{typeCounts['THREAT_ACTOR'] || 0}</div>
          <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px', fontWeight: '600' }}>Tracked APT Groups</div>
        </div>

        <div className="cyber-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Malware Families</span>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '6px', borderRadius: '8px' }}>
              <Flame size={18} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#ef4444' }}>{typeCounts['MALWARE'] || 0}</div>
          <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: '600' }}>Active Strains</div>
        </div>

        <div className="cyber-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Critical CVEs</span>
            <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', padding: '6px', borderRadius: '8px' }}>
              <Bug size={18} color="#a855f7" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#a855f7' }}>{typeCounts['CVE'] || 0}</div>
          <div style={{ fontSize: '11px', color: '#a855f7', marginTop: '4px', fontWeight: '600' }}>Exploited Vulnerabilities</div>
        </div>

        <div className="cyber-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Correlated Campaigns</span>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '6px', borderRadius: '8px' }}>
              <Globe size={18} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#10b981' }}>{campaigns.length}</div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', fontWeight: '600' }}>Multi-lingual Clusters</div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Entity Category Analytics Bar Chart */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Layers size={20} color="#38bdf8" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
              Entity Type Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {typePercentages.map((item, idx) => {
              const pct = Math.round((item.count / totalEntities) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1', fontWeight: '500' }}>{item.type}</span>
                    <span style={{ color: item.color, fontWeight: '700' }}>{item.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#090d16', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.max(pct, 4)}%`,
                        backgroundColor: item.color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Lingual Intelligence Corpus Status */}
        <div className="cyber-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Globe size={20} color="#a855f7" />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
                Multilingual NLP Engine & Languages
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
              CyberGraph-X processes raw advisories across 5 language models and code-mixed syntax using fine-tuned <strong>XLM-RoBERTa</strong> token classification.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: '#090d16', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>English (EN)</span>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>Supported</div>
              </div>
              <div style={{ backgroundColor: '#090d16', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Spanish (ES)</span>
                <div style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>Supported</div>
              </div>
              <div style={{ backgroundColor: '#090d16', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Russian (RU)</span>
                <div style={{ color: '#ef4444', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>Supported</div>
              </div>
              <div style={{ backgroundColor: '#090d16', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Hindi-English Code-Mix</span>
                <div style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>Supported</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('explorer')}
            className="cyber-btn"
            style={{
              marginTop: '20px',
              backgroundColor: '#a855f7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Launch Interactive Graph Explorer <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid: Extracted Entity Chips & Correlated Campaigns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* Extracted Security Entities Grid */}
        <div className="cyber-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#f8fafc' }}>Knowledge Base Entities</h3>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{entities.length} items</span>
          </div>
          
          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>Loading graph entities...</p>
          ) : entities.length === 0 ? (
            <div style={{ backgroundColor: '#090d16', padding: '24px', borderRadius: '8px', border: '1px dashed #334155', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No entities ingested yet. Click an Ingest Preset button above to populate the knowledge graph.
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignContent: 'flex-start', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
              {entities.map((item, idx) => (
                <EntityBadge
                  key={idx}
                  type={item.type}
                  text={item.label || item.name || item.id}
                  onClick={() => onNavigate && onNavigate('explorer')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Correlated Campaigns Cards */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="#10b981" />
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#f8fafc' }}>Correlated Campaigns</h3>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{campaigns.length} clusters</span>
          </div>

          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>Clustering multi-lingual advisories...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {campaigns.map((camp, idx) => (
                <div key={idx} style={{ backgroundColor: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#38bdf8', fontSize: '14px' }}>{camp.campaign_name}</span>
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '2px 8px', borderRadius: '12px' }}>
                      Correlated
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                    Threat Actor: <strong style={{ color: '#f59e0b' }}>{camp.threat_actor}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Shared Malware: <span style={{ color: '#ef4444', fontWeight: '600' }}>{camp.shared_malware.join(', ')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #1e293b' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Advisories: {camp.correlated_reports.length}
                    </span>
                    <button
                      onClick={() => onNavigate && onNavigate('explorer')}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Graph View <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
