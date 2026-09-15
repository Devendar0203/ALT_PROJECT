const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'cybergraphx_secret_key_2026';

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
};

export const api = {
  getHealth: async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  ingestReport: async (text, reportId = null) => {
    const res = await fetch(`${API_BASE_URL}/ingest`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, report_id: reportId })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  getEntitiesByType: async (type = 'ALL') => {
    const res = await fetch(`${API_BASE_URL}/entities/${type}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  getEntityGraph: async (entityId) => {
    const res = await fetch(`${API_BASE_URL}/entities/${encodeURIComponent(entityId)}/graph`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  searchIntel: async (query) => {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  getCampaigns: async () => {
    const res = await fetch(`${API_BASE_URL}/campaigns`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
};
