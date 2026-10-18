import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../state/appStore';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  Search,
  FileText,
  Eye,
  Sliders,
  Activity,
  Check,
} from 'lucide-react';

export const JourneyBar: React.FC = () => {
  const {
    simState,
    isPlaying,
    togglePlay,
    stepForward,
    advanceSimulation,
    resetSimulation,
    investigation,
    runInvestigation,
    isInvestigating,
    findBestSample,
    collectedSamples,
    generateReport,
    aiReportLoading,
    revealResult,
    revealSource,
    setStartModalOpen,
    openConfirmModal,
    sensorDrawerOpen,
    toggleSensorDrawer,
    teacherView,
    setTeacherView,
  } = useApp();

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close "More controls" popover on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const currentStepNum = simState?.current_step || 0;
  const isStarted = currentStepNum > 0 || simState?.status !== 'NORMAL';
  const hasAlerts = (simState?.alert_count || 0) > 0;
  const hasInvestigated = Boolean(investigation);
  const sampleCount = Object.keys(collectedSamples).length;
  const isRevealed = Boolean(revealResult);

  // Determine current active journey step (1 to 6)
  let activeStep = 1;
  if (isRevealed) {
    activeStep = 6;
  } else if (hasInvestigated && sampleCount > 0) {
    activeStep = 5;
  } else if (hasInvestigated) {
    activeStep = 4;
  } else if (hasAlerts || currentStepNum >= 4) {
    activeStep = 3;
  } else if (isStarted) {
    activeStep = 2;
  }

  const steps = [
    { num: 1, label: 'Start' },
    { num: 2, label: 'Watch' },
    { num: 3, label: 'Investigate' },
    { num: 4, label: 'Sample' },
    { num: 5, label: 'Report' },
    { num: 6, label: 'Reveal' },
  ];

  // Render primary action button according to current journey step
  const renderPrimaryAction = () => {
    if (!isStarted) {
      return (
        <button
          onClick={() => setStartModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold border border-[#76C0EC]/50 shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Play size={13} fill="currentColor" />
          <span>Start a contamination</span>
        </button>
      );
    }

    if (activeStep === 2) {
      return (
        <button
          onClick={() => advanceSimulation(5)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold border border-[#76C0EC]/50 shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <SkipForward size={13} />
          <span>Run 5 steps forward</span>
        </button>
      );
    }

    if (activeStep === 3) {
      return (
        <button
          onClick={runInvestigation}
          disabled={isInvestigating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold border border-[#76C0EC]/50 shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <Sparkles size={13} />
          <span>{isInvestigating ? 'Finding source...' : 'Run investigation'}</span>
        </button>
      );
    }

    if (activeStep === 4) {
      return (
        <button
          onClick={findBestSample}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold border border-[#76C0EC]/50 shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Search size={13} />
          <span>Find best sample spot</span>
        </button>
      );
    }

    if (activeStep === 5) {
      return (
        <button
          onClick={generateReport}
          disabled={aiReportLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold border border-[#76C0EC]/50 shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <FileText size={13} />
          <span>{aiReportLoading ? 'Writing report...' : 'Write incident report'}</span>
        </button>
      );
    }

    // Step 6: Reveal / Reset
    if (!isRevealed) {
      return (
        <button
          onClick={() => {
            openConfirmModal({
              title: 'Reveal the real contamination source?',
              message:
                'This checks the ground-truth node kept hidden on the server and scores the investigation accuracy.',
              confirmLabel: 'Reveal real source',
              onConfirm: revealSource,
            });
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D9534F] hover:bg-[#c4413d] text-white text-xs font-semibold border border-white/20 shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Eye size={13} />
          <span>Reveal the real source</span>
        </button>
      );
    }

    return (
      <button
        onClick={() => {
          openConfirmModal({
            title: 'Reset investigation?',
            message: 'All sensor readings, samples, and results will be cleared back to normal state.',
            confirmLabel: 'Reset now',
            isDestructive: true,
            onConfirm: resetSimulation,
          });
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E2F62] hover:bg-[#425B9A]/40 text-[#76C0EC] text-xs font-semibold border border-[#76C0EC]/40 shadow-md transition-all"
      >
        <RotateCcw size={13} />
        <span>Start new test</span>
      </button>
    );
  };

  return (
    <div className="w-full bg-[#152248]/95 backdrop-blur-md border border-[#425B9A]/40 rounded-xl p-2.5 sm:p-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3 select-none">
      {/* 6-Step Journey Indicator */}
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
        {steps.map(step => {
          const isDone = step.num < activeStep;
          const isCurrent = step.num === activeStep;

          return (
            <div
              key={step.num}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                isCurrent
                  ? 'bg-[#425B9A] text-white border border-[#76C0EC]/60 shadow-sm'
                  : isDone
                  ? 'bg-[#1E2F62]/60 text-[#91AC67] border border-[#91AC67]/30'
                  : 'text-[#9FB0C9]/60'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  isCurrent
                    ? 'bg-[#76C0EC] text-[#121D38] font-bold'
                    : isDone
                    ? 'bg-[#597928] text-white'
                    : 'bg-[#1E2F62] text-[#9FB0C9]'
                }`}
              >
                {isDone ? <Check size={10} /> : step.num}
              </div>
              <span className="hidden sm:inline">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Primary Action Button + More Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Big Primary Action */}
        {renderPrimaryAction()}

        {/* More Controls Popover */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setMoreOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0E1733] hover:bg-[#1E2F62] text-[#9FB0C9] hover:text-[#EAF1F8] border border-[#425B9A]/40 text-xs font-medium transition-colors"
            title="More controls"
          >
            <Sliders size={13} />
            <span className="hidden sm:inline">More controls</span>
          </button>

          {moreOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-56 bg-[#152248] border border-[#425B9A]/50 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-2 py-1 text-[11px] font-mono text-[#9FB0C9] border-b border-[#425B9A]/30">
                Timeline: Step {currentStepNum} of {simState?.total_steps || 60}
              </div>

              <button
                onClick={() => {
                  stepForward();
                  setMoreOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E2F62] text-[#EAF1F8] transition-colors text-left"
              >
                <SkipForward size={13} className="text-[#76C0EC]" />
                <span>Step 1 step forward</span>
              </button>

              <button
                onClick={() => {
                  togglePlay();
                  setMoreOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E2F62] text-[#EAF1F8] transition-colors text-left"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlaying ? 'Pause simulation' : 'Auto-run timeline'}</span>
              </button>

              <button
                onClick={() => {
                  toggleSensorDrawer();
                  setMoreOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E2F62] text-[#EAF1F8] transition-colors text-left"
              >
                <Activity size={13} className="text-[#E8A33D]" />
                <span>{sensorDrawerOpen ? 'Close sensor chart' : 'Open sensor chart'}</span>
              </button>

              {isRevealed && (
                <button
                  onClick={() => {
                    setTeacherView(!teacherView);
                    setMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E2F62] text-[#91AC67] transition-colors text-left"
                >
                  <Eye size={13} />
                  <span>{teacherView ? 'Hide teacher view' : 'Show teacher view'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setStartModalOpen(true);
                  setMoreOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E2F62] text-[#EAF1F8] transition-colors text-left"
              >
                <Sliders size={13} />
                <span>Change test seed / source</span>
              </button>

              <div className="pt-1 border-t border-[#425B9A]/30">
                <button
                  onClick={() => {
                    setMoreOpen(false);
                    openConfirmModal({
                      title: 'Reset everything?',
                      message: 'This clears all observations and resets to clean baseline.',
                      confirmLabel: 'Reset',
                      isDestructive: true,
                      onConfirm: resetSimulation,
                    });
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#D9534F]/20 text-[#D9534F] transition-colors text-left"
                >
                  <RotateCcw size={13} />
                  <span>Reset to start</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
