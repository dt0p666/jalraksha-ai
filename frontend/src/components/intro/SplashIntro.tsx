import React, { useEffect, useState } from 'react';
import { Droplet, Activity, ShieldCheck } from 'lucide-react';

interface SplashIntroProps {
  onComplete: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'calibrating' | 'ready' | 'done'>('calibrating');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if user already saw the intro in this session
    const hasSeen = sessionStorage.getItem('jalrakshak_splash_seen');
    if (hasSeen) {
      onComplete();
      return;
    }

    const timer1 = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer1);
          setPhase('ready');
          return 100;
        }
        return p + 4;
      });
    }, 30);

    const timer2 = setTimeout(() => {
      sessionStorage.setItem('jalrakshak_splash_seen', 'true');
      setPhase('done');
      onComplete();
    }, 1800);

    return () => {
      clearInterval(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 select-none ${
        phase === 'ready'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#1C3C53',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(8, 196, 225, 0.08) 0%, transparent 65%),
          linear-gradient(to right, rgba(8, 196, 225, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(8, 196, 225, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 32px 32px, 32px 32px',
      }}
    >
      {/* Laser scan lines */}
      <div 
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#08C4E1] to-transparent opacity-60 animate-bounce duration-1000"
      />

      {/* Central Brand Badge with Ripple Waves */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-md">
        {/* Animated Water Droplet Icon with Concentric Waves */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl bg-[#446882] border-2 border-[#08C4E1] shadow-[0_0_40px_rgba(8,196,225,0.5)] flex items-center justify-center text-[#08C4E1] relative z-10">
            <Droplet size={46} className="fill-[#08C4E1] animate-pulse" />
          </div>
          <div className="absolute w-32 h-32 rounded-2xl border border-[#08C4E1]/30 animate-ping" />
          <div className="absolute w-40 h-40 rounded-2xl border border-[#F5E6BB]/20 animate-pulse" />
        </div>

        {/* Title & Tagline in Brand Typography */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#F8F3EF] tracking-tight flex items-center justify-center gap-2">
            JALRAKSHAK <span className="text-[#08C4E1]">AI</span>
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#F8F3EF] tracking-wider uppercase">
            Drinking-Water Infrastructure Infrastructure Intelligence
          </p>
        </div>

        {/* Kinetic Loading Bar */}
        <div className="w-72 space-y-2">
          <div className="w-full h-1.5 rounded-full bg-[#446882] border border-[#08C4E1]/30 p-0.2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #08C4E1, #F5E6BB)',
                boxShadow: '0 0 10px rgba(8, 196, 225, 0.6)',
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#F8F3EF]">
            <span className="flex items-center gap-1.5">
              <Activity size={10} className="text-[#08C4E1] animate-spin" />
              <span>Calibrating 42-node distribution network...</span>
            </span>
            <span className="font-bold text-[#08C4E1]">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-[#F8F3EF]/60">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-[#F5E6BB]" /> EPANET Topology
          </span>
          <span>•</span>
          <span>Bayesian Likelihood</span>
          <span>•</span>
          <span>Gemma 4</span>
        </div>

        {/* Skip button for quick developers */}
        <button
          onClick={() => {
            sessionStorage.setItem('jalrakshak_splash_seen', 'true');
            setPhase('done');
            onComplete();
          }}
          className="text-[11px] font-mono text-[#F8F3EF] hover:text-[#08C4E1] transition-colors pt-2"
        >
          Skip initialization →
        </button>
      </div>
    </div>
  );
};
