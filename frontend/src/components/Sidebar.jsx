import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Search, 
  PlusCircle, 
  ChevronRight,
  User
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'Graph Explorer', icon: Network },
    { id: 'search', label: 'Report Search', icon: Search },
    { id: 'ingest', label: 'Ingest Studio', icon: PlusCircle }
  ];

  return (
    <aside className="sidebar-container">
      {/* Brand Header */}
      <div>
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <Network size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="sidebar-brand-title">CyberGraph<span style={{ color: '#38bdf8' }}>-X</span></span>
              <span className="sidebar-brand-version">v1.0</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>Enterprise CTI</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div style={{ padding: '4px 8px 8px 8px', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Platform Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color={isActive ? '#ffffff' : 'var(--text-secondary)'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} color="#ffffff" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--opencti-border)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '6px', backgroundColor: 'var(--opencti-card)', border: '1px solid var(--opencti-border)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#1e2842', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <User size={15} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Analyst Console</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>SecOps Workspace</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
