import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Droplet, GitBranch, Shuffle, Play } from 'lucide-react';
import { useApp } from '../../state/appStore';

export const StartContaminationModal: React.FC = () => {
  const { startModalOpen, setStartModalOpen, initSimulation, activeSeed } = useApp();
  const [sourceType, setSourceType] = useState<string>('random');
  const [seed, setSeed] = useState<number>(activeSeed);

  if (!startModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initSimulation(seed, sourceType);
    setStartModalOpen(false);
  };

  const options = [
    {
      id: 'random',
      title: 'Random Hidden Source (Recommended)',
      desc: 'Picks an undisclosed reservoir or junction across the entire 42-node network using the seeded RNG.',
      icon: Shuffle,
    },
    {
      id: 'reservoir',
      title: 'Reservoir Outlet',
      desc: 'Simulates a major breach originating at either North High (R1) or East Hill (R2) storage reservoirs.',
      icon: Droplet,
    },
    {
      id: 'junction',
      title: 'Pipeline Main Junction',
      desc: 'Simulates back-siphonage or pipe breach at an intermediate trunk transmission junction.',
      icon: GitBranch,
    },
    {
      id: 'branch',
      title: 'Distribution Sector Branch',
      desc: 'Simulates localized contamination along sub-sector branch pipelines feeding specific hamlets.',
      icon: GitBranch,
    },
  ];

  return (
    <Modal
      isOpen={startModalOpen}
      onClose={() => setStartModalOpen(false)}
      title="Start Simulated Contamination Event"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#EAF1F8]">
        <p className="text-[#9FB0C9] text-xs leading-relaxed">
          Select an origin scenario. The exact source node will remain strictly hidden inside the server session
          until you reveal it during the investigation.
        </p>

        {/* Source Category Radio List */}
        <div className="space-y-2">
          {options.map(opt => {
            const Icon = opt.icon;
            const isSelected = sourceType === opt.id;
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1D2A52] border-[#76C0EC] text-white shadow-sm'
                    : 'bg-[#0D1630] border-[#425B9A]/30 text-[#9FB0C9] hover:border-[#425B9A]/60'
                }`}
              >
                <input
                  type="radio"
                  name="sourceType"
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => setSourceType(opt.id)}
                  className="mt-0.5 text-[#76C0EC] focus:ring-[#76C0EC]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-[#EAF1F8]">
                    <Icon size={14} className={isSelected ? 'text-[#76C0EC]' : 'text-[#9FB0C9]'} />
                    <span>{opt.title}</span>
                  </div>
                  <p className="text-[11px] text-[#9FB0C9] mt-0.5 leading-snug">{opt.desc}</p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Seed input for reproducible stage demonstrations */}
        <div className="p-3 bg-[#0D1630] rounded-lg border border-[#425B9A]/30 space-y-1">
          <label htmlFor="seed-input" className="font-semibold text-xs text-[#EAF1F8] flex items-center justify-between">
            <span>RNG Random Seed (Demo Reproducibility):</span>
            <span className="text-[10px] text-[#76C0EC] font-mono">Fixed physics</span>
          </label>
          <input
            id="seed-input"
            type="number"
            value={seed}
            onChange={e => setSeed(parseInt(e.target.value, 10) || 42)}
            className="w-full px-3 py-1.5 rounded bg-[#141E3D] border border-[#425B9A]/40 text-sm font-mono text-[#EAF1F8] focus:border-[#76C0EC] focus:outline-none"
          />
          <span className="text-[10px] text-[#9FB0C9]">
            Identical seed values yield identical sensor noise and plume arrival trajectories.
          </span>
        </div>

        {/* Modal Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#425B9A]/30">
          <button
            type="button"
            onClick={() => setStartModalOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1D2A52] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#425B9A] hover:bg-[#4f6cb6] text-white border border-[#76C0EC]/50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Play size={13} fill="currentColor" />
            <span>Start contamination</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
