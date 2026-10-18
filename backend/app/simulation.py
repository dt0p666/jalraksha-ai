"""Contamination propagation and sensor observation simulation for JALRAKSHAK AI.

MATHEMATICAL MODEL:
===================
1. Discrete Timeline: t in {0, 1, ..., T_max}.
2. Source Injection:
   At hidden source s* and onset step t0:
     C(s*, t) = 1.0 for t >= t0, else 0.0.
3. Downstream Advective-Dilution Transport:
   For any target node v downstream of source s*:
     - Let path P(s* -> v) have cumulative delay d(s*, v) = sum of delay_steps of edges on path.
     - Let path P(s* -> v) have cumulative dilution D(s*, v) = product of dilution factors of edges.
     - Contamination arriving at v at step t is:
         C(v, t) = D(s*, v) * C(s*, t - d(s*, v))
                 = D(s*, v) if t >= (t0 + d(s*, v)) else 0.0.
   Contamination never propagates upstream (directed network property).

4. Sensor Measurement Model:
   For any monitored node v at step t:
     Y(v, t) = mu_baseline + G * C(v, t) + epsilon_t
   where:
     mu_baseline = Calibrated normal electrical conductivity (183.0 umhos/cm).
     G           = Contamination gain scale (400.0 umhos/cm at full concentration).
     epsilon_t   ~ Normal(0, sigma^2) with sigma = 15.0 umhos/cm.
   An alert is flagged whenever Y(v, t) >= Alert_Threshold (230.0 umhos/cm).
"""

from __future__ import annotations

import math
from typing import Dict, List, Optional, Set, Tuple
import numpy as np

from app.config import (
    CALIBRATED_ALERT_THRESHOLD,
    CALIBRATED_BASELINE_MEAN,
    CALIBRATED_CONTAMINATION_GAIN,
    CALIBRATED_NOISE_SIGMA,
)
from app.network import compute_path_delay_and_dilution, get_downstream_nodes, load_network_data


def compute_true_concentration(
    source_node: str,
    onset_step: int,
    target_node: str,
    current_step: int,
) -> float:
    """Compute exact noise-free contamination concentration at target_node at current_step.
    
    Returns 0.0 if target is upstream or plume has not yet arrived due to cumulative delay.
    """
    if current_step < onset_step:
        return 0.0

    if source_node == target_node:
        return 1.0

    path_info = compute_path_delay_and_dilution(source_node, target_node)
    if path_info is None:
        # Not downstream of source
        return 0.0

    cumulative_delay, cumulative_dilution, _ = path_info
    arrival_step = onset_step + cumulative_delay

    if current_step >= arrival_step:
        return cumulative_dilution
    return 0.0


def compute_all_node_concentrations(
    source_node: str,
    onset_step: int,
    current_step: int,
) -> Dict[str, float]:
    """Compute true concentration across all 42 network nodes at current_step."""
    net_data = load_network_data()
    concentrations: Dict[str, float] = {}

    for node in net_data["nodes"]:
        nid = node["id"]
        concentrations[nid] = compute_true_concentration(
            source_node=source_node,
            onset_step=onset_step,
            target_node=nid,
            current_step=current_step,
        )

    return concentrations


def generate_noisy_reading(
    true_concentration: float,
    rng: np.random.Generator,
    baseline: float = CALIBRATED_BASELINE_MEAN,
    gain: float = CALIBRATED_CONTAMINATION_GAIN,
    sigma: float = CALIBRATED_NOISE_SIGMA,
) -> Tuple[float, bool]:
    """Generate a sensor observation with calibrated Gaussian noise.
    
    Returns (reading_value, is_alert_flag).
    """
    noise = float(rng.normal(0.0, sigma))
    reading = max(0.0, baseline + gain * true_concentration + noise)
    is_alert = reading >= CALIBRATED_ALERT_THRESHOLD
    return round(reading, 2), is_alert
