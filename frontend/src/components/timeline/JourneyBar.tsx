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
  const activeStep = (() => {
    if (isRevealed) return 6;
    if (hasInvestigated && sampleCount > 0) return 5;
    if (hasInvestigated) return 4;
    if (hasAlerts) return 3;
    if (isStarted) return 2;
    return 1;
  })();

  // Direct action for each step when clicked
  const handleStepClick = (stepNum: number) => {
    if (stepNum === 1) {
      setStartModalOpen(true);
    } else if (stepNum === 2) {
      advanceSimulation(5);
    } else if (stepNum === 3) {
      if (!hasInvestigated) {
        runInvestigation();
      }
    } else if (stepNum === 4) {
      findBestSample();
    } else if (stepNum === 5) {
      generateReport();
    } else if (stepNum === 6) {
      if (!isRevealed) {
        openConfirmModal({
          title: 'Reveal the real source?',
          message: 'This ends the investigation and checks if the calculated source matches the real ground truth.',
          confirmLabel: 'Reveal real source',
          onConfirm: revealSource,
        });
      }
    }
  };

  const steps = [
    { num: 1, label: 'Start', hint: 'Start contamination' },
    { num: 2, label: 'Watch', hint: 'Advance 5 flow steps' },
    { num: 3, label: 'Investigate', hint: 'Run Bayesian ranking' },
    { num: 4, label: 'Sample', hint: 'Take targeted sample' },
    { num: 5, label: 'Report', hint: 'Gemma 4 incident synthesis' },
    { num: 6, label: 'Reveal', hint: 'Reveal ground truth' },
  ];

  // Render primary action button according to current journey step
  const renderPrimaryAction = () => {
    if (!isStarted) {
      return (
        <button
          onClick={() => setStartModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] text-xs font-bold border border-[#6FBEB2] shadow-lg transition-all hover:scale-[1.02] active:scale-100"
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] text-xs font-bold border border-[#6FBEB2] shadow-lg transition-all hover:scale-[1.02] active:scale-100"
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] text-xs font-bold border border-[#6FBEB2] shadow-lg transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
        >
          <Sparkles size={14} className="text-[#A5E9DD]" />
          <span>{isInvestigating ? 'Calculating ranking...' : 'Step 3: Run Bayesian investigation'}</span>
        </button>
      );
    }

    if (activeStep === 4) {
      return (
        <button
          onClick={findBestSample}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] text-xs font-bold border border-[#6FBEB2] shadow-lg transition-all hover:scale-[1.02] active:scale-100"
        >
          <Search size={14} className="text-[#A5E9DD]" />
          <span>Step 4: Find optimal sample location</span>
        </button>
      );
    }

    if (activeStep === 5) {
      return (
        <button
          onClick={generateReport}
          disabled={aiReportLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] text-xs font-bold border border-[#6FBEB2] shadow-lg transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
        >
          <FileText size={14} />
          <span>{aiReportLoading ? 'Synthesizing report...' : 'Step 5: Write incident report'}</span>
        </button>
      );
    }

    if (activeStep === 6 && !isRevealed) {
      return (
        <button
          onClick={() => {
            openConfirmModal({
              title: 'Reveal the real source?',
              message:
                'This ends the investigation and checks if the calculated source matches the real ground truth.',
              confirmLabel: 'Reveal real source',
              onConfirm: revealSource,
            });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] text-xs font-bold border border-[#6FBEB2] shadow-lg transition-all hover:scale-[1.02] active:scale-100"
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#163238] hover:bg-[#34908B] text-[#EAF7F5] text-xs font-bold border border-[#6FBEB2] shadow-lg transition-all"
      >
        <RotateCcw size={14} />
        <span>Start new test</span>
      </button>
    );
  };

  return (
    <div className="w-full bg-[#0F2226]/95 backdrop-blur-md border border-[#6FBEB2]/40 rounded-xl p-3 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-3 select-none">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-[#34908B] text-[#EAF7F5] shadow-md border-2 border-[#A5E9DD] scale-105'
                    : isDone
                    ? 'bg-[#163238] text-[#A5E9DD] hover:bg-[#34908B]/30 border border-[#6FBEB2]/40'
                    : 'bg-[#081416]/60 text-[#6FBEB2] hover:bg-[#163238]/60 hover:text-[#EAF7F5] border border-[#6FBEB2]/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isCurrent
                      ? 'bg-[#FDF4AF] text-[#081416]'
                      : isDone
                      ? 'bg-[#A5E9DD] text-[#081416]'
                      : 'bg-[#0F2226] text-[#6FBEB2]'
                  }`}
                >
                  {isDone ? <Check size={11} strokeWidth={3} /> : step.num}
                </div>
                <span className="font-semibold whitespace-nowrap">{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight
                  size={12}
                  className={`shrink-0 ${
                    step.num < activeStep ? 'text-[#A5E9DD]' : 'text-[#6FBEB2]/40'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Primary Action Button & Auxiliary Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Dynamic Primary Next-Step Button */}
        {renderPrimaryAction()}

        {/* Play/Pause simulation tick toggle */}
        {isStarted && !isRevealed && (
          <button
            onClick={togglePlay}
            className={`p-2.5 rounded-lg border transition-all ${
              isPlaying
                ? 'bg-[#FDF4AF] text-[#081416] border-[#A5E9DD] shadow-lg'
                : 'bg-[#081416] text-[#EAF7F5] border-[#6FBEB2]/40 hover:bg-[#163238]'
            }`}
            title={isPlaying ? 'Pause simulation (Space)' : 'Play simulation continuous flow (Space)'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
          </button>
        )}

        {/* Step one tick forward */}
        {isStarted && !isRevealed && (
          <button
            onClick={stepForward}
            className="p-2.5 rounded-lg bg-[#081416] text-[#EAF7F5] border border-[#6FBEB2]/40 hover:bg-[#163238] transition-all"
            title="Advance 1 step"
            aria-label="Advance 1 step"
          >
            <SkipForward size={14} />
          </button>
        )}

        {/* "More controls" Popover Button */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setMoreOpen(prev => !prev)}
            className={`flex items-center gap-1 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
              moreOpen
                ? 'bg-[#34908B] text-[#EAF7F5] border-[#A5E9DD]'
                : 'bg-[#081416] text-[#A5E9DD] border-[#6FBEB2]/40 hover:bg-[#163238]'
            }`}
            title="More controls"
            aria-expanded={moreOpen}
          >
            <Sliders size={13} />
            <span className="hidden sm:inline">Controls</span>
          </button>

          {/* More Controls Popover */}
          {moreOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-[#081416] border border-[#6FBEB2]/50 rounded-xl shadow-2xl z-50 text-xs space-y-2 animate-fadeIn">
              <div className="text-[11px] font-mono uppercase text-[#A5E9DD] pb-1 border-b border-[#6FBEB2]/30">
                Advanced Controls
              </div>

              {/* Sensor Readings Telemetry Drawer Toggle */}
              <button
                onClick={() => {
                  toggleSensorDrawer();
                  setMoreOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#163238]/60 hover:bg-[#34908B]/40 text-[#EAF7F5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Activity size={13} className="text-[#A5E9DD]" />
                  <span>Sensor readings drawer</span>
                </div>
                <span className="font-mono text-[10px] text-[#A5E9DD]">
                  {sensorDrawerOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </button>

              {/* Teacher view toggle */}
              <button
                onClick={() => {
                  setTeacherView(!teacherView);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#163238]/60 hover:bg-[#34908B]/40 text-[#EAF7F5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye size={13} className="text-[#A5E9DD]" />
                  <span>Teacher view (spread)</span>
                </div>
                <span className="font-mono text-[10px] text-[#A5E9DD]">
                  {teacherView ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Reset simulation */}
              <button
                onClick={() => {
                  setMoreOpen(false);
                  openConfirmModal({
                    title: 'Reset investigation?',
                    message:
                      'All sensor readings, samples, and results will be cleared back to normal state.',
                    confirmLabel: 'Reset now',
                    isDestructive: true,
                    onConfirm: resetSimulation,
                  });
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#FF5C5C]/20 hover:bg-[#FF5C5C]/30 text-[#FF5C5C] font-semibold transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset simulation</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
