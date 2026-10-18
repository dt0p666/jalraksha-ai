import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity, ArrowRight } from 'lucide-react';

export const StoryChapters: React.FC = () => {
  const navigate = useNavigate();

  // Mini-visual 1 (Detect): leak simulation step
  const [detectStep, setDetectStep] = useState(2);

  // Mini-visual 2 (Trace): samples taken slider
  const [samplesTaken, setSamplesTaken] = useState(3);

  // Candidate probabilities narrowing dynamically with samples taken
  const candA = Math.min(94, Math.round(35 + samplesTaken * 18));
  const candB = Math.max(4, Math.round(35 - samplesTaken * 10));
  const candC = Math.max(2, Math.round(30 - samplesTaken * 8));

  return (
    <div id="story-start" className="space-y-24 py-16" style={{ background: '#34908B' }}>
      {/* Giant Kinetic Typography Headline */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#FDF4AF] leading-[1.15] tracking-tight">
          <span className="text-[#A5E9DD]">Detect</span> the threat.{' '}
          <span className="text-[#FDF4AF]">Trace</span> the source.{' '}
          <span className="text-[#A5E9DD]">Protect</span> the community.
        </h2>
        <p className="text-sm sm:text-base text-[#A5E9DD] max-w-2xl mx-auto leading-relaxed">
          When an invisible waterborne contaminant enters a rural piped network, every minute counts.
          Here's how the three stages of the investigation work.
        </p>
      </div>

      {/* Marquee Band — Sea Green (#6FBEB2) band */}
      <div className="w-full bg-[#6FBEB2] border-y border-[#34908B]/40 py-3 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-12 font-mono text-xs text-[#081416] font-bold tracking-widest uppercase">
          <span>• Where did it start?</span>
          <span>• Who is affected?</span>
          <span>• Where do we test next?</span>
          <span>• Best next sample location</span>
          <span>• Open-weight AI incident report</span>
          <span>• Where did it start?</span>
          <span>• Who is affected?</span>
          <span>• Where do we test next?</span>
          <span>• Best next sample location</span>
          <span>• Open-weight AI incident report</span>
        </div>
      </div>

      {/* Chapter 1: DETECT — Deep Teal background */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#6FBEB2]/30 text-[#FDF4AF] border border-[#6FBEB2]/50">
              STAGE 01
            </span>
            <span className="text-xs uppercase tracking-wider text-[#A5E9DD] font-semibold">Sensor readings</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDF4AF]">
            Plumes travel with hydraulic delay
          </h3>
          <p className="text-sm text-[#A5E9DD] leading-relaxed">
            Contamination doesn't appear everywhere at once. It travels with water flow,
            arriving at sensors downstream after a delay. Clean sensors are just as useful as
            alarmed ones — they rule out upstream sources.
          </p>

          <div className="pt-2">
            <label className="text-xs text-[#A5E9DD] block mb-1">
              Move the plume forward: <strong className="text-[#FDF4AF]">Step {detectStep}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="4"
              value={detectStep}
              onChange={e => setDetectStep(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#0F2226] rounded-lg accent-[#A5E9DD]"
            />
          </div>
        </div>

        {/* Live Mini-Visual 1 */}
        <div className="p-6 rounded-xl bg-[#0F2226] border border-[#6FBEB2]/40 relative flex flex-col items-center justify-center min-h-[220px]">
          <div className="flex items-center justify-between w-full max-w-xs relative">
            {/* Pipe connector line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#6FBEB2]/40 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#FF5C5C] -translate-y-1/2 transition-all duration-300 z-0"
              style={{ width: `${(detectStep / 4) * 100}%` }}
            />

            {/* Node 1: Source */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#FF5C5C] border-2 border-[#FDF4AF] flex items-center justify-center text-white text-xs font-mono font-bold shadow-md">
                J-01
              </div>
              <span className="text-[10px] font-mono text-[#FF5C5C] mt-1 font-semibold">Plume Leak</span>
            </div>

            {/* Node 2: Intermediate */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 transition-colors flex items-center justify-center text-xs font-mono font-bold shadow ${
                  detectStep >= 2
                    ? 'bg-[#FDF4AF] border-[#34908B] text-[#081416]'
                    : 'bg-[#163238] border-[#6FBEB2] text-[#A5E9DD]'
                }`}
              >
                J-02
              </div>
              <span className="text-[10px] font-mono text-[#A5E9DD] mt-1">Delay T+2</span>
            </div>

            {/* Node 3: Sensor */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 transition-colors flex items-center justify-center text-xs font-mono font-bold shadow ${
                  detectStep >= 4
                    ? 'bg-[#FF5C5C] border-[#FDF4AF] text-white animate-pulse'
                    : 'bg-[#163238] border-[#6FBEB2] text-[#A5E9DD]'
                }`}
              >
                <Activity size={18} />
              </div>
              <span className="text-[10px] font-mono text-[#A5E9DD] mt-1">
                {detectStep >= 4 ? 'Alert (380 µS/cm)' : 'Normal (183)'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: TRACE — Sea Green tinted section */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Live Mini-Visual 2 */}
        <div className="order-2 md:order-1 p-6 rounded-xl bg-[#0F2226] border border-[#A5E9DD]/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#6FBEB2]/30 text-xs">
            <span className="font-semibold text-[#A5E9DD]">Source candidates narrowing</span>
            <span className="font-mono text-[#FDF4AF]">{samplesTaken} / 5 field samples</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#EAF7F5]">Candidate J-08</span>
                <span className="text-[#FDF4AF] font-bold">{candA}%</span>
              </div>
              <div className="h-2 bg-[#081416] rounded-full overflow-hidden">
                <div className="h-full bg-[#A5E9DD] transition-all duration-300" style={{ width: `${candA}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A5E9DD]/70">Candidate J-12</span>
                <span className="text-[#A5E9DD]/50">{candB}%</span>
              </div>
              <div className="h-2 bg-[#081416] rounded-full overflow-hidden">
                <div className="h-full bg-[#6FBEB2] transition-all duration-300" style={{ width: `${candB}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A5E9DD]/70">Candidate R2</span>
                <span className="text-[#A5E9DD]/50">{candC}%</span>
              </div>
              <div className="h-2 bg-[#081416] rounded-full overflow-hidden">
                <div className="h-full bg-[#6FBEB2]/50 transition-all duration-300" style={{ width: `${candC}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs text-[#A5E9DD] block mb-1">
              Water samples taken: <strong className="text-[#FDF4AF]">{samplesTaken}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={samplesTaken}
              onChange={e => setSamplesTaken(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#081416] rounded-lg accent-[#A5E9DD]"
            />
          </div>
        </div>

        <div className="order-1 md:order-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#6FBEB2]/30 text-[#A5E9DD] border border-[#A5E9DD]/30">
              STAGE 02
            </span>
            <span className="text-xs uppercase tracking-wider text-[#A5E9DD] font-semibold">Sampling & tracing</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDF4AF]">
            Each sample cuts uncertainty in half
          </h3>
          <p className="text-sm text-[#A5E9DD] leading-relaxed">
            Rather than testing everywhere at random, the system picks the spot where a sample
            will eliminate the most competing candidates. A few targeted samples converge quickly
            on the real source.
          </p>
        </div>
      </section>

      {/* Chapter 3: PROTECT — Aqua Mint (#A5E9DD) card */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#A5E9DD]/20 text-[#A5E9DD] border border-[#A5E9DD]/40">
              STAGE 03
            </span>
            <span className="text-xs uppercase tracking-wider text-[#A5E9DD] font-semibold">Community protection</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDF4AF]">
            Isolate fast, protect households
          </h3>
          <p className="text-sm text-[#A5E9DD] leading-relaxed">
            Once the most likely source is identified, local engineers can isolate suspect valves
            and issue advisories to affected villages — before contaminated water reaches household taps.
          </p>
        </div>

        {/* Live Mini-Visual 3 */}
        <div className="p-6 rounded-xl bg-[#A5E9DD] border border-[#34908B]/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#34908B] flex items-center gap-1.5">
              <ShieldCheck size={16} />Village containment advisory
            </span>
            <span className="text-[10px] font-mono text-[#34908B]/70 font-bold">Zone D &amp; Zone E</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-[#FDF4AF] rounded border border-[#34908B]/30">
              <span className="text-[#34908B]/80 text-[10px] block font-semibold">Zone D (Primary health)</span>
              <span className="font-mono font-bold text-[#081416]">190 households</span>
              <span className="text-[10px] text-[#FF5C5C] block font-bold">Standpost isolated</span>
            </div>
            <div className="p-2.5 bg-[#FDF4AF] rounded border border-[#34908B]/30">
              <span className="text-[#34908B]/80 text-[10px] block font-semibold">Zone E (Central hamlet)</span>
              <span className="font-mono font-bold text-[#081416]">380 households</span>
              <span className="text-[10px] text-[#34908B] block font-bold">Alternate tank active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <div className="max-w-xl mx-auto px-4 text-center space-y-4 pt-8 pb-8">
        <h3 className="text-2xl font-serif font-bold text-[#FDF4AF]">
          Ready to run an investigation?
        </h3>
        <p className="text-xs sm:text-sm text-[#A5E9DD]">
          Take command of the 42-node distribution network. Start a simulated incident, watch live
          sensor readings, and track down the source.
        </p>
        <button
          onClick={() => navigate('/command-center')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FDF4AF] hover:bg-[#fff9cf] text-[#34908B] font-bold text-sm border-2 border-[#A5E9DD] shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <span>Open the command center</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
