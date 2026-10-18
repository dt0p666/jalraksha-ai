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
    <div className="w-full bg-[#007979] border border-[#24B1B1]/30 rounded-xl p-3 sm:p-4 shadow-2xl space-y-3 animate-fadeIn">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#24B1B1]/20">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[#24B1B1]" />
          <h3 className="font-heading font-bold text-sm text-[#95BDD7]">
            Live Sensor Observations & Telemetry
          </h3>
          {alertCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#D9D28B]/20 text-[#D9D28B] border border-[#D9D28B]/40 animate-pulse">
              <AlertTriangle size={11} />
              <span>{alertCount} anomaly threshold breach{alertCount > 1 ? 'es' : ''}</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setSensorDrawerOpen(false)}
          className="p-1 rounded-lg text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979] transition-colors"
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
