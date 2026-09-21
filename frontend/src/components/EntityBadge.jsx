import React from 'react';
import { ShieldAlert, Flame, Bug, Globe, Network, Key, Tag } from 'lucide-react';

const TYPE_CONFIG = {
  THREAT_ACTOR: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fef3c7', icon: ShieldAlert },
  MALWARE: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#fee2e2', icon: Flame },
  CVE: { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', text: '#f3e8ff', icon: Bug },
  IP: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#d1fae5', icon: Globe },
  DOMAIN: { bg: 'rgba(2, 132, 199, 0.15)', border: '#0284c7', text: '#e0f2fe', icon: Network },
  IOC: { bg: 'rgba(99, 102, 241, 0.15)', border: '#6366f1', text: '#e0e7ff', icon: Key },
  DEFAULT: { bg: 'rgba(100, 116, 139, 0.15)', border: '#64748b', text: '#f1f5f9', icon: Tag }
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
        padding: '5px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        margin: '3px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Icon size={14} style={{ color: config.border }} />
      <span>{text}</span>
      <span style={{ opacity: 0.6, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {type}
      </span>
      {confidence && (
        <span style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1px 5px', borderRadius: '4px', opacity: 0.8, fontSize: '10px' }}>
          {Math.round(confidence * 100)}%
        </span>
      )}
    </span>
  );
}
