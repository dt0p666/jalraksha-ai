import React from 'react';
import { useApp } from '../../state/appStore';
import { TOUR_STEPS } from '../../content/tourSteps';
import { Compass, X } from 'lucide-react';

export const TourGuide: React.FC = () => {
  const { tourActive, endTour, tourStep } = useApp();

  if (!tourActive) return null;

  const currentStep = TOUR_STEPS[Math.min(tourStep, TOUR_STEPS.length - 1)];

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4 bg-[#141E3D] border-2 border-[#76C0EC] rounded-xl text-[#EAF1F8] shadow-2xl animate-fadeIn"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3 pb-2 border-b border-[#425B9A]/30">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-[#76C0EC] animate-spin" />
          <span className="font-serif font-bold text-sm text-[#76C0EC]">
            {currentStep.title}
          </span>
        </div>
        <button
          onClick={endTour}
          className="p-1 rounded text-[#9FB0C9] hover:text-[#D9534F] hover:bg-[#1D2A52]"
          aria-label="Exit training mode tour"
          title="Exit Tour"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-[#9FB0C9] leading-relaxed mt-2">
        {currentStep.content}
      </p>

      <div className="flex items-center justify-between pt-3 text-[11px] text-[#9FB0C9]">
        <span>
          Step {Math.min(tourStep + 1, TOUR_STEPS.length)} of {TOUR_STEPS.length}
        </span>
        <span className="text-[#76C0EC] font-semibold">
          Perform highlighted action on screen to advance
        </span>
      </div>
    </div>
  );
};
