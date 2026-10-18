import React, { useState } from 'react';
import {
  Search,
  FileText,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../state/appStore';

export const InvestigationStepCard: React.FC = () => {
  const {
    network,
    simState,
    investigation,
    samplingRec,
    collectedSamples,
    collectSample,
    revealResult,
    revealSource,
    teacherView,
    setTeacherView,
    generateReport,
    aiReportLoading,
    aiStatus,
    openConfirmModal,
    inspectedNodeId,
    setInspectedNodeId,
  } = useApp();

  const [expandedMath, setExpandedMath] = useState(false);
  const [expandedFullRanking, setExpandedFullRanking] = useState(false);

  const currentStepNum = simState?.current_step || 0;
  const isStarted = currentStepNum > 0 || simState?.status !== 'NORMAL';
  const hasAlerts = (simState?.alert_count || 0) > 0;
  const hasInvestigated = Boolean(investigation);
  const sampleCount = Object.keys(collectedSamples).length;
  const isRevealed = Boolean(revealResult);
  const top1 = investigation?.top_candidates[0];
  const budgetRemaining = simState?.budget_remaining ?? 6;

  // Selected node details if user clicked a node
  const inspectedNode = inspectedNodeId && network?.nodes
    ? network.nodes.find(n => n.id === inspectedNodeId)
    : null;
  const inspectedReading = inspectedNodeId
    ? simState?.sensor_readings.find(r => r.node_id === inspectedNodeId)
    : null;
  const inspectedSample = inspectedNodeId ? collectedSamples[inspectedNodeId] : null;
  const canSampleInspected =
    Boolean(inspectedNode) &&
    !inspectedSample &&
    !inspectedNode?.has_sensor &&
    budgetRemaining > 0;

  const modelBadge = aiStatus?.model_name || 'gemma4:e2b';

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#007979] border border-[#24B1B1]/25 rounded-xl text-[#95BDD7] shadow-2xl text-xs select-none">
      {/* 1. Card Header: Step Status & Guidance */}
      <div className="pb-3 border-b border-[#24B1B1]/15">
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-sm tracking-wide text-[#95BDD7] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#24B1B1]" />
            {isRevealed
              ? '6. Investigation Outcome'
              : hasInvestigated && sampleCount > 0
              ? '5. Incident Report & Review'
              : hasInvestigated
              ? '4. Field Sampling'
              : hasAlerts
              ? '3. Analyze Abnormal Readings'
              : isStarted
              ? '2. Watching Network Flow'
              : '1. Ready to Start'}
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#086288] text-[#24B1B1] border border-[#24B1B1]/30 font-bold">
            Step {currentStepNum} / {simState?.total_steps || 60}
          </span>
        </div>

        {/* Plain-English step instructions */}
        <p className="mt-1.5 text-[#95BDD7] text-xs leading-relaxed">
          {isRevealed
            ? 'Ground truth revealed. Compare the Bayesian inferred source with the real network injection point.'
            : hasInvestigated && sampleCount > 0
            ? 'Samples collected. Synthesize the engineering report or reveal the ground truth to test accuracy.'
            : hasInvestigated
            ? 'Top candidate nodes identified. Collect a targeted water sample to confirm the exact junction.'
            : hasAlerts
            ? 'Sensors detected elevated conductivity. Run Bayesian inference to locate the upstream source.'
            : isStarted
            ? 'Water is traveling downstream through pipes. Advance steps to observe arrival times.'
            : 'Start a contamination event with a hidden source to begin the diagnostic exercise.'}
        </p>
      </div>

      {/* 2. Inspected Node Quick Card (if user clicked any node on canvas/3D) */}
      {inspectedNode && (
        <div className="p-3 bg-[#086288] border border-[#24B1B1]/40 rounded-lg space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#24B1B1]" />
              <span className="font-mono font-bold text-sm text-[#24B1B1]">
                {inspectedNode.id}
              </span>
              <span className="text-[10px] text-[#95BDD7] uppercase font-bold">
                ({inspectedNode.type})
              </span>
            </div>
            <button
              onClick={() => setInspectedNodeId(null)}
              className="text-[#95BDD7] hover:text-[#95BDD7] text-[11px]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#95BDD7]">
            <div>
              Elevation: <strong className="text-[#95BDD7]">{inspectedNode.elevation_m}m</strong>
            </div>
            {inspectedNode.households !== undefined && inspectedNode.households > 0 && (
              <div>
                Households: <strong className="text-[#D9D28B] font-bold">{inspectedNode.households}</strong>
              </div>
            )}
          </div>

          {inspectedReading && (
            <div className="p-2 rounded bg-[#007979] text-[11px] font-mono flex items-center justify-between">
              <span>Sensor reading:</span>
              <span
                className={
                  inspectedReading.is_alert
                    ? 'text-[#D9D28B] font-bold'
                    : 'text-[#24B1B1] font-semibold'
                }
              >
                {inspectedReading.value.toFixed(1)} µS/cm
              </span>
            </div>
          )}

          {inspectedSample && (
            <div className="p-2 rounded bg-[#007979] text-[11px] font-mono flex items-center justify-between">
              <span>Collected sample:</span>
              <span
                className={
                  inspectedSample.is_alert
                    ? 'text-[#D9D28B] font-bold'
                    : 'text-[#D9D28B] font-semibold'
                }
              >
                {inspectedSample.reading.toFixed(1)} µS/cm
              </span>
            </div>
          )}

          {canSampleInspected && (
            <button
              onClick={() => collectSample(inspectedNode.id)}
              className="w-full py-1.5 rounded bg-[#24B1B1] hover:bg-[#24B1B1]/90 text-[#086288] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-[#24B1B1]/20"
            >
              <Search size={13} />
              <span>Collect sample at {inspectedNode.id}</span>
            </button>
          )}
        </div>
      )}

      {/* 3. What It Found: Investigation Results */}
      {investigation && !isRevealed && (
        <div className="space-y-2.5">
          {/* Top Plausible Candidate */}
          {top1 && (
            <div className="p-3 rounded-lg bg-[#086288] border border-[#24B1B1]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#95BDD7]">Most plausible source:</span>
                <span className="font-mono text-[11px] text-[#D9D28B] font-bold">
                  Confidence: {investigation.uncertainty_level}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-bold text-[#95BDD7]">
                    {top1.node_id}
                  </span>
                  <span className="text-[11px] text-[#95BDD7]">
                    ({network?.nodes.find(n => n.id === top1.node_id)?.label || 'Junction'})
                  </span>
                </div>
                <span className="text-lg font-mono font-bold text-[#24B1B1]">
                  {(top1.probability * 100).toFixed(1)}%
                </span>
              </div>

              {/* Progress probability bar */}
              <div className="w-full h-2 bg-[#007979] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#24B1B1] to-[#D9D28B] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, top1.probability * 100))}%` }}
                />
              </div>

              <div className="text-[11px] text-[#95BDD7] leading-relaxed pt-1">
                {top1.path_summary}
              </div>
            </div>
          )}

          {/* Next Recommended Sample */}
          {samplingRec?.recommended_node && budgetRemaining > 0 && (
            <div className="p-2.5 rounded-lg bg-[#007979] border border-[#D9D28B]/40 flex items-center justify-between gap-2 shadow-lg">
              <div>
                <span className="text-[10px] text-[#D9D28B] font-bold uppercase block">
                  Next Recommended Sample:
                </span>
                <span className="font-mono text-sm font-bold text-[#95BDD7]">
                  {samplingRec.recommended_node.node_id}
                </span>
                <span className="text-[10px] text-[#95BDD7] block">
                  {samplingRec.recommended_node.zone_or_branch}
                </span>
              </div>
              <button
                onClick={() => samplingRec.recommended_node && collectSample(samplingRec.recommended_node.node_id)}
                className="px-3 py-1.5 rounded-md bg-[#D9D28B] hover:bg-[#D9D28B]/90 text-[#086288] text-xs font-bold shadow-md transition-colors"
              >
                Collect Sample
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Ground Truth Revealed Outcome */}
      {revealResult && (
        <div className="p-3 rounded-lg bg-[#086288] border border-[#24B1B1]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-xs text-[#24B1B1]">
              Diagnostic Accuracy
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                revealResult.is_top1_correct
                  ? 'bg-[#D9D28B]/20 text-[#D9D28B] border border-[#D9D28B]/40'
                  : 'bg-[#D9D28B]/20 text-[#D9D28B] border border-[#D9D28B]/40'
              }`}
            >
              {revealResult.is_top1_correct ? 'Source Identified (Top 1)' : 'Near Source'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded bg-[#007979]">
              <span className="text-[#95BDD7] block">Real source:</span>
              <span className="font-mono font-bold text-base text-[#D9D28B]">
                {revealResult.true_source}
              </span>
            </div>
            <div className="p-2 rounded bg-[#007979]">
              <span className="text-[#95BDD7] block">Bayesian top pick:</span>
              <span className="font-mono font-bold text-base text-[#24B1B1]">
                {revealResult.top1_candidate}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#95BDD7]">
            Error distance: <strong className="text-[#95BDD7]">{revealResult.hop_error} pipe hops</strong> • Samples used: <strong className="text-[#95BDD7]">{revealResult.samples_used}</strong>
          </div>

          <button
            onClick={() => setTeacherView(!teacherView)}
            className="w-full py-1.5 rounded bg-[#007979] hover:bg-[#24B1B1]/20 text-[#95BDD7] text-xs font-semibold border border-[#24B1B1]/30 transition-colors"
          >
            {teacherView ? 'Hide true spread plume' : 'Toggle teacher view (show true plume)'}
          </button>
        </div>
      )}

      {/* 5. Incident Report Button with honest Gemma 4 model badge */}
      {hasInvestigated && (
        <div className="pt-2 border-t border-[#24B1B1]/15 space-y-2">
          <button
            data-tour="report-btn"
            onClick={generateReport}
            disabled={aiReportLoading}
            className="w-full py-2 px-3 rounded-lg bg-[#24B1B1] hover:bg-[#24B1B1]/90 text-[#086288] font-bold text-xs flex items-center justify-between gap-1.5 transition-colors shadow-md shadow-[#24B1B1]/25 disabled:opacity-50"
          >
            <div className="flex items-center gap-1.5">
              <FileText size={14} />
              <span>Generate AI Incident Briefing</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#086288] text-[#24B1B1] font-bold">
              {modelBadge}
            </span>
          </button>

          {!isRevealed && (
            <button
              data-tour="reveal-btn"
              onClick={() => {
                openConfirmModal({
                  title: 'Reveal the real source?',
                  message:
                    'This checks whether the calculated Bayesian candidate matches the true contamination injection point.',
                  confirmLabel: 'Reveal real source',
                  onConfirm: revealSource,
                });
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#086288] hover:bg-[#D9D28B]/20 text-[#95BDD7] hover:text-[#D9D28B] font-semibold text-xs border border-[#24B1B1]/20 hover:border-[#D9D28B]/50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye size={14} />
              <span>Reveal Ground Truth</span>
            </button>
          )}
        </div>
      )}

      {/* 6. "See how this was worked out" Collapsible Section */}
      {investigation && (
        <div className="pt-2 border-t border-[#24B1B1]/15">
          <button
            onClick={() => setExpandedMath(prev => !prev)}
            className="w-full flex items-center justify-between py-1.5 text-xs text-[#24B1B1] hover:underline font-medium"
          >
            <span className="flex items-center gap-1">
              <Sparkles size={12} />
              <span>Hydraulic Delay & Bayesian Formula</span>
            </span>
            {expandedMath ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expandedMath && (
            <div className="mt-2 p-3 rounded-lg bg-[#086288] border border-[#24B1B1]/20 space-y-3 text-[11px] leading-relaxed text-[#95BDD7] animate-fadeIn">
              {/* Math explanation */}
              <div>
                <span className="font-semibold text-[#95BDD7] block mb-1">
                  Physical Delay & Bayesian Likelihood
                </span>
                <p>
                  Every pipe edge has travel delay and dilution factor. When contamination starts at node <em>u</em>, concentration arrives downstream at sensor <em>s</em> after cumulative travel delay:
                </p>
                <code className="block p-1.5 my-1 rounded bg-[#007979] text-[#24B1B1] font-mono text-[10px]">
                  C(s, t) = C_peak × D(u, s) × G(t − t₀ − delay(u, s)) + ε
                </code>
                <p>
                  Observed conductivity is compared against expected arrival times across all sensors to compute posterior probabilities.
                </p>
              </div>

              {/* Entropy / Uncertainty */}
              <div className="p-2 rounded bg-[#007979] border border-[#24B1B1]/20">
                <div className="flex justify-between text-[#95BDD7]">
                  <span>Uncertainty entropy:</span>
                  <strong className="font-mono text-[#D9D28B]">{investigation.entropy} bits</strong>
                </div>
                <div className="text-[10px] text-[#95BDD7] mt-0.5">
                  Lower entropy indicates higher certainty. Targeted grab sampling systematically reduces this uncertainty.
                </div>
              </div>

              {/* Random Forest Cross-check */}
              {investigation.ml_second_opinion && (
                <div className="p-2 rounded bg-[#007979] border border-[#24B1B1]/20 space-y-1">
                  <div className="flex items-center justify-between text-[#95BDD7]">
                    <span>Random Forest Ensemble:</span>
                    <strong className="font-mono text-[#24B1B1]">
                      {investigation.ml_second_opinion.top_pick}
                    </strong>
                  </div>
                  <div className="text-[10px] text-[#95BDD7]">
                    Supervised classifier agrees with primary candidate with{' '}
                    <strong className="text-[#95BDD7]">
                      {(investigation.ml_second_opinion.confidence * 100).toFixed(0)}%
                    </strong>{' '}
                    tree consensus.
                  </div>
                </div>
              )}

              {/* Toggle Full Ranking */}
              <button
                onClick={() => setExpandedFullRanking(prev => !prev)}
                className="text-[11px] text-[#24B1B1] hover:underline block pt-1"
              >
                {expandedFullRanking ? 'Hide candidate list' : 'View full 42-node candidate ranking'}
              </button>

              {expandedFullRanking && (
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 font-mono text-[10px]">
                  {investigation.full_ranking.map((c, i) => (
                    <div
                      key={c.node_id}
                      className="flex items-center justify-between p-1 rounded bg-[#007979]/80"
                    >
                      <span className="text-[#95BDD7]">
                        #{i + 1} {c.node_id}
                      </span>
                      <span className="text-[#24B1B1]">
                        {(c.probability * 100).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
