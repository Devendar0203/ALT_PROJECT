import React, { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3Force from 'd3-force';

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

  // Transform graph data for ForceGraph2D
  const formattedData = {
    nodes: (graphData?.nodes || []).map((n) => ({
      id: n.id,
      label: n.label || n.id,
      type: n.type || 'DEFAULT',
      color: NODE_COLORS[n.type] || NODE_COLORS.DEFAULT,
      val: n.type === 'THREAT_ACTOR' ? 10 : n.type === 'MALWARE' ? 8 : 6
    })),
    links: (graphData?.edges || []).map((e) => ({
      source: e.source,
      target: e.target,
      label: e.type || 'CONNECTED'
    }))
  };

  useEffect(() => {
    if (fgRef.current) {
      // Increase charge repulsion to spread nodes out
      fgRef.current.d3Force('charge', d3Force.forceManyBody().strength(-450));
      // Add collision radius force to prevent overlapping node circles
      fgRef.current.d3Force('collide', d3Force.forceCollide(32));
      // Auto zoom to fit container after simulation settles
      setTimeout(() => {
        if (fgRef.current) {
          fgRef.current.zoomToFit(400, 40);
        }
      }, 500);
    }
  }, [graphData]);

  return (
    <div style={{ width: '100%', height: '520px', backgroundColor: '#090d16', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
      {formattedData.nodes.length === 0 ? (
        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px' }}>
          Select an entity or submit a report to render graph topology.
        </div>
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={formattedData}
          nodeRelSize={7}
          nodeColor={(node) => node.color}
          linkColor={() => '#475569'}
          linkWidth={1.5}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkDirectionalArrowColor={() => '#94a3b8'}
          onNodeClick={(node) => onNodeClick && onNodeClick(node)}
          // Render Node label text cleanly below circle
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.label;
            const fontSize = Math.max(11 / globalScale, 3);
            const radius = Math.max(7 / globalScale, 2.5);

            // Node Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();
            ctx.lineWidth = 1.5 / globalScale;
            ctx.strokeStyle = '#0f172a';
            ctx.stroke();

            // Node Label Text
            ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            // Background pill for contrast
            const textWidth = ctx.measureText(label).width;
            const pad = 2 / globalScale;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(node.x - textWidth / 2 - pad, node.y + radius + 2, textWidth + pad * 2, fontSize + pad);

            ctx.fillStyle = '#f8fafc';
            ctx.fillText(label, node.x, node.y + radius + 3);
          }}
          nodeCanvasObjectMode={() => 'replace'}
          // Render Link / Relationship type labels
          linkCanvasObject={(link, ctx, globalScale) => {
            if (!link.source.x || !link.target.x) return;
            const label = link.label;
            const fontSize = Math.max(9 / globalScale, 2.5);

            // Calculate midpoint for link label
            const midX = (link.source.x + link.target.x) / 2;
            const midY = (link.source.y + link.target.y) / 2;

            ctx.font = `500 ${fontSize}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textWidth = ctx.measureText(label).width;
            const pad = 2 / globalScale;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(midX - textWidth / 2 - pad, midY - fontSize / 2 - pad, textWidth + pad * 2, fontSize + pad * 2);

            ctx.fillStyle = '#38bdf8';
            ctx.fillText(label, midX, midY);
          }}
          linkCanvasObjectMode={() => 'after'}
        />
      )}
    </div>
  );
}
