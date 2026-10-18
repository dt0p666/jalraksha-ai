"""Application configuration for JALRAKSHAK AI.

Calibrated parameters, Ollama endpoints, default seeds, and simulation constants.
"""

from __future__ import annotations

import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent.parent

# Fixed seed for reproducibility across demonstrations
DEFAULT_RANDOM_SEED: int = 42

# Simulation timeline configuration
MAX_SIMULATION_STEPS: int = 60
DEFAULT_SOURCE_ONSET_STEP: int = 4
DEFAULT_SAMPLE_BUDGET: int = 6

# Dataset Calibration:
# Based on CPCB historical monitoring records in water_dataX.csv.
# Metric: Electrical Conductivity (umhos/cm).
# - Baseline mean (183.0): 50th percentile (median) of water monitoring records.
# - Noise sigma (15.0): Trimmed variance reflecting natural ambient sensor fluctuation.
# - Alert threshold (230.0): Baseline + ~3*sigma (~75th percentile of normal water).
# - Contamination gain (400.0): Scale factor when concentration reaches 1.0.
CALIBRATED_BASELINE_MEAN: float = 183.0
CALIBRATED_NOISE_SIGMA: float = 15.0
CALIBRATED_ALERT_THRESHOLD: float = 230.0
CALIBRATED_CONTAMINATION_GAIN: float = 400.0

# Ollama and AI Analyst settings
OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma3:1b")
OLLAMA_TIMEOUT_SECONDS: float = 25.0

# Instructor passcode for classroom settings (safe demo unlock)
INSTRUCTOR_PASSCODE: str = os.getenv("INSTRUCTOR_PASSCODE", "jalrakshak-demo-2026")

# Network status thresholds
# INCIDENT triggered when at least this many sensors exceed the alert threshold
SENSORS_FOR_INCIDENT: int = 2
