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

  // Visual styling based on new Mission Control palette
  let borderColor = 'rgba(8, 196, 225, 0.25)';
  let bgColor = '#446882';
  let glowStyle = '';

  if (isReservoir) {
    bgColor = '#446882';
    borderColor = '#08C4E1';
    glowStyle = 'shadow-[0_0_15px_rgba(8,196,225,0.35)]';
  } else if (isZone) {
    bgColor = '#446882';
    borderColor = '#F5E6BB';
  } else if (hasReading) {
    if (isAlert) {
      borderColor = '#F5E6BB';
      bgColor = '#1C3C53';
      glowStyle = 'shadow-[0_0_15px_rgba(245,230,187,0.4)] animate-pulse';
    } else {
      borderColor = '#08C4E1';
      bgColor = '#1C3C53';
      glowStyle = 'shadow-[0_0_8px_rgba(8,196,225,0.25)]';
    }
  }

  // Candidate overrides
  if (isCandidate && candidateRank === 1) {
    borderColor = '#F5E6BB';
    glowStyle = 'shadow-[0_0_15px_rgba(245,230,187,0.45)]';
  }

  // Recommended sample beacon
  if (isRecommendedSample) {
    borderColor = '#F5E6BB';
    glowStyle = 'shadow-[0_0_15px_rgba(245,230,187,0.5)]';
  }

  // Ground truth revelation overrides
  if (isRevealed && isTrueSource) {
    borderColor = '#F5E6BB';
    bgColor = '#446882';
    glowStyle = 'shadow-[0_0_25px_rgba(245,230,187,0.6)]';
  }

  // Teacher view contaminated plume spread
  if (isContaminatedInTeacherView) {
    borderColor = '#F5E6BB';
  }

  // Selected node glow
  const selectedRing = isSelected ? 'ring-2 ring-[#08C4E1] ring-offset-2 ring-offset-[#1C3C53]' : '';

  return (
    <div
      className={`relative px-2.5 py-1.5 rounded-lg border text-[#F8F3EF] transition-all ${glowStyle} ${selectedRing}`}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        minWidth: isReservoir ? '110px' : isZone ? '95px' : '75px',
      }}
    >
      {/* Target input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-1.5 h-1.5 !bg-[#08C4E1] border-none"
      />

      {/* Recommended Sample Pulsing Beacon */}
      {isRecommendedSample && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5E6BB] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#F5E6BB] items-center justify-center text-[9px] font-bold text-[#1C3C53]">
            ★
          </span>
        </span>
      )}

      {/* Node Content */}
      <div className="flex items-center gap-1.5">
        {/* Node Icon */}
        <span className="shrink-0">
          {isReservoir ? (
            <Droplets size={14} className="text-[#08C4E1]" />
          ) : isZone ? (
            <Home size={13} className="text-[#F5E6BB]" />
          ) : isCandidate ? (
            <Target size={12} className="text-[#F5E6BB]" />
          ) : model.has_sensor ? (
            <Activity size={12} className={isAlert ? 'text-[#F5E6BB]' : 'text-[#08C4E1]'} />
          ) : (
            <Disc size={11} className="text-[#F8F3EF]" />
          )}
        </span>

        {/* Node ID & Details */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-mono font-bold text-xs text-[#F8F3EF]">
              {model.id}
            </span>
            {isCandidate && candidateProbability !== undefined && (
              <span className="font-mono text-[9px] px-1 rounded bg-[#F5E6BB]/20 border border-[#F5E6BB]/50 text-[#F5E6BB] font-semibold">
                {(candidateProbability * 100).toFixed(0)}%
              </span>
            )}
          </div>

          {/* Node secondary label */}
          <span className="text-[9px] text-[#F8F3EF] font-mono leading-none truncate max-w-[85px]">
            {isReservoir ? model.label : isZone ? model.label : `${model.elevation_m}m`}
          </span>
        </div>
      </div>

      {/* Bottom telemetry or sample readout */}
      {hasReading && (
        <div className="mt-1 pt-1 border-t border-[#08C4E1]/15 flex items-center justify-between text-[9px] font-mono">
          <span className="text-[#F8F3EF]">
            {isSampled ? 'Sample' : 'Sensor'}:
          </span>
          <span
            className={`font-semibold ${
              isAlert ? 'text-[#F5E6BB] font-bold' : 'text-[#08C4E1]'
            }`}
          >
            {(sampleValue || sensorReading?.value || 0).toFixed(0)} µS
          </span>
        </div>
      )}

      {/* Source output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-1.5 h-1.5 !bg-[#08C4E1] border-none"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
