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
      title="Incident Investigation Report"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-sm text-[#EAF1F8]">
        {/* Loading State with Real Elapsed Timer */}
        {aiReportLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#425B9A] border-t-[#76C0EC] rounded-full animate-spin" />
            <div className="text-center">
              <span className="font-semibold text-base block text-[#EAF1F8]">
                Synthesizing Incident Evidence...
              </span>
              <span className="text-xs text-[#9FB0C9] mt-1 block">
                Executing open-weight Gemma model locally via Ollama or generating verified rule-based summary
              </span>
            </div>
          </div>
        ) : aiReportError ? (
          <div className="p-4 rounded-lg bg-[#D9534F]/20 border border-[#D9534F]/40 space-y-2">
            <div className="flex items-center gap-2 text-[#D9534F] font-semibold">
              <AlertTriangle size={18} />
              <span>Failed to generate report</span>
            </div>
            <p className="text-xs text-[#9FB0C9]">{aiReportError}</p>
          </div>
        ) : aiReport ? (
          <>
            {/* Meta bar: Model Attribution, Time, and Verification */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#0D1630] rounded-lg border border-[#425B9A]/30 text-xs">
              <div className="flex items-center gap-2">
                {aiReport.is_ai_generated ? (
                  <Bot size={16} className="text-[#76C0EC]" />
                ) : (
                  <FileText size={16} className="text-[#91AC67]" />
                )}
                <div>
                  <span className="font-semibold text-[#EAF1F8]">{aiReport.model_used}</span>
                  <div className="flex items-center gap-2 text-[10px] text-[#9FB0C9]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {aiReport.generation_time_sec}s generation time
                    </span>
                    <span>•</span>
                    <span>Strict evidence constraint</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {aiReport.verified ? (
                  <span className="px-2 py-0.5 rounded bg-[#91AC67]/20 text-[#91AC67] border border-[#91AC67]/30 text-[10px] font-semibold flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified against evidence
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-[#E8A33D]/20 text-[#E8A33D] border border-[#E8A33D]/30 text-[10px] font-semibold flex items-center gap-1">
                    <AlertTriangle size={12} /> Unverified statement detected
                  </span>
                )}
              </div>
            </div>

            {/* Warnings Alert Box */}
            {aiReport.warnings && aiReport.warnings.length > 0 && (
              <div className="p-2.5 rounded-lg bg-[#E8A33D]/20 border border-[#E8A33D]/40 text-xs text-[#E8A33D] space-y-1">
                <span className="font-semibold flex items-center gap-1">
                  <AlertTriangle size={14} /> Output Verification Notices:
                </span>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-[#EAF1F8]">
                  {aiReport.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Report Content Body */}
            <div className="p-4 bg-[#0D1630] rounded-lg border border-[#425B9A]/30 max-h-96 overflow-y-auto leading-relaxed text-xs sm:text-sm font-sans space-y-3 whitespace-pre-wrap select-text">
              {aiReport.report_markdown}
            </div>

            {/* Evidence Drawer Toggle */}
            <div className="border-t border-[#425B9A]/30 pt-3">
              <button
                onClick={() => setShowEvidence(prev => !prev)}
                className="flex items-center justify-between w-full text-xs text-[#9FB0C9] hover:text-[#76C0EC] py-1 transition-colors"
              >
                <span>View evidence package sent to model</span>
                {showEvidence ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showEvidence && (
                <pre className="mt-2 p-3 bg-[#0D1630] rounded border border-[#425B9A]/30 text-[10px] font-mono text-[#9FB0C9] max-h-48 overflow-y-auto overflow-x-auto whitespace-pre">
                  {JSON.stringify(aiReport.evidence_sent, null, 2)}
                </pre>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#425B9A]/30">
              <CopyButton textToCopy={aiReport.report_markdown} label="Copy report" />

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-[#1D2A52] hover:bg-[#425B9A]/40 text-[#EAF1F8] text-xs font-semibold border border-[#425B9A]/40 flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={14} />
                  <span>Print report</span>
                </button>
                <button
                  onClick={() => setAiReportModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold border border-[#76C0EC]/50 transition-colors"
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
