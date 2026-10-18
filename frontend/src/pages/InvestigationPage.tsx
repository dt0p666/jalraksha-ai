import React from 'react';
import { useApp } from '../state/appStore';
import { NetworkCanvas } from '../components/network/NetworkCanvas';
import {
  Target,
  Sparkles,
  Search,
  Eye,
} from 'lucide-react';

export const InvestigationPage: React.FC = () => {
  const {
    network,
    simState,
    investigation,
    runInvestigation,
    isInvestigating,
    samplingRec,
    collectSample,
    revealResult,
    revealSource,
    openConfirmModal,
    inspectedNodeId,
    setInspectedNodeId,
  } = useApp();

  const hasAlerts = (simState?.alert_count || 0) > 0;
  const budgetRemaining = simState?.budget_remaining ?? 6;

  return (
    <main
      id="main-content"
      className="w-full min-h-[calc(100vh-62px)] flex flex-col p-4 sm:p-6 gap-4 max-w-7xl mx-auto"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#007979] border border-[#24B1B1]/25 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#95BDD7] flex items-center gap-2">
            <Target size={22} className="text-[#24B1B1]" />
            <span>Bayesian Source Localization</span>
          </h1>
          <p className="text-xs text-[#95BDD7] mt-0.5">
            Physics-informed Bayesian inversion matching sensor arrival curves against hydraulic graph delay profiles.
          </p>
        </div>

        <button
          onClick={runInvestigation}
          disabled={isInvestigating}
          className="px-5 py-2.5 rounded-lg bg-[#24B1B1] hover:bg-[#24B1B1]/90 text-[#086288] font-heading font-bold text-xs shadow-lg shadow-[#24B1B1]/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
        >
          <Sparkles size={15} />
          <span>{isInvestigating ? 'COMPUTING POSTERIOR...' : 'RUN BAYESIAN INVERSION'}</span>
        </button>
      </div>

      {/* Main Grid: Left Investigation Intel Panels (5 cols) + Right Network Canvas (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        
        {/* Left Column (5 cols): Ranked Candidates & Sampling Recommendation */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Next Recommended Sample Feature */}
          {samplingRec?.recommended_node && budgetRemaining > 0 && (
            <div className="p-4 rounded-xl bg-[#007979] border-2 border-[#D9D28B] shadow-xl shadow-[#D9D28B]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-[#D9D28B] tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D9D28B] animate-ping" />
                  NEXT RECOMMENDED SAMPLE
                </span>
                <span className="text-[10px] font-mono text-[#95BDD7]">
                  Budget: {budgetRemaining} left
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-[#95BDD7]">
                    {samplingRec.recommended_node.node_id}
                  </span>
                  <span className="text-xs text-[#95BDD7]">
                    ({samplingRec.recommended_node.zone_or_branch})
                  </span>
                </div>
                <p className="text-xs text-[#95BDD7] mt-1 leading-relaxed">
                  {samplingRec.recommended_node.reason}
                </p>
              </div>

              <button
                onClick={() => samplingRec.recommended_node && collectSample(samplingRec.recommended_node.node_id)}
                className="w-full py-2.5 rounded-lg bg-[#D9D28B] hover:bg-[#D9D28B]/90 text-[#086288] font-heading font-bold text-xs shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Search size={14} />
                <span>COLLECT SAMPLE</span>
              </button>
            </div>
          )}

          {/* Ranked Candidate Sources */}
          {investigation ? (
            <div className="p-4 rounded-xl bg-[#007979] border border-[#24B1B1]/25 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#24B1B1]/15">
                <span className="font-heading font-bold text-sm text-[#95BDD7]">
                  Ranked Source Hypotheses
                </span>
                <span className="font-mono text-[11px] text-[#24B1B1]">
                  Entropy: {investigation.entropy} bits ({investigation.uncertainty_level})
                </span>
              </div>

              <div className="space-y-2">
                {investigation.top_candidates.map(candidate => {
                  const nodeObj = network?.nodes.find(n => n.id === candidate.node_id);
                  const isSelected = inspectedNodeId === candidate.node_id;

                  return (
                    <div
                      key={candidate.node_id}
                      onClick={() => setInspectedNodeId(candidate.node_id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#007979] border-[#24B1B1] shadow-md shadow-[#24B1B1]/20'
                          : 'bg-[#086288] border-[#24B1B1]/20 hover:border-[#24B1B1]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#007979] border border-[#24B1B1]/30 flex items-center justify-center text-[10px] font-mono font-bold text-[#24B1B1]">
                            {candidate.rank}
                          </span>
                          <span className="font-mono font-bold text-sm text-[#95BDD7]">
                            {candidate.node_id}
                          </span>
                          <span className="text-[10px] text-[#95BDD7]">
                            ({nodeObj?.label || 'Junction'})
                          </span>
                        </div>
                        <span className="font-mono font-bold text-sm text-[#24B1B1]">
                          {(candidate.probability * 100).toFixed(1)}%
                        </span>
                      </div>

                      {/* Probability Bar */}
                      <div className="w-full h-1.5 bg-[#007979] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#24B1B1] to-[#D9D28B] rounded-full"
                          style={{ width: `${Math.min(100, Math.max(5, candidate.probability * 100))}%` }}
                        />
                      </div>

                      <div className="text-[10px] text-[#95BDD7] mt-1.5 truncate">
                        {candidate.path_summary}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reveal Ground Truth Action */}
              {!revealResult ? (
                <button
                  onClick={() => {
                    openConfirmModal({
                      title: 'Reveal Ground Truth?',
                      message: 'This evaluates whether the Bayesian model correctly identified the simulated injection point.',
                      confirmLabel: 'Reveal real source',
                      onConfirm: revealSource,
                    });
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#086288] hover:bg-[#D9D28B]/20 border border-[#24B1B1]/30 hover:border-[#D9D28B]/50 text-[#95BDD7] hover:text-[#D9D28B] font-semibold text-xs transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <Eye size={14} />
                  <span>Reveal Ground Truth</span>
                </button>
              ) : (
                <div className="p-3 rounded-lg bg-[#086288] border border-[#D9D28B]/40 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#95BDD7]">Ground Truth Source:</span>
                    <strong className="text-[#D9D28B] text-sm">{revealResult.true_source}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#95BDD7]">Bayesian Inferred:</span>
                    <strong className="text-[#24B1B1] text-sm">{revealResult.top1_candidate}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#95BDD7]">Hop Error:</span>
                    <strong className="text-[#95BDD7]">{revealResult.hop_error} hops</strong>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#007979] border border-[#24B1B1]/20 text-center space-y-3">
              <Target size={36} className="mx-auto text-[#95BDD7]/50" />
              <h3 className="font-heading font-bold text-base text-[#95BDD7]">
                No Inversion Computed Yet
              </h3>
              <p className="text-xs text-[#95BDD7] max-w-sm mx-auto">
                {hasAlerts
                  ? 'Sensor anomalies are detected! Click "RUN BAYESIAN INVERSION" above to rank the most plausible source nodes.'
                  : 'Start a contamination simulation from the Command Center or advance flow steps to observe sensor anomalies.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Network Topology Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="w-full h-[620px] rounded-xl overflow-hidden border border-[#24B1B1]/25 bg-[#086288]">
            <NetworkCanvas />
          </div>
        </div>
      </div>
    </main>
  );
};
