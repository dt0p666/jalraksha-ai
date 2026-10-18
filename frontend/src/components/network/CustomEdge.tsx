import { memo, useState } from 'react';
import { getSmoothStepPath, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import type { EdgeModel } from '../../api/types';

export const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) => {
  const [hovered, setHovered] = useState(false);
  const edgeModel = data?.model as EdgeModel | undefined;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
    borderRadius: 8,
  });

  return (
    <>
      {/* Base Pipe Line */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: '#425B9A',
          strokeWidth: hovered ? 4 : 2.5,
          strokeOpacity: 0.7,
          transition: 'all 0.2s',
        }}
      />

      {/* Animated Flow Particles / Dash in pipe direction */}
      <path
        d={edgePath}
        fill="none"
        stroke="#76C0EC"
        strokeWidth={hovered ? 3 : 1.5}
        strokeDasharray="4 8"
        className="animate-[flow_2s_linear_infinite]"
        style={{
          strokeLinecap: 'round',
          opacity: 0.85,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Interactive hover zone */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={14}
        className="cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Edge Hover Tooltip Badge */}
      {hovered && edgeModel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="z-30 px-2 py-1 bg-[#141E3D] text-[#EAF1F8] border border-[#76C0EC]/60 rounded shadow-md text-[10px] font-mono whitespace-nowrap animate-fadeIn"
          >
            <div className="font-bold text-[#76C0EC]">{edgeModel.id} ({edgeModel.from} → {edgeModel.to})</div>
            <div className="text-[#9FB0C9]">Delay: {edgeModel.delay_steps} steps • Dilution: {edgeModel.dilution}x</div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';
