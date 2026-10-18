import React, { useState, useRef } from 'react';
import { RotateCw, Check } from 'lucide-react';

interface ValveWheelProps {
  onOpenFlow?: () => void;
}

export const ValveWheel: React.FC<ValveWheelProps> = ({ onOpenFlow }) => {
  const [rotation, setRotation] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);

  const triggerOpen = () => {
    setIsOpen(true);
    onOpenFlow?.();
    setTimeout(() => {
      const el = document.getElementById('story-start');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || isOpen) return;
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
      const next = prev + Math.abs(delta);
      if (next >= 180 && !isOpen) {
        triggerOpen();
      }
      return next;
    });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleKeyboardTurn = () => {
    if (isOpen) return;
    setRotation(prev => {
      const next = prev + 60;
      if (next >= 180 && !isOpen) {
        triggerOpen();
      }
      return next;
    });
  };

  const progressPercent = Math.min(100, Math.round((rotation / 180) * 100));

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Draggable Valve Container */}
      <div
        className="relative w-44 h-44 rounded-full border-4 border-[#425B9A] bg-[#141E3D] shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none transition-transform"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        tabIndex={0}
        role="slider"
        aria-label="Water valve wheel. Rotate to open flow."
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
            e.preventDefault();
            handleKeyboardTurn();
          }
        }}
      >
        {/* Rotating Wheel Graphic */}
        <div
          className="w-36 h-36 rounded-full border-4 border-[#76C0EC] bg-[#1D2A52] flex items-center justify-center transition-transform duration-75 relative"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Wheel Spokes */}
          <div className="absolute w-full h-1 bg-[#76C0EC]/50" />
          <div className="absolute h-full w-1 bg-[#76C0EC]/50" />
          <div className="w-12 h-12 rounded-full bg-[#425B9A] border-2 border-[#76C0EC] flex items-center justify-center text-white z-10 shadow">
            {isOpen ? <Check size={20} className="text-[#91AC67]" /> : <RotateCw size={18} className="text-[#76C0EC]" />}
          </div>
        </div>
      </div>

      {/* Helper text */}
      <div className="text-center space-y-1">
        <span className="font-serif font-semibold text-sm text-[#EAF1F8] block">
          {isOpen ? 'Valve Opened • Flow Active' : 'Turn the valve wheel'}
        </span>
        <span className="text-xs text-[#9FB0C9] block">
          Drag wheel or press <kbd className="px-1 py-0.5 rounded bg-[#1D2A52] text-[#76C0EC] font-mono">Space</kbd> / <kbd className="px-1 py-0.5 rounded bg-[#1D2A52] text-[#76C0EC] font-mono">Enter</kbd>
        </span>
        {/* Progress bar */}
        <div className="w-40 h-1.5 bg-[#0D1630] rounded-full mx-auto mt-2 overflow-hidden border border-[#425B9A]/30">
          <div
            className="h-full bg-[#76C0EC] transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
