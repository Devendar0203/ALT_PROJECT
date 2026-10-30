import React from 'react';
import { ShieldAlert, Flame, Bug, Globe, Network, Key, Tag } from 'lucide-react';

const TYPE_CONFIG = {
  THREAT_ACTOR: { bg: '#fef3c7', border: '#fde68a', text: '#b45309', icon: ShieldAlert },
  MALWARE: { bg: '#fee2e2', border: '#fca5a5', text: '#b91c1c', icon: Flame },
  CVE: { bg: '#f3e8ff', border: '#d8b4fe', text: '#6b21a8', icon: Bug },
  IP: { bg: '#d1fae5', border: '#6ee7b7', text: '#047857', icon: Globe },
  DOMAIN: { bg: '#e0f2fe', border: '#7dd3fc', text: '#0369a1', icon: Network },
  IOC: { bg: '#e0e7ff', border: '#a5b4fc', text: '#4338ca', icon: Key },
  DEFAULT: { bg: '#f1f5f9', border: '#cbd5e1', text: '#334155', icon: Tag }
};

export default function EntityBadge({ type, text, confidence, onClick }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.DEFAULT;
  const Icon = config.icon;

  return (
    <span
      onClick={onClick}
      className="cyber-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        margin: '3px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}
    >
      <Icon size={14} style={{ color: config.text }} />
      <span>{text}</span>
      <span style={{ opacity: 0.7, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {type}
      </span>
      {confidence && (
        <span style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', padding: '1px 5px', borderRadius: '4px', fontSize: '10px' }}>
          {Math.round(confidence * 100)}%
        </span>
      )}
    </span>
  );
}
