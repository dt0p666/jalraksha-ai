import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../state/appStore';

export const FloatingContactButton: React.FC = () => {
  const { setContactModalOpen } = useApp();
  const location = useLocation();

  // On command-center page, place slightly higher or compact so it doesn't overlap timeline
  const isCommandCenter = location.pathname === '/command-center';

  return (
    <button
      onClick={() => setContactModalOpen(true)}
      className={`fixed z-30 flex items-center gap-2 rounded-full bg-[#425B9A] text-white border border-[#76C0EC]/50 shadow-xl hover:bg-[#4f6cb6] transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#76C0EC] no-print ${
        isCommandCenter
          ? 'bottom-20 right-4 sm:bottom-20 sm:right-6 px-3 py-2 text-xs'
          : 'bottom-6 right-6 px-4 py-2.5 text-sm'
      }`}
      aria-label="Open contact and feedback form"
      title="Contact engineering team"
    >
      <MessageSquare size={16} />
      <span className="hidden sm:inline font-medium">Contact / Feedback</span>
    </button>
  );
};
