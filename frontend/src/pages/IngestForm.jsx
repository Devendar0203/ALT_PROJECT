import React, { useState } from 'react';
import { api } from '../api/client';
import EntityBadge from '../components/EntityBadge';
import { PlusCircle, Cpu, CheckCircle2, ArrowRight, Share2 } from 'lucide-react';

export default function IngestForm({ onIngestSuccess }) {
  const [text, setText] = useState(
    'Threat actor APT28 deployed Cobalt Strike to compromise financial sector systems by exploiting CVE-2023-38831. Command and control communications were established via IP address 192.168.1.50 and malicious domain darknet-malware.com.'
  );
  const [customId, setCustomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);

    api.ingestReport(text, customId || null)
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '20px' }}>
      {/* Form Input Side */}
      <div className="panel-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <PlusCircle color="#0284c7" size={24} />
          <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>Ingest Cyber Threat Report</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Report ID (Optional)
            </label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="e.g. RPT-2026-009"
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--opencti-border)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Multilingual CTI Advisory Text
            </label>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw threat report in English, Spanish, Russian, Chinese, or Hinglish..."
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--opencti-border)',
                borderRadius: '6px',
                padding: '12px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                lineHeight: '1.5',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cta-btn cta-btn-primary"
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              justifyContent: 'center'
            }}
          >
            {loading ? (
              'Processing XLM-RoBERTa Pipeline...'
            ) : (
              <>
                <Cpu size={18} /> Run Pipeline & Update Graph
              </>
            )}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px', color: '#dc2626', fontSize: '14px' }}>
            Ingestion error: {error}
          </div>
        )}
      </div>

      {/* Real-Time Extraction Results Side */}
      {result && (
        <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--opencti-border)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
              <CheckCircle2 size={22} />
              <h3 style={{ margin: 0, fontSize: '18px', color: '#16a34a' }}>Live Extraction Results</h3>
            </div>
            {onIngestSuccess && (
              <button
                type="button"
                onClick={() => onIngestSuccess(result)}
                className="cta-btn cta-btn-primary"
                style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Share2 size={14} /> Explore in Graph &rarr;
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
            <span style={{ backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--opencti-border)', color: '#0284c7' }}>
              Report ID: <strong>{result.report_id}</strong>
            </span>
            <span style={{ backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--opencti-border)', color: '#9333ea' }}>
              Language: <strong>{result.primary_language.toUpperCase()}</strong> {result.is_code_mixed ? '(Code-Mixed)' : ''}
            </span>
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Extracted Entities ({result.entity_count})</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {result.entities.map((e, idx) => (
                <EntityBadge key={idx} type={e.type} text={e.entity} confidence={e.confidence} />
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Extracted Relation Triples ({result.relation_count})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.relations.map((r, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--opencti-border)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#d97706', fontWeight: 'bold' }}>{r.source}</span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                  <span style={{ color: '#0284c7', fontSize: '11px', textTransform: 'uppercase', backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', padding: '2px 6px', borderRadius: '4px' }}>{r.relation}</span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                  <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{r.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
