import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import EntityBadge from '../components/EntityBadge';
import { Activity, ShieldAlert, Cpu, Globe, Flame, Layers } from 'lucide-react';

export default function Dashboard() {
  const [entities, setEntities] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const typeCounts = entities.reduce((acc, curr) => {
    const t = curr.type || 'OTHER';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Total Ingested Entities</span>
            <Cpu size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#38bdf8' }}>{entities.length}</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Threat Actors</span>
            <ShieldAlert size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{typeCounts['THREAT_ACTOR'] || 0}</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Malware Families</span>
            <Flame size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>{typeCounts['MALWARE'] || 0}</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Correlated Campaigns</span>
            <Globe size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#a855f7' }}>{campaigns.length}</div>
        </div>
      </div>

      {/* Main Content Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Extracted Security Entities Grid */}
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layers size={20} color="#38bdf8" />
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>Knowledge Base Entities</h2>
          </div>
          
          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading graph entities...</p>
          ) : entities.length === 0 ? (
            <div style={{ backgroundColor: '#090d16', padding: '24px', borderRadius: '8px', border: '1px dashed #334155', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No entities ingested yet. Use the <strong>Ingest Report</strong> tab to submit advisories.
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignContent: 'flex-start' }}>
              {entities.map((item, idx) => (
                <EntityBadge key={idx} type={item.type} text={item.label || item.name || item.id} />
              ))}
            </div>
          )}
        </div>

        {/* Correlated Campaigns Cluster */}
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Globe size={20} color="#a855f7" />
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>Cross-Lingual Campaign Clusters</h2>
          </div>

          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Clustering multi-lingual advisories...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {campaigns.map((camp, idx) => (
                <div key={idx} style={{ backgroundColor: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: '6px', fontSize: '15px' }}>{camp.campaign_name}</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Threat Actor: <strong style={{ color: '#f59e0b' }}>{camp.threat_actor}</strong></div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                    Malware: <span style={{ color: '#ef4444' }}>{camp.shared_malware.join(', ')}</span> | Reports: {camp.correlated_reports.length}
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
