import React from 'react';
import { useApp } from '../state/appStore';
import {
  FileText,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const AiBriefingPage: React.FC = () => {
  const {
    aiReport,
    aiReportLoading,
    generateReport,
    aiStatus,
    investigation,
    simState,
  } = useApp();

  const isOllamaOnline = Boolean(aiStatus?.ollama_reachable && aiStatus?.model_available);
  const modelName = aiStatus?.model_name || 'gemma4:e2b';
  const hasInvestigated = Boolean(investigation);
  const top1 = investigation?.top_candidates[0];

  return (
    <main
      id="main-content"
      className="w-full min-h-[calc(100vh-62px)] flex flex-col p-4 sm:p-6 gap-6 max-w-5xl mx-auto"
    >
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0D1B26] border border-[#38D9E6]/25 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-heading font-bold text-[#EAF4F7]">
              AI Incident Intelligence Briefing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#38D9E6]/15 border border-[#38D9E6]/30 text-[#38D9E6] text-[10px] font-mono font-bold uppercase">
              STRUCTURED DOSSIER
            </span>
          </div>
          <p className="text-xs text-[#8EA5B4]">
            Automated technical incident synthesis powered by local open-weight LLM inference without hallucinated labels.
          </p>
        </div>

        {/* Generate / Regenerate CTA */}
        <button
          onClick={generateReport}
          disabled={aiReportLoading}
          className="px-5 py-2.5 rounded-xl bg-[#38D9E6] hover:bg-[#38D9E6]/90 text-[#071018] font-heading font-bold text-xs shadow-lg shadow-[#38D9E6]/30 flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
        >
          {aiReportLoading ? (
            <RefreshCw size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          <span>{aiReportLoading ? 'SYNTHESIZING DOSSIER...' : 'GENERATE AI BRIEFING'}</span>
        </button>
      </div>

      {/* Model Provenance & Physical Grounding Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model Spec */}
        <div className="p-4 rounded-xl bg-[#0D1B26] border border-[#38D9E6]/20 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8EA5B4] flex items-center gap-1.5">
              <Cpu size={14} className="text-[#38D9E6]" /> Inference Engine
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isOllamaOnline ? 'bg-[#64F4C4] shadow-[0_0_8px_#64F4C4]' : 'bg-[#FFB547]'
              }`}
            />
          </div>
          <strong className="text-sm font-mono text-[#EAF4F7] block">{modelName}</strong>
          <span className="text-[11px] text-[#8EA5B4] block">
            {isOllamaOnline
              ? 'Local Ollama endpoint active'
              : 'Deterministic rule-based fallback active'}
          </span>
        </div>

        {/* Safety & Anti-Hallucination */}
        <div className="p-4 rounded-xl bg-[#0D1B26] border border-[#38D9E6]/20 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8EA5B4] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#64F4C4]" /> Evidence Grounding
            </span>
            <span className="text-[#64F4C4] text-[10px] font-mono">STRICT</span>
          </div>
          <strong className="text-sm font-mono text-[#EAF4F7] block">Zero Hidden Labels</strong>
          <span className="text-[11px] text-[#8EA5B4] block">
            Prompt never receives unrevealed ground truth
          </span>
        </div>

        {/* Current Network Anomaly Context */}
        <div className="p-4 rounded-xl bg-[#0D1B26] border border-[#38D9E6]/20 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8EA5B4] flex items-center gap-1.5">
              <Clock size={14} className="text-[#FFB547]" /> Network Step
            </span>
            <span className="text-[#38D9E6] text-[10px] font-mono">
              {simState?.status || 'NORMAL'}
            </span>
          </div>
          <strong className="text-sm font-mono text-[#EAF4F7] block">
            Step {simState?.current_step || 0} of {simState?.total_steps || 60}
          </strong>
          <span className="text-[11px] text-[#8EA5B4] block">
            {simState?.alert_count || 0} sensor conductivity breaches
          </span>
        </div>
      </div>

      {/* Main Dossier Content */}
      {aiReport ? (
        <div className="p-6 rounded-2xl bg-[#0D1B26] border border-[#38D9E6]/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#38D9E6]/15">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#38D9E6]" />
              <span className="font-heading font-bold text-base text-[#EAF4F7]">
                Technical Incident Assessment
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#8EA5B4]">
              <span>Latency: {aiReport.generation_time_sec.toFixed(2)}s</span>
              <span>•</span>
              <span className="text-[#64F4C4]">
                {aiReport.is_ai_generated ? 'LLM Synthesized' : 'Template Validated'}
              </span>
            </div>
          </div>

          {/* Render Markdown report body */}
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#EAF4F7]/90 leading-relaxed font-sans space-y-4">
            <div className="p-4 rounded-xl bg-[#071018] border border-[#38D9E6]/20 whitespace-pre-wrap font-mono text-xs text-[#EAF4F7] leading-relaxed">
              {aiReport.report_markdown}
            </div>
          </div>

          {/* Report Warnings if any */}
          {aiReport.warnings && aiReport.warnings.length > 0 && (
            <div className="p-3 rounded-lg bg-[#FFB547]/15 border border-[#FFB547]/30 text-xs text-[#FFB547] space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle size={13} />
                Notice
              </span>
              <ul className="list-disc list-inside text-[11px] text-[#FFB547]/90">
                {aiReport.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* Empty / Ready state */
        <div className="p-10 rounded-2xl bg-[#0D1B26] border border-[#38D9E6]/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#071018] border border-[#38D9E6]/30 flex items-center justify-center mx-auto text-[#38D9E6]">
            <FileText size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-heading font-bold text-[#EAF4F7]">
              AI Briefing Ready For Generation
            </h2>
            <p className="text-xs text-[#8EA5B4] max-w-md mx-auto leading-relaxed">
              {hasInvestigated
                ? `Bayesian ranking computed with top candidate ${top1?.node_id}. Click "GENERATE AI BRIEFING" above to synthesize the official technical incident response.`
                : 'Start a contamination simulation and run Bayesian localization in the Command Center to populate evidence for the incident briefing.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={generateReport}
              disabled={aiReportLoading}
              className="px-6 py-3 rounded-xl bg-[#38D9E6] hover:bg-[#38D9E6]/90 text-[#071018] font-heading font-bold text-xs shadow-lg shadow-[#38D9E6]/30 transition-transform hover:scale-105 disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Sparkles size={15} />
              <span>SYNTHESIZE BRIEFING NOW</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
