import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import GraphCanvas from '../components/GraphCanvas';
import EntityBadge from '../components/EntityBadge';
import { Network, Search, Info } from 'lucide-react';

export default function GraphExplorer() {
  const [searchTerm, setSearchTerm] = useState('Cobalt Strike');
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGraph = (targetId) => {
    if (!targetId) return;
    setLoading(true);
    api.getEntityGraph(targetId)
      .then((data) => {
        setGraphData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Graph fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGraph(searchTerm);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGraph(searchTerm);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header controls */}
      <div style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network color="#a855f7" size={24} />
          <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>Knowledge Graph Explorer</h2>
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', minWidth: '300px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search entity (e.g. Cobalt Strike, APT28, CVE-2023-38831)..."
            style={{
              flex: 1,
              backgroundColor: '#090d16',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '8px 12px',
              color: '#f8fafc',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#a855f7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Search size={16} /> Explore
          </button>
        </form>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '3fr 1fr' : '1fr', gap: '20px' }}>
        {/* Canvas */}
        <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
          {loading ? (
            <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Querying Neo4j Aura topology...
            </div>
          ) : (
            <GraphCanvas
              graphData={graphData}
              onNodeClick={(node) => setSelectedNode(node)}
            />
          )}
        </div>

        {/* Node Inspector Side Panel */}
        {selectedNode && (
          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={18} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>Entity Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Canonical Name</span>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8', marginTop: '4px' }}>
                {selectedNode.label}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Type Label</span>
              <div style={{ marginTop: '4px' }}>
                <EntityBadge type={selectedNode.type} text={selectedNode.label} />
              </div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Connected Edges</span>
              <div style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '4px' }}>
                {(graphData.edges || []).filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length} graph relationships
              </div>
            </div>

            <button
              onClick={() => fetchGraph(selectedNode.label)}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: 'auto'
              }}
            >
              Expand Subgraph Here
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
