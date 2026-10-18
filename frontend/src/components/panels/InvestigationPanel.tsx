import React, { useState } from 'react';
import {
  Play,
  Search,
  Target,
  FileText,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
} from 'lucide-react';
import { useApp } from '../../state/appStore';
import { ExplainButton } from '../ui/ExplainButton';

export const InvestigationPanel: React.FC = () => {
  const {
    simState,
    investigation,
    isInvestigating,
    runInvestigation,
    samplingRec,
    findBestSample,
    collectSample,
    revealResult,
    revealSource,
    teacherView,
    setTeacherView,
    generateReport,
    setStartModalOpen,
    openConfirmModal,
    resetSimulation,
  } = useApp();

  const [expandedFullRanking, setExpandedFullRanking] = useState(false);

  const budgetRemaining = simState?.budget_remaining ?? 6;
  const isRevealed = Boolean(revealResult);
  const top1 = investigation?.top_candidates[0];

  const handleRevealClick = () => {
    openConfirmModal({
      title: 'Reveal Ground Truth Source?',
      message:
        'Revealing the true contamination source concludes the active investigation and displays final diagnostic accuracy. Are you ready to reveal?',
      confirmLabel: 'Reveal source',
      isDestructive: false,
      onConfirm: revealSource,
    });
  };

  const handleResetClick = () => {
    openConfirmModal({
      title: 'Reset Simulation?',
      message: 'This will clear all sensor telemetry, collected grab samples, and candidate rankings.',
      confirmLabel: 'Reset simulation',
      isDestructive: true,
      onConfirm: resetSimulation,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#141E3D] border border-[#425B9A]/30 rounded-xl text-[#EAF1F8] shadow-sm text-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#425B9A]/30">
        <h2 className="font-serif font-bold text-base tracking-wide text-[#EAF1F8]">
          Investigation Control
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetClick}
            className="p-1.5 text-[#9FB0C9] hover:text-[#D9534F] hover:bg-[#1D2A52] rounded-lg transition-colors"
            title="Reset simulation"
            aria-label="Reset simulation"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Start Contamination Trigger */}
      <div className="flex gap-2">
        <button
          data-tour="start-btn"
          onClick={() => setStartModalOpen(true)}
          className="flex-1 py-2 px-3 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white font-semibold text-xs border border-[#76C0EC]/50 flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <Play size={14} fill="currentColor" />
          <span>Start contamination</span>
        </button>

        <button
          data-tour="investigate-btn"
          onClick={runInvestigation}
          disabled={isInvestigating}
          className="flex-1 py-2 px-3 rounded-lg bg-[#1D2A52] hover:bg-[#425B9A]/40 text-[#76C0EC] font-semibold text-xs border border-[#76C0EC]/40 flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
        >
          <Search size={14} />
          <span>{isInvestigating ? 'Calculating...' : 'Run investigation'}</span>
        </button>
      </div>

      {/* Active Bayesian Candidate Source Ranking */}
      {investigation ? (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-[#76C0EC] uppercase tracking-wider">
                Most Plausible Sources
              </span>
              <ExplainButton
                title="Bayesian Source Probabilities"
                explanation={
                  top1
                    ? `${top1.node_id} holds ${Math.round(top1.probability * 100)}% posterior probability because physical arrival delays match ${top1.supporting_sensors.length} alarmed sensor(s).`
                    : 'Probabilities derived by marginalizing Gaussian log-likelihood over injection onset steps.'
                }
                contextData={{
                  'Top Candidate': top1?.node_id,
                  Probability: top1 ? `${(top1.probability * 100).toFixed(1)}%` : '0%',
                  Entropy: `${investigation.entropy} bits`,
                  Uncertainty: investigation.uncertainty_level,
                }}
              />
            </div>

            {/* Uncertainty badge */}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                investigation.uncertainty_level === 'LOW'
                  ? 'bg-[#91AC67]/20 text-[#91AC67] border border-[#91AC67]/30'
                  : investigation.uncertainty_level === 'MEDIUM'
                  ? 'bg-[#E8A33D]/20 text-[#E8A33D] border border-[#E8A33D]/30'
                  : 'bg-[#425B9A]/30 text-[#9FB0C9] border border-[#425B9A]/40'
              }`}
            >
              {investigation.uncertainty_level} UNCERTAINTY ({investigation.entropy} bits)
            </span>
          </div>

          {/* Top 3 Candidate Probability Bars */}
          <div className="space-y-2">
            {investigation.top_candidates.map(candidate => {
              const pct = Math.round(candidate.probability * 100);
              return (
                <div
                  key={candidate.node_id}
                  className="p-2.5 bg-[#0D1630] rounded-lg border border-[#425B9A]/30 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#1D2A52] text-[#76C0EC] border border-[#76C0EC]/30">
                        #{candidate.rank}
                      </span>
                      <span className="font-mono font-bold text-sm text-[#EAF1F8]">
                        {candidate.node_id}
                      </span>
                      <span className="text-[10px] text-[#9FB0C9] capitalize">
                        ({candidate.node_type})
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#76C0EC]">{pct}%</span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-1.5 bg-[#141E3D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#76C0EC] transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[#9FB0C9] leading-tight pt-0.5">
                    {candidate.path_summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Expandable full candidate list */}
          <div>
            <button
              onClick={() => setExpandedFullRanking(prev => !prev)}
              className="w-full flex items-center justify-between text-xs text-[#9FB0C9] hover:text-[#76C0EC] py-1 border-t border-[#425B9A]/20 transition-colors"
            >
              <span>{expandedFullRanking ? 'Hide full candidate list' : 'View full ranking (all 34 hypotheses)'}</span>
              {expandedFullRanking ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expandedFullRanking && (
              <div className="max-h-48 overflow-y-auto space-y-1 pt-1 pr-1 text-xs">
                {investigation.full_ranking.slice(3).map(c => (
                  <div
                    key={c.node_id}
                    className="flex items-center justify-between py-1 px-2 rounded bg-[#0D1630]/60 text-[#9FB0C9]"
                  >
                    <span className="font-mono">
                      #{c.rank} {c.node_id}
                    </span>
                    <span className="font-mono">{Math.round(c.probability * 100)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Random Forest Cross-Check Second Opinion */}
          {investigation.ml_second_opinion && (
            <div className="p-2.5 rounded-lg bg-[#1D2A52]/60 border border-[#425B9A]/40 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-[#EAF1F8]">
                  <Cpu size={14} className="text-[#76C0EC]" />
                  ML Second Opinion (Random Forest)
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0D1630] text-[#9FB0C9] border border-[#425B9A]/30">
                  {investigation.ml_second_opinion.label}
                </span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <span>Pick:</span>
                  <span className="font-mono font-bold text-[#76C0EC]">
                    {investigation.ml_second_opinion.top_pick}
                  </span>
                  <span className="text-[11px] text-[#9FB0C9]">
                    ({Math.round(investigation.ml_second_opinion.confidence * 100)}% conf)
                  </span>
                </div>
                {investigation.ml_second_opinion.agrees_with_bayes ? (
                  <span className="text-[10px] text-[#91AC67] font-semibold flex items-center gap-1">
                    <CheckCircle size={12} /> Agrees with Bayes
                  </span>
                ) : (
                  <span className="text-[10px] text-[#E8A33D] font-semibold flex items-center gap-1">
                    <AlertCircle size={12} /> Diverges
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#9FB0C9]/70 pt-0.5">
                Held-out synthetic test accuracy: {Math.round(investigation.ml_second_opinion.held_out_accuracy * 100)}%
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-6 px-4 text-center rounded-lg bg-[#0D1630]/60 border border-[#425B9A]/20 text-[#9FB0C9] text-xs">
          Click &quot;Run investigation&quot; or advance timeline to compute real-time Bayesian source ranking.
        </div>
      )}

      {/* Targeted Grab Sampling Section */}
      <div className="pt-3 border-t border-[#425B9A]/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-[#76C0EC] uppercase tracking-wider">
              Field Grab Sampling
            </span>
            <ExplainButton
              title="Optimal Grab Sampling"
              explanation="Calculates Expected Information Gain for every unmonitored node to bisect top competing hypotheses with the fewest physical field samples."
              contextData={{
                'Remaining Budget': `${budgetRemaining} samples`,
                'Recommended Target': samplingRec?.recommended_node?.node_id || 'None calculated yet',
              }}
            />
          </div>
          <span className="font-mono text-xs text-[#9FB0C9]">
            Budget: <strong className="text-[#EAF1F8]">{budgetRemaining}</strong> left
          </span>
        </div>

        {samplingRec?.recommended_node ? (
          <div className="p-2.5 bg-[#0D1630] rounded-lg border border-[#E8A33D]/40 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#E8A33D] font-bold block">
                  Optimal Diagnostic Target
                </span>
                <span className="font-mono font-bold text-base text-[#EAF1F8]">
                  {samplingRec.recommended_node.node_id}
                </span>
                <span className="text-[11px] text-[#9FB0C9] block">
                  {samplingRec.recommended_node.zone_or_branch}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#1D2A52] text-[#76C0EC] font-mono text-[10px] border border-[#76C0EC]/30">
                +{samplingRec.recommended_node.expected_information_gain} bits EIG
              </span>
            </div>

            <p className="text-[11px] text-[#9FB0C9] leading-tight">
              {samplingRec.recommended_node.reason}
            </p>

            <button
              data-tour="sample-btn"
              onClick={() => collectSample(samplingRec.recommended_node!.node_id)}
              disabled={budgetRemaining <= 0}
              className="w-full py-2 px-3 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white font-semibold text-xs border border-[#76C0EC]/50 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Target size={14} />
              <span>Collect sample at {samplingRec.recommended_node.node_id}</span>
            </button>
          </div>
        ) : (
          <button
            data-tour="sample-btn"
            onClick={findBestSample}
            disabled={budgetRemaining <= 0}
            className="w-full py-2 px-3 rounded-lg bg-[#1D2A52] hover:bg-[#425B9A]/30 text-[#EAF1F8] font-medium text-xs border border-[#425B9A]/40 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Target size={14} className="text-[#76C0EC]" />
            <span>Find best sample location</span>
          </button>
        )}
      </div>

      {/* Incident Report & Reveal Actions */}
      <div className="pt-3 border-t border-[#425B9A]/30 space-y-2">
        <button
          data-tour="report-btn"
          onClick={generateReport}
          className="w-full py-2 px-3 rounded-lg bg-[#1D2A52] hover:bg-[#425B9A]/40 text-[#76C0EC] font-semibold text-xs border border-[#76C0EC]/40 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <FileText size={14} />
          <span>Incident report (Gemma 3 1B)</span>
        </button>

        {!isRevealed ? (
          <button
            data-tour="reveal-btn"
            onClick={handleRevealClick}
            className="w-full py-2 px-3 rounded-lg bg-[#0D1630] hover:bg-[#D9534F]/20 text-[#EAF1F8] hover:text-[#D9534F] font-semibold text-xs border border-[#425B9A]/40 hover:border-[#D9534F]/50 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye size={14} />
            <span>Reveal true source & evaluate</span>
          </button>
        ) : revealResult ? (
          /* Reveal Evaluation Result Card */
          <div className="p-3 bg-[#0D1630] rounded-lg border border-[#76C0EC]/40 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#425B9A]/30">
              <span className="font-serif font-bold text-xs text-[#76C0EC]">
                Evaluation Outcome
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  revealResult.is_top1_correct
                    ? 'bg-[#91AC67]/20 text-[#91AC67] border border-[#91AC67]/30'
                    : 'bg-[#E8A33D]/20 text-[#E8A33D] border border-[#E8A33D]/30'
                }`}
              >
                {revealResult.is_top1_correct ? 'CORRECT (Top-1)' : `${revealResult.hop_error} HOP ERROR`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#9FB0C9] text-[10px] block">True Source:</span>
                <span className="font-mono font-bold text-sm text-[#D9534F]">
                  {revealResult.true_source}
                </span>
                <span className="text-[10px] text-[#9FB0C9] capitalize block">
                  ({revealResult.true_source_type})
                </span>
              </div>
              <div>
                <span className="text-[#9FB0C9] text-[10px] block">Samples Used:</span>
                <span className="font-mono font-bold text-sm text-[#EAF1F8]">
                  {revealResult.samples_used}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#9FB0C9] leading-tight">
              {revealResult.summary}
            </p>

            {/* Teacher View Toggle */}
            <div className="pt-2 border-t border-[#425B9A]/20 flex items-center justify-between">
              <span className="text-xs text-[#EAF1F8]">Teacher view (True plume spread):</span>
              <button
                onClick={() => setTeacherView(!teacherView)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  teacherView
                    ? 'bg-[#D9534F] text-white'
                    : 'bg-[#1D2A52] text-[#9FB0C9] hover:text-[#EAF1F8]'
                }`}
              >
                {teacherView ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
