import React from 'react';
import { ShieldAlert, ShieldCheck, Activity, Droplets, Waves, Shuffle } from 'lucide-react';
import { useApp } from '../../state/appStore';
import { CopyButton } from '../ui/CopyButton';
import { ExplainButton } from '../ui/ExplainButton';

export const StatsOverview: React.FC = () => {
  const { network, simState, activeSeed } = useApp();

  const status = simState?.status || 'NORMAL';
  const alertCount = simState?.alert_count || 0;
  const isIncident = status === 'INCIDENT';
  const isWarning = status === 'WARNING';

  const demoSeedUrl = `${window.location.origin}/command-center?seed=${activeSeed}`;

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#141E3D] border border-[#425B9A]/30 rounded-xl text-[#EAF1F8] shadow-sm">
      {/* Network Status Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#425B9A]/30">
        <div className="flex items-center gap-2">
          {isIncident ? (
            <ShieldAlert size={20} className="text-[#D9534F] animate-pulse" />
          ) : isWarning ? (
            <ShieldAlert size={20} className="text-[#E8A33D]" />
          ) : (
            <ShieldCheck size={20} className="text-[#91AC67]" />
          )}
          <span className="font-serif font-bold text-base tracking-wide">Network Status</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider ${
              isIncident
                ? 'bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40'
                : isWarning
                ? 'bg-[#E8A33D]/20 text-[#E8A33D] border border-[#E8A33D]/40'
                : 'bg-[#91AC67]/20 text-[#91AC67] border border-[#91AC67]/40'
            }`}
          >
            {status}
          </span>
          <ExplainButton
            title="Network Operational Status"
            explanation="NORMAL when all 8 monitoring sensors read within calibrated baseline conductivity. Switches to WARNING when one sensor spikes, and INCIDENT when 2 or more sensors confirm abnormal plume arrival."
            contextData={{
              Status: status,
              'Active Sensor Alerts': alertCount,
              'Incident Trigger Threshold': '>= 2 alarmed sensors',
            }}
          />
        </div>
      </div>

      {/* Grid of Key Infrastructure Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-[#0D1630] rounded-lg border border-[#425B9A]/20 flex flex-col justify-between">
          <span className="text-[#9FB0C9] flex items-center gap-1">
            <Waves size={13} className="text-[#76C0EC]" />
            Total Nodes
          </span>
          <span className="font-mono text-base font-bold text-[#EAF1F8] mt-1">
            {network?.total_nodes || 42}
          </span>
          <span className="text-[10px] text-[#9FB0C9]">2 Res • 32 Junc • 8 Zones</span>
        </div>

        <div className="p-2.5 bg-[#0D1630] rounded-lg border border-[#425B9A]/20 flex flex-col justify-between">
          <span className="text-[#9FB0C9] flex items-center gap-1">
            <Activity size={13} className="text-[#76C0EC]" />
            Active Sensors
          </span>
          <span className="font-mono text-base font-bold text-[#76C0EC] mt-1">
            {network?.sensors.length || 8} / 8
          </span>
          <span className="text-[10px] text-[#9FB0C9]">Conductivity Telemetry</span>
        </div>

        <div className="p-2.5 bg-[#0D1630] rounded-lg border border-[#425B9A]/20 flex flex-col justify-between">
          <span className="text-[#9FB0C9] flex items-center gap-1">
            <Droplets size={13} className="text-[#76C0EC]" />
            Reservoirs
          </span>
          <span className="font-mono text-base font-bold text-[#EAF1F8] mt-1">
            R1 & R2
          </span>
          <span className="text-[10px] text-[#9FB0C9]">Gravity pressure head</span>
        </div>

        <div className="p-2.5 bg-[#0D1630] rounded-lg border border-[#425B9A]/20 flex flex-col justify-between">
          <span className="text-[#9FB0C9] flex items-center gap-1">
            <ShieldAlert size={13} className={alertCount > 0 ? 'text-[#D9534F]' : 'text-[#91AC67]'} />
            Active Alerts
          </span>
          <span className={`font-mono text-base font-bold mt-1 ${alertCount > 0 ? 'text-[#D9534F]' : 'text-[#91AC67]'}`}>
            {alertCount}
          </span>
          <span className="text-[10px] text-[#9FB0C9]">&gt; 230 umhos/cm threshold</span>
        </div>
      </div>

      {/* Demo Seed Bar */}
      <div className="mt-1 pt-2 border-t border-[#425B9A]/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#9FB0C9]">
          <Shuffle size={13} />
          <span>Demo Seed:</span>
          <span className="font-mono text-[#76C0EC] font-semibold">{activeSeed}</span>
        </div>
        <CopyButton textToCopy={demoSeedUrl} label="Share Seed" />
      </div>
    </div>
  );
};
