import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  const isCommandCenter = location.pathname === '/command-center';

  useEffect(() => {
    if (isCommandCenter) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const pct = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCommandCenter, location.pathname]);

  if (isCommandCenter) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-transparent pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-[#76C0EC] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
