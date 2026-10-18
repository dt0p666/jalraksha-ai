import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../state/appStore';
import { NetworkCanvas } from '../components/network/NetworkCanvas';
import { NetworkScene3D } from '../components/network/NetworkScene3D';
import { CompactStatStrip } from '../components/panels/CompactStatStrip';
import { InvestigationStepCard } from '../components/panels/InvestigationStepCard';
import { JourneyBar } from '../components/timeline/JourneyBar';
import { SensorDrawer } from '../components/timeline/SensorDrawer';
import { StartContaminationModal } from '../components/panels/StartContaminationModal';
import { AiReportModal } from '../components/panels/AiReportModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { TourGuide } from '../components/learn/TourGuide';
import {
  AlertCircle,
  LayoutDashboard,
  Network,
  PlayCircle,
  Target,
  FileText,
  BarChart2,
  Compass,
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const {
    backendError,
    confirmModal,
    closeConfirmModal,
    startTour,
    tourActive,
    viewMode,
    simState,
  } = useApp();

  const isIncident = simState?.status === 'INCIDENT' || simState?.status === 'WARNING';

  return (
    <main
      id="main-content"
      className="w-full min-h-[calc(100vh-62px)] flex bg-[#086288] text-[#95BDD7] select-none"
    >
      {/* 1. LEFT: Compact Vertical Navigation Bar (NASA Mission Control Style) */}
      <aside 
        className="hidden md:flex flex-col items-center py-4 px-2 w-16 bg-[#007979] border-r border-[#24B1B1]/20 shrink-0 gap-6 z-20"
        aria-label="Mission Control Navigation"
      >
        <div className="flex flex-col items-center gap-4">
          <NavLink
            to="/command-center"
            title="Command Center (Full Viewport)"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#24B1B1]/20 text-[#24B1B1] border border-[#24B1B1]'
                  : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
              }`
            }
          >
            <LayoutDashboard size={20} />
            {isIncident && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D9D28B] animate-ping" />
            )}
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#007979] text-[#95BDD7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#24B1B1]/30">
              Command Center
            </span>
          </NavLink>

          <NavLink
            to="/network"
            title="Network Explorer"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#24B1B1]/20 text-[#24B1B1] border border-[#24B1B1]'
                  : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
              }`
            }
          >
            <Network size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#007979] text-[#95BDD7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#24B1B1]/30">
              Network Explorer
            </span>
          </NavLink>

          <NavLink
            to="/simulation"
            title="Simulation Controls"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#24B1B1]/20 text-[#24B1B1] border border-[#24B1B1]'
                  : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
              }`
            }
          >
            <PlayCircle size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#007979] text-[#95BDD7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#24B1B1]/30">
              Simulation
            </span>
          </NavLink>

          <NavLink
            to="/investigation"
            title="Source Investigation"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#24B1B1]/20 text-[#24B1B1] border border-[#24B1B1]'
                  : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
              }`
            }
          >
            <Target size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#007979] text-[#95BDD7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#24B1B1]/30">
              Source Investigation
            </span>
          </NavLink>

          <NavLink
            to="/ai-briefing"
            title="AI Intelligence Briefing"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#24B1B1]/20 text-[#24B1B1] border border-[#24B1B1]'
                  : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
              }`
            }
          >
            <FileText size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#007979] text-[#95BDD7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#24B1B1]/30">
              AI Briefing
            </span>
          </NavLink>

          <NavLink
            to="/evaluation"
            title="Evaluation Lab"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#24B1B1]/20 text-[#24B1B1] border border-[#24B1B1]'
                  : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
              }`
            }
          >
            <BarChart2 size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#007979] text-[#95BDD7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#24B1B1]/30">
              Evaluation Lab
            </span>
          </NavLink>
        </div>

        {/* Bottom Guided Tour Button */}
        <div className="mt-auto">
          <button
            onClick={startTour}
            title="Start Guided Tour"
            className="p-2.5 rounded-xl text-[#95BDD7] hover:text-[#24B1B1] hover:bg-[#007979] transition-colors relative group"
          >
            <Compass size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#007979] text-[#95BDD7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#24B1B1]/30">
              Interactive Tour
            </span>
          </button>
        </div>
      </aside>

      {/* Main Investigation Workspace (CENTER + RIGHT + BOTTOM) */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 max-w-[1920px] mx-auto w-full overflow-hidden">
        {/* Backend connection failure alert */}
        {backendError && (
          <div className="w-full p-2.5 rounded-xl bg-[#D9D28B]/20 border border-[#D9D28B]/50 text-[#D9D28B] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>Connection notice: {backendError}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-2.5 py-1 rounded bg-[#D9D28B] text-white font-semibold text-[11px]"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Guided Walkthrough Quick Start Pill */}
        {!tourActive && (
          <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#007979] border border-[#24B1B1]/25 text-xs text-[#95BDD7]">
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-[#24B1B1]" />
              <span>Investigating water contamination? Follow the interactive 6-step workflow.</span>
            </div>
            <button
              onClick={startTour}
              className="text-[#24B1B1] font-bold hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              Start Walkthrough →
            </button>
          </div>
        )}

        {/* Top Compact Stat Strip + View Mode Toggle */}
        <CompactStatStrip />

        {/* Main Interface: Large Network (Center 8-cols) + Investigation Panel (Right 4-cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[540px]">
          {/* CENTER: Large interactive water network infrastructure intelligence */}
          <div className="lg:col-span-8 flex flex-col gap-2.5 relative">
            <div className="w-full h-full min-h-[500px] flex-1 rounded-xl overflow-hidden border border-[#24B1B1]/25 relative bg-[#086288]">
              {viewMode === '3d' ? <NetworkScene3D /> : <NetworkCanvas />}
            </div>

            {/* BOTTOM: Simulation Journey Stepper Bar */}
            <div className="w-full">
              <JourneyBar />
            </div>
          </div>

          {/* RIGHT: Context-sensitive intelligence & investigation panel */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <InvestigationStepCard />
          </div>
        </div>

        {/* Collapsible Bottom Drawer: Sensor readings telemetry charts */}
        <SensorDrawer />

        {/* Modals & Dialogs */}
        <StartContaminationModal />
        <AiReportModal />
        <TourGuide />

        {confirmModal && (
          <ConfirmDialog
            isOpen={confirmModal.isOpen}
            title={confirmModal.title}
            message={confirmModal.message}
            confirmLabel={confirmModal.confirmLabel}
            isDestructive={confirmModal.isDestructive}
            onConfirm={() => {
              confirmModal.onConfirm();
              closeConfirmModal();
            }}
            onClose={closeConfirmModal}
          />
        )}
      </div>
    </main>
  );
};
