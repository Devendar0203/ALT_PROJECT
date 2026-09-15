import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import EntityBadge from '../components/EntityBadge';
import { Search, FileText, AlertCircle, Loader2 } from 'lucide-react';

export default function ReportSearch() {
  const [query, setQuery] = useState('Lazarus');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search Header Card */}
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#f8fafc' }}>Threat Intelligence Search</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0' }}>Search across ingested CTI advisories, threat actors, malware families, and indicators</p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, threat actors (e.g. Lazarus, APT28), malware, CVEs..."
            style={{
              flex: 1,
              backgroundColor: '#090d16',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#f8fafc',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease'
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Search Intel
          </button>
        </form>
      </div>

      {/* Results Container */}
      {loading ? (
        <div style={{ backgroundColor: '#1e293b', padding: '32px', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center', color: '#94a3b8' }}>
          Searching CTI graph database...
        </div>
      ) : results ? (
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '20px', fontWeight: '500' }}>
            Search Results for "<strong style={{ color: '#38bdf8' }}>{results.query}</strong>" — {results.total_matches} matched nodes
          </div>

          {results.total_matches === 0 ? (
            /* Styled Empty State */
            <div style={{ backgroundColor: '#090d16', padding: '32px', borderRadius: '8px', border: '1px dashed #334155', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={36} color="#64748b" />
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>No matches found</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '400px' }}>
                No matching CTI entities found for "{results.query}". Try a different term like "APT28", "Cobalt Strike", "Lazarus", or ingest a report mentioning this entity.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {results.results.map((res, idx) => (
                <div key={idx} style={{ backgroundColor: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="#38bdf8" />
                    <span style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: '15px' }}>{res.label || res.id}</span>
                  </div>
                  <div>
                    <EntityBadge type={res.type} text={res.label || res.id} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    Node ID: {res.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
