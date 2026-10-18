import React from 'react';
import { NavLink } from 'react-router-dom';

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
    <footer className="w-full border-t border-[#425B9A]/30 bg-[#0E1733] text-[#9FB0C9] py-8 px-4 sm:px-8 text-sm transition-colors print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Disclaimer & Project identity */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-[#EAF1F8]">JALRAKSHAK AI</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#425B9A]/30 text-[#76C0EC] border border-[#76C0EC]/30">
              v1.0.0
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#9FB0C9]">
            Educational drinking-water contamination diagnostic simulation. This is a simplified educational tool,
            NOT a validated hydraulic or water-safety model. Never use for municipal or public health safety decisions.
          </p>
          <div className="text-[11px] text-[#9FB0C9]/60 font-mono pt-1">
            Last updated {formattedBuildDate}
          </div>
        </div>

        {/* Right: Legal & Navigation Links */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <NavLink to="/about" className="hover:text-[#76C0EC] underline transition-colors">
            About
          </NavLink>
          <NavLink to="/faq" className="hover:text-[#76C0EC] underline transition-colors">
            FAQ
          </NavLink>
          <NavLink to="/contact" className="hover:text-[#76C0EC] underline transition-colors">
            Contact
          </NavLink>
          <button
            onClick={() => {
              localStorage.removeItem('jalrakshak_cookie_consent');
              window.location.reload();
            }}
            className="hover:text-[#76C0EC] underline transition-colors text-left"
          >
            Cookie settings
          </button>
        </div>
      </div>
    </footer>
  );
};
