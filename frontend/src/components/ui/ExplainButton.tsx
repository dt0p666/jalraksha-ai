import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Modal } from './Modal';

interface ExplainButtonProps {
  title: string;
  explanation: string;
  contextData?: Record<string, any>;
  className?: string;
}

export const ExplainButton: React.FC<ExplainButtonProps> = ({
  title,
  explanation,
  contextData,
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`p-1 rounded-full text-[#9FB0C9] hover:text-[#76C0EC] hover:bg-[#1D2A52] transition-colors focus-visible:ring-1 focus-visible:ring-[#76C0EC] ${className}`}
        aria-label={`Explain: ${title}`}
        title={`Explain: ${title}`}
      >
        <HelpCircle size={15} />
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`Explanation: ${title}`} maxWidth="max-w-md">
        <div className="space-y-3">
          <p className="text-sm text-[#EAF1F8] leading-relaxed">{explanation}</p>
          {contextData && Object.keys(contextData).length > 0 && (
            <div className="p-3 bg-[#0D1630] rounded-lg border border-[#425B9A]/30 text-xs font-mono space-y-1 text-[#9FB0C9]">
              {Object.entries(contextData).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[#9FB0C9]">{k}:</span>
                  <span className="text-[#76C0EC] font-semibold">{String(v)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="text-xs text-[#9FB0C9]/80 pt-2 border-t border-[#425B9A]/20">
            Computed in real time by the Bayesian inference and sampling physics engine.
          </div>
        </div>
      </Modal>
    </>
  );
};
