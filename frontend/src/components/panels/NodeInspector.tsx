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
    <div className="p-4 bg-[#141E3D] border border-[#425B9A]/40 rounded-xl text-[#EAF1F8] shadow-md animate-fadeIn text-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#425B9A]/30">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#425B9A]/30 text-[#76C0EC]">
            <MapPin size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#76C0EC]">{node.id}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1630] text-[#9FB0C9] border border-[#425B9A]/30 uppercase">
                {node.type}
              </span>
            </div>
            <span className="text-[11px] text-[#9FB0C9] block">{node.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <CopyButton textToCopy={node.id} label={node.id} />
          <button
            onClick={() => setInspectedNodeId(null)}
            className="p-1 text-[#9FB0C9] hover:text-[#76C0EC] rounded hover:bg-[#1D2A52]"
            aria-label="Close inspector"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2 bg-[#0D1630] rounded border border-[#425B9A]/20">
          <span className="text-[#9FB0C9] block">Elevation</span>
          <span className="font-mono text-[#EAF1F8] font-semibold">
            {node.elevation_m ? `${node.elevation_m} m` : '200.0 m'}
          </span>
        </div>

        <div className="p-2 bg-[#0D1630] rounded border border-[#425B9A]/20">
          <span className="text-[#9FB0C9] block">Households</span>
          <span className="font-mono text-[#EAF1F8] font-semibold">
            {node.households ? `${node.households} (synthetic)` : 'N/A (Junction)'}
          </span>
        </div>
      </div>

      {/* Upstream & Downstream Topology */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1 text-[#9FB0C9]">
          <ArrowUpRight size={13} className="text-[#76C0EC]" />
          <span>Fed from:</span>
          <span className="font-mono text-[#EAF1F8]">
            {incoming.length > 0 ? incoming.map(e => e.from).join(', ') : 'None (Reservoir Origin)'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#9FB0C9]">
          <ArrowDownRight size={13} className="text-[#91AC67]" />
          <span>Feeds into:</span>
          <span className="font-mono text-[#EAF1F8]">
            {outgoing.length > 0 ? outgoing.map(e => e.to).join(', ') : 'Terminal Supply Zone'}
          </span>
        </div>
      </div>

      {/* Sensor / Sample Measurement Status */}
      <div className="p-2.5 bg-[#0D1630] rounded-lg border border-[#425B9A]/30 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#76C0EC] flex items-center gap-1.5">
            {node.has_sensor ? <Activity size={14} /> : <Target size={14} />}
            {node.has_sensor ? 'Fixed Sensor Telemetry' : 'Field Sample Reading'}
          </span>
          {sensorReading?.is_alert || sampleData?.is_alert ? (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#D9534F]/20 text-[#D9534F] font-bold border border-[#D9534F]/40 flex items-center gap-1">
              <AlertTriangle size={10} /> ALERT
            </span>
          ) : (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#91AC67]/20 text-[#91AC67] font-bold border border-[#91AC67]/40">
              NORMAL
            </span>
          )}
        </div>

        {sensorReading ? (
          <div className="flex items-baseline justify-between text-xs pt-1">
            <span className="text-[#9FB0C9]">Conductivity:</span>
            <span className="font-mono font-bold text-[#EAF1F8]">
              {sensorReading.value} umhos/cm
            </span>
          </div>
        ) : sampleData ? (
          <div className="space-y-1 pt-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#9FB0C9]">Sampled Conductivity:</span>
              <span className="font-mono font-bold text-[#EAF1F8]">{sampleData.reading} umhos/cm</span>
            </div>
            {sampleData.multi_parameter_sample && (
              <div className="pt-1.5 border-t border-[#425B9A]/20 grid grid-cols-2 gap-1 text-[10px] text-[#9FB0C9]">
                <div>pH: <span className="text-[#EAF1F8] font-mono">{sampleData.multi_parameter_sample.ph}</span></div>
                <div>D.O.: <span className="text-[#EAF1F8] font-mono">{sampleData.multi_parameter_sample.dissolved_oxygen} mg/l</span></div>
                <div>Turbidity: <span className="text-[#EAF1F8] font-mono">{sampleData.multi_parameter_sample.turbidity_ntu} NTU</span></div>
                <div>Step: <span className="text-[#EAF1F8] font-mono">{sampleData.step}</span></div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-[#9FB0C9] pt-1">
            No telemetry sensor permanently mounted at this node.
          </div>
        )}
      </div>

      {/* Grab Sample Action */}
      {canSample && (
        <button
          onClick={() => collectSample(node.id)}
          className="w-full py-2 px-3 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white font-semibold text-xs border border-[#76C0EC]/50 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Target size={14} />
          <span>Take a water sample at {node.id}</span>
        </button>
      )}
    </div>
  );
};
