import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Check, ArrowDown } from 'lucide-react';

interface InteractiveValveScrollProps {
  onUnlock?: () => void;
}

export const InteractiveValveScroll: React.FC<InteractiveValveScrollProps> = ({ onUnlock }) => {
  const [rotation, setRotation] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);

  // Sync window scrolling to wheel rotation
  useEffect(() => {
    const handleWindowScroll = () => {
      // Calculate scroll progress (0 to 1) of the page
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const targetDeg = progress * 720; // 2 full revolutions for full page
      setRotation(targetDeg);
      if (progress > 0.05 && !isOpen) {
        setIsOpen(true);
        onUnlock?.();
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [isOpen, onUnlock]);

  const triggerScrollFromRotation = (deg: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, deg / 720));
    window.scrollTo({
      top: progress * maxScroll,
      behavior: 'auto',
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
    const deg = rad * (180 / Math.PI);

    let delta = deg - lastAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    lastAngle.current = deg;

    setRotation(prev => {
      const next = Math.max(0, prev + delta);
      triggerScrollFromRotation(next);
      if (next >= 60 && !isOpen) {
        setIsOpen(true);
        onUnlock?.();
      }
      return next;
    });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleTurnStep = (forward: boolean) => {
    setRotation(prev => {
      const next = Math.max(0, prev + (forward ? 90 : -90));
      triggerScrollFromRotation(next);
      if (next >= 60 && !isOpen) {
        setIsOpen(true);
        onUnlock?.();
      }
      return next;
    });
  };

  const progressPercent = Math.min(100, Math.round((rotation / 720) * 100));

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-[#34908B] border-2 border-[#6FBEB2] shadow-2xl flex flex-col items-center gap-4 text-[#FDF4AF] select-none">
      <div className="flex items-center justify-between w-full text-xs font-mono font-bold tracking-wider text-[#FDF4AF]">
        <span>MAIN PRESSURE WHEEL</span>
        <span className="px-2 py-0.5 rounded bg-[#6FBEB2] text-[#081416] font-bold">
          {isOpen ? `HEAD: ${progressPercent}%` : 'VALVE CLOSED'}
        </span>
      </div>

      {/* Interactive Draggable & Rotatable Wheel */}
      <div
        className="relative w-44 h-44 rounded-full border-4 border-[#FDF4AF] bg-[#6FBEB2] shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-transform"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        tabIndex={0}
        role="slider"
        aria-label="Water valve wheel controls page scroll and mains pressure"
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
          className="w-36 h-36 rounded-full border-4 border-[#34908B] bg-[#34908B] flex items-center justify-center transition-transform duration-75 relative shadow-inner"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Wheel Spokes */}
          <div className="absolute w-full h-1.5 bg-[#A5E9DD]" />
          <div className="absolute h-full w-1.5 bg-[#A5E9DD]" />
          <div className="absolute w-full h-1 bg-[#FDF4AF] rotate-45" />
          <div className="absolute w-full h-1 bg-[#FDF4AF] -rotate-45" />

          {/* Center Hub */}
          <div className="w-12 h-12 rounded-full bg-[#6FBEB2] border-2 border-[#FDF4AF] flex items-center justify-center text-[#081416] z-10 shadow-lg">
            {isOpen ? <Check size={20} className="text-[#081416]" /> : <RotateCw size={18} className="text-[#081416]" />}
          </div>
        </div>
      </div>

      {/* Helper text explaining the dual connection */}
      <div className="text-center space-y-1.5 w-full">
        <span className="font-serif font-bold text-sm text-[#FDF4AF] block">
          {isOpen ? 'Valve Turning • Driving Network Flow' : 'Rotate Wheel to Drive Page & Flow'}
        </span>
        <p className="text-xs text-[#EAF7F5]/90 leading-tight">
          Drag the wheel clockwise or simply scroll the page — both rotate together in real time!
        </p>

        {/* Flow Progress Bar */}
        <div className="w-full h-2 bg-[#0F2226] rounded-full mx-auto mt-2 overflow-hidden border border-[#A5E9DD]">
          <div
            className="h-full bg-[#A5E9DD] transition-all duration-100"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* One-click quick scroll jump */}
        <button
          onClick={() => {
            const el = document.getElementById('story-start');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#FDF4AF] hover:underline font-semibold"
        >
          <span>Scroll into story chapters</span>
          <ArrowDown size={13} />
        </button>
      </div>
    </div>
  );
};
