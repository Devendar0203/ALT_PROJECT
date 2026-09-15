import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Network, Search, PlusCircle, CheckCircle, Database } from 'lucide-react';

export default function App() {
  const [healthStatus, setHealthStatus] = useState({ loading: true, data: null, error: null });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetch(`${apiBaseUrl}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setHealthStatus({ loading: false, data, error: null }))
      .catch((err) => setHealthStatus({ loading: false, data: null, error: err.message }));
  }, [apiBaseUrl]);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={32} color="#38bdf8" />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#38bdf8' }}>CyberGraph-X</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Multilingual Cyber Threat Intelligence Framework</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#1e293b', borderRadius: '20px', border: '1px solid #334155' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: healthStatus.data ? '#22c55e' : '#ef4444' }} />
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
            {healthStatus.loading ? 'Checking backend...' : healthStatus.data ? 'Backend Online' : 'Backend Offline'}
          </span>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Activity color="#38bdf8" size={20} />
            <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>System Status</h2>
          </div>
          {healthStatus.loading ? (
            <p style={{ color: '#94a3b8' }}>Connecting to FastAPI backend...</p>
          ) : healthStatus.error ? (
            <div style={{ backgroundColor: '#450a0a', border: '1px solid #991b1b', padding: '12px', borderRadius: '6px', color: '#fca5a5', fontSize: '14px' }}>
              Failed to reach backend: {healthStatus.error}
            </div>
          ) : (
            <pre style={{ backgroundColor: '#090d16', padding: '12px', borderRadius: '6px', overflowX: 'auto', fontSize: '12px', color: '#a7f3d0' }}>
              {JSON.stringify(healthStatus.data, null, 2)}
            </pre>
          )}
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Network color="#a855f7" size={20} />
            <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>Graph Knowledge Base</h2>
          </div>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            Neo4j Aura database integration configured for cross-lingual threat correlation.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#c084fc', backgroundColor: '#3b0764', padding: '4px 8px', borderRadius: '4px' }}>
            <Database size={14} /> Neo4j Aura Ready
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle color="#22c55e" size={20} />
            <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>Phase 1 Initialized</h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8' }}>
            <li>FastAPI Backend + CORS Middleware</li>
            <li>Vite + React Dashboard Scaffold</li>
            <li>Strict Parameterized Neo4j Aura Driver</li>
            <li>Git Repository & Phase Tracking</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
