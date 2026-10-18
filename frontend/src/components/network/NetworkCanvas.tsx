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
    <div className="relative w-full h-full min-h-[500px] bg-[#071018] rounded-xl overflow-hidden border border-[#38D9E6]/25 network-canvas select-none shadow-2xl">
      {/* Terrain contour illustration background */}
      <ContourBackground />

      {/* Floating telemetry status tag */}
      <div className="absolute top-3 left-4 z-10 px-3 py-1 rounded-md bg-[#0D1B26]/85 backdrop-blur-md border border-[#38D9E6]/30 text-[11px] font-mono text-[#8EA5B4] pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#38D9E6] animate-pulse" />
        <span>EPANET Digital Twin • 42 Junctions</span>
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
        fitViewOptions={{ padding: 0.28 }}
        minZoom={0.35}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          className="!bg-[#0D1B26] !border-[#38D9E6]/30 !rounded-lg !overflow-hidden [&>button]:!bg-[#0D1B26] [&>button]:!border-[#38D9E6]/20 [&>button]:!text-[#38D9E6] [&>button:hover]:!bg-[#132535]"
          showInteractive={false}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1.5}
          color="rgba(56, 217, 230, 0.12)"
        />
      </ReactFlow>
    </div>
  );
};
