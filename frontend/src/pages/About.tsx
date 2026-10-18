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
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-12 text-[#EAF1F8]">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#425B9A]/30">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#EAF1F8]">
          About JALRAKSHAK AI
        </h1>
        <p className="text-sm text-[#9FB0C9]">
          Methodology, mathematical formulation, local AI constraints, and classroom instructor tools.
        </p>
      </div>

      {/* Mathematical Methodology */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-[#76C0EC]" />
          <h2 className="text-xl font-serif font-bold text-[#EAF1F8]">
            Hydraulic &amp; Mathematical Formulation
          </h2>
        </div>

        <div className="p-5 bg-[#141E3D] border border-[#425B9A]/30 rounded-xl space-y-4 text-xs sm:text-sm text-[#9FB0C9] leading-relaxed">
          <div>
            <strong className="text-[#EAF1F8] block mb-1">1. Discrete Transport Physics:</strong>
            <p>
              For any candidate origin node <span className="font-mono text-[#76C0EC]">s</span> and target node <span className="font-mono text-[#76C0EC]">v</span>,
              the plume concentration <span className="font-mono text-[#76C0EC]">C(v, t) = D(s, v)</span> for all time steps <span className="font-mono text-[#76C0EC]">t &gt;= t0 + d(s, v)</span>,
              where <span className="font-mono text-[#76C0EC]">d(s, v)</span> is the cumulative pipe delay and <span className="font-mono text-[#76C0EC]">D(s, v)</span> is the cumulative dilution factor along the primary downstream path.
            </p>
          </div>

          <div>
            <strong className="text-[#EAF1F8] block mb-1">2. Bayesian Likelihood &amp; Posterior Marginalization:</strong>
            <p>
              Under Gaussian sensor noise <span className="font-mono text-[#76C0EC]">sigma = 15.0 umhos/cm</span>, the likelihood across all time-stamped sensor readings <span className="font-mono text-[#76C0EC]">Y</span> is computed and marginalized across a grid of unknown injection onset steps <span className="font-mono text-[#76C0EC]">t0</span>.
              Normalized using numerically stable log-sum-exp to ensure posteriors sum strictly to 1.0.
            </p>
          </div>

          <div>
            <strong className="text-[#EAF1F8] block mb-1">3. Optimal Experimental Design (OED):</strong>
            <p>
              Sampling recommendations maximize Expected Information Gain (EIG), computing the reduction in Shannon entropy:
              <span className="font-mono text-[#76C0EC] block mt-1">IG(u) = H_curr - E[H(P | Y_u)]</span>
              This bisects competing hypotheses with the fewest possible grab samples.
            </p>
          </div>
        </div>
      </section>

      {/* Dataset Provenance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-[#76C0EC]" />
          <h2 className="text-xl font-serif font-bold text-[#EAF1F8]">
            Dataset Calibration &amp; Scope
          </h2>
        </div>

        <div className="p-5 bg-[#141E3D] border border-[#425B9A]/30 rounded-xl space-y-2 text-xs sm:text-sm text-[#9FB0C9] leading-relaxed">
          <p>
            The simulation parameters are calibrated against historical Indian Central Pollution Control Board (CPCB) monitoring station records.
            The raw dataset (1,991 rows, 12 columns) contains real monitoring records for pH, Electrical Conductivity, Dissolved Oxygen, BOD, and Coliform.
          </p>
          <p className="text-[#91AC67]">
            • Normal electrical conductivity median: <strong>183.0 umhos/cm</strong><br />
            • Background sensor noise: <strong>15.0 umhos/cm</strong><br />
            • Anomaly alert threshold: <strong>230.0 umhos/cm</strong>
          </p>
          <p className="text-[11px] text-[#9FB0C9]/80 pt-2 border-t border-[#425B9A]/20">
            Note: The dataset provides statistical distributions only. It is never used to predict safety verdicts for real drinking water.
          </p>
        </div>
      </section>

      {/* AI Model Rules */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu size={20} className="text-[#76C0EC]" />
          <h2 className="text-xl font-serif font-bold text-[#EAF1F8]">
            Open-Weight AI Incident Analyst (Gemma 3 1B)
          </h2>
        </div>

        <div className="p-5 bg-[#141E3D] border border-[#425B9A]/30 rounded-xl space-y-2 text-xs sm:text-sm text-[#9FB0C9] leading-relaxed">
          <p>
            Incident reports are synthesized locally by Google DeepMind&apos;s <strong>Gemma 3 1B</strong> running via Ollama.
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
          <Compass size={18} className="text-[#76C0EC]" />
          <h3 className="font-serif font-bold text-base text-[#EAF1F8]">
            Session Source (UTM Parameters)
          </h3>
        </div>
        <div className="p-3 bg-[#0D1630] rounded-xl border border-[#425B9A]/30 text-xs font-mono text-[#9FB0C9]">
          {Object.keys(utmParams).length > 0 ? (
            <div className="space-y-1">
              {Object.entries(utmParams).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[#9FB0C9]">{k}:</span>
                  <span className="text-[#76C0EC] font-semibold">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <span>No incoming UTM campaign tracking parameters detected in URL.</span>
          )}
        </div>
      </section>

      {/* Classroom Instructor Unlock Tool */}
      <section className="p-6 bg-[#141E3D] border border-[#425B9A]/40 rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#425B9A]/30">
          <div className="flex items-center gap-2 text-[#76C0EC]">
            <KeyRound size={20} />
            <h3 className="font-serif font-bold text-base text-[#EAF1F8]">
              Classroom Instructor Controls
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D1630] text-[#9FB0C9] border border-[#425B9A]/30">
            Classroom Lock
          </span>
        </div>

        <p className="text-xs text-[#9FB0C9] leading-relaxed">
          Educators can unlock experimental parameters (sample budget modifications, sensor noise adjustment).
          Default demo passcode: <code className="text-[#76C0EC]">jalrakshak-demo-2026</code>.
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
              <span className="text-xs text-[#D9534F] block">{unlockError}</span>
            )}

            <button
              type="submit"
              disabled={submitting || !passcode}
              className="px-4 py-2 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Verifying...' : 'Unlock classroom tools'}
            </button>
          </form>
        ) : (
          <div className="p-3 bg-[#0D1630] rounded-lg border border-[#91AC67]/40 space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#91AC67] font-semibold">
              <CheckCircle size={16} />
              <span>{unlockStatus || 'Classroom instructor mode active.'}</span>
            </div>
            <div className="text-xs text-[#9FB0C9] space-y-1">
              <div>• Investigation Sample Budget: 6 samples (Fixed)</div>
              <div>• Noise Variance Sigma: 15.0 umhos/cm</div>
              <div>• Ground Truth Enclosure: Strictly Guarded</div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
