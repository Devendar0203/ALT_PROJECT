import React from 'react';

const TYPE_COLORS = {
  THREAT_ACTOR: { bg: '#451a03', border: '#f59e0b', text: '#fef3c7' },
  MALWARE: { bg: '#450a0a', border: '#ef4444', text: '#fee2e2' },
  CVE: { bg: '#3b0764', border: '#a855f7', text: '#f3e8ff' },
  IP: { bg: '#064e3b', border: '#10b981', text: '#d1fae5' },
  DOMAIN: { bg: '#0c4a6e', border: '#0284c7', text: '#e0f2fe' },
  IOC: { bg: '#312e81', border: '#6366f1', text: '#e0e7ff' },
  DEFAULT: { bg: '#1e293b', border: '#64748b', text: '#f1f5f9' }
};

export default function EntityBadge({ type, text, confidence }) {
  const style = TYPE_COLORS[type] || TYPE_COLORS.DEFAULT;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: style.bg,
      border: `1px solid ${style.border}`,
      color: style.text,
      margin: '2px 4px'
    }}>
      <span>{text}</span>
      <span style={{ opacity: 0.6, fontSize: '10px' }}>({type})</span>
      {confidence && (
        <span style={{ opacity: 0.5, fontSize: '9px' }}>
          {Math.round(confidence * 100)}%
        </span>
      )}
    </span>
  );
}
