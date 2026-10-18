import React from 'react';
import { CheckSquare, Shield, Users } from 'lucide-react';
import { useApp } from '../../state/appStore';

export const AdvisoryPanel: React.FC = () => {
  const { simState, investigation, network } = useApp();

  const isIncident = simState?.status === 'INCIDENT';
  if (!isIncident) return null;

  // Identify affected downstream zones based on top hypothesis
  const topCandidate = investigation?.top_candidates[0]?.node_id;

  const affectedZones = network?.nodes.filter(
    n => n.type === 'zone' && (topCandidate ? true : true)
  ).slice(0, 4) || [];

  const totalExposedHouseholds = affectedZones.reduce(
    (acc, z) => acc + (z.households || 0),
    0
  );

  return (
    <div className="p-4 rounded-xl bg-[#597928]/20 border border-[#91AC67]/50 text-[#EAF1F8] space-y-3 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#91AC67]/30">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-[#91AC67]" />
          <span className="font-serif font-bold text-sm text-[#91AC67]">
            Community Water Advisory (Illustrative)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#597928]/40 text-[#91AC67] border border-[#91AC67]/40 uppercase">
          Educational example, not a real advisory
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Checklist */}
        <div className="space-y-2">
          <span className="font-semibold text-xs text-[#EAF1F8] block">
            General Containment Protocol:
          </span>
          <ul className="space-y-1.5 text-[#9FB0C9]">
            <li className="flex items-start gap-2">
              <CheckSquare size={14} className="text-[#91AC67] shrink-0 mt-0.5" />
              <span>Isolate transmission valves feeding downstream affected distribution branches.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckSquare size={14} className="text-[#91AC67] shrink-0 mt-0.5" />
              <span>Switch community standposts to verified alternate deep-borewell supplies.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckSquare size={14} className="text-[#91AC67] shrink-0 mt-0.5" />
              <span>Dispatch field teams for H2S vial microbial verification and chlorine dosing.</span>
            </li>
          </ul>
        </div>

        {/* Affected Zones Summary */}
        <div className="p-3 bg-[#0D1630]/60 rounded-lg border border-[#91AC67]/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#9FB0C9] flex items-center gap-1.5">
              <Users size={14} className="text-[#91AC67]" />
              Potentially Affected Hamlets:
            </span>
            <span className="font-mono font-bold text-[#91AC67]">
              {totalExposedHouseholds} households (synthetic)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {affectedZones.map(z => (
              <span
                key={z.id}
                className="px-2 py-0.5 rounded bg-[#1D2A52] text-[#EAF1F8] text-[10px] font-mono border border-[#425B9A]/40"
              >
                {z.label} ({z.households} hh)
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
