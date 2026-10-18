import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useApp } from '../../state/appStore';
import { InteractiveValveScroll } from './InteractiveValveScroll';
import { StoryChapters } from './StoryChapters';

export const CinematicHero: React.FC = () => {
  const { isLoadingNetwork } = useApp();
  const navigate = useNavigate();

  return (
    <div className="w-full relative bg-[#F2EFE7] text-[#0F1E2E]">
      {/* Preloader */}
      {isLoadingNetwork && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F2EFE7] space-y-4">
          <div className="w-12 h-12 border-4 border-[#3368A0] border-t-[#66A3BF] rounded-full animate-spin" />
          <div className="text-center space-y-1">
            <span className="font-serif font-bold text-lg text-[#0F1E2E]">
              Initializing JALRAKSHAK Network
            </span>
            <span className="text-xs text-[#3368A0] block">
              Loading 42-node village graph and water quality distribution profile...
            </span>
          </div>
        </div>
      )}

      {/* Hero Section on clean Warm Sand (#F2EFE7) background */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-6 pb-10 max-w-5xl mx-auto space-y-6">
        {/* Top category badge in Deep Blue */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3368A0] text-xs font-semibold text-[#F2EFE7] shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#C8DFDB] animate-pulse" />
          <span>Village Drinking-Water Network Investigation Simulator</span>
        </div>

        {/* Hero Headline in High-Contrast Deep Navy */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#0F1E2E] tracking-tight leading-[1.12]">
            Protecting rural drinking water with <span className="text-[#3368A0]">physics</span> and <span className="text-[#66A3BF]">inference</span>.
          </h1>
          <p className="text-base sm:text-xl text-[#3368A0] font-medium max-w-2xl mx-auto leading-relaxed">
            Trace hidden contamination sources in branching pipe networks using Bayesian reasoning,
            optimal grab sampling, and open-weight AI incident reporting.
          </p>
        </div>

        {/* Interactive Main Valve Control: Linked directly to page scrolling */}
        <InteractiveValveScroll />

        {/* Primary Launch Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/command-center')}
            className="px-8 py-3.5 rounded-xl bg-[#3368A0] hover:bg-[#285380] text-[#F2EFE7] font-bold text-sm border-2 border-[#66A3BF] shadow-2xl hover:scale-105 active:scale-100 transition-all flex items-center gap-2.5"
          >
            <Play size={16} fill="currentColor" />
            <span>Launch Command Center</span>
          </button>
        </div>
      </section>

      {/* Story Narrative Chapters */}
      <StoryChapters />
    </div>
  );
};
