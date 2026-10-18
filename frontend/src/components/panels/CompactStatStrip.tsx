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
    <div className="w-full flex flex-wrap items-center justify-between gap-2.5 p-2 px-3 rounded-xl bg-[#152248]/90 border border-[#425B9A]/35 text-xs text-[#EAF1F8] backdrop-blur-sm select-none">
      {/* 4 Compact Stat Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. Network Points */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1733]/80 border border-[#425B9A]/30"
          title="Network structure: 2 water tanks, 32 pipe junctions, 8 village supply zones"
        >
          <MapPin size={13} className="text-[#76C0EC]" />
          <span>
            <strong className="font-mono text-[#EAF1F8]">{totalNodes}</strong> points (
            <span className="text-[#9FB0C9]">{reservoirsCount} tanks, {junctionsCount} junctions, {zonesCount} villages</span>)
          </span>
        </div>

        {/* 2. Sensors Online */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1733]/80 border border-[#425B9A]/30"
          title="Automated conductivity sensors installed at key network junctions"
        >
          <Radio size={13} className="text-[#76C0EC]" />
          <span>
            <strong className="font-mono text-[#EAF1F8]">{sensorsCount}</strong> sensors online
          </span>
        </div>

        {/* 3. Storage Tanks */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1733]/80 border border-[#425B9A]/30"
          title="Elevated clean water storage tanks feeding the gravity network"
        >
          <Building2 size={13} className="text-[#425B9A]" />
          <span>
            <strong className="font-mono text-[#EAF1F8]">{reservoirsCount}</strong> supply tanks
          </span>
        </div>

        {/* 4. Active Alerts */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
            alertCount > 0
              ? 'bg-[#D9534F]/20 border-[#D9534F]/50 text-[#D9534F] animate-pulse'
              : 'bg-[#597928]/25 border-[#91AC67]/40 text-[#91AC67]'
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
              ? 'bg-[#425B9A]/40 text-[#76C0EC] border-[#76C0EC]/40'
              : 'bg-[#0E1733]/80 text-[#9FB0C9] hover:text-[#EAF1F8] border-[#425B9A]/30 hover:bg-[#1E2F62]'
          }`}
          title="Toggle sensor readings telemetry chart"
        >
          <Activity size={13} className={alertCount > 0 ? 'text-[#E8A33D]' : 'text-[#76C0EC]'} />
          <span>Sensor readings</span>
          {sensorDrawerOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>

        {/* 3D | Map View Toggle */}
        <div
          className="flex items-center p-0.5 rounded-lg bg-[#0E1733] border border-[#425B9A]/40 text-xs font-medium"
          role="group"
          aria-label="View Mode Toggle"
        >
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === '3d'
                ? 'bg-[#425B9A] text-white shadow-sm font-semibold'
                : 'text-[#9FB0C9] hover:text-[#EAF1F8]'
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
                ? 'bg-[#425B9A] text-white shadow-sm font-semibold'
                : 'text-[#9FB0C9] hover:text-[#EAF1F8]'
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
