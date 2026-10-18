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
          stroke: hovered ? '#08C4E1' : 'rgba(8, 196, 225, 0.3)',
          strokeWidth: hovered ? 3.5 : 2,
          strokeOpacity: 0.8,
          transition: 'all 0.2s',
        }}
      />

      {/* Animated Flow Particles / Dash in pipe direction */}
      <path
        d={edgePath}
        fill="none"
        stroke="#08C4E1"
        strokeWidth={hovered ? 2.5 : 1.2}
        strokeDasharray="4 8"
        className="animate-[flow_2s_linear_infinite]"
        style={{
          strokeLinecap: 'round',
          opacity: 0.9,
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
            className="z-30 px-2 py-1 bg-[#446882] text-[#F8F3EF] border border-[#08C4E1]/60 rounded-md shadow-xl text-[10px] font-mono whitespace-nowrap animate-fadeIn"
          >
            <div className="font-bold text-[#08C4E1]">{edgeModel.id} ({edgeModel.from} → {edgeModel.to})</div>
            <div className="text-[#F8F3EF]">Delay: {edgeModel.delay_steps} steps • Dilution: {edgeModel.dilution}x</div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';
