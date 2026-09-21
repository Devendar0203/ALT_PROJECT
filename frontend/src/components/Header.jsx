import React from 'react';
import { Search, Database, Cpu, Sparkles, PlusCircle } from 'lucide-react';

export default function Header({ activeTab, healthStatus, onIngestClick }) {
  const pageTitles = {
    dashboard: 'Threat Intelligence Telemetry',
    explorer: 'Knowledge Graph Explorer',
    search: 'Report Intelligence Search',
    ingest: 'CTI Ingest Studio'
  };

  return (
    <header className="header-container">
      {/* Page Title & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
        <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
          {pageTitles[activeTab] || 'Threat Intelligence Telemetry'}
        </h1>

        <div className="header-search">
          <Search size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px' }} />
          <input
            type="text"
            placeholder="Search threat intelligence, entities, CVEs, IPs..."
            className="header-search-input"
          />
        </div>
      </div>

      {/* Live System Telemetry Status Badges */}
      <div className="header-telemetry">
        {/* API Status */}
        <div className="telemetry-badge">
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: healthStatus?.data ? '#10b981' : '#ef4444' }} />
          <span>API {healthStatus?.loading ? 'Checking' : healthStatus?.data ? 'Online' : 'Offline'}</span>
        </div>

        {/* Neo4j Aura */}
        <div className="telemetry-badge" style={{ color: '#c084fc' }}>
          <Database size={13} color="#a855f7" />
          <span>Neo4j Aura</span>
        </div>

        {/* XLM-RoBERTa */}
        <div className="telemetry-badge" style={{ color: '#38bdf8' }}>
          <Cpu size={13} color="#38bdf8" />
          <span>XLM-RoBERTa</span>
        </div>

        {/* Primary Ingest Button */}
        <button
          onClick={onIngestClick}
          className="cta-btn cta-btn-primary"
          style={{ fontSize: '11px', padding: '5px 12px' }}
        >
          <PlusCircle size={13} />
          <span>+ Ingest</span>
        </button>
      </div>
    </header>
  );
}
