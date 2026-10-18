import React from 'react';
import { X, MapPin, ArrowDownRight, ArrowUpRight, Activity, Target, AlertTriangle } from 'lucide-react';
import { useApp } from '../../state/appStore';
import { CopyButton } from '../ui/CopyButton';

export const NodeInspector: React.FC = () => {
  const {
    network,
    simState,
    inspectedNodeId,
    setInspectedNodeId,
    collectedSamples,
    collectSample,
  } = useApp();

  if (!inspectedNodeId || !network) return null;

  const node = network.nodes.find(n => n.id === inspectedNodeId);
  if (!node) return null;

  // Find upstream edges (feeding into this node) and downstream edges (fed by this node)
  const incoming = network.edges.filter(e => e.to === node.id);
  const outgoing = network.edges.filter(e => e.from === node.id);

  // Latest sensor reading if fixed sensor
  const sensorReading = simState?.sensor_readings.find(r => r.node_id === node.id);
  const sampleData = collectedSamples[node.id];

  const canSample = !sampleData && !node.has_sensor && (simState?.budget_remaining || 0) > 0;

  return (
    <div className="p-4 bg-[#0D1B26] border border-[#38D9E6]/30 rounded-xl text-[#EAF4F7] shadow-2xl animate-fadeIn text-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#38D9E6]/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#071018] border border-[#38D9E6]/30 text-[#38D9E6]">
            <MapPin size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#38D9E6]">{node.id}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#071018] text-[#8EA5B4] border border-[#38D9E6]/25 uppercase font-mono">
                {node.type}
              </span>
            </div>
            <span className="text-[11px] text-[#8EA5B4] block">{node.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <CopyButton textToCopy={node.id} label={node.id} />
          <button
            onClick={() => setInspectedNodeId(null)}
            className="p-1 text-[#8EA5B4] hover:text-[#EAF4F7] rounded hover:bg-[#132535] transition-colors"
            aria-label="Close inspector"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2 bg-[#071018] rounded border border-[#38D9E6]/15">
          <span className="text-[#8EA5B4] block">Elevation</span>
          <span className="font-mono text-[#EAF4F7] font-semibold">
            {node.elevation_m ? `${node.elevation_m} m` : '200.0 m'}
          </span>
        </div>

        <div className="p-2 bg-[#071018] rounded border border-[#38D9E6]/15">
          <span className="text-[#8EA5B4] block">Supply Reach</span>
          <span className="font-mono text-[#EAF4F7] font-semibold">
            {node.households ? `${node.households} households` : 'Distribution Junction'}
          </span>
        </div>
      </div>

      {/* Upstream & Downstream Topology */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1 text-[#8EA5B4]">
          <ArrowUpRight size={13} className="text-[#38D9E6]" />
          <span>Fed from:</span>
          <span className="font-mono text-[#EAF4F7]">
            {incoming.length > 0 ? incoming.map(e => e.from).join(', ') : 'None (Reservoir Origin)'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#8EA5B4]">
          <ArrowDownRight size={13} className="text-[#64F4C4]" />
          <span>Feeds into:</span>
          <span className="font-mono text-[#EAF4F7]">
            {outgoing.length > 0 ? outgoing.map(e => e.to).join(', ') : 'Terminal Supply Zone'}
          </span>
        </div>
      </div>

      {/* Sensor / Sample Measurement Status */}
      <div className="p-2.5 bg-[#071018] rounded-lg border border-[#38D9E6]/25 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#38D9E6] flex items-center gap-1.5">
            {node.has_sensor ? <Activity size={14} /> : <Target size={14} />}
            {node.has_sensor ? 'Fixed IoT Sensor Telemetry' : 'Field Grab Sample'}
          </span>
          {sensorReading?.is_alert || sampleData?.is_alert ? (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#FF5E66]/20 text-[#FF5E66] font-bold border border-[#FF5E66]/40 flex items-center gap-1">
              <AlertTriangle size={10} /> ANOMALY
            </span>
          ) : (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#64F4C4]/20 text-[#64F4C4] font-bold border border-[#64F4C4]/40">
              NORMAL
            </span>
          )}
        </div>

        {sensorReading ? (
          <div className="flex items-baseline justify-between text-xs pt-1">
            <span className="text-[#8EA5B4]">Conductivity:</span>
            <span className="font-mono font-bold text-[#38D9E6]">
              {sensorReading.value.toFixed(1)} µS/cm
            </span>
          </div>
        ) : sampleData ? (
          <div className="space-y-1 pt-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#8EA5B4]">Sampled Conductivity:</span>
              <span className="font-mono font-bold text-[#64F4C4]">{sampleData.reading.toFixed(1)} µS/cm</span>
            </div>
            {sampleData.multi_parameter_sample && (
              <div className="pt-1.5 border-t border-[#38D9E6]/15 grid grid-cols-2 gap-1 text-[10px] text-[#8EA5B4]">
                <div>pH: <span className="text-[#EAF4F7] font-mono">{sampleData.multi_parameter_sample.ph}</span></div>
                <div>D.O.: <span className="text-[#EAF4F7] font-mono">{sampleData.multi_parameter_sample.dissolved_oxygen} mg/l</span></div>
                <div>Turbidity: <span className="text-[#EAF4F7] font-mono">{sampleData.multi_parameter_sample.turbidity_ntu} NTU</span></div>
                <div>Step: <span className="text-[#EAF4F7] font-mono">{sampleData.step}</span></div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-[#8EA5B4] pt-1">
            No telemetry sensor permanently mounted at this node.
          </div>
        )}
      </div>

      {/* Grab Sample Action */}
      {canSample && (
        <button
          onClick={() => collectSample(node.id)}
          className="w-full py-2 px-3 rounded-lg bg-[#38D9E6] hover:bg-[#38D9E6]/90 text-[#071018] font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] shadow-md shadow-[#38D9E6]/25"
        >
          <Target size={14} />
          <span>Collect Water Sample at {node.id}</span>
        </button>
      )}
    </div>
  );
};
