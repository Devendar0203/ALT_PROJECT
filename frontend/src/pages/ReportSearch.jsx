import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import EntityBadge from '../components/EntityBadge';
import { Search, FileText } from 'lucide-react';

export default function ReportSearch() {
  const [query, setQuery] = useState('Lazarus');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query) return;
    setLoading(true);
    api.searchIntel(query)
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#f8fafc' }}>Threat Intelligence Search</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, threat actors, malware, IoCs, CVEs..."
            style={{
              flex: 1,
              backgroundColor: '#090d16',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '10px 16px',
              color: '#f8fafc',
              fontSize: '15px'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Search size={18} /> Search
          </button>
        </form>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Searching CTI graph database...</p>
      ) : results && (
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '16px' }}>
            Found {results.total_matches} matched nodes for query "<strong>{results.query}</strong>"
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {results.results.map((res, idx) => (
              <div key={idx} style={{ backgroundColor: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FileText size={18} color="#38bdf8" />
                  <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{res.label || res.id}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <EntityBadge type={res.type} text={res.label || res.id} />
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Node ID: <code>{res.id}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
