import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ activeTab, setActiveTab, children, healthStatus }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex font-sans antialiased">
      {/* Left Collapsible Vertical Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top OpenCTI Header */}
        <Header 
          activeTab={activeTab} 
          onIngestClick={() => setActiveTab('ingest')} 
        />

        {/* Full-bleed Content Workspace */}
        <main className="flex-1 overflow-x-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
