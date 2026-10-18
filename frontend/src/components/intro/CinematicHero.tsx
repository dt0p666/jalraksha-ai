import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Play } from 'lucide-react';
import { useApp } from '../../state/appStore';
import { ValveWheel } from './ValveWheel';
import { StoryChapters } from './StoryChapters';

export const CinematicHero: React.FC = () => {
  const { isLoadingNetwork, setIntroSkipped } = useApp();
  const navigate = useNavigate();

  const handleSkip = () => {
    setIntroSkipped(true);
    navigate('/command-center');
  };

  return (
    <div className="w-full relative">
      {/* Preloader / Loading Bar reflecting real network data load */}
      {isLoadingNetwork && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D1630] space-y-4">
          <div className="relative">
            <Droplet size={48} className="text-[#425B9A] animate-pulse" />
            <Droplet size={48} className="text-[#76C0EC] absolute inset-0 animate-bounce" />
          </div>
          <div className="text-center space-y-1">
            <span className="font-serif font-bold text-lg text-[#EAF1F8]">
              Initializing JALRAKSHAK Network
            </span>
            <span className="text-xs text-[#9FB0C9] block">
              Loading 42-node village graph and CPCB water quality distribution profile...
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 max-w-5xl mx-auto space-y-6">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141E3D] border border-[#425B9A]/40 text-xs text-[#9FB0C9]">
          <span className="w-2 h-2 rounded-full bg-[#91AC67] animate-ping" />
          <span>Village Drinking-Water Network Investigation Simulator</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#EAF1F8] tracking-tight max-w-3xl mx-auto leading-tight">
            Protecting rural drinking water with physics and inference.
          </h1>
          <p className="text-base sm:text-lg text-[#9FB0C9] max-w-2xl mx-auto leading-relaxed">
            Trace hidden contamination sources in branching pipe networks using Bayesian reasoning,
            optimal grab sampling, and open-weight AI incident reporting.
          </p>
        </div>

        {/* Tactile Entry: Interactive Valve Wheel */}
        <ValveWheel onOpenFlow={() => {}} />

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/command-center')}
            className="px-6 py-3 rounded-xl bg-[#425B9A] hover:bg-[#4f6cb6] text-white font-semibold text-sm border border-[#76C0EC]/50 shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
          >
            <Play size={15} fill="currentColor" />
            <span>Launch Command Center</span>
          </button>

          <button
            onClick={handleSkip}
            className="px-4 py-3 rounded-xl bg-[#141E3D] hover:bg-[#1D2A52] text-[#9FB0C9] hover:text-[#EAF1F8] font-medium text-sm border border-[#425B9A]/30 transition-colors"
          >
            Skip intro
          </button>
        </div>
      </section>

      {/* Pinned Scroll Narrative Story */}
      <StoryChapters />
    </div>
  );
};
