import React from 'react';
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
import { AlertCircle, Compass } from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const {
    backendError,
    confirmModal,
    closeConfirmModal,
    startTour,
    tourActive,
    viewMode,
  } = useApp();

  return (
    <main
      id="main-content"
      className="w-full min-h-[calc(100vh-58px)] flex flex-col p-3 sm:p-5 gap-3 max-w-7xl mx-auto"
    >
      {/* Backend connection failure alert */}
      {backendError && (
        <div className="w-full p-2.5 rounded-xl bg-[#FF5C5C]/20 border border-[#FF5C5C]/50 text-[#FF5C5C] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>Connection notice: {backendError}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded bg-[#FF5C5C] text-white font-semibold text-[11px]"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Guided Walkthrough Quick Start Pill */}
      {!tourActive && (
        <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#0F2226]/80 border border-[#6FBEB2]/30 text-xs text-[#A5E9DD]">
          <div className="flex items-center gap-2">
            <Compass size={14} className="text-[#A5E9DD]" />
            <span>First time investigating? Follow the guided walkthrough.</span>
          </div>
          <button
            onClick={startTour}
            className="text-[#FDF4AF] font-bold hover:underline flex items-center gap-1"
          >
            Start walkthrough
          </button>
        </div>
      )}

      {/* Top 4-Chip Compact Stat Strip + View Switcher */}
      <CompactStatStrip />

      {/* Main Investigation Workspace: Map/3D Canvas (Left/Center) + Step Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[520px]">
        {/* Left/Center Viewport (8 cols): 3D or 2D Canvas with Journey Bar */}
        <div className="lg:col-span-8 flex flex-col gap-2.5 relative">
          <div className="w-full h-full min-h-[480px] flex-1 rounded-xl overflow-hidden border border-[#6FBEB2]/30 relative bg-[#081416]">
            {viewMode === '3d' ? <NetworkScene3D /> : <NetworkCanvas />}
          </div>

          {/* Floating Journey Bar at bottom of map */}
          <div className="w-full">
            <JourneyBar />
          </div>
        </div>

        {/* Right Column (4 cols): Single Focused Step Card */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <InvestigationStepCard />
        </div>
      </div>

      {/* Collapsible Bottom Drawer: Sensor readings telemetry chart */}
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
    </main>
  );
};
