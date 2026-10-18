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
    <div id="story-start" className="space-y-24 py-16">
      {/* Giant Kinetic Typography Headline */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#EAF1F8] leading-[1.15] tracking-tight">
          <span className="text-[#76C0EC]">Detect</span> the threat.{' '}
          <span className="text-[#425B9A] dark:text-[#76C0EC]/80">Trace</span> the source.{' '}
          <span className="text-[#91AC67]">Protect</span> the community.
        </h2>
        <p className="text-sm sm:text-base text-[#9FB0C9] max-w-2xl mx-auto leading-relaxed">
          When an invisible waterborne contaminant enters a rural piped network, every minute counts.
          Explore the three stages of investigative physics.
        </p>
      </div>

      {/* Marquee Band */}
      <div className="w-full bg-[#141E3D] border-y border-[#425B9A]/30 py-3 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-12 font-mono text-xs text-[#76C0EC] tracking-widest uppercase">
          <span>• Where did it start?</span>
          <span>• Who is affected?</span>
          <span>• Where do we test next?</span>
          <span>• Optimal Information Gain</span>
          <span>• Open-Weight Incident Reporting</span>
          <span>• Where did it start?</span>
          <span>• Who is affected?</span>
          <span>• Where do we test next?</span>
          <span>• Optimal Information Gain</span>
          <span>• Open-Weight Incident Reporting</span>
        </div>
      </div>

      {/* Pinned Chapter 1: DETECT */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#76C0EC]/20 text-[#76C0EC] border border-[#76C0EC]/30">
              STAGE 01
            </span>
            <span className="text-xs uppercase tracking-wider text-[#9FB0C9] font-semibold">Sensor Telemetry</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAF1F8]">
            Plumes travel with hydraulic delay
          </h3>
          <p className="text-sm text-[#9FB0C9] leading-relaxed">
            Contamination does not instantly appear across the village. It travels with water flow down
            pipe lines, delaying its arrival at downstream telemetry sensors. Clean sensors are just as
            informative as alarmed ones: they rule out upstream sources.
          </p>

          <div className="pt-2">
            <label className="text-xs text-[#9FB0C9] block mb-1">
              Advance plume transport delay: <strong className="text-[#76C0EC]">Step {detectStep}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="4"
              value={detectStep}
              onChange={e => setDetectStep(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#0D1630] rounded-lg accent-[#76C0EC]"
            />
          </div>
        </div>

        {/* Live Mini-Visual 1 */}
        <div className="p-6 rounded-xl bg-[#141E3D] border border-[#425B9A]/30 relative flex flex-col items-center justify-center min-h-[220px]">
          <div className="flex items-center justify-between w-full max-w-xs relative">
            {/* Pipe connector line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#425B9A] -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#D9534F] -translate-y-1/2 transition-all duration-300 z-0"
              style={{ width: `${(detectStep / 4) * 100}%` }}
            />

            {/* Node 1: Source */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#D9534F] border-2 border-white flex items-center justify-center text-white text-xs font-mono font-bold shadow-md">
                J-01
              </div>
              <span className="text-[10px] font-mono text-[#D9534F] mt-1 font-semibold">Plume Leak</span>
            </div>

            {/* Node 2: Intermediate */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 transition-colors flex items-center justify-center text-xs font-mono font-bold shadow ${
                  detectStep >= 2
                    ? 'bg-[#E8A33D] border-white text-[#0D1630]'
                    : 'bg-[#1D2A52] border-[#425B9A] text-[#9FB0C9]'
                }`}
              >
                J-02
              </div>
              <span className="text-[10px] font-mono text-[#9FB0C9] mt-1">Delay T+2</span>
            </div>

            {/* Node 3: Sensor */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 transition-colors flex items-center justify-center text-xs font-mono font-bold shadow ${
                  detectStep >= 4
                    ? 'bg-[#D9534F] border-white text-white animate-pulse'
                    : 'bg-[#1D2A52] border-[#425B9A] text-[#76C0EC]'
                }`}
              >
                <Activity size={18} />
              </div>
              <span className="text-[10px] font-mono text-[#76C0EC] mt-1">
                {detectStep >= 4 ? 'ALARM (380 umhos)' : 'Normal (183)'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pinned Chapter 2: TRACE */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Live Mini-Visual 2 */}
        <div className="order-2 md:order-1 p-6 rounded-xl bg-[#141E3D] border border-[#425B9A]/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#425B9A]/30 text-xs">
            <span className="font-semibold text-[#76C0EC]">Hypothesis Disambiguation</span>
            <span className="font-mono text-[#9FB0C9]">{samplesTaken} / 5 field samples</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span>Candidate J-08</span>
                <span className="text-[#76C0EC] font-bold">{candA}%</span>
              </div>
              <div className="h-2 bg-[#0D1630] rounded-full overflow-hidden">
                <div className="h-full bg-[#76C0EC] transition-all duration-300" style={{ width: `${candA}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span>Candidate J-12</span>
                <span className="text-[#9FB0C9]">{candB}%</span>
              </div>
              <div className="h-2 bg-[#0D1630] rounded-full overflow-hidden">
                <div className="h-full bg-[#425B9A] transition-all duration-300" style={{ width: `${candB}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span>Candidate R2</span>
                <span className="text-[#9FB0C9]">{candC}%</span>
              </div>
              <div className="h-2 bg-[#0D1630] rounded-full overflow-hidden">
                <div className="h-full bg-[#425B9A]/60 transition-all duration-300" style={{ width: `${candC}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs text-[#9FB0C9] block mb-1">
              Targeted Field Samples Taken: <strong className="text-[#EAF1F8]">{samplesTaken}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={samplesTaken}
              onChange={e => setSamplesTaken(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#0D1630] rounded-lg accent-[#76C0EC]"
            />
          </div>
        </div>

        <div className="order-1 md:order-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#425B9A]/30 text-[#76C0EC] border border-[#76C0EC]/30">
              STAGE 02
            </span>
            <span className="text-xs uppercase tracking-wider text-[#9FB0C9] font-semibold">Inference & Sampling</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAF1F8]">
            Optimal sampling bisects uncertainty
          </h3>
          <p className="text-sm text-[#9FB0C9] leading-relaxed">
            Rather than randomly sampling everywhere or testing where water is already known to be dirty,
            the Bayesian engine computes Expected Information Gain (EIG). Each targeted sample eliminates
            whole branches of competing hypotheses.
          </p>
        </div>
      </section>

      {/* Pinned Chapter 3: PROTECT */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#597928]/40 text-[#91AC67] border border-[#91AC67]/40">
              STAGE 03
            </span>
            <span className="text-xs uppercase tracking-wider text-[#9FB0C9] font-semibold">Community Advisory</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAF1F8]">
            Actionable containment and protection
          </h3>
          <p className="text-sm text-[#9FB0C9] leading-relaxed">
            Once high-probability candidates are identified, local gram panchayats and municipal engineers
            can isolate suspect transmission valves and warn affected service hamlets before contaminated water
            reaches household taps.
          </p>
        </div>

        {/* Live Mini-Visual 3 */}
        <div className="p-6 rounded-xl bg-[#597928]/15 border border-[#91AC67]/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#91AC67] flex items-center gap-1.5">
              <ShieldCheck size={16} /> Hamlet Containment Advisory
            </span>
            <span className="text-[10px] font-mono text-[#9FB0C9]">Zone D & Zone E</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-[#0D1630] rounded border border-[#91AC67]/30">
              <span className="text-[#9FB0C9] text-[10px] block">Zone D (Primary Health)</span>
              <span className="font-mono font-bold text-[#EAF1F8]">190 households</span>
              <span className="text-[10px] text-[#E8A33D] block font-semibold">Standpost isolated</span>
            </div>
            <div className="p-2.5 bg-[#0D1630] rounded border border-[#91AC67]/30">
              <span className="text-[#9FB0C9] text-[10px] block">Zone E (Central Hamlet)</span>
              <span className="font-mono font-bold text-[#EAF1F8]">380 households</span>
              <span className="text-[10px] text-[#91AC67] block font-semibold">Alternate tank active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <div className="max-w-xl mx-auto px-4 text-center space-y-4 pt-8">
        <h3 className="text-2xl font-serif font-bold text-[#EAF1F8]">
          Ready to run an investigation?
        </h3>
        <p className="text-xs sm:text-sm text-[#9FB0C9]">
          Take command of the 42-node distribution network. Start a simulated incident, analyze live telemetry,
          and track down the source.
        </p>
        <button
          onClick={() => navigate('/command-center')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#425B9A] hover:bg-[#4f6cb6] text-white font-semibold text-sm border border-[#76C0EC]/50 shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <span>Enter the command center</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
