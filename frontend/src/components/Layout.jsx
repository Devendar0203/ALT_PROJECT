import React from 'react';
import { ShieldAlert, LayoutDashboard, Network, Search, PlusCircle, Database } from 'lucide-react';

export default function Layout({ activeTab, setActiveTab, children, healthStatus }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'Graph Explorer', icon: Network },
    { id: 'search', label: 'Report Search', icon: Search },
    { id: 'ingest', label: 'Ingest Report', icon: PlusCircle }
  ];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={32} color="#38bdf8" />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#38bdf8' }}>CyberGraph-X</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Multilingual CTI Framework & Knowledge Graph</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '8px', backgroundColor: '#1e293b', padding: '6px', borderRadius: '10px', border: '1px solid #334155' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isActive ? '#0284c7' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#1e293b', borderRadius: '20px', border: '1px solid #334155' }}>
          <Database size={14} color="#38bdf8" />
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
            Neo4j Aura: {healthStatus?.data ? 'Connected' : 'Active'}
          </span>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
