import React, { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const NODE_COLORS = {
  THREAT_ACTOR: '#f59e0b',
  MALWARE: '#ef4444',
  CVE: '#a855f7',
  IP: '#10b981',
  DOMAIN: '#0284c7',
  IOC: '#6366f1',
  Report: '#38bdf8',
  DEFAULT: '#94a3b8'
};

export default function GraphCanvas({ graphData, onNodeClick }) {
  const fgRef = useRef();

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-120);
    }
  }, [graphData]);

  // Transform graph data for ForceGraph2D
  const formattedData = {
    nodes: (graphData?.nodes || []).map((n) => ({
      id: n.id,
      label: n.label || n.id,
      type: n.type || 'DEFAULT',
      color: NODE_COLORS[n.type] || NODE_COLORS.DEFAULT,
      val: n.type === 'THREAT_ACTOR' ? 8 : n.type === 'MALWARE' ? 7 : 5
    })),
    links: (graphData?.edges || []).map((e) => ({
      source: e.source,
      target: e.target,
      label: e.type || 'CONNECTED'
    }))
  };

  return (
    <div style={{ width: '100%', height: '500px', backgroundColor: '#090d16', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
      {formattedData.nodes.length === 0 ? (
        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          Select an entity or submit a report to render graph topology.
        </div>
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={formattedData}
          nodeLabel={(node) => `${node.label} (${node.type})`}
          nodeColor={(node) => node.color}
          nodeRelSize={6}
          linkLabel={(link) => link.label}
          linkColor={() => '#475569'}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          onNodeClick={(node) => onNodeClick && onNodeClick(node)}
          canvasObject={(node, ctx, globalScale) => {
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            
            // Draw node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();

            // Draw text label
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#f8fafc';
            ctx.fillText(label, node.x, node.y + 10);
          }}
        />
      )}
    </div>
  );
}
