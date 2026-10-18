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
          title: 'Reveal the ground truth source?',
          message: 'This evaluates whether the Bayesian candidate matches the true physical injection point.',
          confirmLabel: 'Reveal real source',
          onConfirm: revealSource,
        });
      }
    }
  };

  const steps = [
    { num: 1, label: 'Start Flow', hint: 'Inject contamination scenario' },
    { num: 2, label: 'Observe Sensors', hint: 'Advance 5 flow steps' },
    { num: 3, label: 'Run Inference', hint: 'Bayesian source localisation' },
    { num: 4, label: 'Grab Sample', hint: 'Take optimal verification sample' },
    { num: 5, label: 'AI Briefing', hint: 'Synthesize Gemma 4 incident report' },
    { num: 6, label: 'Ground Truth', hint: 'Verify against simulation truth' },
  ];

  // Render primary action button according to current journey step
  const renderPrimaryAction = () => {
    if (!isStarted) {
      return (
        <button
          onClick={() => setStartModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] text-xs font-bold shadow-lg shadow-[#08C4E1]/30 transition-all hover:scale-[1.02] active:scale-100"
        >
          <Play size={14} fill="currentColor" />
          <span>Step 1: Start Simulation</span>
        </button>
      );
    }

    if (activeStep === 2) {
      return (
        <button
          onClick={() => advanceSimulation(5)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] text-xs font-bold shadow-lg shadow-[#08C4E1]/30 transition-all hover:scale-[1.02] active:scale-100"
        >
          <SkipForward size={14} />
          <span>Step 2: Advance +5 Steps</span>
        </button>
      );
    }

    if (activeStep === 3) {
      return (
        <button
          onClick={runInvestigation}
          disabled={isInvestigating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] text-xs font-bold shadow-lg shadow-[#08C4E1]/30 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
        >
          <Sparkles size={14} />
          <span>{isInvestigating ? 'Localizing...' : 'Step 3: Run Inversion'}</span>
        </button>
      );
    }

    if (activeStep === 4) {
      return (
        <button
          onClick={findBestSample}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F5E6BB] hover:bg-[#F5E6BB]/90 text-[#1C3C53] text-xs font-bold shadow-lg shadow-[#F5E6BB]/30 transition-all hover:scale-[1.02] active:scale-100"
        >
          <Search size={14} />
          <span>Step 4: Find Optimal Sample</span>
        </button>
      );
    }

    if (activeStep === 5) {
      return (
        <button
          onClick={generateReport}
          disabled={aiReportLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] text-xs font-bold shadow-lg shadow-[#08C4E1]/30 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
        >
          <FileText size={14} />
          <span>{aiReportLoading ? 'Synthesizing...' : 'Step 5: Generate Briefing'}</span>
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
                'This checks whether the calculated Bayesian candidate matches the true contamination injection point.',
              confirmLabel: 'Reveal real source',
              onConfirm: revealSource,
            });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F5E6BB] hover:bg-[#F5E6BB]/90 text-[#1C3C53] text-xs font-bold shadow-lg shadow-[#F5E6BB]/30 transition-all hover:scale-[1.02] active:scale-100"
        >
          <Eye size={14} />
          <span>Step 6: Reveal Truth</span>
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#446882] hover:bg-[#08C4E1]/20 text-[#F8F3EF] text-xs font-bold border border-[#08C4E1]/30 shadow-lg transition-all"
      >
        <RotateCcw size={14} className="text-[#08C4E1]" />
        <span>New Investigation</span>
      </button>
    );
  };

  return (
    <div className="w-full bg-[#446882]/95 backdrop-blur-md border border-[#08C4E1]/25 rounded-xl p-3 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-3 select-none">
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
                    ? 'bg-[#08C4E1]/20 text-[#08C4E1] border border-[#08C4E1] shadow-[0_0_12px_rgba(8,196,225,0.3)] scale-105'
                    : isDone
                    ? 'bg-[#446882] text-[#F5E6BB] hover:bg-[#446882]/80 border border-[#F5E6BB]/30'
                    : 'bg-[#1C3C53] text-[#F8F3EF] hover:bg-[#446882] hover:text-[#F8F3EF] border border-[#08C4E1]/15'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isCurrent
                      ? 'bg-[#08C4E1] text-[#1C3C53]'
                      : isDone
                      ? 'bg-[#F5E6BB] text-[#1C3C53]'
                      : 'bg-[#446882] text-[#F8F3EF]'
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
                    step.num < activeStep ? 'text-[#F5E6BB]' : 'text-[#F8F3EF]/30'
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
                ? 'bg-[#F5E6BB] text-[#1C3C53] border-[#F5E6BB] shadow-lg'
                : 'bg-[#1C3C53] text-[#F8F3EF] border-[#08C4E1]/30 hover:bg-[#446882]'
            }`}
            title={isPlaying ? 'Pause simulation (Space)' : 'Play continuous simulation flow (Space)'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
          </button>
        )}

        {/* Step one tick forward */}
        {isStarted && !isRevealed && (
          <button
            onClick={stepForward}
            className="p-2.5 rounded-lg bg-[#1C3C53] text-[#F8F3EF] border border-[#08C4E1]/30 hover:bg-[#446882] transition-all"
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
                ? 'bg-[#08C4E1]/20 text-[#08C4E1] border-[#08C4E1]'
                : 'bg-[#1C3C53] text-[#F8F3EF] border-[#08C4E1]/30 hover:bg-[#446882]'
            }`}
            title="More controls"
            aria-expanded={moreOpen}
          >
            <Sliders size={13} />
            <span className="hidden sm:inline">Controls</span>
          </button>

          {/* More Controls Popover */}
          {moreOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-[#1C3C53] border border-[#08C4E1]/40 rounded-xl shadow-2xl z-50 text-xs space-y-2 animate-fadeIn">
              <div className="text-[11px] font-mono uppercase text-[#08C4E1] pb-1 border-b border-[#08C4E1]/20">
                Advanced Controls
              </div>

              {/* Sensor Readings Telemetry Drawer Toggle */}
              <button
                onClick={() => {
                  toggleSensorDrawer();
                  setMoreOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#446882] hover:bg-[#08C4E1]/20 text-[#F8F3EF] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Activity size={13} className="text-[#08C4E1]" />
                  <span>Telemetry Drawer</span>
                </div>
                <span className="font-mono text-[10px] text-[#08C4E1]">
                  {sensorDrawerOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </button>

              {/* Teacher view toggle */}
              <button
                onClick={() => {
                  setTeacherView(!teacherView);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#446882] hover:bg-[#08C4E1]/20 text-[#F8F3EF] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye size={13} className="text-[#F5E6BB]" />
                  <span>Teacher View (Plume)</span>
                </div>
                <span className="font-mono text-[10px] text-[#F5E6BB]">
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
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#F5E6BB]/20 hover:bg-[#F5E6BB]/30 text-[#F5E6BB] font-semibold transition-colors"
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
