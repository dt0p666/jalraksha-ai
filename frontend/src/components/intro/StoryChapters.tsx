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
    <div id="story-start" className="space-y-24 py-16" style={{ background: '#007979' }}>
      {/* Giant Kinetic Typography Headline */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#D9D28B] leading-[1.15] tracking-tight">
          <span className="text-[#24B1B1]">Detect</span> the threat.{' '}
          <span className="text-[#D9D28B]">Trace</span> the source.{' '}
          <span className="text-[#24B1B1]">Protect</span> the community.
        </h2>
        <p className="text-sm sm:text-base text-[#24B1B1] max-w-2xl mx-auto leading-relaxed">
          When an invisible waterborne contaminant enters a rural piped network, every minute counts.
          Here's how the three stages of the investigation work.
        </p>
      </div>

      {/* Marquee Band — Sea Green (#78A4CB) band */}
      <div className="w-full bg-[#78A4CB] border-y border-[#007979]/40 py-3 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-12 font-mono text-xs text-[#086288] font-bold tracking-widest uppercase">
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
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#78A4CB]/30 text-[#D9D28B] border border-[#78A4CB]/50">
              STAGE 01
            </span>
            <span className="text-xs uppercase tracking-wider text-[#24B1B1] font-semibold">Sensor readings</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#D9D28B]">
            Plumes travel with hydraulic delay
          </h3>
          <p className="text-sm text-[#24B1B1] leading-relaxed">
            Contamination doesn't appear everywhere at once. It travels with water flow,
            arriving at sensors downstream after a delay. Clean sensors are just as useful as
            alarmed ones — they rule out upstream sources.
          </p>

          <div className="pt-2">
            <label className="text-xs text-[#24B1B1] block mb-1">
              Move the plume forward: <strong className="text-[#D9D28B]">Step {detectStep}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="4"
              value={detectStep}
              onChange={e => setDetectStep(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#007979] rounded-lg accent-[#24B1B1]"
            />
          </div>
        </div>

        {/* Live Mini-Visual 1 */}
        <div className="p-6 rounded-xl bg-[#007979] border border-[#78A4CB]/40 relative flex flex-col items-center justify-center min-h-[220px]">
          <div className="flex items-center justify-between w-full max-w-xs relative">
            {/* Pipe connector line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#78A4CB]/40 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#D9D28B] -translate-y-1/2 transition-all duration-300 z-0"
              style={{ width: `${(detectStep / 4) * 100}%` }}
            />

            {/* Node 1: Source */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#D9D28B] border-2 border-[#D9D28B] flex items-center justify-center text-white text-xs font-mono font-bold shadow-md">
                J-01
              </div>
              <span className="text-[10px] font-mono text-[#D9D28B] mt-1 font-semibold">Plume Leak</span>
            </div>

            {/* Node 2: Intermediate */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 transition-colors flex items-center justify-center text-xs font-mono font-bold shadow ${
                  detectStep >= 2
                    ? 'bg-[#D9D28B] border-[#007979] text-[#086288]'
                    : 'bg-[#163238] border-[#78A4CB] text-[#24B1B1]'
                }`}
              >
                J-02
              </div>
              <span className="text-[10px] font-mono text-[#24B1B1] mt-1">Delay T+2</span>
            </div>

            {/* Node 3: Sensor */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 transition-colors flex items-center justify-center text-xs font-mono font-bold shadow ${
                  detectStep >= 4
                    ? 'bg-[#D9D28B] border-[#D9D28B] text-white animate-pulse'
                    : 'bg-[#163238] border-[#78A4CB] text-[#24B1B1]'
                }`}
              >
                <Activity size={18} />
              </div>
              <span className="text-[10px] font-mono text-[#24B1B1] mt-1">
                {detectStep >= 4 ? 'Alert (380 µS/cm)' : 'Normal (183)'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: TRACE — Sea Green tinted section */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Live Mini-Visual 2 */}
        <div className="order-2 md:order-1 p-6 rounded-xl bg-[#007979] border border-[#24B1B1]/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#78A4CB]/30 text-xs">
            <span className="font-semibold text-[#24B1B1]">Source candidates narrowing</span>
            <span className="font-mono text-[#D9D28B]">{samplesTaken} / 5 field samples</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#EAF7F5]">Candidate J-08</span>
                <span className="text-[#D9D28B] font-bold">{candA}%</span>
              </div>
              <div className="h-2 bg-[#086288] rounded-full overflow-hidden">
                <div className="h-full bg-[#24B1B1] transition-all duration-300" style={{ width: `${candA}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#24B1B1]/70">Candidate J-12</span>
                <span className="text-[#24B1B1]/50">{candB}%</span>
              </div>
              <div className="h-2 bg-[#086288] rounded-full overflow-hidden">
                <div className="h-full bg-[#78A4CB] transition-all duration-300" style={{ width: `${candB}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#24B1B1]/70">Candidate R2</span>
                <span className="text-[#24B1B1]/50">{candC}%</span>
              </div>
              <div className="h-2 bg-[#086288] rounded-full overflow-hidden">
                <div className="h-full bg-[#78A4CB]/50 transition-all duration-300" style={{ width: `${candC}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs text-[#24B1B1] block mb-1">
              Water samples taken: <strong className="text-[#D9D28B]">{samplesTaken}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={samplesTaken}
              onChange={e => setSamplesTaken(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#086288] rounded-lg accent-[#24B1B1]"
            />
          </div>
        </div>

        <div className="order-1 md:order-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#78A4CB]/30 text-[#24B1B1] border border-[#24B1B1]/30">
              STAGE 02
            </span>
            <span className="text-xs uppercase tracking-wider text-[#24B1B1] font-semibold">Sampling & tracing</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#D9D28B]">
            Each sample cuts uncertainty in half
          </h3>
          <p className="text-sm text-[#24B1B1] leading-relaxed">
            Rather than testing everywhere at random, the system picks the spot where a sample
            will eliminate the most competing candidates. A few targeted samples converge quickly
            on the real source.
          </p>
        </div>
      </section>

      {/* Chapter 3: PROTECT — Aqua Mint (#24B1B1) card */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#24B1B1]/20 text-[#24B1B1] border border-[#24B1B1]/40">
              STAGE 03
            </span>
            <span className="text-xs uppercase tracking-wider text-[#24B1B1] font-semibold">Community protection</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#D9D28B]">
            Isolate fast, protect households
          </h3>
          <p className="text-sm text-[#24B1B1] leading-relaxed">
            Once the most likely source is identified, local engineers can isolate suspect valves
            and issue advisories to affected villages — before contaminated water reaches household taps.
          </p>
        </div>

        {/* Live Mini-Visual 3 */}
        <div className="p-6 rounded-xl bg-[#24B1B1] border border-[#007979]/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#007979] flex items-center gap-1.5">
              <ShieldCheck size={16} />Village containment advisory
            </span>
            <span className="text-[10px] font-mono text-[#007979]/70 font-bold">Zone D &amp; Zone E</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-[#D9D28B] rounded border border-[#007979]/30">
              <span className="text-[#007979]/80 text-[10px] block font-semibold">Zone D (Primary health)</span>
              <span className="font-mono font-bold text-[#086288]">190 households</span>
              <span className="text-[10px] text-[#D9D28B] block font-bold">Standpost isolated</span>
            </div>
            <div className="p-2.5 bg-[#D9D28B] rounded border border-[#007979]/30">
              <span className="text-[#007979]/80 text-[10px] block font-semibold">Zone E (Central hamlet)</span>
              <span className="font-mono font-bold text-[#086288]">380 households</span>
              <span className="text-[10px] text-[#007979] block font-bold">Alternate tank active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <div className="max-w-xl mx-auto px-4 text-center space-y-4 pt-8 pb-8">
        <h3 className="text-2xl font-serif font-bold text-[#D9D28B]">
          Ready to run an investigation?
        </h3>
        <p className="text-xs sm:text-sm text-[#24B1B1]">
          Take command of the 42-node distribution network. Start a simulated incident, watch live
          sensor readings, and track down the source.
        </p>
        <button
          onClick={() => navigate('/command-center')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D9D28B] hover:bg-[#fff9cf] text-[#007979] font-bold text-sm border-2 border-[#24B1B1] shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <span>Open the command center</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
