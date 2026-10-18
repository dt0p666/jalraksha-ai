import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-6 z-30 p-2.5 rounded-full bg-[#1D2A52] text-[#76C0EC] border border-[#425B9A]/60 shadow-lg hover:bg-[#425B9A] hover:text-white transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#76C0EC] no-print"
      aria-label="Back to top of page"
      title="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
};
