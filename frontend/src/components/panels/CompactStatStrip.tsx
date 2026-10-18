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
    <div className="w-full flex flex-wrap items-center justify-between gap-2.5 p-2.5 px-3.5 rounded-xl bg-[#0D1B26]/95 border border-[#38D9E6]/25 text-xs text-[#EAF4F7] backdrop-blur-md select-none shadow-xl">
      {/* 4 Compact Stat Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. Network Points */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071018] border border-[#38D9E6]/20"
          title="Network structure: 2 water tanks, 32 pipe junctions, 8 village supply zones"
        >
          <MapPin size={13} className="text-[#38D9E6]" />
          <span>
            <strong className="font-mono text-[#EAF4F7]">{totalNodes}</strong> Nodes (
            <span className="text-[#8EA5B4]">{reservoirsCount} Reservoirs, {junctionsCount} Junctions, {zonesCount} Zones</span>)
          </span>
        </div>

        {/* 2. Sensors Online */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071018] border border-[#38D9E6]/20"
          title="Automated conductivity sensors installed at key network junctions"
        >
          <Radio size={13} className="text-[#64F4C4]" />
          <span>
            <strong className="font-mono text-[#EAF4F7]">{sensorsCount}</strong> Sensors Active
          </span>
        </div>

        {/* 3. Storage Tanks */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071018] border border-[#38D9E6]/20"
          title="Elevated clean water storage tanks feeding the gravity network"
        >
          <Building2 size={13} className="text-[#38D9E6]" />
          <span>
            <strong className="font-mono text-[#EAF4F7]">{reservoirsCount}</strong> Reservoirs
          </span>
        </div>

        {/* 4. Active Alerts */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
            alertCount > 0
              ? 'bg-[#FF5E66]/20 border-[#FF5E66]/50 text-[#FF5E66] animate-pulse'
              : 'bg-[#071018] border-[#64F4C4]/30 text-[#64F4C4]'
          }`}
          title={
            alertCount > 0
              ? `${alertCount} sensor(s) reading conductivity above physical baseline threshold`
              : 'All sensor readings within normal baseline levels'
          }
        >
          {alertCount > 0 ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
          <span>
            <strong className="font-mono">{alertCount}</strong> {alertCount === 1 ? 'Anomaly' : 'Anomalies'}
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
              ? 'bg-[#38D9E6]/20 text-[#38D9E6] border-[#38D9E6]/50'
              : 'bg-[#071018] text-[#8EA5B4] hover:text-[#EAF4F7] border-[#38D9E6]/20 hover:bg-[#132535]'
          }`}
          title="Toggle telemetry charts drawer"
        >
          <Activity size={13} className={alertCount > 0 ? 'text-[#FFB547]' : 'text-[#38D9E6]'} />
          <span>Telemetry</span>
          {sensorDrawerOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>

        {/* 3D | 2D Graph View Toggle */}
        <div
          className="flex items-center p-0.5 rounded-lg bg-[#071018] border border-[#38D9E6]/30 text-xs font-medium"
          role="group"
          aria-label="View Mode Toggle"
        >
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === '3d'
                ? 'bg-[#38D9E6] text-[#071018] shadow-sm font-bold'
                : 'text-[#8EA5B4] hover:text-[#EAF4F7]'
            }`}
            aria-pressed={viewMode === '3d'}
          >
            <Box size={13} />
            <span>3D Twin</span>
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === '2d'
                ? 'bg-[#38D9E6] text-[#071018] shadow-sm font-bold'
                : 'text-[#8EA5B4] hover:text-[#EAF4F7]'
            }`}
            aria-pressed={viewMode === '2d'}
          >
            <Map size={13} />
            <span>2D Flow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
