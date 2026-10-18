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
      className={`fixed z-30 flex items-center justify-center rounded-full bg-[#425B9A] text-white border border-[#76C0EC]/50 shadow-xl hover:bg-[#4f6cb6] transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#76C0EC] no-print ${
        isCommandCenter
          ? 'bottom-4 right-4 p-2 sm:p-2.5'
          : 'bottom-6 right-6 px-3.5 py-2 text-xs gap-1.5'
      }`}
      aria-label="Open contact and feedback form"
      title="Contact / Feedback"
    >
      <MessageSquare size={16} />
      {!isCommandCenter && <span className="hidden sm:inline font-medium">Contact</span>}
    </button>
  );
};
