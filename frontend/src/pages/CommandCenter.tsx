import React from 'react';
import { useApp } from '../state/appStore';
import { NetworkCanvas } from '../components/network/NetworkCanvas';
import { StatsOverview } from '../components/panels/StatsOverview';
import { NodeInspector } from '../components/panels/NodeInspector';
import { InvestigationPanel } from '../components/panels/InvestigationPanel';
import { AdvisoryPanel } from '../components/panels/AdvisoryPanel';
import { TimelineBar } from '../components/timeline/TimelineBar';
import { SensorChart } from '../components/timeline/SensorChart';
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
    inspectedNodeId,
  } = useApp();

  return (
    <main id="main-content" className="w-full min-h-[calc(100vh-65px)] flex flex-col p-3 sm:p-5 gap-4">
      {/* Backend connection failure alert */}
      {backendError && (
        <div className="w-full p-3 rounded-xl bg-[#D9534F]/20 border border-[#D9534F]/50 text-[#D9534F] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>Backend communication issue: {backendError}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded bg-[#D9534F] text-white font-semibold text-[11px]"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Training Mode Tour Quick Start Banner */}
      {!tourActive && (
        <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-[#141E3D] border border-[#425B9A]/30 text-xs text-[#9FB0C9]">
          <div className="flex items-center gap-2">
            <Compass size={15} className="text-[#76C0EC]" />
            <span>New to water network diagnostics? Take the guided walkthrough.</span>
          </div>
          <button
            onClick={startTour}
            className="text-[#76C0EC] font-semibold hover:underline flex items-center gap-1"
          >
            Start Training Mode
          </button>
        </div>
      )}

      {/* Main 3-Column Control Room Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Column (3 cols): Overview & Node Inspector */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <StatsOverview />
          {inspectedNodeId && <NodeInspector />}
        </div>

        {/* Center Column (6 cols): Live Network Canvas */}
        <div className="lg:col-span-6 flex flex-col gap-4 min-h-[480px]">
          <NetworkCanvas />
          <AdvisoryPanel />
        </div>

        {/* Right Column (3 cols): Investigation & Sampling Controls */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <InvestigationPanel />
        </div>
      </div>

      {/* Bottom Row: Timeline Controls & Sensor Telemetry Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4">
          <TimelineBar />
        </div>
        <div className="lg:col-span-8">
          <SensorChart />
        </div>
      </div>

      {/* Dialogs and Modals */}
      <StartContaminationModal />
      <AiReportModal />
      <TourGuide />

      {confirmModal && (
        <ConfirmDialog
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          isDestructive={confirmModal.isDestructive}
          onConfirm={confirmModal.onConfirm}
          onClose={closeConfirmModal}
        />
      )}
    </main>
  );
};
