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
      <div className="panel-card">
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Threat Intelligence Search</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>Search across ingested CTI advisories, threat actors, malware families, and indicators</p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, threat actors (e.g. Lazarus, APT28), malware, CVEs..."
            style={{
              flex: 1,
              backgroundColor: '#f8fafc',
              border: '1px solid var(--opencti-border)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="cta-btn cta-btn-primary"
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Search Intel
          </button>
        </form>
      </div>

      {/* Results Container */}
      {loading ? (
        <div className="panel-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Searching CTI graph database...
        </div>
      ) : results ? (
        <div className="panel-card">
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', fontWeight: '500' }}>
            Search Results for "<strong style={{ color: '#0284c7' }}>{results.query}</strong>" — {results.total_matches} matched nodes
          </div>

          {results.total_matches === 0 ? (
            /* Styled Empty State */
            <div style={{ backgroundColor: '#f8fafc', padding: '32px', borderRadius: '8px', border: '1px dashed var(--opencti-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={36} color="#94a3b8" />
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>No matches found</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                No matching CTI entities found for "{results.query}". Try a different term like "APT28", "Cobalt Strike", "Lazarus", or ingest a report mentioning this entity.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {results.results.map((res, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--opencti-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="#0284c7" />
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{res.label || res.id}</span>
                  </div>
                  <div>
                    <EntityBadge type={res.type} text={res.label || res.id} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
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
