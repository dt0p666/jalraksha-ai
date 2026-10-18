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
    <footer className="w-full border-t border-[#24B1B1]/20 bg-[#086288] text-[#95BDD7] py-10 px-4 sm:px-8 text-sm transition-colors print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Disclaimer & Project identity */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#007979] border border-[#24B1B1]/40 flex items-center justify-center text-[#24B1B1]">
              <Droplet size={14} className="fill-[#24B1B1]" />
            </div>
            <span className="font-heading font-bold text-base text-[#95BDD7]">JALRAKSHAK AI</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#007979] text-[#24B1B1] border border-[#24B1B1]/30 font-mono">
              INTELLIGENCE PLATFORM V1.0
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#95BDD7]/90">
            Interactive drinking-water contamination diagnostic and source-localisation simulator.
            Combines EPANET graph physical delay tracking, Bayesian source ranking, Shannon entropy sampling,
            and open-weight Gemma 4 incident briefings.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#95BDD7]/70 font-mono pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#D9D28B]" />
              Zero Hallucinated Source Labels
            </span>
            <span className="flex items-center gap-1">
              <Cpu size={12} className="text-[#24B1B1]" />
              Local Open-Weight Inference
            </span>
            <span>Build: {formattedBuildDate}</span>
          </div>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
          <NavLink to="/" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            Overview
          </NavLink>
          <NavLink to="/command-center" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            Command Center
          </NavLink>
          <NavLink to="/network" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            Network Explorer
          </NavLink>
          <NavLink to="/simulation" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            Simulation
          </NavLink>
          <NavLink to="/investigation" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            Source Localization
          </NavLink>
          <NavLink to="/ai-briefing" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            AI Briefing
          </NavLink>
          <NavLink to="/evaluation" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            Evaluation Lab
          </NavLink>
          <NavLink to="/learn" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            Learn
          </NavLink>
          <NavLink to="/faq" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            FAQ
          </NavLink>
          <NavLink to="/contact" className="text-[#95BDD7] hover:text-[#24B1B1] transition-colors">
            Contact
          </NavLink>
        </div>
      </div>
    </footer>
  );
};
