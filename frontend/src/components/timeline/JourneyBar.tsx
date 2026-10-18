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
  ChevronRight,
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

  // Allow the user to directly click any step to execute that step's action
  const handleStepClick = (stepNum: number) => {
    if (stepNum === 1) {
      setStartModalOpen(true);
    } else if (stepNum === 2) {
      advanceSimulation(5);
    } else if (stepNum === 3) {
      if (!isStarted) advanceSimulation(5);
      runInvestigation();
    } else if (stepNum === 4) {
      if (!hasInvestigated) runInvestigation();
      findBestSample();
    } else if (stepNum === 5) {
      generateReport();
    } else if (stepNum === 6) {
      if (!isRevealed) {
        openConfirmModal({
          title: 'Reveal the real contamination source?',
          message:
            'This checks the ground-truth node kept hidden on the server and scores the investigation accuracy.',
          confirmLabel: 'Reveal real source',
          onConfirm: revealSource,
        });
      }
    }
  };

  const steps = [
    { num: 1, label: 'Start', hint: 'Start contamination' },
    { num: 2, label: 'Watch', hint: 'Run 5 flow steps' },
    { num: 3, label: 'Investigate', hint: 'Compute source ranking' },
    { num: 4, label: 'Sample', hint: 'Take water sample' },
    { num: 5, label: 'Report', hint: 'Gemma 4 incident synthesis' },
    { num: 6, label: 'Reveal', hint: 'Reveal ground truth' },
  ];

  // Render primary action button according to current journey step
  const renderPrimaryAction = () => {
    if (!isStarted) {
      return (
        <button
          onClick={() => setStartModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3368A0] hover:bg-[#285380] text-[#F2EFE7] text-xs font-bold border border-[#66A3BF] shadow-lg transition-all hover:scale-[1.02] active:scale-100"
        >
          <Play size={14} fill="currentColor" />
          <span>Step 1: Start contamination</span>
        </button>
      );
    }

    if (activeStep === 2) {
      return (
        <button
          onClick={() => advanceSimulation(5)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3368A0] hover:bg-[#285380] text-[#F2EFE7] text-xs font-bold border border-[#66A3BF] shadow-lg transition-all hover:scale-[1.02] active:scale-100"
        >
          <SkipForward size={14} />
          <span>Step 2: Advance 5 flow steps</span>
        </button>
      );
    }

    if (activeStep === 3) {
      return (
        <button
          onClick={runInvestigation}
          disabled={isInvestigating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3368A0] hover:bg-[#285380] text-[#F2EFE7] text-xs font-bold border border-[#66A3BF] shadow-lg transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
        >
          <Sparkles size={14} className="text-[#C8DFDB]" />
          <span>{isInvestigating ? 'Calculating ranking...' : 'Step 3: Run Bayesian investigation'}</span>
        </button>
      );
    }

    if (activeStep === 4) {
      return (
        <button
          onClick={findBestSample}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3368A0] hover:bg-[#285380] text-[#F2EFE7] text-xs font-bold border border-[#66A3BF] shadow-lg transition-all hover:scale-[1.02] active:scale-100"
        >
          <Search size={14} className="text-[#C8DFDB]" />
          <span>Step 4: Find optimal sample location</span>
        </button>
      );
    }

    if (activeStep === 5) {
      return (
        <button
          onClick={generateReport}
          disabled={aiReportLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3368A0] hover:bg-[#285380] text-[#F2EFE7] text-xs font-bold border border-[#66A3BF] shadow-lg transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
        >
          <FileText size={14} className="text-[#C8DFDB]" />
          <span>{aiReportLoading ? 'Synthesizing report...' : 'Step 5: Write incident report'}</span>
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF5C5C] hover:bg-[#e04a4a] text-white text-xs font-bold border border-white/20 shadow-lg transition-all hover:scale-[1.02] active:scale-100"
        >
          <Eye size={14} />
          <span>Step 6: Reveal the real source</span>
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E3B57] hover:bg-[#3368A0] text-[#F2EFE7] text-xs font-bold border border-[#66A3BF] shadow-lg transition-all"
      >
        <RotateCcw size={14} />
        <span>Start new test</span>
      </button>
    );
  };

  return (
    <div className="w-full bg-[#162C42]/95 backdrop-blur-md border border-[#66A3BF]/40 rounded-xl p-3 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-3 select-none">
      {/* 6-Step Journey Interactive Stepper */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 lg:pb-0">
        {steps.map((step, idx) => {
          const isDone = step.num < activeStep;
          const isCurrent = step.num === activeStep;

          return (
            <React.Fragment key={step.num}>
              <button
                onClick={() => handleStepClick(step.num)}
                title={step.hint}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer ${
                  isCurrent
                    ? 'bg-[#3368A0] text-[#F2EFE7] border-2 border-[#C8DFDB] shadow-lg ring-2 ring-[#66A3BF]/30'
                    : isDone
                    ? 'bg-[#1E3B57] text-[#C8DFDB] border border-[#66A3BF]/40'
                    : 'bg-[#0F1E2E]/60 text-[#C8DFDB]/60 border border-[#162C42] hover:bg-[#1E3B57]/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isCurrent
                      ? 'bg-[#FDF4AF] text-[#0F1E2E]'
                      : isDone
                      ? 'bg-[#66A3BF] text-[#0F1E2E]'
                      : 'bg-[#1E3B57] text-[#C8DFDB]'
                  }`}
                >
                  {isDone ? <Check size={11} /> : step.num}
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight">{step.label}</span>
                </div>
              </button>
              {idx < steps.length - 1 && (
                <ChevronRight size={13} className="text-[#66A3BF]/40 hidden sm:block shrink-0" />
              )}
            </React.Fragment>
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
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#0F1E2E] hover:bg-[#1E3B57] text-[#C8DFDB] hover:text-[#F2EFE7] border border-[#66A3BF]/40 text-xs font-semibold transition-colors"
            title="More controls"
          >
            <Sliders size={13} />
            <span className="hidden sm:inline">More controls</span>
          </button>

          {moreOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-56 bg-[#162C42] border border-[#66A3BF]/50 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-2 py-1 text-[11px] font-mono text-[#C8DFDB] border-b border-[#66A3BF]/30">
                Timeline: Step {currentStepNum} of {simState?.total_steps || 60}
              </div>

              <button
                onClick={() => {
                  stepForward();
                  setMoreOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E3B57] text-[#F2EFE7] transition-colors text-left"
              >
                <SkipForward size={13} className="text-[#66A3BF]" />
                <span>Step 1 step forward</span>
              </button>

              <button
                onClick={() => {
                  togglePlay();
                  setMoreOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E3B57] text-[#F2EFE7] transition-colors text-left"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlaying ? 'Pause simulation' : 'Auto-run timeline'}</span>
              </button>

              <button
                onClick={() => {
                  toggleSensorDrawer();
                  setMoreOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E3B57] text-[#F2EFE7] transition-colors text-left"
              >
                <Activity size={13} className="text-[#FDF4AF]" />
                <span>{sensorDrawerOpen ? 'Close sensor chart' : 'Open sensor chart'}</span>
              </button>

              {isRevealed && (
                <button
                  onClick={() => {
                    setTeacherView(!teacherView);
                    setMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E3B57] text-[#C8DFDB] transition-colors text-left"
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
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1E3B57] text-[#F2EFE7] transition-colors text-left"
              >
                <Sliders size={13} />
                <span>Change test seed / source</span>
              </button>

              <div className="pt-1 border-t border-[#66A3BF]/30">
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
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#FF5C5C]/20 text-[#FF5C5C] transition-colors text-left"
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
