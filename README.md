# JALRAKSHAK AI

> **Detect the threat. Trace the source. Protect the community.**

An interactive educational simulation for investigating contamination in a rural drinking-water pipe network.  
A hidden contamination event begins. Downstream sensors start reading abnormal. You collect samples, watch a Bayesian engine rank the likely source, and ultimately reveal whether it was right.

> **Disclaimer — this is not a safety tool.**  
> JALRAKSHAK AI is a simplified educational simulation, NOT a validated hydraulic or water-safety model.  
> Never use it for municipal or public health decisions. All simulation parameters are illustrative.

---

## What it does

| Feature | Detail |
|---|---|
| **Live pipe-network map** | 42-node directed graph (2 reservoirs, 32 junctions, 8 supply zones). Pipes animate while water flows. Node colours and ring styles reflect contamination state. |
| **Hidden contamination source** | A randomly chosen source node is kept strictly server-side. No client code can ever read it. |
| **Sensor model** | Gaussian-noise concentration readings calibrated from a real 1 991-row CPCB water-quality dataset (`water_dataX.csv`). |
| **Bayesian inference engine** | Log-likelihood marginalized over an onset-time grid; log-sum-exp normalized posterior; Shannon entropy tracks confidence. |
| **Random Forest cross-check** | 60 synthetic training scenarios, 20 trees. Provides a second opinion on the top candidate nodes. |
| **Optimal sampling (OED)** | Expected Information Gain ranks candidate sample locations so each measurement does the most work. |
| **Gemma 3 1B incident report** | Runs locally via Ollama. Strict prompt prevents the model from inventing measurements or safety verdicts. Honest fallback when Ollama is unavailable — clearly labelled, never called AI. |
| **Education layer** | Guided tour, glossary tooltips, interactive quiz, full dataset explorer with histograms. |

---

## Architecture

```
jalrakshak_ai.py/
├── backend/
│   ├── app/
│   │   ├── main.py          FastAPI app, 14 endpoint groups
│   │   ├── config.py        Fixed seed, noise σ, thresholds, Ollama settings
│   │   ├── dataset.py       CSV loader (latin-1), profile, histogram
│   │   ├── network.py       NetworkX DiGraph, path delays & dilution
│   │   ├── simulation.py    Contamination propagation + sensor noise
│   │   ├── session.py       In-memory sessions; hidden source PRIVATE
│   │   ├── inference.py     Bayesian posterior, entropy, top candidates
│   │   ├── ml_crosscheck.py Random Forest synthetic-scenario training
│   │   ├── sampling.py      Expected Information Gain (OED)
│   │   ├── ai_report.py     Ollama/Gemma 3 1B client + fallback
│   │   ├── contact.py       Contact message persistence
│   │   └── data/
│   │       ├── network.json         42-node graph topology
│   │       ├── water_dataX.csv      CPCB source dataset (1 991 rows)
│   │       └── dataset_profile.json Pre-computed summary statistics
│   └── tests/               15 pytest tests (all must pass)
└── frontend/
    └── src/
        ├── api/             Typed API client matching backend schemas
        ├── state/           Zustand app store
        ├── pages/           Home, CommandCenter, Learn, FAQ, About, Contact
        ├── components/      Network canvas, panels, timeline, intro, learn, layout
        ├── content/         Lessons, glossary, quiz, tour steps, FAQ data
        └── styles/          Design tokens (brand palette, dark/light themes)
```

### Information boundary

The hidden contamination source lives **only** in a private Python attribute `session._hidden_source`. It is set once during contamination start and accessible only via `session.reveal()` (called at the end). Every inference, sampling, ML, and AI-report module is tested to have zero imports or references to any private session state — verified by `tests/test_no_leakage.py`.

### Simulation math

**Concentration at sensor s after source u fires at step t₀:**
```
C(s, t) = C_peak × D(u, s) × G(t − t₀ − delay(u,s), σ_spread)  +  ε
```
where `D(u,s)` is cumulative dilution along the shortest path, `delay` is the sum of edge travel times, and `ε ~ N(0, σ_noise)`.

**Bayesian log-likelihood (observation o at sensor s, step t):**
```
log p(o | source=u, onset=t₀) = Σ_{s,t} log N(o_{s,t}; μ(u,s,t,t₀), σ_noise²)
```
Marginalized over a grid of onset steps, then log-sum-exp normalized to a probability simplex.

**Expected Information Gain for candidate sample location c:**
```
EIG(c) = H(posterior) − E_{p(o|c)} [ H(posterior | o) ]
```
Approximated by discrete summation over quantized observation values.

---

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.com/) installed and running (optional — app works without it, with an honest fallback)

### 1 — Clone and enter the project

```powershell
cd "c:\Users\LOQ\OneDrive\Desktop\jalrakshak_ai.py"
```

### 2 — Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Run tests
pytest -v
# Start server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3 — Frontend (new terminal)

```powershell
cd frontend
npm install
npm run dev
```

### 4 — Gemma 3 1B (optional, for AI incident reports)

```powershell
ollama pull gemma3:1b
ollama serve          # runs on http://localhost:11434 by default
```

### 5 — Open

Navigate to **http://localhost:5173**

Or run both servers at once:

```powershell
.\start-dev.ps1
```

---

## Dataset

`water_dataX.csv` — 1 991 rows, Indian CPCB drinking-water monitoring format.  
Key calibration values derived from the dataset (see `backend/app/config.py`):

| Parameter | Value | Source |
|---|---|---|
| Baseline conductivity | 183.0 µS/cm | Median after pH-outlier removal |
| Noise sigma | 15.0 µS/cm | Half IQR of trimmed conductivity |
| Alert threshold | 230.0 µS/cm | Median + 3 × sigma |

---

## Running tests

```powershell
cd backend
.\venv\Scripts\pytest -v
```

Expected: **15 passed**.

Key test coverage:

| Test file | What it checks |
|---|---|
| `test_propagation.py` | Contamination only travels downstream; dilution accumulates correctly |
| `test_inference.py` | Posterior sums to 1.0; source is in top-3 across multiple seeds |
| `test_sampling.py` | EIG recommendation always returns a valid candidate node |
| `test_no_leakage.py` | Inference/sampling/ML/AI modules have zero access to private session state |
| `test_dataset.py` | CSV loads correctly; histogram returns valid data |
| `test_contact.py` | Validation rejects bad inputs; storage returns a UUID reference |
| `test_api.py` | Health and meta endpoints respond; full investigation flow via TestClient |

---

## Design system

Brand palette (defined as CSS variables and Tailwind tokens, never hardcoded):

| Token | Hex | Usage |
|---|---|---|
| Brand Blue | `#425B9A` | Reservoirs, primary buttons, heading accents |
| Sky | `#76C0EC` | Healthy flow, water glow, primary highlight |
| Olive | `#597928` | Village zone fills, secondary accents |
| Sage | `#91AC67` | Supply zones, safe states, advisory backgrounds |
| Warning | `#E8A33D` | Alert states only |
| Critical | `#D9534F` | Contamination confirmed only |

Fonts: **Fraunces** (headlines) · **Inter** (UI) · **JetBrains Mono** (numbers, IDs)  
Theme: dark by default, light toggle, follows system preference on first visit.

---

## License

MIT — see [LICENSE](./LICENSE).  
Third-party licenses: [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).
