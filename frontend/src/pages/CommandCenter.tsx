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
      className="w-full min-h-[calc(100vh-62px)] flex bg-[#071018] text-[#EAF4F7] select-none"
    >
      {/* 1. LEFT: Compact Vertical Navigation Bar (NASA Mission Control Style) */}
      <aside 
        className="hidden md:flex flex-col items-center py-4 px-2 w-16 bg-[#0D1B26] border-r border-[#38D9E6]/20 shrink-0 gap-6 z-20"
        aria-label="Mission Control Navigation"
      >
        <div className="flex flex-col items-center gap-4">
          <NavLink
            to="/command-center"
            title="Command Center (Full Viewport)"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#38D9E6]/20 text-[#38D9E6] border border-[#38D9E6]'
                  : 'text-[#8EA5B4] hover:text-[#EAF4F7] hover:bg-[#132535]'
              }`
            }
          >
            <LayoutDashboard size={20} />
            {isIncident && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5E66] animate-ping" />
            )}
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#0D1B26] text-[#EAF4F7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#38D9E6]/30">
              Command Center
            </span>
          </NavLink>

          <NavLink
            to="/network"
            title="Network Explorer"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#38D9E6]/20 text-[#38D9E6] border border-[#38D9E6]'
                  : 'text-[#8EA5B4] hover:text-[#EAF4F7] hover:bg-[#132535]'
              }`
            }
          >
            <Network size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#0D1B26] text-[#EAF4F7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#38D9E6]/30">
              Network Explorer
            </span>
          </NavLink>

          <NavLink
            to="/simulation"
            title="Simulation Controls"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#38D9E6]/20 text-[#38D9E6] border border-[#38D9E6]'
                  : 'text-[#8EA5B4] hover:text-[#EAF4F7] hover:bg-[#132535]'
              }`
            }
          >
            <PlayCircle size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#0D1B26] text-[#EAF4F7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#38D9E6]/30">
              Simulation
            </span>
          </NavLink>

          <NavLink
            to="/investigation"
            title="Source Investigation"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#38D9E6]/20 text-[#38D9E6] border border-[#38D9E6]'
                  : 'text-[#8EA5B4] hover:text-[#EAF4F7] hover:bg-[#132535]'
              }`
            }
          >
            <Target size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#0D1B26] text-[#EAF4F7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#38D9E6]/30">
              Source Investigation
            </span>
          </NavLink>

          <NavLink
            to="/ai-briefing"
            title="AI Intelligence Briefing"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#38D9E6]/20 text-[#38D9E6] border border-[#38D9E6]'
                  : 'text-[#8EA5B4] hover:text-[#EAF4F7] hover:bg-[#132535]'
              }`
            }
          >
            <FileText size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#0D1B26] text-[#EAF4F7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#38D9E6]/30">
              AI Briefing
            </span>
          </NavLink>

          <NavLink
            to="/evaluation"
            title="Evaluation Lab"
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-[#38D9E6]/20 text-[#38D9E6] border border-[#38D9E6]'
                  : 'text-[#8EA5B4] hover:text-[#EAF4F7] hover:bg-[#132535]'
              }`
            }
          >
            <BarChart2 size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#0D1B26] text-[#EAF4F7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#38D9E6]/30">
              Evaluation Lab
            </span>
          </NavLink>
        </div>

        {/* Bottom Guided Tour Button */}
        <div className="mt-auto">
          <button
            onClick={startTour}
            title="Start Guided Tour"
            className="p-2.5 rounded-xl text-[#8EA5B4] hover:text-[#38D9E6] hover:bg-[#132535] transition-colors relative group"
          >
            <Compass size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#0D1B26] text-[#EAF4F7] text-[10px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#38D9E6]/30">
              Interactive Tour
            </span>
          </button>
        </div>
      </aside>

      {/* Main Investigation Workspace (CENTER + RIGHT + BOTTOM) */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 max-w-[1920px] mx-auto w-full overflow-hidden">
        {/* Backend connection failure alert */}
        {backendError && (
          <div className="w-full p-2.5 rounded-xl bg-[#FF5E66]/20 border border-[#FF5E66]/50 text-[#FF5E66] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>Connection notice: {backendError}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-2.5 py-1 rounded bg-[#FF5E66] text-white font-semibold text-[11px]"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Guided Walkthrough Quick Start Pill */}
        {!tourActive && (
          <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#0D1B26] border border-[#38D9E6]/25 text-xs text-[#8EA5B4]">
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-[#38D9E6]" />
              <span>Investigating water contamination? Follow the interactive 6-step workflow.</span>
            </div>
            <button
              onClick={startTour}
              className="text-[#38D9E6] font-bold hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              Start Walkthrough →
            </button>
          </div>
        )}

        {/* Top Compact Stat Strip + View Mode Toggle */}
        <CompactStatStrip />

        {/* Main Interface: Large Network (Center 8-cols) + Investigation Panel (Right 4-cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[540px]">
          {/* CENTER: Large interactive water network digital twin */}
          <div className="lg:col-span-8 flex flex-col gap-2.5 relative">
            <div className="w-full h-full min-h-[500px] flex-1 rounded-xl overflow-hidden border border-[#38D9E6]/25 relative bg-[#071018]">
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
