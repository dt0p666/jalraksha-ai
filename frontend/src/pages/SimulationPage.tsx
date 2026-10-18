import React from 'react';
import { useApp } from '../state/appStore';
import { NetworkCanvas } from '../components/network/NetworkCanvas';
import { SensorDrawer } from '../components/timeline/SensorDrawer';
import { StartContaminationModal } from '../components/panels/StartContaminationModal';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Activity,
  AlertTriangle,
  Clock,
  Zap,
  Radio,
} from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const {
    simState,
    isPlaying,
    togglePlay,
    stepForward,
    advanceSimulation,
    resetSimulation,
    setStartModalOpen,
    openConfirmModal,
    sensorDrawerOpen,
    toggleSensorDrawer,
  } = useApp();

  const currentStep = simState?.current_step || 0;
  const totalSteps = simState?.total_steps || 60;
  const alertCount = simState?.alert_count || 0;
  const status = simState?.status || 'NORMAL';
  const isStarted = currentStep > 0 || status !== 'NORMAL';

  return (
    <main
      id="main-content"
      className="w-full min-h-[calc(100vh-62px)] flex flex-col p-4 sm:p-6 gap-4 max-w-7xl mx-auto"
    >
      {/* Simulation Page Header & Primary Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-xl bg-[#446882] border border-[#08C4E1]/25 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#F8F3EF]">
              Hydraulic Flow Simulation
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                status === 'INCIDENT'
                  ? 'bg-[#F5E6BB]/20 text-[#F5E6BB] border border-[#F5E6BB]/50 animate-pulse'
                  : status === 'WARNING'
                  ? 'bg-[#F5E6BB]/20 text-[#F5E6BB] border border-[#F5E6BB]/50'
                  : 'bg-[#F5E6BB]/20 text-[#F5E6BB] border border-[#F5E6BB]/40'
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-xs text-[#F8F3EF]">
            Continuous gravity advection through 42 junctions with Hazen-Williams physical dispersion.
          </p>
        </div>

        {/* Primary Simulation Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isStarted ? (
            <button
              onClick={() => setStartModalOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] font-heading font-bold text-xs shadow-lg shadow-[#08C4E1]/30 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Zap size={15} />
              <span>START CONTAMINATION EVENT</span>
            </button>
          ) : (
            <>
              <button
                onClick={togglePlay}
                className={`px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                  isPlaying
                    ? 'bg-[#F5E6BB] text-[#1C3C53] shadow-lg shadow-[#F5E6BB]/30'
                    : 'bg-[#08C4E1] text-[#1C3C53] shadow-lg shadow-[#08C4E1]/30 hover:scale-105'
                }`}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY FLOW'}</span>
              </button>

              <button
                onClick={stepForward}
                className="px-3.5 py-2.5 rounded-lg bg-[#1C3C53] border border-[#08C4E1]/30 text-[#F8F3EF] hover:bg-[#446882] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Advance 1 step"
              >
                <SkipForward size={14} />
                <span>+1 Step</span>
              </button>

              <button
                onClick={() => advanceSimulation(5)}
                className="px-3.5 py-2.5 rounded-lg bg-[#1C3C53] border border-[#08C4E1]/30 text-[#F8F3EF] hover:bg-[#446882] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Advance 5 steps"
              >
                <SkipForward size={14} />
                <span>+5 Steps</span>
              </button>

              <button
                onClick={toggleSensorDrawer}
                className={`px-3.5 py-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  sensorDrawerOpen
                    ? 'bg-[#08C4E1]/20 text-[#08C4E1] border-[#08C4E1]'
                    : 'bg-[#1C3C53] text-[#F8F3EF] border-[#08C4E1]/30 hover:bg-[#446882]'
                }`}
                title="Toggle live telemetry chart"
              >
                <Activity size={14} className="text-[#08C4E1]" />
                <span>Telemetry ({sensorDrawerOpen ? 'Hide' : 'Show'})</span>
              </button>

              <button
                onClick={() => {
                  openConfirmModal({
                    title: 'Reset simulation?',
                    message: 'All sensor readings, samples, and results will be cleared back to normal state.',
                    confirmLabel: 'Reset now',
                    isDestructive: true,
                    onConfirm: resetSimulation,
                  });
                }}
                className="px-3.5 py-2.5 rounded-lg bg-[#F5E6BB]/15 hover:bg-[#F5E6BB]/25 border border-[#F5E6BB]/40 text-[#F5E6BB] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Real-time Telemetry Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#446882] border border-[#08C4E1]/20 flex items-center gap-3">
          <Clock size={20} className="text-[#08C4E1]" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#F8F3EF] block">Simulation Step</span>
            <strong className="text-base font-mono text-[#F8F3EF]">
              {currentStep} <span className="text-xs text-[#F8F3EF]">/ {totalSteps}</span>
            </strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#446882] border border-[#08C4E1]/20 flex items-center gap-3">
          <AlertTriangle size={20} className={alertCount > 0 ? 'text-[#F5E6BB]' : 'text-[#F5E6BB]'} />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#F8F3EF] block">Breached Sensors</span>
            <strong className={`text-base font-mono ${alertCount > 0 ? 'text-[#F5E6BB]' : 'text-[#F5E6BB]'}`}>
              {alertCount} <span className="text-xs text-[#F8F3EF]">active</span>
            </strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#446882] border border-[#08C4E1]/20 flex items-center gap-3">
          <Radio size={20} className="text-[#08C4E1]" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#F8F3EF] block">Active Sensors</span>
            <strong className="text-base font-mono text-[#F8F3EF]">
              {simState?.sensor_readings.length || 8} <span className="text-xs text-[#F8F3EF]">sampling</span>
            </strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#446882] border border-[#08C4E1]/20 flex items-center gap-3">
          <Activity size={20} className="text-[#F5E6BB]" />
          <div>
            <span className="text-[10px] font-mono uppercase text-[#F8F3EF] block">Field Samples</span>
            <strong className="text-base font-mono text-[#F5E6BB]">
              {simState?.budget_remaining !== undefined ? 6 - simState.budget_remaining : 0} <span className="text-xs text-[#F8F3EF]">collected</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Main Network Visual Canvas */}
      <div className="w-full h-[540px] rounded-xl overflow-hidden border border-[#08C4E1]/25 bg-[#1C3C53]">
        <NetworkCanvas />
      </div>

      {/* Sensor Readings Telemetry Charts Drawer */}
      <SensorDrawer />

      {/* Modals */}
      <StartContaminationModal />
    </main>
  );
};
