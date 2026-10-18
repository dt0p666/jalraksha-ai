import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../state/appStore';

export const FloatingContactButton: React.FC = () => {
  const { setContactModalOpen } = useApp();
  const location = useLocation();

  const isCommandCenter = location.pathname === '/command-center' || location.pathname === '/investigate';

  return (
    <button
      onClick={() => setContactModalOpen(true)}
      className={`fixed z-30 flex items-center justify-center rounded-full bg-[#24B1B1] text-[#086288] border border-[#24B1B1] shadow-2xl hover:bg-[#24B1B1]/90 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#24B1B1] no-print ${
        isCommandCenter
          ? 'bottom-4 right-4 p-2.5 shadow-[#24B1B1]/30'
          : 'bottom-6 right-6 px-4 py-2 text-xs gap-1.5 font-bold shadow-[#24B1B1]/30'
      }`}
      aria-label="Open contact and advisory form"
      title="Contact / Advisory"
    >
      <MessageSquare size={16} />
      {!isCommandCenter && <span className="hidden sm:inline font-heading">Contact Advisory</span>}
    </button>
  );
};
