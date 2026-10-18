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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#446882] border border-[#08C4E1]/25 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-heading font-bold text-[#F8F3EF]">
              AI Incident Intelligence Briefing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#08C4E1]/15 border border-[#08C4E1]/30 text-[#08C4E1] text-[10px] font-mono font-bold uppercase">
              STRUCTURED DOSSIER
            </span>
          </div>
          <p className="text-xs text-[#F8F3EF]">
            Automated technical incident synthesis powered by local open-weight LLM inference without hallucinated labels.
          </p>
        </div>

        {/* Generate / Regenerate CTA */}
        <button
          onClick={generateReport}
          disabled={aiReportLoading}
          className="px-5 py-2.5 rounded-xl bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] font-heading font-bold text-xs shadow-lg shadow-[#08C4E1]/30 flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
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
        <div className="p-4 rounded-xl bg-[#446882] border border-[#08C4E1]/20 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F8F3EF] flex items-center gap-1.5">
              <Cpu size={14} className="text-[#08C4E1]" /> Inference Engine
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isOllamaOnline ? 'bg-[#F5E6BB] shadow-[0_0_8px_#F5E6BB]' : 'bg-[#F5E6BB]'
              }`}
            />
          </div>
          <strong className="text-sm font-mono text-[#F8F3EF] block">{modelName}</strong>
          <span className="text-[11px] text-[#F8F3EF] block">
            {isOllamaOnline
              ? 'Local Ollama endpoint active'
              : 'Deterministic rule-based fallback active'}
          </span>
        </div>

        {/* Safety & Anti-Hallucination */}
        <div className="p-4 rounded-xl bg-[#446882] border border-[#08C4E1]/20 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F8F3EF] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#F5E6BB]" /> Evidence Grounding
            </span>
            <span className="text-[#F5E6BB] text-[10px] font-mono">STRICT</span>
          </div>
          <strong className="text-sm font-mono text-[#F8F3EF] block">Zero Hidden Labels</strong>
          <span className="text-[11px] text-[#F8F3EF] block">
            Prompt never receives unrevealed ground truth
          </span>
        </div>

        {/* Current Network Anomaly Context */}
        <div className="p-4 rounded-xl bg-[#446882] border border-[#08C4E1]/20 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F8F3EF] flex items-center gap-1.5">
              <Clock size={14} className="text-[#F5E6BB]" /> Network Step
            </span>
            <span className="text-[#08C4E1] text-[10px] font-mono">
              {simState?.status || 'NORMAL'}
            </span>
          </div>
          <strong className="text-sm font-mono text-[#F8F3EF] block">
            Step {simState?.current_step || 0} of {simState?.total_steps || 60}
          </strong>
          <span className="text-[11px] text-[#F8F3EF] block">
            {simState?.alert_count || 0} sensor conductivity breaches
          </span>
        </div>
      </div>

      {/* Main Dossier Content */}
      {aiReport ? (
        <div className="p-6 rounded-2xl bg-[#446882] border border-[#08C4E1]/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#08C4E1]/15">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#08C4E1]" />
              <span className="font-heading font-bold text-base text-[#F8F3EF]">
                Technical Incident Assessment
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#F8F3EF]">
              <span>Latency: {aiReport.generation_time_sec.toFixed(2)}s</span>
              <span>•</span>
              <span className="text-[#F5E6BB]">
                {aiReport.is_ai_generated ? 'LLM Synthesized' : 'Template Validated'}
              </span>
            </div>
          </div>

          {/* Render Markdown report body */}
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#F8F3EF]/90 leading-relaxed font-sans space-y-4">
            <div className="p-4 rounded-xl bg-[#1C3C53] border border-[#08C4E1]/20 whitespace-pre-wrap font-mono text-xs text-[#F8F3EF] leading-relaxed">
              {aiReport.report_markdown}
            </div>
          </div>

          {/* Report Warnings if any */}
          {aiReport.warnings && aiReport.warnings.length > 0 && (
            <div className="p-3 rounded-lg bg-[#F5E6BB]/15 border border-[#F5E6BB]/30 text-xs text-[#F5E6BB] space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle size={13} />
                Notice
              </span>
              <ul className="list-disc list-inside text-[11px] text-[#F5E6BB]/90">
                {aiReport.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* Empty / Ready state */
        <div className="p-10 rounded-2xl bg-[#446882] border border-[#08C4E1]/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1C3C53] border border-[#08C4E1]/30 flex items-center justify-center mx-auto text-[#08C4E1]">
            <FileText size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-heading font-bold text-[#F8F3EF]">
              AI Briefing Ready For Generation
            </h2>
            <p className="text-xs text-[#F8F3EF] max-w-md mx-auto leading-relaxed">
              {hasInvestigated
                ? `Bayesian ranking computed with top candidate ${top1?.node_id}. Click "GENERATE AI BRIEFING" above to synthesize the official technical incident response.`
                : 'Start a contamination simulation and run Bayesian localization in the Command Center to populate evidence for the incident briefing.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={generateReport}
              disabled={aiReportLoading}
              className="px-6 py-3 rounded-xl bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] font-heading font-bold text-xs shadow-lg shadow-[#08C4E1]/30 transition-transform hover:scale-105 disabled:opacity-50 inline-flex items-center gap-2"
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
