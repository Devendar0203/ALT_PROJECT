import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GraphExplorer from './pages/GraphExplorer';
import ReportSearch from './pages/ReportSearch';
import IngestForm from './pages/IngestForm';
import { api } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [healthStatus, setHealthStatus] = useState({ loading: true, data: null, error: null });
  const [selectedEntity, setSelectedEntity] = useState('Cobalt Strike');

  useEffect(() => {
    api.getHealth()
      .then((data) => setHealthStatus({ loading: false, data, error: null }))
      .catch((err) => setHealthStatus({ loading: false, data: null, error: err.message }));
  }, []);

  const handleIngestSuccess = (result) => {
    // Find primary entity to explore in graph, e.g. threat actor, malware, or first entity
    const actorOrMalware = result.entities?.find(
      (e) => e.type === 'THREAT_ACTOR' || e.type === 'MALWARE'
    );
    const target = actorOrMalware?.entity || result.entities?.[0]?.entity || result.report_id || 'ALL';
    setSelectedEntity(target);
    setActiveTab('explorer');
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} healthStatus={healthStatus}>
      {activeTab === 'dashboard' && <Dashboard onNavigate={(tab, entity) => { if (entity) setSelectedEntity(entity); setActiveTab(tab); }} />}
      {activeTab === 'explorer' && <GraphExplorer initialSearch={selectedEntity} />}
      {activeTab === 'search' && <ReportSearch />}
      {activeTab === 'ingest' && <IngestForm onIngestSuccess={handleIngestSuccess} />}
    </Layout>
  );
}
