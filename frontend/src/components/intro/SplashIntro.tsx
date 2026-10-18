import React, { useEffect, useState } from 'react';
import { Droplet } from 'lucide-react';

interface SplashIntroProps {
  onComplete: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'curtain' | 'peel' | 'done'>('curtain');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if user already saw the intro in this session
    const hasSeen = sessionStorage.getItem('jalrakshak_splash_seen');
    if (hasSeen) {
      onComplete();
      return;
    }

    // Step-by-step ribbon peel reveal sequence inspired by sweet-tape
    const timer1 = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer1);
          setPhase('peel');
          return 100;
        }
        return p + 2.5;
      });
    }, 25);

    const timer2 = setTimeout(() => {
      sessionStorage.setItem('jalrakshak_splash_seen', 'true');
      setPhase('done');
      onComplete();
    }, 2200);

    return () => {
      clearInterval(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 select-none ${
        phase === 'peel'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #081416 0%, #0F2226 50%, #163238 100%)',
      }}
    >
      {/* Decorative Diagonal Ribbon Layers (SweetTape Peel Style) */}
      <div
        className="absolute w-[180%] h-16 bg-[#34908B] -rotate-12 transform -translate-y-36 opacity-30 shadow-2xl transition-transform duration-1000"
        style={{ transform: `translateY(${-150 + progress * 0.5}px) rotate(-12deg)` }}
      />
      <div
        className="absolute w-[180%] h-14 bg-[#6FBEB2] -rotate-12 transform -translate-y-12 opacity-40 shadow-2xl transition-transform duration-1000"
        style={{ transform: `translateY(${-50 + progress * 0.4}px) rotate(-12deg)` }}
      />
      <div
        className="absolute w-[180%] h-12 bg-[#A5E9DD] -rotate-12 transform translate-y-16 opacity-40 shadow-2xl transition-transform duration-1000"
        style={{ transform: `translateY(${50 + progress * 0.3}px) rotate(-12deg)` }}
      />
      <div
        className="absolute w-[180%] h-10 bg-[#FDF4AF] -rotate-12 transform translate-y-40 opacity-40 shadow-2xl transition-transform duration-1000"
        style={{ transform: `translateY(${150 + progress * 0.2}px) rotate(-12deg)` }}
      />

      {/* Central Brand Badge with Ripple Waves */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-md">
        {/* Animated Water Droplet Icon with Concentric Waves */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-[#34908B] border-2 border-[#A5E9DD] shadow-[0_0_50px_rgba(165,233,221,0.5)] flex items-center justify-center text-[#FDF4AF] relative z-10 transform animate-bounce duration-1000">
            <Droplet size={48} fill="#A5E9DD" className="text-[#A5E9DD]" />
          </div>
          <div className="absolute w-32 h-32 rounded-3xl border-2 border-[#6FBEB2]/40 animate-ping" />
          <div className="absolute w-40 h-40 rounded-3xl border border-[#FDF4AF]/20 animate-pulse" />
        </div>

        {/* Title & Tagline in Brand Typography */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#EAF7F5] tracking-tight">
            JALRAKSHAK <span className="text-[#FDF4AF]">AI</span>
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#A5E9DD] tracking-wide">
            Drinking-Water Network Diagnostic Simulator
          </p>
        </div>

        {/* Kinetic Loading Bar with SweetTape Color Steps */}
        <div className="w-64 space-y-2">
          <div className="w-full h-2 rounded-full bg-[#081416] border border-[#6FBEB2]/50 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #34908B, #6FBEB2, #A5E9DD, #FDF4AF)',
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#6FBEB2]">
            <span>Calibrating 42-node village graph...</span>
            <span className="font-bold text-[#FDF4AF]">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Skip button for quick developers */}
        <button
          onClick={() => {
            sessionStorage.setItem('jalrakshak_splash_seen', 'true');
            setPhase('done');
            onComplete();
          }}
          className="text-[11px] font-mono text-[#6FBEB2] hover:text-[#FDF4AF] underline transition-colors pt-2"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
};
