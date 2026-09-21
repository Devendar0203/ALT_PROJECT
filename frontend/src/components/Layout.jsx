import React from 'react';
import { ShieldAlert, LayoutDashboard, Network, Search, PlusCircle, Database, Cpu, Activity, ExternalLink } from 'lucide-react';

export default function Layout({ activeTab, setActiveTab, children, healthStatus }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'Graph Explorer', icon: Network },
    { id: 'search', label: 'Report Search', icon: Search },
    { id: 'ingest', label: 'Ingest Studio', icon: PlusCircle }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner & Navigation Header */}
      <header style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', sticky: 'top', zIndex: 50 }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ backgroundColor: '#0c4a6e', padding: '10px', borderRadius: '10px', border: '1px solid #0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={28} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.5px' }}>
                  CyberGraph<span style={{ color: '#38bdf8' }}>-X</span>
                </h1>
                <span style={{ backgroundColor: '#1e293b', color: '#38bdf8', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', border: '1px solid #334155' }}>
                  v1.0 Enterprise
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                Multilingual Cyber Threat Intelligence Framework & Knowledge Graph
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', gap: '6px', backgroundColor: '#131b2e', padding: '5px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="cyber-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: isActive ? '#0284c7' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none'
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Live System Telemetry Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#131b2e', borderRadius: '20px', border: '1px solid #1e293b', fontSize: '12px' }}>
              <div className="animate-pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: healthStatus?.data ? '#10b981' : '#ef4444' }} />
              <span style={{ color: '#cbd5e1', fontWeight: '500' }}>
                Backend API: {healthStatus?.loading ? 'Checking...' : healthStatus?.data ? 'Online' : 'Offline'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#131b2e', borderRadius: '20px', border: '1px solid #1e293b', fontSize: '12px', color: '#c084fc' }}>
              <Database size={14} color="#a855f7" />
              <span>Neo4j Aura</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#131b2e', borderRadius: '20px', border: '1px solid #1e293b', fontSize: '12px', color: '#38bdf8' }}>
              <Cpu size={14} color="#38bdf8" />
              <span>XLM-RoBERTa</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '28px 24px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', padding: '16px 24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>CyberGraph-X Enterprise Security Framework — Powered by XLM-RoBERTa & Neo4j Aura Graph Database</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Swagger API Docs <ExternalLink size={12} />
            </a>
            <span>•</span>
            <span style={{ color: '#94a3b8' }}>Strict Parameterized Cypher Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
