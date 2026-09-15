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

  useEffect(() => {
    api.getHealth()
      .then((data) => setHealthStatus({ loading: false, data, error: null }))
      .catch((err) => setHealthStatus({ loading: false, data: null, error: err.message }));
  }, []);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} healthStatus={healthStatus}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'explorer' && <GraphExplorer />}
      {activeTab === 'search' && <ReportSearch />}
      {activeTab === 'ingest' && <IngestForm onIngestSuccess={() => {}} />}
    </Layout>
  );
}
