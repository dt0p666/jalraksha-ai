import React, { useState, useRef, useCallback } from 'react';
import { RotateCw, Check, Sparkles } from 'lucide-react';

interface InteractiveValveScrollProps {
  onUnlock?: () => void;
}

export const InteractiveValveScroll: React.FC<InteractiveValveScrollProps> = ({ onUnlock }) => {
  const [rotation, setRotation] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const isDragging = useRef(false);
  const startAngle = useRef(0);
  const startRotation = useRef(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Directly drive page scrolling FROM wheel rotation
  const applyRotation = useCallback((newDeg: number) => {
    const clampedDeg = Math.max(0, newDeg);
    setRotation(clampedDeg);

    if (clampedDeg >= 40 && !isOpen) {
      setIsOpen(true);
      onUnlock?.();
    }

    // Direct 1-to-1 control: 1 full turn (360 deg) scrolls 50% of the page
    // 720 deg scrolls 100% of the page
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      const scrollRatio = Math.min(1, clampedDeg / 720);
      window.scrollTo({
        top: scrollRatio * maxScroll,
        behavior: 'auto',
      });
    }
  }, [isOpen, onUnlock]);

  // Pointer drag event handlers for direct wheel rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      startAngle.current = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
      startRotation.current = rotation;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);

    let delta = currentAngle - startAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    applyRotation(startRotation.current + delta * 1.5);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Keyboard accessibility: Arrow keys rotate wheel and smoothly drive page
  const handleTurnStep = (forward: boolean) => {
    applyRotation(rotation + (forward ? 90 : -90));
  };

  // Wheel event: scrolling OVER the wheel directly turns the wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 35 : -35;
    applyRotation(rotation + delta);
  };

  const progressPercent = Math.min(100, Math.round((rotation / 720) * 100));

  return (
    <div
      onWheel={handleWheel}
      className="w-full max-w-md mx-auto p-6 rounded-2xl bg-[#34908B] border-2 border-[#6FBEB2] shadow-2xl flex flex-col items-center gap-4 text-[#FDF4AF] select-none hover:shadow-[0_0_40px_rgba(165,233,221,0.3)] transition-all"
    >
      <div className="flex items-center justify-between w-full text-xs font-mono font-bold tracking-wider text-[#FDF4AF]">
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#A5E9DD]" />
          <span>DRIVE HOMEPAGE WITH VALVE</span>
        </span>
        <span className="px-2.5 py-0.5 rounded bg-[#6FBEB2] text-[#081416] font-bold">
          {isOpen ? `PRESSURE: ${progressPercent}%` : 'VALVE CLOSED'}
        </span>
      </div>

      {/* Interactive Draggable & Rotatable Wheel */}
      <div
        ref={wheelRef}
        className="relative w-48 h-48 rounded-full border-4 border-[#FDF4AF] bg-[#6FBEB2] shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-transform hover:scale-105"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        tabIndex={0}
        role="slider"
        aria-label="Water valve wheel that drives the entire homepage flow"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={e => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            handleTurnStep(true);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            handleTurnStep(false);
          }
        }}
      >
        {/* Rotating Wheel Spoke Graphic */}
        <div
          className="w-40 h-40 rounded-full border-4 border-[#34908B] bg-[#34908B] flex items-center justify-center transition-transform duration-75 relative shadow-inner"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Wheel Spokes */}
          <div className="absolute w-full h-2 bg-[#A5E9DD] shadow-sm" />
          <div className="absolute h-full w-2 bg-[#A5E9DD] shadow-sm" />
          <div className="absolute w-full h-1.5 bg-[#FDF4AF] rotate-45" />
          <div className="absolute w-full h-1.5 bg-[#FDF4AF] -rotate-45" />

          {/* Grip studs on outer rim */}
          <div className="absolute top-1 w-3 h-3 rounded-full bg-[#FDF4AF]" />
          <div className="absolute bottom-1 w-3 h-3 rounded-full bg-[#FDF4AF]" />
          <div className="absolute left-1 w-3 h-3 rounded-full bg-[#FDF4AF]" />
          <div className="absolute right-1 w-3 h-3 rounded-full bg-[#FDF4AF]" />

          {/* Center Hub */}
          <div className="w-14 h-14 rounded-full bg-[#6FBEB2] border-2 border-[#FDF4AF] flex items-center justify-center text-[#081416] z-10 shadow-lg">
            {isOpen ? <Check size={24} className="text-[#081416] stroke-[3]" /> : <RotateCw size={22} className="text-[#081416] stroke-[2.5]" />}
          </div>
        </div>
      </div>

      {/* Helper text explaining that the wheel drives the homepage */}
      <div className="text-center space-y-1.5 w-full">
        <span className="font-serif font-bold text-sm text-[#FDF4AF] block">
          {isOpen ? `Valve Open • Flowing at ${progressPercent}% Head` : 'Turn the Wheel to Open Water Flow & Drive Homepage'}
        </span>
        <p className="text-xs text-[#EAF7F5]/90 leading-tight">
          Click and spin the valve wheel clockwise — it directly propels you down through the whole experience!
        </p>

        {/* Flow Progress Bar */}
        <div className="w-full h-2 bg-[#081416] rounded-full mx-auto mt-2 overflow-hidden border border-[#A5E9DD]">
          <div
            className="h-full bg-gradient-to-r from-[#6FBEB2] to-[#FDF4AF] transition-all duration-100"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* Quick Stepper Buttons */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => handleTurnStep(false)}
            className="px-3 py-1 rounded-md bg-[#081416] hover:bg-[#163238] text-[#A5E9DD] text-xs font-mono border border-[#6FBEB2]/40"
          >
            ↺ Back
          </button>
          <button
            onClick={() => handleTurnStep(true)}
            className="px-3 py-1 rounded-md bg-[#081416] hover:bg-[#163238] text-[#FDF4AF] text-xs font-mono border border-[#6FBEB2]/40 font-bold"
          >
            ↻ Spin Forward
          </button>
          <button
            onClick={() => {
              applyRotation(720);
            }}
            className="px-3 py-1 rounded-md bg-[#6FBEB2] hover:bg-[#A5E9DD] text-[#081416] text-xs font-mono font-bold"
          >
            Full Flow ⚡
          </button>
        </div>
      </div>
    </div>
  );
};
