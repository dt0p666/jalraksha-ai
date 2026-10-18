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
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#95BDD7]">
        <p className="text-[#95BDD7] text-xs leading-relaxed">
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
                    ? 'bg-[#007979] border-[#24B1B1] text-[#95BDD7] shadow-lg shadow-[#24B1B1]/10'
                    : 'bg-[#086288] border-[#24B1B1]/20 text-[#95BDD7] hover:border-[#24B1B1]/40'
                }`}
              >
                <input
                  type="radio"
                  name="sourceType"
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => setSourceType(opt.id)}
                  className="mt-0.5 text-[#24B1B1] focus:ring-[#24B1B1]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-[#95BDD7]">
                    <Icon size={14} className={isSelected ? 'text-[#24B1B1]' : 'text-[#95BDD7]'} />
                    <span>{opt.title}</span>
                  </div>
                  <p className="text-[11px] text-[#95BDD7] mt-0.5 leading-snug">{opt.desc}</p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Seed input for reproducible demonstrations */}
        <div className="p-3 bg-[#086288] rounded-lg border border-[#24B1B1]/20 space-y-1">
          <label htmlFor="seed-input" className="font-semibold text-xs text-[#95BDD7] flex items-center justify-between">
            <span>RNG Random Seed (Reproducibility):</span>
            <span className="text-[10px] text-[#24B1B1] font-mono">Calibrated physics</span>
          </label>
          <input
            id="seed-input"
            type="number"
            value={seed}
            onChange={e => setSeed(parseInt(e.target.value, 10) || 42)}
            className="w-full px-3 py-1.5 rounded bg-[#007979] border border-[#24B1B1]/30 text-sm font-mono text-[#95BDD7] focus:border-[#24B1B1] focus:outline-none"
          />
          <span className="text-[10px] text-[#95BDD7]">
            Identical seed values yield identical sensor noise and plume arrival trajectories.
          </span>
        </div>

        {/* Modal Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#24B1B1]/20">
          <button
            type="button"
            onClick={() => setStartModalOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-xs font-heading font-bold bg-[#24B1B1] hover:bg-[#24B1B1]/90 text-[#086288] shadow-lg shadow-[#24B1B1]/25 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Play size={13} fill="currentColor" />
            <span>START CONTAMINATION</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
