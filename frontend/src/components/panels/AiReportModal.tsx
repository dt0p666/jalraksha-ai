import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { CopyButton } from '../ui/CopyButton';
import { Printer, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Bot, FileText, Clock } from 'lucide-react';
import { useApp } from '../../state/appStore';

export const AiReportModal: React.FC = () => {
  const {
    aiReportModalOpen,
    setAiReportModalOpen,
    aiReport,
    aiReportLoading,
    aiReportError,
  } = useApp();

  const [showEvidence, setShowEvidence] = useState(false);

  if (!aiReportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={aiReportModalOpen}
      onClose={() => setAiReportModalOpen(false)}
      title="Incident Investigation Briefing"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-sm text-[#EAF4F7]">
        {/* Loading State with Real Elapsed Timer */}
        {aiReportLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#38D9E6]/30 border-t-[#38D9E6] rounded-full animate-spin" />
            <div className="text-center">
              <span className="font-heading font-bold text-base block text-[#EAF4F7]">
                Synthesizing Incident Evidence...
              </span>
              <span className="text-xs text-[#8EA5B4] mt-1 block">
                Executing open-weight Gemma model locally via Ollama or generating verified rule-based summary
              </span>
            </div>
          </div>
        ) : aiReportError ? (
          <div className="p-4 rounded-xl bg-[#FF5E66]/15 border border-[#FF5E66]/40 space-y-2">
            <div className="flex items-center gap-2 text-[#FF5E66] font-semibold">
              <AlertTriangle size={18} />
              <span>Failed to generate report</span>
            </div>
            <p className="text-xs text-[#8EA5B4]">{aiReportError}</p>
          </div>
        ) : aiReport ? (
          <>
            {/* Meta bar: Model Attribution, Time, and Verification */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#071018] rounded-xl border border-[#38D9E6]/25 text-xs">
              <div className="flex items-center gap-2">
                {aiReport.is_ai_generated ? (
                  <Bot size={16} className="text-[#38D9E6]" />
                ) : (
                  <FileText size={16} className="text-[#64F4C4]" />
                )}
                <div>
                  <span className="font-semibold text-[#EAF4F7] font-mono">{aiReport.model_used}</span>
                  <div className="flex items-center gap-2 text-[10px] text-[#8EA5B4]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {aiReport.generation_time_sec.toFixed(2)}s generation latency
                    </span>
                    <span>•</span>
                    <span>Zero hidden label leakage</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {aiReport.verified ? (
                  <span className="px-2 py-0.5 rounded bg-[#64F4C4]/15 text-[#64F4C4] border border-[#64F4C4]/30 text-[10px] font-semibold flex items-center gap-1">
                    <ShieldCheck size={12} /> Grounded in sensor telemetry
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30 text-[10px] font-semibold flex items-center gap-1">
                    <AlertTriangle size={12} /> Unverified statement notice
                  </span>
                )}
              </div>
            </div>

            {/* Warnings Alert Box */}
            {aiReport.warnings && aiReport.warnings.length > 0 && (
              <div className="p-2.5 rounded-lg bg-[#FFB547]/15 border border-[#FFB547]/30 text-xs text-[#FFB547] space-y-1">
                <span className="font-semibold flex items-center gap-1">
                  <AlertTriangle size={14} /> Output Verification Notices:
                </span>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-[#EAF4F7]">
                  {aiReport.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Report Content Body */}
            <div className="p-4 bg-[#071018] rounded-xl border border-[#38D9E6]/25 max-h-96 overflow-y-auto leading-relaxed text-xs sm:text-sm font-sans space-y-3 whitespace-pre-wrap select-text">
              {aiReport.report_markdown}
            </div>

            {/* Evidence Drawer Toggle */}
            <div className="border-t border-[#38D9E6]/15 pt-3">
              <button
                onClick={() => setShowEvidence(prev => !prev)}
                className="flex items-center justify-between w-full text-xs text-[#8EA5B4] hover:text-[#38D9E6] py-1 transition-colors"
              >
                <span>View evidence package sent to inference engine</span>
                {showEvidence ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showEvidence && (
                <pre className="mt-2 p-3 bg-[#071018] rounded-xl border border-[#38D9E6]/20 text-[10px] font-mono text-[#8EA5B4] max-h-48 overflow-y-auto overflow-x-auto whitespace-pre">
                  {JSON.stringify(aiReport.evidence_sent, null, 2)}
                </pre>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#38D9E6]/15">
              <CopyButton textToCopy={aiReport.report_markdown} label="Copy report" />

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-lg bg-[#071018] hover:bg-[#132535] text-[#EAF4F7] text-xs font-semibold border border-[#38D9E6]/30 flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={14} />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => setAiReportModalOpen(false)}
                  className="px-5 py-1.5 rounded-lg bg-[#38D9E6] hover:bg-[#38D9E6]/90 text-[#071018] text-xs font-heading font-bold shadow-md shadow-[#38D9E6]/25 transition-transform hover:scale-105"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
};
