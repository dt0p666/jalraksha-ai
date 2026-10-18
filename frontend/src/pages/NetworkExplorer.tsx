import React, { useState } from 'react';
import { useApp } from '../state/appStore';
import { NetworkCanvas } from '../components/network/NetworkCanvas';
import { NetworkScene3D } from '../components/network/NetworkScene3D';
import { NodeInspector } from '../components/panels/NodeInspector';
import {
  Search,
  Filter,
  Droplets,
  Radio,
  Home,
  Disc,
  Box,
  Map,
  Compass,
} from 'lucide-react';

export const NetworkExplorer: React.FC = () => {
  const { network, viewMode, setViewMode, inspectedNodeId, setInspectedNodeId } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const nodes = network?.nodes || [];
  const edges = network?.edges || [];

  const filteredNodes = nodes.filter(n => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'reservoir' && n.type === 'reservoir') ||
      (filterType === 'sensor' && n.has_sensor) ||
      (filterType === 'zone' && n.type === 'zone') ||
      (filterType === 'junction' && n.type === 'junction');

    const matchesSearch =
      n.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.label.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <main
      id="main-content"
      className="w-full min-h-[calc(100vh-62px)] flex flex-col p-4 sm:p-6 gap-4 max-w-7xl mx-auto"
    >
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#446882] border border-[#08C4E1]/25">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#F8F3EF] flex items-center gap-2">
            <Compass size={22} className="text-[#08C4E1]" />
            <span>Water Network Explorer</span>
          </h1>
          <p className="text-xs text-[#F8F3EF] mt-0.5">
            Inspect physical graph topology, hydraulic head elevations, and IoT sensor placements.
          </p>
        </div>

        {/* View Mode & Counts */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-0.5 rounded-lg bg-[#1C3C53] border border-[#08C4E1]/30 text-xs">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === '3d'
                  ? 'bg-[#08C4E1] text-[#1C3C53] font-bold shadow-sm'
                  : 'text-[#F8F3EF] hover:text-[#F8F3EF]'
              }`}
            >
              <Box size={14} />
              <span>3D Infrastructure View</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === '2d'
                  ? 'bg-[#08C4E1] text-[#1C3C53] font-bold shadow-sm'
                  : 'text-[#F8F3EF] hover:text-[#F8F3EF]'
              }`}
            >
              <Map size={14} />
              <span>2D Flow Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Column (8 cols): Large Interactive Map/3D Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* Quick Filter Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[#446882] border border-[#08C4E1]/20 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#F8F3EF] flex items-center gap-1 pl-1">
                <Filter size={12} className="text-[#08C4E1]" /> Filter:
              </span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-[#08C4E1]/20 text-[#08C4E1] border border-[#08C4E1]/40'
                    : 'text-[#F8F3EF] hover:text-[#F8F3EF] hover:bg-[#446882]'
                }`}
              >
                All ({nodes.length})
              </button>
              <button
                onClick={() => setFilterType('reservoir')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  filterType === 'reservoir'
                    ? 'bg-[#08C4E1]/20 text-[#08C4E1] border border-[#08C4E1]/40'
                    : 'text-[#F8F3EF] hover:text-[#F8F3EF] hover:bg-[#446882]'
                }`}
              >
                <Droplets size={12} className="text-[#08C4E1]" />
                <span>Reservoirs (2)</span>
              </button>
              <button
                onClick={() => setFilterType('sensor')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  filterType === 'sensor'
                    ? 'bg-[#F5E6BB]/20 text-[#F5E6BB] border border-[#F5E6BB]/40'
                    : 'text-[#F8F3EF] hover:text-[#F8F3EF] hover:bg-[#446882]'
                }`}
              >
                <Radio size={12} className="text-[#F5E6BB]" />
                <span>Sensors (8)</span>
              </button>
              <button
                onClick={() => setFilterType('zone')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  filterType === 'zone'
                    ? 'bg-[#F5E6BB]/20 text-[#F5E6BB] border border-[#F5E6BB]/40'
                    : 'text-[#F8F3EF] hover:text-[#F8F3EF] hover:bg-[#446882]'
                }`}
              >
                <Home size={12} className="text-[#F5E6BB]" />
                <span>Zones (8)</span>
              </button>
              <button
                onClick={() => setFilterType('junction')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  filterType === 'junction'
                    ? 'bg-[#F8F3EF]/20 text-[#F8F3EF] border border-[#F8F3EF]/40'
                    : 'text-[#F8F3EF] hover:text-[#F8F3EF] hover:bg-[#446882]'
                }`}
              >
                <Disc size={12} className="text-[#F8F3EF]" />
                <span>Junctions (24)</span>
              </button>
            </div>

            {/* Quick Node Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2 text-[#F8F3EF]" />
              <input
                type="text"
                placeholder="Find node (e.g. J-05)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-md bg-[#1C3C53] border border-[#08C4E1]/25 text-[11px] text-[#F8F3EF] placeholder-[#F8F3EF]/50 focus:outline-none focus:border-[#08C4E1] w-40 sm:w-48 font-mono"
              />
            </div>
          </div>

          {/* Quick Node Selection Scroller */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
            {filteredNodes.slice(0, 18).map(n => (
              <button
                key={n.id}
                onClick={() => setInspectedNodeId(n.id)}
                className={`px-2 py-0.5 rounded-md font-mono text-[10px] whitespace-nowrap transition-colors ${
                  inspectedNodeId === n.id
                    ? 'bg-[#08C4E1] text-[#1C3C53] font-bold shadow-sm'
                    : 'bg-[#446882] text-[#F8F3EF] hover:text-[#F8F3EF] border border-[#08C4E1]/20'
                }`}
              >
                {n.id}
              </button>
            ))}
            {filteredNodes.length > 18 && (
              <span className="text-[10px] font-mono text-[#F8F3EF] px-1">
                +{filteredNodes.length - 18} more
              </span>
            )}
          </div>

          {/* Network Canvas */}
          <div className="w-full h-[620px] rounded-xl overflow-hidden border border-[#08C4E1]/25 bg-[#1C3C53]">
            {viewMode === '3d' ? <NetworkScene3D /> : <NetworkCanvas />}
          </div>
        </div>

        {/* Right Column (4 cols): Detailed Node Inspector & Network Metadata */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <NodeInspector />

          {/* Topology Quick Reference Card */}
          <div className="p-4 rounded-xl bg-[#446882] border border-[#08C4E1]/25 space-y-3 text-xs">
            <h3 className="font-heading font-bold text-sm text-[#F8F3EF]">
              EPANET Physical Calibration
            </h3>
            <p className="text-[#F8F3EF] text-xs leading-relaxed">
              The distribution network model is calibrated with EPANET hydraulic parameters: Hazen-Williams roughness coefficients, gravity head differential from storage tanks R1 (250m) and R2 (240m), and travel delays proportional to pipe length and flow velocities.
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
              <div className="p-2 rounded bg-[#1C3C53] border border-[#08C4E1]/15">
                <span className="text-[#F8F3EF] block text-[10px]">Total Pipelines</span>
                <strong className="text-[#08C4E1] text-sm">{edges.length} pipes</strong>
              </div>
              <div className="p-2 rounded bg-[#1C3C53] border border-[#08C4E1]/15">
                <span className="text-[#F8F3EF] block text-[10px]">Supply Gravity Head</span>
                <strong className="text-[#F5E6BB] text-sm">30m - 50m</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
