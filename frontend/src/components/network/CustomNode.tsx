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
  let borderColor = '#425B9A';
  let bgColor = '#141E3D';

  if (isReservoir) {
    bgColor = '#425B9A';
    borderColor = '#76C0EC';
  } else if (isZone) {
    bgColor = '#597928';
    borderColor = '#91AC67';
  } else if (hasReading) {
    if (isAlert) {
      borderColor = '#E8A33D';
      bgColor = '#2C1F10'; // amber-dark, blue-shifted from brand dark
    } else {
      borderColor = '#76C0EC';
      bgColor = '#152248'; // brand panel dark (matches --panel token)
    }
  } else {
    // Unmeasured junction
    borderColor = '#425B9A';
    bgColor = '#0E1733'; // brand bg dark
  }

  // Teacher View ground truth override
  if (isRevealed && isContaminatedInTeacherView) {
    borderColor = '#D9534F';
    if (!isReservoir && !isZone) bgColor = '#2E1012'; // red-dark, brand-dark shifted
  }

  return (
    <div className="relative group cursor-pointer">
      {/* Invisible Handles for React Flow Edge Routing */}
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />

      {/* True Source Crown / Pulse after Reveal */}
      {isRevealed && isTrueSource && (
        <div className="absolute -inset-3 rounded-full border-2 border-[#D9534F] animate-ping opacity-75 pointer-events-none" />
      )}

      {/* Candidate Probability Pulse Ring */}
      {isCandidate && candidateProbability && candidateProbability > 0.05 && !isRevealed && (
        <div className="absolute -inset-2 rounded-full border border-[#76C0EC] animate-pulse pointer-events-none" />
      )}

      {/* Recommended Sample Highlight Badge */}
      {isRecommendedSample && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#E8A33D] text-[#0D1630] font-mono text-[10px] font-bold shadow-md flex items-center gap-1 z-20 whitespace-nowrap animate-bounce">
          <Target size={11} />
          <span>Test here</span>
        </div>
      )}

      {/* Probability Badge for Ranked Candidates */}
      {isCandidate && candidateProbability !== undefined && (
        <div
          className={`absolute -top-3 -right-3 z-20 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shadow ${
            candidateRank === 1
              ? 'bg-[#76C0EC] text-[#0D1630] ring-1 ring-white'
              : 'bg-[#1D2A52] text-[#76C0EC] border border-[#76C0EC]/50'
          }`}
        >
          {Math.round(candidateProbability * 100)}%
        </div>
      )}

      {/* Main Node Body */}
      <div
        style={{ borderColor, backgroundColor: bgColor }}
        className={`flex items-center justify-center transition-all duration-200 border-2 shadow-md ${
          isReservoir
            ? 'w-12 h-12 rounded-xl text-white'
            : isZone
            ? 'w-10 h-10 rounded-lg text-[#EAF1F8]'
            : 'w-8 h-8 rounded-full text-[#76C0EC]'
        } ${isSelected ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105'}`}
      >
        {isReservoir ? (
          <Droplets size={22} className="text-[#76C0EC]" />
        ) : isZone ? (
          <Home size={18} className="text-white" />
        ) : isSampled ? (
          <Target size={16} className={isAlert ? 'text-[#E8A33D]' : 'text-[#76C0EC]'} />
        ) : model.has_sensor ? (
          <Activity size={16} className={isAlert ? 'text-[#E8A33D]' : 'text-[#76C0EC]'} />
        ) : (
          <Disc size={12} className="text-[#9FB0C9]" />
        )}
      </div>

      {/* Node ID & Label */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 flex flex-col items-center pointer-events-none whitespace-nowrap z-10">
        <span className="font-mono text-[11px] font-semibold text-[#EAF1F8] drop-shadow-sm bg-[#0D1630]/80 px-1 rounded">
          {model.id}
        </span>
        {isZone && model.households && (
          <span className="text-[9px] text-[#91AC67] font-mono">
            {model.households} hh
          </span>
        )}
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
