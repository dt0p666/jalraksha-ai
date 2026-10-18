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
    <div className="w-full relative bg-[#FDF4AF] text-[#081416]">
      {/* Preloader */}
      {isLoadingNetwork && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FDF4AF] space-y-4">
          <div className="w-12 h-12 border-4 border-[#34908B] border-t-[#6FBEB2] rounded-full animate-spin" />
          <div className="text-center space-y-1">
            <span className="font-serif font-bold text-lg text-[#081416]">
              Initializing JALRAKSHAK Network
            </span>
            <span className="text-xs text-[#34908B] block">
              Loading 42-node village graph and water quality distribution profile...
            </span>
          </div>
        </div>
      )}

      {/* Hero Section on clean Light Yellow (#FDF4AF) background */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-6 pb-10 max-w-5xl mx-auto space-y-6">
        {/* Top category badge in Deep Teal */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#34908B] text-xs font-semibold text-[#FDF4AF] shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#A5E9DD] animate-pulse" />
          <span>Village Drinking-Water Network Investigation Simulator</span>
        </div>

        {/* Hero Headline in High-Contrast Deep Teal/Charcoal */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#081416] tracking-tight leading-[1.12]">
            Protecting rural drinking water with <span className="text-[#34908B]">physics</span> and <span className="text-[#6FBEB2]">inference</span>.
          </h1>
          <p className="text-base sm:text-xl text-[#34908B] font-medium max-w-2xl mx-auto leading-relaxed">
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
            className="px-8 py-3.5 rounded-xl bg-[#34908B] hover:bg-[#2c7d78] text-[#FDF4AF] font-bold text-sm border-2 border-[#6FBEB2] shadow-2xl hover:scale-105 active:scale-100 transition-all flex items-center gap-2.5"
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
