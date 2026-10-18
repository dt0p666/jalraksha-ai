import React from 'react';
import { Play, Pause, StepForward, RotateCcw, AlertTriangle, Target, Eye } from 'lucide-react';
import { useApp } from '../../state/appStore';

export const TimelineBar: React.FC = () => {
  const {
    simState,
    isPlaying,
    togglePlay,
    stepForward,
    advanceSimulation,
    openConfirmModal,
    resetSimulation,
  } = useApp();

  const currentStep = simState?.current_step || 0;
  const totalSteps = simState?.total_steps || 60;
  const timelineEvents = simState?.timeline_events || [];

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetStep = parseInt(e.target.value, 10);
    const diff = targetStep - currentStep;
    if (diff > 0) {
      advanceSimulation(diff);
    }
  };

  const handleReset = () => {
    openConfirmModal({
      title: 'Reset Timeline?',
      message: 'This will reset the simulation back to step 0 and clear sensor logs.',
      confirmLabel: 'Reset to step 0',
      isDestructive: true,
      onConfirm: resetSimulation,
    });
  };

  return (
    <div
      data-tour="timeline-controls"
      className="p-3 bg-[#071018] border border-[#38D9E6]/25 rounded-xl text-[#EAF4F7] shadow-xl flex flex-col gap-2 timeline-controls"
    >
      {/* Upper bar: Playback controls, step counter, and status */}
      <div className="flex items-center justify-between gap-4">
        {/* Playback Button Group */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={togglePlay}
            className={`p-2 rounded-lg font-semibold text-xs border transition-colors flex items-center gap-1.5 shadow-sm ${
              isPlaying
                ? 'bg-[#FFB547] text-[#071018] border-[#FFB547]'
                : 'bg-[#38D9E6] hover:bg-[#38D9E6]/90 text-[#071018] border-[#38D9E6]'
            }`}
            aria-label={isPlaying ? 'Pause simulation timeline' : 'Play simulation timeline'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={stepForward}
            className="p-2 rounded-lg bg-[#0D1B26] hover:bg-[#132535] text-[#38D9E6] border border-[#38D9E6]/30 transition-colors flex items-center gap-1 text-xs"
            aria-label="Step forward one timeline step"
            title="Step Forward (+1)"
          >
            <StepForward size={15} />
            <span className="hidden sm:inline">Step</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-[#0D1B26] hover:bg-[#FF5E66]/20 text-[#8EA5B4] hover:text-[#FF5E66] border border-[#38D9E6]/30 transition-colors text-xs"
            aria-label="Reset timeline to step 0"
            title="Reset timeline"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Step Counter Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1 text-xs font-mono">
            <span className="text-[#8EA5B4]">Step</span>
            <span className="text-base font-bold text-[#38D9E6]">{currentStep}</span>
            <span className="text-[#8EA5B4]">of {totalSteps}</span>
          </div>

          <span
            className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              simState?.status === 'INCIDENT'
                ? 'bg-[#FF5E66]/20 text-[#FF5E66] border border-[#FF5E66]/40'
                : 'bg-[#64F4C4]/20 text-[#64F4C4] border border-[#64F4C4]/40'
            }`}
          >
            {simState?.status || 'NORMAL'}
          </span>
        </div>
      </div>

      {/* Scrub Slider Bar with Event Markers */}
      <div className="relative flex flex-col gap-1 pt-1">
        <input
          type="range"
          min="0"
          max={totalSteps}
          value={currentStep}
          onChange={handleScrub}
          className="w-full h-1.5 bg-[#0D1B26] rounded-lg appearance-none cursor-pointer accent-[#38D9E6] focus:outline-none"
        />

        {/* Event Marker Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full text-[11px] text-[#8EA5B4]">
          <span className="text-[10px] uppercase font-mono text-[#8EA5B4]/60 shrink-0">Events:</span>
          {timelineEvents.map((evt, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0D1B26] border border-[#38D9E6]/25 text-[10px] whitespace-nowrap shrink-0"
              title={evt.description}
            >
              {evt.type.includes('ALERT') ? (
                <AlertTriangle size={11} className="text-[#FF5E66]" />
              ) : evt.type.includes('SAMPLE') ? (
                <Target size={11} className="text-[#64F4C4]" />
              ) : evt.type.includes('REVEAL') ? (
                <Eye size={11} className="text-[#38D9E6]" />
              ) : null}
              <span className="font-mono text-[#38D9E6]">T+{evt.step}</span>
              <span className="text-[#EAF4F7] max-w-[140px] truncate">{evt.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
