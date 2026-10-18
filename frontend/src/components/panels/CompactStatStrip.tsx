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
    <div className="w-full flex flex-wrap items-center justify-between gap-2.5 p-2.5 px-3.5 rounded-xl bg-[#007979]/95 border border-[#24B1B1]/25 text-xs text-[#95BDD7] backdrop-blur-md select-none shadow-xl">
      {/* 4 Compact Stat Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. Network Points */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#086288] border border-[#24B1B1]/20"
          title="Network structure: 2 water tanks, 32 pipe junctions, 8 village supply zones"
        >
          <MapPin size={13} className="text-[#24B1B1]" />
          <span>
            <strong className="font-mono text-[#95BDD7]">{totalNodes}</strong> Nodes (
            <span className="text-[#95BDD7]">{reservoirsCount} Reservoirs, {junctionsCount} Junctions, {zonesCount} Zones</span>)
          </span>
        </div>

        {/* 2. Sensors Online */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#086288] border border-[#24B1B1]/20"
          title="Automated conductivity sensors installed at key network junctions"
        >
          <Radio size={13} className="text-[#D9D28B]" />
          <span>
            <strong className="font-mono text-[#95BDD7]">{sensorsCount}</strong> Sensors Active
          </span>
        </div>

        {/* 3. Storage Tanks */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#086288] border border-[#24B1B1]/20"
          title="Elevated clean water storage tanks feeding the gravity network"
        >
          <Building2 size={13} className="text-[#24B1B1]" />
          <span>
            <strong className="font-mono text-[#95BDD7]">{reservoirsCount}</strong> Reservoirs
          </span>
        </div>

        {/* 4. Active Alerts */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
            alertCount > 0
              ? 'bg-[#D9D28B]/20 border-[#D9D28B]/50 text-[#D9D28B] animate-pulse'
              : 'bg-[#086288] border-[#D9D28B]/30 text-[#D9D28B]'
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
              ? 'bg-[#24B1B1]/20 text-[#24B1B1] border-[#24B1B1]/50'
              : 'bg-[#086288] text-[#95BDD7] hover:text-[#95BDD7] border-[#24B1B1]/20 hover:bg-[#007979]'
          }`}
          title="Toggle telemetry charts drawer"
        >
          <Activity size={13} className={alertCount > 0 ? 'text-[#D9D28B]' : 'text-[#24B1B1]'} />
          <span>Telemetry</span>
          {sensorDrawerOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>

        {/* 3D | 2D Graph View Toggle */}
        <div
          className="flex items-center p-0.5 rounded-lg bg-[#086288] border border-[#24B1B1]/30 text-xs font-medium"
          role="group"
          aria-label="View Mode Toggle"
        >
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === '3d'
                ? 'bg-[#24B1B1] text-[#086288] shadow-sm font-bold'
                : 'text-[#95BDD7] hover:text-[#95BDD7]'
            }`}
            aria-pressed={viewMode === '3d'}
          >
            <Box size={13} />
            <span>3D View</span>
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === '2d'
                ? 'bg-[#24B1B1] text-[#086288] shadow-sm font-bold'
                : 'text-[#95BDD7] hover:text-[#95BDD7]'
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
