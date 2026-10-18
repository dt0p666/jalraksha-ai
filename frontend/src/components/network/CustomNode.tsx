import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Droplets, Home, Activity, Disc, Target } from 'lucide-react';
import type { NodeModel, SensorReading } from '../../api/types';

interface CustomNodeData {
  model: NodeModel;
  isSelected: boolean;
  sensorReading?: SensorReading;
  isCandidate?: boolean;
  candidateProbability?: number;
  candidateRank?: number;
  isRecommendedSample?: boolean;
  isSampled?: boolean;
  sampleValue?: number;
  isTrueSource?: boolean;
  isContaminatedInTeacherView?: boolean;
  isRevealed?: boolean;
}

export const CustomNode = memo(({ data }: { data: CustomNodeData }) => {
  const {
    model,
    isSelected,
    sensorReading,
    isCandidate,
    candidateProbability,
    candidateRank,
    isRecommendedSample,
    isSampled,
    sampleValue,
    isTrueSource,
    isContaminatedInTeacherView,
    isRevealed,
  } = data;

  const isReservoir = model.type === 'reservoir';
  const isZone = model.type === 'zone';

  // Determine observation state
  const hasReading = Boolean(sensorReading || isSampled);
  const isAlert = Boolean(sensorReading?.is_alert || (sampleValue && sampleValue >= 230.0));

  // Visual styling based on state and node type
  let borderColor = '#6FBEB2';
  let bgColor = '#0F2226';

  if (isReservoir) {
    bgColor = '#34908B';
    borderColor = '#A5E9DD';
  } else if (isZone) {
    bgColor = '#163238';
    borderColor = '#6FBEB2';
  } else if (hasReading) {
    if (isAlert) {
      borderColor = '#FDF4AF';
      bgColor = '#262208'; // solar yellow dark
    } else {
      borderColor = '#A5E9DD';
      bgColor = '#0F2226'; // tech dark cyan panel
    }
  }

  // Candidate overrides
  if (isCandidate && candidateRank === 1) {
    borderColor = '#FDF4AF';
  }

  // Recommended sample beacon
  if (isRecommendedSample) {
    borderColor = '#A5E9DD';
  }

  // Ground truth revelation overrides
  if (isRevealed && isTrueSource) {
    borderColor = '#FF5C5C';
    bgColor = '#3D1414';
  }

  // Teacher view contaminated plume spread
  if (isContaminatedInTeacherView) {
    borderColor = '#FF5C5C';
  }

  // Selected node glow
  const selectedRing = isSelected ? 'ring-2 ring-[#A5E9DD] ring-offset-2 ring-offset-[#081416]' : '';

  return (
    <div
      className={`relative px-2.5 py-1.5 rounded-lg border shadow-lg transition-all ${selectedRing}`}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        minWidth: isReservoir ? '100px' : isZone ? '90px' : '70px',
      }}
    >
      {/* Target input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-1.5 h-1.5 !bg-[#6FBEB2] border-none"
      />

      {/* Recommended Sample Pulsing Beacon */}
      {isRecommendedSample && (
        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FDF4AF] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FDF4AF] items-center justify-center text-[8px] font-bold text-[#081416]">
            ★
          </span>
        </span>
      )}

      {/* Node Content */}
      <div className="flex items-center gap-1.5">
        {/* Node Icon */}
        <span className="text-white/80">
          {isReservoir ? (
            <Droplets size={13} className="text-[#A5E9DD]" />
          ) : isZone ? (
            <Home size={13} className="text-[#FDF4AF]" />
          ) : isCandidate ? (
            <Target size={12} className="text-[#FDF4AF]" />
          ) : model.has_sensor ? (
            <Activity size={12} className={isAlert ? 'text-[#FDF4AF]' : 'text-[#A5E9DD]'} />
          ) : (
            <Disc size={11} className="text-[#6FBEB2]" />
          )}
        </span>

        {/* Node ID & Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-mono font-bold text-xs text-[#EAF7F5]">
              {model.id}
            </span>
            {isCandidate && candidateProbability !== undefined && (
              <span className="font-mono text-[9px] px-1 rounded bg-[#34908B] text-[#FDF4AF]">
                {(candidateProbability * 100).toFixed(0)}%
              </span>
            )}
          </div>

          {/* Node secondary label */}
          <span className="text-[9px] text-[#A5E9DD] leading-none truncate max-w-[85px]">
            {isReservoir ? model.label : isZone ? model.label : `${model.elevation_m}m`}
          </span>
        </div>
      </div>

      {/* Bottom telemetry or sample readout */}
      {hasReading && (
        <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between text-[9px] font-mono">
          <span className="text-[#6FBEB2]">
            {isSampled ? 'Sample' : 'Sensor'}:
          </span>
          <span
            className={`font-semibold ${
              isAlert ? 'text-[#FDF4AF] font-bold' : 'text-[#A5E9DD]'
            }`}
          >
            {(sampleValue || sensorReading?.value || 0).toFixed(0)}
          </span>
        </div>
      )}

      {/* Source output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-1.5 h-1.5 !bg-[#6FBEB2] border-none"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
