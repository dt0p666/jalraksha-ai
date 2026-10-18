import React, { useState } from 'react';
import { GLOSSARY } from '../../content/glossary';
import type { GlossaryTerm } from '../../content/glossary';

interface GlossaryTooltipProps {
  termKey: string;
  children: React.ReactNode;
}

export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({ termKey, children }) => {
  const [visible, setVisible] = useState(false);
  const termData: GlossaryTerm | undefined = GLOSSARY[termKey];

  if (!termData) return <>{children}</>;

  return (
    <span
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      role="term"
      aria-describedby={`tooltip-${termKey}`}
    >
      <span className="underline decoration-dotted decoration-[#76C0EC]/60 hover:text-[#76C0EC] transition-colors">
        {children}
      </span>

      {visible && (
        <span
          id={`tooltip-${termKey}`}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#1D2A52] text-[#EAF1F8] border border-[#76C0EC]/50 rounded-lg shadow-xl text-xs font-sans pointer-events-none animate-fadeIn"
        >
          <span className="block font-semibold text-[#76C0EC] mb-1">{termData.term}</span>
          <span className="text-[#9FB0C9] leading-snug">{termData.shortDef}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1D2A52]" />
        </span>
      )}
    </span>
  );
};
