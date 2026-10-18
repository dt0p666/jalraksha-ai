import React, { useState } from 'react';
import {
  Search,
  FileText,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
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
    <div className="flex flex-col gap-3 p-4 bg-[#0F2226] border border-[#6FBEB2]/40 rounded-xl text-[#EAF7F5] shadow-xl text-xs select-none">
      {/* 1. Card Header: Step Status & Guidance */}
      <div className="pb-2.5 border-b border-[#6FBEB2]/30">
        <div className="flex items-center justify-between">
          <span className="font-serif font-bold text-sm tracking-wide text-[#EAF7F5]">
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
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#081416] text-[#A5E9DD] border border-[#6FBEB2]/40 font-bold">
            Step {currentStepNum} of {simState?.total_steps || 60}
          </span>
        </div>

        {/* Plain-English step instructions */}
        <p className="mt-1 text-[#6FBEB2] text-xs leading-relaxed">
          {isRevealed
            ? 'Ground truth revealed. Compare the inferred source with the real network injection point.'
            : hasInvestigated && sampleCount > 0
            ? 'Samples collected. Synthesize the engineering report or reveal the real source to test accuracy.'
            : hasInvestigated
            ? 'Top candidate nodes identified. Collect a targeted water sample to confirm the exact junction.'
            : hasAlerts
            ? 'Sensors detected elevated conductivity. Run the investigation to locate the upstream source.'
            : isStarted
            ? 'Water is traveling downstream. Advance 5 steps to observe sensor readings.'
            : 'Start a contamination event with a hidden source to begin the diagnostic exercise.'}
        </p>
      </div>

      {/* 2. Inspected Node Quick Card (if user clicked any node on canvas/3D) */}
      {inspectedNode && (
        <div className="p-3 bg-[#081416] border border-[#A5E9DD]/50 rounded-lg space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#A5E9DD]" />
              <span className="font-mono font-bold text-sm text-[#A5E9DD]">
                {inspectedNode.id}
              </span>
              <span className="text-[10px] text-[#6FBEB2] uppercase font-bold">
                ({inspectedNode.type})
              </span>
            </div>
            <button
              onClick={() => setInspectedNodeId(null)}
              className="text-[#6FBEB2] hover:text-[#EAF7F5] text-[11px]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A5E9DD]">
            <div>
              Elevation: <strong className="text-[#EAF7F5]">{inspectedNode.elevation_m}m</strong>
            </div>
            {inspectedNode.households !== undefined && inspectedNode.households > 0 && (
              <div>
                Households: <strong className="text-[#A5E9DD] font-bold">{inspectedNode.households}</strong>
              </div>
            )}
          </div>

          {inspectedReading && (
            <div className="p-2 rounded bg-[#163238] text-[11px] font-mono flex items-center justify-between">
              <span>Sensor reading:</span>
              <span
                className={
                  inspectedReading.is_alert
                    ? 'text-[#FDF4AF] font-bold'
                    : 'text-[#A5E9DD] font-semibold'
                }
              >
                {inspectedReading.value.toFixed(1)} µS/cm
              </span>
            </div>
          )}

          {inspectedSample && (
            <div className="p-2 rounded bg-[#163238] text-[11px] font-mono flex items-center justify-between">
              <span>Collected sample:</span>
              <span
                className={
                  inspectedSample.is_alert
                    ? 'text-[#FF5C5C] font-bold'
                    : 'text-[#A5E9DD] font-semibold'
                }
              >
                {inspectedSample.reading.toFixed(1)} µS/cm
              </span>
            </div>
          )}

          {canSampleInspected && (
            <button
              onClick={() => collectSample(inspectedNode.id)}
              className="w-full py-1.5 rounded bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#6FBEB2]"
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
            <div className="p-3 rounded-lg bg-[#081416] border border-[#6FBEB2]/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#A5E9DD]">Most plausible source:</span>
                <span className="font-mono text-[11px] text-[#FDF4AF] font-bold">
                  Confidence: {investigation.uncertainty_level}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-bold text-[#EAF7F5]">
                    {top1.node_id}
                  </span>
                  <span className="text-[11px] text-[#6FBEB2]">
                    ({network?.nodes.find(n => n.id === top1.node_id)?.label || 'Junction'})
                  </span>
                </div>
                <span className="text-lg font-mono font-bold text-[#A5E9DD]">
                  {(top1.probability * 100).toFixed(1)}%
                </span>
              </div>

              {/* Progress probability bar */}
              <div className="w-full h-2 bg-[#163238] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A5E9DD] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, top1.probability * 100))}%` }}
                />
              </div>

              <div className="text-[11px] text-[#A5E9DD] leading-relaxed pt-1">
                {top1.path_summary}
              </div>
            </div>
          )}

          {/* Next Recommended Sample */}
          {samplingRec?.recommended_node && budgetRemaining > 0 && (
            <div className="p-2.5 rounded-lg bg-[#34908B]/25 border border-[#A5E9DD]/50 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-[#FDF4AF] font-bold uppercase block">
                  Best sampling spot:
                </span>
                <span className="font-mono text-sm font-bold text-[#EAF7F5]">
                  {samplingRec.recommended_node.node_id}
                </span>
                <span className="text-[10px] text-[#A5E9DD] block">
                  {samplingRec.recommended_node.zone_or_branch}
                </span>
              </div>
              <button
                onClick={() => samplingRec.recommended_node && collectSample(samplingRec.recommended_node.node_id)}
                className="px-3 py-1.5 rounded-md bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] text-xs font-bold shadow-sm transition-colors border border-[#6FBEB2]"
              >
                Sample now
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Ground Truth Revealed Outcome */}
      {revealResult && (
        <div className="p-3 rounded-lg bg-[#081416] border border-[#6FBEB2]/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-xs text-[#A5E9DD]">
              Diagnostic Accuracy
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                revealResult.is_top1_correct
                  ? 'bg-[#34908B]/30 text-[#FDF4AF] border border-[#6FBEB2]/40'
                  : 'bg-[#FF5C5C]/30 text-[#FF5C5C] border border-[#FF5C5C]/40'
              }`}
            >
              {revealResult.is_top1_correct ? 'Source Identified' : 'Near Source'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded bg-[#163238]">
              <span className="text-[#A5E9DD] block">Real source:</span>
              <span className="font-mono font-bold text-base text-[#FF5C5C]">
                {revealResult.true_source}
              </span>
            </div>
            <div className="p-2 rounded bg-[#163238]">
              <span className="text-[#A5E9DD] block">Engine pick:</span>
              <span className="font-mono font-bold text-base text-[#A5E9DD]">
                {revealResult.top1_candidate}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#6FBEB2]">
            Error distance: <strong className="text-[#EAF7F5]">{revealResult.hop_error} pipe hops</strong> • Samples used: <strong className="text-[#EAF7F5]">{revealResult.samples_used}</strong>
          </div>

          <button
            onClick={() => setTeacherView(!teacherView)}
            className="w-full py-1.5 rounded bg-[#163238] hover:bg-[#34908B] text-[#EAF7F5] text-xs font-semibold border border-[#6FBEB2]/40 transition-colors"
          >
            {teacherView ? 'Hide teacher view' : 'Toggle teacher view (show full spread)'}
          </button>
        </div>
      )}

      {/* 5. Incident Report Button with honest Gemma 4 model badge */}
      {hasInvestigated && (
        <div className="pt-2 border-t border-[#6FBEB2]/30 space-y-2">
          <button
            data-tour="report-btn"
            onClick={generateReport}
            disabled={aiReportLoading}
            className="w-full py-2 px-3 rounded-lg bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] font-bold text-xs border border-[#6FBEB2] flex items-center justify-between gap-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <div className="flex items-center gap-1.5">
              <FileText size={14} className="text-[#FDF4AF]" />
              <span>Write incident report</span>
            </div>
            <span className="text-[10px] font-mono text-[#081416] font-bold px-1.5 py-0.5 rounded bg-[#A5E9DD] border border-[#6FBEB2]">
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
                    'This ends the investigation and checks if the calculated source matches the real ground truth.',
                  confirmLabel: 'Reveal real source',
                  onConfirm: revealSource,
                });
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#081416] hover:bg-[#FF5C5C]/20 text-[#EAF7F5] hover:text-[#FF5C5C] font-semibold text-xs border border-[#6FBEB2]/40 hover:border-[#FF5C5C]/50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye size={14} />
              <span>Reveal the real source</span>
            </button>
          )}
        </div>
      )}

      {/* 6. "See how this was worked out" Collapsible Section */}
      {investigation && (
        <div className="pt-2 border-t border-[#6FBEB2]/30">
          <button
            onClick={() => setExpandedMath(prev => !prev)}
            className="w-full flex items-center justify-between py-1.5 text-xs text-[#A5E9DD] hover:underline font-medium"
          >
            <span>See how this was worked out</span>
            {expandedMath ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expandedMath && (
            <div className="mt-2 p-3 rounded-lg bg-[#081416] border border-[#6FBEB2]/30 space-y-3 text-[11px] leading-relaxed text-[#A5E9DD] animate-fadeIn">
              {/* Math explanation */}
              <div>
                <span className="font-semibold text-[#EAF7F5] block mb-1">
                  Physical Delay & Bayesian Likelihood
                </span>
                <p>
                  Every pipe edge has travel delay and dilution factor. When a contamination starts at node <em>u</em>, concentration arrives downstream at sensor <em>s</em> after cumulative travel delay:
                </p>
                <code className="block p-1.5 my-1 rounded bg-[#163238] text-[#FDF4AF] font-mono text-[10px]">
                  C(s, t) = C_peak × D(u, s) × G(t − t₀ − delay(u, s)) + ε
                </code>
                <p>
                  Observed conductivity is compared against expected arrival times across all 8 sensors to compute source posterior probabilities.
                </p>
              </div>

              {/* Entropy / Uncertainty */}
              <div className="p-2 rounded bg-[#163238] border border-[#6FBEB2]/30">
                <div className="flex justify-between text-[#EAF7F5]">
                  <span>Uncertainty entropy:</span>
                  <strong className="font-mono text-[#FDF4AF]">{investigation.entropy} bits</strong>
                </div>
                <div className="text-[10px] text-[#6FBEB2] mt-0.5">
                  Lower entropy indicates higher certainty. Taking samples reduces this value.
                </div>
              </div>

              {/* Random Forest Cross-check */}
              {investigation.ml_second_opinion && (
                <div className="p-2 rounded bg-[#163238] border border-[#6FBEB2]/30 space-y-1">
                  <div className="flex items-center justify-between text-[#EAF7F5]">
                    <span>Machine Learning Cross-check:</span>
                    <strong className="font-mono text-[#A5E9DD]">
                      {investigation.ml_second_opinion.top_pick}
                    </strong>
                  </div>
                  <div className="text-[10px] text-[#6FBEB2]">
                    Random Forest (20 trees, 60 synthetic scenarios) agrees with primary Bayesian candidate with{' '}
                    <strong className="text-[#EAF7F5]">
                      {(investigation.ml_second_opinion.confidence * 100).toFixed(0)}%
                    </strong>{' '}
                    tree consensus.
                  </div>
                </div>
              )}

              {/* Toggle Full Ranking */}
              <button
                onClick={() => setExpandedFullRanking(prev => !prev)}
                className="text-[11px] text-[#A5E9DD] hover:underline block pt-1"
              >
                {expandedFullRanking ? 'Hide full ranking' : 'Show full candidate ranking table (42 nodes)'}
              </button>

              {expandedFullRanking && (
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 font-mono text-[10px]">
                  {investigation.full_ranking.map((c, i) => (
                    <div
                      key={c.node_id}
                      className="flex items-center justify-between p-1 rounded bg-[#163238]/60"
                    >
                      <span className="text-[#EAF7F5]">
                        #{i + 1} {c.node_id}
                      </span>
                      <span className="text-[#A5E9DD]">
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
