import React, { useState } from 'react';
import { api } from '../api/client';
import EntityBadge from '../components/EntityBadge';
import { PlusCircle, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

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
        if (onIngestSuccess) onIngestSuccess(data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '20px' }}>
      {/* Form Input Side */}
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <PlusCircle color="#38bdf8" size={24} />
          <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>Ingest Cyber Threat Report</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
              Report ID (Optional)
            </label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="e.g. RPT-2026-009"
              style={{
                width: '100%',
                backgroundColor: '#090d16',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#f8fafc',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
              Multilingual CTI Advisory Text
            </label>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw threat report in English, Spanish, Russian, Chinese, or Hinglish..."
              style={{
                width: '100%',
                backgroundColor: '#090d16',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '12px',
                color: '#f8fafc',
                fontSize: '14px',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
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
          <div style={{ marginTop: '16px', backgroundColor: '#450a0a', border: '1px solid #991b1b', padding: '12px', borderRadius: '6px', color: '#fca5a5', fontSize: '14px' }}>
            Ingestion error: {error}
          </div>
        )}
      </div>

      {/* Real-Time Extraction Results Side */}
      {result && (
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
            <CheckCircle2 size={22} />
            <h3 style={{ margin: 0, fontSize: '18px', color: '#22c55e' }}>Live Extraction Results</h3>
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
            <span style={{ backgroundColor: '#090d16', padding: '6px 12px', borderRadius: '6px', border: '1px solid #334155', color: '#38bdf8' }}>
              Report ID: <strong>{result.report_id}</strong>
            </span>
            <span style={{ backgroundColor: '#090d16', padding: '6px 12px', borderRadius: '6px', border: '1px solid #334155', color: '#a855f7' }}>
              Language: <strong>{result.primary_language.toUpperCase()}</strong> {result.is_code_mixed ? '(Code-Mixed)' : ''}
            </span>
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#cbd5e1' }}>Extracted Entities ({result.entity_count})</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {result.entities.map((e, idx) => (
                <EntityBadge key={idx} type={e.type} text={e.entity} confidence={e.confidence} />
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#cbd5e1' }}>Extracted Relation Triples ({result.relation_count})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.relations.map((r, idx) => (
                <div key={idx} style={{ backgroundColor: '#090d16', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{r.source}</span>
                  <ArrowRight size={14} color="#94a3b8" />
                  <span style={{ color: '#38bdf8', fontSize: '11px', textTransform: 'uppercase', backgroundColor: '#0c4a6e', padding: '2px 6px', borderRadius: '4px' }}>{r.relation}</span>
                  <ArrowRight size={14} color="#94a3b8" />
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{r.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
