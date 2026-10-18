import React from 'react';
import { useApp } from '../../state/appStore';
import {
  MapPin,
  Radio,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Box,
  Map,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const CompactStatStrip: React.FC = () => {
  const {
    network,
    simState,
    viewMode,
    setViewMode,
    sensorDrawerOpen,
    toggleSensorDrawer,
  } = useApp();

  const totalNodes = network?.total_nodes || 42;
  const reservoirsCount = network?.reservoirs?.length || 2;
  const zonesCount = network?.zones?.length || 8;
  const junctionsCount = totalNodes - reservoirsCount - zonesCount;
  const sensorsCount = network?.sensors?.length || 8;
  const alertCount = simState?.alert_count || 0;

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2.5 p-2 px-3 rounded-xl bg-[#0F2226]/90 border border-[#6FBEB2]/40 text-xs text-[#EAF7F5] backdrop-blur-md select-none">
      {/* 4 Compact Stat Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. Network Points */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#081416]/80 border border-[#6FBEB2]/30"
          title="Network structure: 2 water tanks, 32 pipe junctions, 8 village supply zones"
        >
          <MapPin size={13} className="text-[#A5E9DD]" />
          <span>
            <strong className="font-mono text-[#EAF7F5]">{totalNodes}</strong> points (
            <span className="text-[#6FBEB2]">{reservoirsCount} tanks, {junctionsCount} junctions, {zonesCount} villages</span>)
          </span>
        </div>

        {/* 2. Sensors Online */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#081416]/80 border border-[#6FBEB2]/30"
          title="Automated conductivity sensors installed at key network junctions"
        >
          <Radio size={13} className="text-[#A5E9DD]" />
          <span>
            <strong className="font-mono text-[#EAF7F5]">{sensorsCount}</strong> sensors online
          </span>
        </div>

        {/* 3. Storage Tanks */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#081416]/80 border border-[#6FBEB2]/30"
          title="Elevated clean water storage tanks feeding the gravity network"
        >
          <Building2 size={13} className="text-[#34908B]" />
          <span>
            <strong className="font-mono text-[#EAF7F5]">{reservoirsCount}</strong> supply tanks
          </span>
        </div>

        {/* 4. Active Alerts */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
            alertCount > 0
              ? 'bg-[#FF5C5C]/20 border-[#FF5C5C]/50 text-[#FF5C5C] animate-pulse'
              : 'bg-[#163238]/60 border-[#6FBEB2]/40 text-[#A5E9DD]'
          }`}
          title={
            alertCount > 0
              ? `${alertCount} sensor(s) reading conductivity above the 230 µS/cm threshold`
              : 'All sensor readings within normal baseline levels'
          }
        >
          {alertCount > 0 ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
          <span>
            <strong className="font-mono">{alertCount}</strong> {alertCount === 1 ? 'alert' : 'alerts'}
          </span>
        </div>
      </div>

      {/* Right Controls: 3D | Map View Toggle & Sensor Drawer Toggle */}
      <div className="flex items-center gap-2">
        {/* Sensor Readings Drawer Toggle */}
        <button
          onClick={toggleSensorDrawer}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
            sensorDrawerOpen
              ? 'bg-[#34908B]/40 text-[#A5E9DD] border-[#A5E9DD]/50'
              : 'bg-[#081416]/80 text-[#6FBEB2] hover:text-[#EAF7F5] border-[#6FBEB2]/40 hover:bg-[#163238]'
          }`}
          title="Toggle sensor readings telemetry chart"
        >
          <Activity size={13} className={alertCount > 0 ? 'text-[#FDF4AF]' : 'text-[#A5E9DD]'} />
          <span>Sensor readings</span>
          {sensorDrawerOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>

        {/* 3D | Map View Toggle */}
        <div
          className="flex items-center p-0.5 rounded-lg bg-[#081416] border border-[#6FBEB2]/50 text-xs font-medium"
          role="group"
          aria-label="View Mode Toggle"
        >
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === '3d'
                ? 'bg-[#34908B] text-[#EAF7F5] shadow-sm font-bold'
                : 'text-[#6FBEB2] hover:text-[#EAF7F5]'
            }`}
            aria-pressed={viewMode === '3d'}
          >
            <Box size={13} />
            <span>3D</span>
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === '2d'
                ? 'bg-[#34908B] text-[#EAF7F5] shadow-sm font-bold'
                : 'text-[#6FBEB2] hover:text-[#EAF7F5]'
            }`}
            aria-pressed={viewMode === '2d'}
          >
            <Map size={13} />
            <span>Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
