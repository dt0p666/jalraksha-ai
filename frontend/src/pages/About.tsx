import React, { useState } from 'react';
import { PasswordInput } from '../components/ui/PasswordInput';
import { api } from '../api/client';
import { useApp } from '../state/appStore';
import { BookOpen, KeyRound, CheckCircle, Cpu, Database, Compass } from 'lucide-react';

export const About: React.FC = () => {
  const { instructorUnlocked, setInstructorUnlocked, utmParams } = useApp();

  const [passcode, setPasscode] = useState('');
  const [unlockStatus, setUnlockStatus] = useState<string | null>(null);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);
    setUnlockStatus(null);
    setSubmitting(true);

    try {
      const res = await api.unlockInstructor(passcode);
      if (res.tools_unlocked) {
        setInstructorUnlocked(true);
        setUnlockStatus(res.message);
      }
    } catch (err: any) {
      setUnlockError(err.message || 'Incorrect passcode.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-12 text-[#95BDD7]">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#24B1B1]/20">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[#95BDD7]">
          About JALRAKSHAK AI
        </h1>
        <p className="text-sm text-[#95BDD7]">
          Methodology, physical delay formulation, local AI constraints, and classroom instructor controls.
        </p>
      </div>

      {/* Mathematical Methodology */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-[#24B1B1]" />
          <h2 className="text-xl font-heading font-bold text-[#95BDD7]">
            Hydraulic &amp; Mathematical Formulation
          </h2>
        </div>

        <div className="p-5 bg-[#007979] border border-[#24B1B1]/25 rounded-2xl space-y-4 text-xs sm:text-sm text-[#95BDD7] leading-relaxed shadow-xl">
          <div>
            <strong className="text-[#95BDD7] block mb-1">1. Discrete Transport Physics:</strong>
            <p>
              For any candidate origin node <span className="font-mono text-[#24B1B1]">s</span> and target node <span className="font-mono text-[#24B1B1]">v</span>,
              the plume concentration <span className="font-mono text-[#24B1B1]">C(v, t) = D(s, v)</span> for all time steps <span className="font-mono text-[#24B1B1]">t &gt;= t0 + d(s, v)</span>,
              where <span className="font-mono text-[#24B1B1]">d(s, v)</span> is the cumulative pipe delay and <span className="font-mono text-[#24B1B1]">D(s, v)</span> is the cumulative dilution factor along the primary downstream path.
            </p>
          </div>

          <div>
            <strong className="text-[#95BDD7] block mb-1">2. Bayesian Likelihood &amp; Posterior Marginalization:</strong>
            <p>
              Under Gaussian sensor noise <span className="font-mono text-[#24B1B1]">sigma = 15.0 µS/cm</span>, the likelihood across all time-stamped sensor readings <span className="font-mono text-[#24B1B1]">Y</span> is computed and marginalized across a grid of unknown injection onset steps <span className="font-mono text-[#24B1B1]">t0</span>.
              Normalized using numerically stable log-sum-exp to ensure posteriors sum strictly to 1.0.
            </p>
          </div>

          <div>
            <strong className="text-[#95BDD7] block mb-1">3. Optimal Experimental Design (OED):</strong>
            <p>
              Sampling recommendations maximize Expected Information Gain (EIG), computing the reduction in Shannon entropy:
              <span className="font-mono text-[#D9D28B] block mt-1">IG(u) = H_curr - E[H(P | Y_u)]</span>
              This bisects competing hypotheses with the fewest possible grab samples.
            </p>
          </div>
        </div>
      </section>

      {/* Dataset Provenance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-[#24B1B1]" />
          <h2 className="text-xl font-heading font-bold text-[#95BDD7]">
            Dataset Calibration &amp; Scope
          </h2>
        </div>

        <div className="p-5 bg-[#007979] border border-[#24B1B1]/25 rounded-2xl space-y-2 text-xs sm:text-sm text-[#95BDD7] leading-relaxed shadow-xl">
          <p>
            The simulation parameters are calibrated against historical Indian Central Pollution Control Board (CPCB) monitoring station records.
            The raw dataset (1,991 rows, 12 columns) contains real monitoring records for pH, Electrical Conductivity, Dissolved Oxygen, BOD, and Coliform.
          </p>
          <p className="text-[#24B1B1] font-mono text-xs">
            • Normal electrical conductivity median: <strong>183.0 µS/cm</strong><br />
            • Background sensor noise: <strong>15.0 µS/cm</strong><br />
            • Anomaly alert threshold: <strong>230.0 µS/cm</strong>
          </p>
          <p className="text-[11px] text-[#95BDD7]/80 pt-2 border-t border-[#24B1B1]/15">
            Note: The dataset provides statistical distributions only. It is never used to predict safety verdicts for real drinking water.
          </p>
        </div>
      </section>

      {/* AI Model Rules */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu size={20} className="text-[#24B1B1]" />
          <h2 className="text-xl font-heading font-bold text-[#95BDD7]">
            Open-Weight AI Analyst (Gemma 4)
          </h2>
        </div>

        <div className="p-5 bg-[#007979] border border-[#24B1B1]/25 rounded-2xl space-y-2 text-xs sm:text-sm text-[#95BDD7] leading-relaxed shadow-xl">
          <p>
            Incident reports are synthesized locally by Google DeepMind&apos;s <strong>Gemma 4</strong> running via Ollama.
            The model receives structured JSON evidence (sensor readings, candidate rankings, path delay equations) and writes a human engineering synthesis.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Zero hallucinations: Strict output verification checks every cited node and probability.</li>
            <li>No safety verdicts: The model is forbidden from declaring water safe to drink.</li>
            <li>Deterministic fallback: If Ollama is offline, a deterministic rule-based summary is automatically produced.</li>
          </ul>
        </div>
      </section>

      {/* Captured UTM Session Source */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-[#24B1B1]" />
          <h3 className="font-heading font-bold text-base text-[#95BDD7]">
            Session Source (UTM Parameters)
          </h3>
        </div>
        <div className="p-3 bg-[#086288] rounded-xl border border-[#24B1B1]/25 text-xs font-mono text-[#95BDD7]">
          {Object.keys(utmParams).length > 0 ? (
            <div className="space-y-1">
              {Object.entries(utmParams).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[#95BDD7]">{k}:</span>
                  <span className="text-[#24B1B1] font-semibold">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <span>No incoming UTM campaign tracking parameters detected in URL.</span>
          )}
        </div>
      </section>

      {/* Classroom Instructor Unlock Tool */}
      <section className="p-6 bg-[#007979] border border-[#24B1B1]/25 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#24B1B1]/15">
          <div className="flex items-center gap-2 text-[#24B1B1]">
            <KeyRound size={20} />
            <h3 className="font-heading font-bold text-base text-[#95BDD7]">
              Classroom Instructor Controls
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#086288] text-[#24B1B1] border border-[#24B1B1]/30">
            Classroom Lock
          </span>
        </div>

        <p className="text-xs text-[#95BDD7] leading-relaxed">
          Educators can unlock experimental parameters (sample budget modifications, sensor noise adjustment).
          Default demo passcode: <code className="text-[#24B1B1] font-mono">jalrakshak-demo-2026</code>.
          Notice: This classroom lock is for teaching demonstrations and does NOT reveal the hidden source.
        </p>

        {!instructorUnlocked ? (
          <form onSubmit={handleUnlock} className="space-y-3 max-w-sm">
            <PasswordInput
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              placeholder="Enter instructor passcode"
              id="instructor-passcode"
            />

            {unlockError && (
              <span className="text-xs text-[#D9D28B] block">{unlockError}</span>
            )}

            <button
              type="submit"
              disabled={submitting || !passcode}
              className="px-5 py-2.5 rounded-xl bg-[#24B1B1] hover:bg-[#24B1B1]/90 text-[#086288] text-xs font-heading font-bold disabled:opacity-50 transition-all shadow-md shadow-[#24B1B1]/25"
            >
              {submitting ? 'Verifying...' : 'Unlock classroom tools'}
            </button>
          </form>
        ) : (
          <div className="p-3 bg-[#086288] rounded-xl border border-[#D9D28B]/40 space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#D9D28B] font-semibold">
              <CheckCircle size={16} />
              <span>{unlockStatus || 'Classroom instructor mode active.'}</span>
            </div>
            <div className="text-xs text-[#95BDD7] space-y-1 font-mono">
              <div>• Investigation Sample Budget: 6 samples (Fixed)</div>
              <div>• Noise Variance Sigma: 15.0 µS/cm</div>
              <div>• Ground Truth Enclosure: Strictly Guarded</div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
