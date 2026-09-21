import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ activeTab, setActiveTab, children, healthStatus }) {
  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content Workspace Column */}
      <div className="main-column">
        {/* Top Header */}
        <Header 
          activeTab={activeTab} 
          healthStatus={healthStatus} 
          onIngestClick={() => setActiveTab('ingest')} 
        />

        {/* Content Area */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>

        {/* Footer Bar */}
        <footer style={{ backgroundColor: 'var(--opencti-header)', borderTop: '1px solid var(--opencti-border)', padding: '10px 24px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', justify: 'space-between', alignItems: 'center' }}>
          <div>CYBERGRAPH-X CTIP PLATFORM — STRICT PARAMETERIZED CYPHER ENGINE</div>
          <div>
            SWAGGER API DOCS:{' '}
            <a 
              href="http://localhost:8000/docs" 
              target="_blank" 
              rel="noreferrer" 
              style={{ color: '#38bdf8', textDecoration: 'none' }}
            >
              http://localhost:8000/docs
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
