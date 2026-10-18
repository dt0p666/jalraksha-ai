import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useApp } from '../../state/appStore';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { ContourBackground } from './ContourBackground';

const nodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

export const NetworkCanvas: React.FC = () => {
  const {
    network,
    simState,
    investigation,
    recommendedNode,
    collectedSamples,
    revealResult,
    teacherView,
    inspectedNodeId,
    setInspectedNodeId,
  } = useApp();

  // Map network nodes to React Flow Node structure
  const nodes: Node[] = useMemo(() => {
    if (!network?.nodes) return [];

    const latestReadingsMap = new Map(
      simState?.sensor_readings.map(r => [r.node_id, r]) || []
    );

    const candidatesMap = new Map(
      investigation?.top_candidates.map(c => [c.node_id, c]) || []
    );

    const trueSpreadSet = new Set(revealResult?.true_spread_nodes || []);

    return network.nodes.map(n => {
      const candidateInfo = candidatesMap.get(n.id);
      const reading = latestReadingsMap.get(n.id);
      const isSampled = Boolean(collectedSamples[n.id]);
      const sampleVal = collectedSamples[n.id]?.reading;

      return {
        id: n.id,
        type: 'customNode',
        position: { x: n.x, y: n.y },
        data: {
          model: n,
          isSelected: inspectedNodeId === n.id,
          sensorReading: reading,
          isCandidate: Boolean(candidateInfo),
          candidateProbability: candidateInfo?.probability,
          candidateRank: candidateInfo?.rank,
          isRecommendedSample: recommendedNode === n.id,
          isSampled,
          sampleValue: sampleVal,
          isTrueSource: revealResult?.true_source === n.id,
          isContaminatedInTeacherView: teacherView && trueSpreadSet.has(n.id),
          isRevealed: Boolean(revealResult),
        },
      };
    });
  }, [
    network,
    simState,
    investigation,
    recommendedNode,
    collectedSamples,
    revealResult,
    teacherView,
    inspectedNodeId,
  ]);

  // Map network edges to React Flow Edge structure
  const edges: Edge[] = useMemo(() => {
    if (!network?.edges) return [];

    return network.edges.map(e => ({
      id: e.id,
      source: e.from,
      target: e.to,
      type: 'customEdge',
      data: {
        model: e,
      },
    }));
  }, [network]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setInspectedNodeId(node.id);
    },
    [setInspectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setInspectedNodeId(null);
  }, [setInspectedNodeId]);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#0D1630] rounded-xl overflow-hidden border border-[#425B9A]/30 network-canvas select-none">
      {/* Terrain contour illustration background */}
      <ContourBackground />

      {/* Floating educational safety disclaimer tag */}
      <div className="absolute top-3 left-4 z-10 px-2.5 py-1 rounded bg-[#141E3D]/80 backdrop-blur-sm border border-[#425B9A]/40 text-[11px] font-mono text-[#9FB0C9] pointer-events-none">
        Simulation, not for real safety decisions
      </div>

      {/* React Flow Graph Layer */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.4}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          className="!bg-[#141E3D] !border-[#425B9A]/40 !rounded-lg !overflow-hidden [&>button]:!bg-[#141E3D] [&>button]:!border-[#425B9A]/30 [&>button]:!text-[#76C0EC] [&>button:hover]:!bg-[#1D2A52]"
          showInteractive={false}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1.5}
          color="rgba(66, 91, 154, 0.25)"
        />
      </ReactFlow>
    </div>
  );
};
