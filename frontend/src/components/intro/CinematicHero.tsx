import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, ShieldCheck, Activity, Search, ChevronDown, Droplets } from 'lucide-react';
import { useApp } from '../../state/appStore';

export const CinematicHero: React.FC = () => {
  const { isLoadingNetwork, network } = useApp();
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const scrollToMethodology = () => {
    const el = document.getElementById('methodology-flow');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nodeCount = network?.nodes.length || 42;
  const sensorCount = network?.nodes.filter(n => n.has_sensor).length || 8;

  return (
    <div 
      className="w-full relative bg-[#071018] text-[#EAF4F7] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Preloader */}
      {isLoadingNetwork && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071018] space-y-4">
          <div className="w-12 h-12 border-3 border-[#38D9E6]/30 border-t-[#38D9E6] rounded-full animate-spin" />
          <div className="text-center space-y-1">
            <span className="font-heading font-bold text-lg text-[#EAF4F7]">
              Initializing Water Infrastructure Digital Twin
            </span>
            <span className="text-xs text-[#8EA5B4] font-mono block">
              Calibrating EPANET hydraulic topology & sensor nodes...
            </span>
          </div>
        </div>
      )}

      {/* Background Subtle Animated Engineering Grid & Cyan Glows */}
      <div className="absolute inset-0 engineering-grid opacity-70 pointer-events-none" />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-[#38D9E6]/5 blur-[120px] pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
          top: '10%',
          left: '20%',
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-[#64F4C4]/4 blur-[100px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`,
          bottom: '10%',
          right: '15%',
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 max-w-6xl mx-auto space-y-8 z-10">
        
        {/* Top category badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D1B26] border border-[#38D9E6]/30 text-xs font-mono text-[#38D9E6] shadow-lg shadow-[#38D9E6]/5">
          <span className="w-2 h-2 rounded-full bg-[#38D9E6] animate-pulse" />
          <span className="tracking-wide uppercase font-semibold">
            NASA Mission Control × Water Digital Twin
          </span>
          <span className="text-[#8EA5B4]">•</span>
          <span className="text-[#8EA5B4] font-mono">{nodeCount} Nodes / {sensorCount} Sensors</span>
        </div>

        {/* Main Headline & Subheading */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-[#EAF4F7] tracking-tight leading-[1.08]">
            THE NEXT WATER CRISIS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38D9E6] via-[#64F4C4] to-[#38D9E6] animate-pulse">
              STARTS INVISIBLE.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-[#8EA5B4] font-medium max-w-2xl mx-auto leading-relaxed">
            Detect contamination. Trace its origin. Protect communities.
          </p>
        </div>

        {/* Interactive Circular Water-Network Digital Twin Visual */}
        <div className="relative w-full max-w-xl aspect-square max-h-[380px] my-4 flex items-center justify-center">
          {/* Subtle Outer Concentric Orbit Rings */}
          <div className="absolute inset-0 rounded-full border border-[#38D9E6]/10 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-6 rounded-full border border-dashed border-[#38D9E6]/20 animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute inset-16 rounded-full border border-[#64F4C4]/15 animate-[spin_25s_linear_infinite]" />

          {/* SVG Pipeline Graph Twin with Parallax Mouse Interaction */}
          <div 
            className="w-full h-full relative flex items-center justify-center transition-transform duration-300 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${mousePos.y * -15}deg) rotateY(${mousePos.x * 15}deg)`,
            }}
          >
            <svg 
              className="w-full h-full filter drop-shadow-[0_0_25px_rgba(56,217,230,0.25)]" 
              viewBox="0 0 400 400"
            >
              {/* Defs for gradients & filters */}
              <defs>
                <linearGradient id="pipeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38D9E6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#64F4C4" stopOpacity="0.3" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Pipe Edges */}
              <g stroke="url(#pipeGlow)" strokeWidth="1.5" fill="none" opacity="0.6">
                <line x1="200" y1="200" x2="200" y2="70" strokeDasharray="4 2" />
                <line x1="200" y1="200" x2="310" y2="135" />
                <line x1="200" y1="200" x2="310" y2="265" strokeDasharray="3 3" />
                <line x1="200" y1="200" x2="200" y2="330" />
                <line x1="200" y1="200" x2="90" y2="265" strokeDasharray="4 2" />
                <line x1="200" y1="200" x2="90" y2="135" />

                {/* Sub-branch outer pipelines */}
                <line x1="200" y1="70" x2="270" y2="40" opacity="0.4" />
                <line x1="200" y1="70" x2="130" y2="40" opacity="0.4" />
                <line x1="310" y1="135" x2="360" y2="180" opacity="0.4" />
                <line x1="310" y1="265" x2="360" y2="220" opacity="0.4" />
                <line x1="200" y1="330" x2="260" y2="370" opacity="0.4" />
                <line x1="200" y1="330" x2="140" y2="370" opacity="0.4" />
                <line x1="90" y1="265" x2="40" y2="220" opacity="0.4" />
                <line x1="90" y1="135" x2="40" y2="180" opacity="0.4" />
              </g>

              {/* Flow Pulses on pipes */}
              <circle r="2.5" fill="#38D9E6" className="animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]">
                <animateMotion path="M 200 200 L 200 70" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="2.5" fill="#64F4C4">
                <animateMotion path="M 200 200 L 310 135" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle r="2" fill="#38D9E6">
                <animateMotion path="M 200 200 L 90 265" dur="2.8s" repeatCount="indefinite" />
              </circle>

              {/* Central Reservoir Node (Primary Cyan) */}
              <circle cx="200" cy="200" r="18" fill="#0D1B26" stroke="#38D9E6" strokeWidth="2.5" />
              <circle cx="200" cy="200" r="10" fill="#38D9E6" opacity="0.8" />
              <circle cx="200" cy="200" r="26" fill="none" stroke="#38D9E6" strokeWidth="1" opacity="0.3" className="animate-ping" />

              {/* Surrounding Junction & Sensor Nodes */}
              {/* Sensor Node Top */}
              <circle cx="200" cy="70" r="8" fill="#0D1B26" stroke="#64F4C4" strokeWidth="2" />
              <circle cx="200" cy="70" r="3" fill="#64F4C4" />

              {/* Sensor Node Right-Top */}
              <circle cx="310" cy="135" r="7" fill="#0D1B26" stroke="#38D9E6" strokeWidth="2" />
              <circle cx="310" cy="135" r="3" fill="#38D9E6" />

              {/* Suspected Junction Node Right-Bottom */}
              <circle cx="310" cy="265" r="7" fill="#0D1B26" stroke="#FFB547" strokeWidth="2" />
              <circle cx="310" cy="265" r="3" fill="#FFB547" />

              {/* Sensor Node Bottom */}
              <circle cx="200" cy="330" r="8" fill="#0D1B26" stroke="#64F4C4" strokeWidth="2" />
              <circle cx="200" cy="330" r="3" fill="#64F4C4" />

              {/* Junction Node Left-Bottom */}
              <circle cx="90" cy="265" r="7" fill="#0D1B26" stroke="#38D9E6" strokeWidth="2" />
              <circle cx="90" cy="265" r="3" fill="#38D9E6" />

              {/* Sensor Node Left-Top */}
              <circle cx="90" cy="135" r="8" fill="#0D1B26" stroke="#64F4C4" strokeWidth="2" />
              <circle cx="90" cy="135" r="3" fill="#64F4C4" />

              {/* Outer Peripheral micro-nodes */}
              <circle cx="270" cy="40" r="3" fill="#8EA5B4" opacity="0.7" />
              <circle cx="130" cy="40" r="3" fill="#8EA5B4" opacity="0.7" />
              <circle cx="360" cy="180" r="3" fill="#8EA5B4" opacity="0.7" />
              <circle cx="360" cy="220" r="3" fill="#8EA5B4" opacity="0.7" />
              <circle cx="260" cy="370" r="3" fill="#8EA5B4" opacity="0.7" />
              <circle cx="140" cy="370" r="3" fill="#8EA5B4" opacity="0.7" />
              <circle cx="40" cy="220" r="3" fill="#8EA5B4" opacity="0.7" />
              <circle cx="40" cy="180" r="3" fill="#8EA5B4" opacity="0.7" />
            </svg>

            {/* Live readout telemetry overlay tags */}
            <div className="absolute top-2 left-4 px-2.5 py-1 rounded bg-[#0D1B26]/80 border border-[#38D9E6]/30 text-[10px] font-mono text-[#38D9E6] backdrop-blur-sm">
              NODE S-01: 284 µS/cm [SAFE]
            </div>
            <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded bg-[#0D1B26]/80 border border-[#FFB547]/40 text-[10px] font-mono text-[#FFB547] backdrop-blur-sm">
              TRACE: J-08 Δt = +14m
            </div>
          </div>
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/command-center')}
            className="px-8 py-3.5 rounded-xl bg-[#38D9E6] hover:bg-[#38D9E6]/90 text-[#071018] font-heading font-bold text-sm shadow-[0_0_25px_rgba(56,217,230,0.45)] hover:scale-105 active:scale-100 transition-all flex items-center gap-2.5 group"
          >
            <Play size={16} className="fill-current group-hover:translate-x-0.5 transition-transform" />
            <span>LAUNCH COMMAND CENTER</span>
          </button>

          <button
            onClick={scrollToMethodology}
            className="px-6 py-3.5 rounded-xl bg-[#0D1B26] hover:bg-[#132535] text-[#EAF4F7] font-medium text-sm border border-[#38D9E6]/30 hover:border-[#38D9E6] transition-all flex items-center gap-2 group"
          >
            <span>EXPLORE THE TECHNOLOGY</span>
            <ArrowRight size={15} className="text-[#38D9E6] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Subtle Scroll Indicator */}
        <div 
          onClick={scrollToMethodology}
          className="pt-6 flex flex-col items-center gap-1.5 cursor-pointer text-[#8EA5B4] hover:text-[#38D9E6] transition-colors"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest">Scroll to explore</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* DETECT → INVESTIGATE → SAMPLE → VERIFY Storytelling Section */}
      <section id="methodology-flow" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#38D9E6]/15">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1B26] border border-[#38D9E6]/25 text-xs font-mono text-[#38D9E6]">
            <span>ENGINEERING PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#EAF4F7]">
            How Contamination Localization Works
          </h2>
          <p className="text-sm text-[#8EA5B4] max-w-2xl mx-auto">
            A 4-stage physics-informed inference cycle that narrows down unknown contamination origins from sparse sensor signals.
          </p>
        </div>

        {/* 4 Interactive Process Cards with Connecting Lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Card 1: DETECT */}
          <div className="p-6 rounded-xl bg-[#0D1B26] border border-[#38D9E6]/25 hover:border-[#38D9E6]/60 transition-all flex flex-col justify-between group shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-heading font-extrabold text-[#38D9E6]">01</span>
                <div className="w-10 h-10 rounded-lg bg-[#071018] border border-[#38D9E6]/30 flex items-center justify-center text-[#38D9E6] group-hover:scale-110 transition-transform">
                  <Activity size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#EAF4F7] flex items-center gap-2">
                  DETECT
                </h3>
                <span className="text-xs font-mono text-[#38D9E6]">Sensor Telemetry</span>
              </div>
              <p className="text-xs leading-relaxed text-[#8EA5B4]">
                IoT sensors measure continuous conductivity and turbidity across key distribution branches. When values breach physical thresholds, alerts register with precise arrival timestamps.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#38D9E6]/10 text-[11px] font-mono text-[#38D9E6] flex items-center justify-between">
              <span>8 Sparse IoT Sensors</span>
              <span>100 Hz Sampling</span>
            </div>
          </div>

          {/* Card 2: INVESTIGATE */}
          <div className="p-6 rounded-xl bg-[#0D1B26] border border-[#38D9E6]/25 hover:border-[#38D9E6]/60 transition-all flex flex-col justify-between group shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-heading font-extrabold text-[#38D9E6]">02</span>
                <div className="w-10 h-10 rounded-lg bg-[#071018] border border-[#38D9E6]/30 flex items-center justify-center text-[#38D9E6] group-hover:scale-110 transition-transform">
                  <Search size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#EAF4F7]">
                  INVESTIGATE
                </h3>
                <span className="text-xs font-mono text-[#64F4C4]">Bayesian Inversion</span>
              </div>
              <p className="text-xs leading-relaxed text-[#8EA5B4]">
                The simulator evaluates water travel times and dilution factors through network pipes, generating Bayesian likelihood rankings across all 42 potential injection junctions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#38D9E6]/10 text-[11px] font-mono text-[#64F4C4] flex items-center justify-between">
              <span>Hydraulic Delay Model</span>
              <span>Posterior Ranking</span>
            </div>
          </div>

          {/* Card 3: SAMPLE */}
          <div className="p-6 rounded-xl bg-[#0D1B26] border border-[#38D9E6]/25 hover:border-[#38D9E6]/60 transition-all flex flex-col justify-between group shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-heading font-extrabold text-[#38D9E6]">03</span>
                <div className="w-10 h-10 rounded-lg bg-[#071018] border border-[#38D9E6]/30 flex items-center justify-center text-[#38D9E6] group-hover:scale-110 transition-transform">
                  <Droplets size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#EAF4F7]">
                  SAMPLE
                </h3>
                <span className="text-xs font-mono text-[#FFB547]">Entropy Reduction</span>
              </div>
              <p className="text-xs leading-relaxed text-[#8EA5B4]">
                The system recommends the next optimal grab sample location that will eliminate the most uncertainty (Shannon entropy), directing field technicians to high-value junctions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#38D9E6]/10 text-[11px] font-mono text-[#FFB547] flex items-center justify-between">
              <span>Next-Best-Sample</span>
              <span>Max Info Gain</span>
            </div>
          </div>

          {/* Card 4: VERIFY */}
          <div className="p-6 rounded-xl bg-[#0D1B26] border border-[#38D9E6]/25 hover:border-[#38D9E6]/60 transition-all flex flex-col justify-between group shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-heading font-extrabold text-[#38D9E6]">04</span>
                <div className="w-10 h-10 rounded-lg bg-[#071018] border border-[#38D9E6]/30 flex items-center justify-center text-[#38D9E6] group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#EAF4F7]">
                  VERIFY
                </h3>
                <span className="text-xs font-mono text-[#64F4C4]">Audit & Report</span>
              </div>
              <p className="text-xs leading-relaxed text-[#8EA5B4]">
                Gemma 4 synthesizes an actionable incident briefing with containment priorities. Users can reveal the ground truth to objectively evaluate localisation accuracy and pipe-hop error.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#38D9E6]/10 text-[11px] font-mono text-[#64F4C4] flex items-center justify-between">
              <span>Ground Truth Check</span>
              <span>Gemma 4 Synthesis</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner to Enter Command Center */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#0D1B26] via-[#132535] to-[#0D1B26] border border-[#38D9E6]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-heading font-bold text-[#EAF4F7]">
              Ready to investigate a live network scenario?
            </h3>
            <p className="text-xs text-[#8EA5B4] max-w-lg">
              Launch the full-viewport command center to run flow simulations, inspect sensor curves, and trace contamination in real time.
            </p>
          </div>
          <button
            onClick={() => navigate('/command-center')}
            className="px-6 py-3 rounded-xl bg-[#38D9E6] hover:bg-[#38D9E6]/90 text-[#071018] font-heading font-bold text-xs shadow-lg shadow-[#38D9E6]/30 transition-all hover:scale-105 active:scale-100 whitespace-nowrap"
          >
            ENTER COMMAND CENTER →
          </button>
        </div>
      </section>
    </div>
  );
};
