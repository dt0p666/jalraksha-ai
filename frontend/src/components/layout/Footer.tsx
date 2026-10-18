import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../../api/client';

declare const __APP_BUILD_TIME__: string;

export const Footer: React.FC = () => {
  const [metaBuildTime, setMetaBuildTime] = useState<string>('');
  const [datasetModTime, setDatasetModTime] = useState<string | null>(null);

  useEffect(() => {
    api.getMeta().then(data => {
      setMetaBuildTime(data.build_time);
      if (data.dataset_file_modified) {
        setDatasetModTime(data.dataset_file_modified);
      }
    }).catch(() => {
      // Fallback to build time from Vite define
      if (typeof __APP_BUILD_TIME__ !== 'undefined') {
        setMetaBuildTime(__APP_BUILD_TIME__);
      }
    });
  }, []);

  const formatTimestamp = (ts: string) => {
    if (!ts) return 'Active session';
    try {
      const d = new Date(ts);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <footer className="w-full border-t border-[#425B9A]/30 bg-[#0D1630] text-[#9FB0C9] py-8 px-4 sm:px-8 text-sm transition-colors print:hidden">
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
            NOT a validated hydraulic or water-safety model. Never use for municipal safety decisions.
          </p>
        </div>

        {/* Right: Real Timestamps & Legal Links */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-xs">
          <div className="space-y-1">
            <div>
              <span className="text-[#9FB0C9]/70">Engine initialized: </span>
              <span className="font-mono text-[#EAF1F8]">{formatTimestamp(metaBuildTime)}</span>
            </div>
            {datasetModTime && (
              <div>
                <span className="text-[#9FB0C9]/70">Dataset file timestamp: </span>
                <span className="font-mono text-[#EAF1F8]">{formatTimestamp(datasetModTime)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
      </div>
    </footer>
  );
};
