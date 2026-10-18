import React from 'react';
import { NavLink } from 'react-router-dom';
import { Droplet, ShieldCheck, Cpu } from 'lucide-react';

declare const __APP_BUILD_TIME__: string;

export const Footer: React.FC = () => {
  // Format build date as a small muted line
  const formattedBuildDate = (() => {
    try {
      if (typeof __APP_BUILD_TIME__ !== 'undefined' && __APP_BUILD_TIME__) {
        const d = new Date(__APP_BUILD_TIME__);
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
    } catch {
      // ignore
    }
    return 'October 2026';
  })();

  return (
    <footer className="w-full border-t border-[#38D9E6]/20 bg-[#071018] text-[#8EA5B4] py-10 px-4 sm:px-8 text-sm transition-colors print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Disclaimer & Project identity */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0D1B26] border border-[#38D9E6]/40 flex items-center justify-center text-[#38D9E6]">
              <Droplet size={14} className="fill-[#38D9E6]" />
            </div>
            <span className="font-heading font-bold text-base text-[#EAF4F7]">JALRAKSHAK AI</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#0D1B26] text-[#38D9E6] border border-[#38D9E6]/30 font-mono">
              DIGITAL TWIN V1.0
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#8EA5B4]/90">
            Interactive drinking-water contamination diagnostic and source-localisation simulator.
            Combines EPANET graph physical delay tracking, Bayesian source ranking, Shannon entropy sampling,
            and open-weight Gemma 4 incident briefings.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#8EA5B4]/70 font-mono pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#64F4C4]" />
              Zero Hallucinated Source Labels
            </span>
            <span className="flex items-center gap-1">
              <Cpu size={12} className="text-[#38D9E6]" />
              Local Open-Weight Inference
            </span>
            <span>Build: {formattedBuildDate}</span>
          </div>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
          <NavLink to="/" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            Overview
          </NavLink>
          <NavLink to="/command-center" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            Command Center
          </NavLink>
          <NavLink to="/network" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            Network Explorer
          </NavLink>
          <NavLink to="/simulation" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            Simulation
          </NavLink>
          <NavLink to="/investigation" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            Source Localization
          </NavLink>
          <NavLink to="/ai-briefing" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            AI Briefing
          </NavLink>
          <NavLink to="/evaluation" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            Evaluation Lab
          </NavLink>
          <NavLink to="/learn" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            Learn
          </NavLink>
          <NavLink to="/faq" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            FAQ
          </NavLink>
          <NavLink to="/contact" className="text-[#8EA5B4] hover:text-[#38D9E6] transition-colors">
            Contact
          </NavLink>
        </div>
      </div>
    </footer>
  );
};
