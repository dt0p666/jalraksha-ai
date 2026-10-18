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
      title: 'Reservoir Outlet Breach',
      desc: 'Simulates a major contamination breach originating at storage reservoirs R1 (North High) or R2 (East Hill).',
      icon: Droplet,
    },
    {
      id: 'junction',
      title: 'Pipeline Main Junction Infiltration',
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
      title="Inject Contamination Scenario"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#F8F3EF]">
        <p className="text-[#F8F3EF] text-xs leading-relaxed">
          Select an origin scenario. The exact source node will remain strictly hidden inside the server session
          until you choose to reveal it during the investigation.
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
                    ? 'bg-[#446882] border-[#08C4E1] text-[#F8F3EF] shadow-lg shadow-[#08C4E1]/10'
                    : 'bg-[#1C3C53] border-[#08C4E1]/20 text-[#F8F3EF] hover:border-[#08C4E1]/40'
                }`}
              >
                <input
                  type="radio"
                  name="sourceType"
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => setSourceType(opt.id)}
                  className="mt-0.5 text-[#08C4E1] focus:ring-[#08C4E1]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-[#F8F3EF]">
                    <Icon size={14} className={isSelected ? 'text-[#08C4E1]' : 'text-[#F8F3EF]'} />
                    <span>{opt.title}</span>
                  </div>
                  <p className="text-[11px] text-[#F8F3EF] mt-0.5 leading-snug">{opt.desc}</p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Seed input for reproducible demonstrations */}
        <div className="p-3 bg-[#1C3C53] rounded-lg border border-[#08C4E1]/20 space-y-1">
          <label htmlFor="seed-input" className="font-semibold text-xs text-[#F8F3EF] flex items-center justify-between">
            <span>RNG Random Seed (Reproducibility):</span>
            <span className="text-[10px] text-[#08C4E1] font-mono">Calibrated physics</span>
          </label>
          <input
            id="seed-input"
            type="number"
            value={seed}
            onChange={e => setSeed(parseInt(e.target.value, 10) || 42)}
            className="w-full px-3 py-1.5 rounded bg-[#446882] border border-[#08C4E1]/30 text-sm font-mono text-[#F8F3EF] focus:border-[#08C4E1] focus:outline-none"
          />
          <span className="text-[10px] text-[#F8F3EF]">
            Identical seed values yield identical sensor noise and plume arrival trajectories.
          </span>
        </div>

        {/* Modal Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#08C4E1]/20">
          <button
            type="button"
            onClick={() => setStartModalOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#F8F3EF] hover:text-[#F8F3EF] hover:bg-[#446882] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-xs font-heading font-bold bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] shadow-lg shadow-[#08C4E1]/25 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Play size={13} fill="currentColor" />
            <span>START CONTAMINATION</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
