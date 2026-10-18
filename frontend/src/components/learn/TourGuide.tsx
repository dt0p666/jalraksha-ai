import React, { useEffect, useState } from 'react';
import { useApp } from '../../state/appStore';
import { TOUR_STEPS } from '../../content/tourSteps';
import { Compass, X, ArrowRight } from 'lucide-react';

export const TourGuide: React.FC = () => {
  const { tourActive, endTour, tourStep } = useApp();
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const currentStep = TOUR_STEPS[Math.min(tourStep, TOUR_STEPS.length - 1)];

  // Position tour card beside the target element without covering it
  useEffect(() => {
    if (!tourActive || !currentStep?.targetSelector) {
      setCoords(null);
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Position card above or to the side of target element with padding
        const top = Math.max(70, rect.top - 120);
        const left = Math.min(window.innerWidth - 340, Math.max(20, rect.left));
        setCoords({ top, left });
      } else {
        // Fallback comfortable floating position
        setCoords({ top: 100, left: 24 });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [tourActive, currentStep]);

  if (!tourActive) return null;

  return (
    <div
      style={coords ? { top: `${coords.top}px`, left: `${coords.left}px` } : { top: '100px', left: '24px' }}
      className="fixed z-50 w-80 p-3 bg-[#152248] border border-[#76C0EC] rounded-xl text-[#EAF1F8] shadow-2xl animate-fadeIn text-xs space-y-2 backdrop-blur-md"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-[#425B9A]/30">
        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-[#76C0EC]" />
          <span className="font-serif font-bold text-xs text-[#76C0EC]">
            {currentStep.title}
          </span>
        </div>
        <button
          onClick={endTour}
          className="p-1 rounded text-[#9FB0C9] hover:text-[#D9534F] hover:bg-[#1E2F62]"
          aria-label="Exit tour"
          title="Exit tour"
        >
          <X size={14} />
        </button>
      </div>

      <p className="text-[11px] text-[#9FB0C9] leading-relaxed">
        {currentStep.content}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-[#425B9A]/20 text-[10px] text-[#9FB0C9]">
        <span>
          Step {Math.min(tourStep + 1, TOUR_STEPS.length)} of {TOUR_STEPS.length}
        </span>
        <span className="text-[#76C0EC] font-medium flex items-center gap-1">
          <span>Do the highlighted step to continue</span>
          <ArrowRight size={10} />
        </span>
      </div>
    </div>
  );
};
