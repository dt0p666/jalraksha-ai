import React from 'react';
import { useApp } from '../../state/appStore';
import { TimelineBar } from './TimelineBar';
import { SensorChart } from './SensorChart';
import { Activity, X, AlertTriangle } from 'lucide-react';

export const SensorDrawer: React.FC = () => {
  const { sensorDrawerOpen, setSensorDrawerOpen, simState } = useApp();

  if (!sensorDrawerOpen) return null;

  const alertCount = simState?.alert_count || 0;

  return (
    <div className="w-full bg-[#152248] border border-[#425B9A]/40 rounded-xl p-3 sm:p-4 shadow-xl space-y-3 animate-fadeIn">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#425B9A]/30">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[#76C0EC]" />
          <h3 className="font-serif font-bold text-sm text-[#EAF1F8]">
            Sensor readings over time
          </h3>
          {alertCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#D9534F]/20 text-[#D9534F] border border-[#D9534F]/40">
              <AlertTriangle size={11} />
              <span>{alertCount} alert{alertCount > 1 ? 's' : ''} detected</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setSensorDrawerOpen(false)}
          className="p-1 rounded-lg text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1E2F62] transition-colors"
          aria-label="Close sensor readings drawer"
          title="Close drawer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Drawer Body: Timeline controls & live telemetry chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-4 flex flex-col justify-center">
          <TimelineBar />
        </div>
        <div className="lg:col-span-8">
          <SensorChart />
        </div>
      </div>
    </div>
  );
};
