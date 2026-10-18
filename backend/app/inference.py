"""Bayesian source identification inference engine for JALRAKSHAK AI.

MATHEMATICAL FORMULATION:
========================
Hypothesis Space: H = { h | h is an eligible source node in the network (reservoirs & junctions) }.
Observations: D = { (v_i, t_i, y_i) } for all sensor and grab-sample readings up to t_current.

Likelihood:
For a candidate source h and unknown injection onset t0 in {1, ..., t_max_onset}:
  Expected noise-free reading at location v at time t:
    mu_hat(v, t | h, t0) = mu_baseline + G * C(v, t | h, t0)
  where C(v, t | h, t0) is computed from downstream path delay and dilution.

Under independent Gaussian noise epsilon ~ N(0, sigma^2):
  ln P(D | h, t0) = sum_{i} [ -0.5 * ((y_i - mu_hat(v_i, t_i | h, t0)) / sigma)^2 - ln(sqrt(2*pi)*sigma) ]

Marginalizing over unknown onset step t0 with uniform prior P(t0):
  ln P(D | h) = logsumexp_{t0} [ ln P(D | h, t0) - ln(N_onset) ]

Posterior:
Under uniform prior P(h) = 1 / |H|:
  ln P(h | D) = ln P(D | h) - logsumexp_{h' in H} [ ln P(D | h') ]
  P(h | D) = exp(ln P(h | D))

Uncertainty:
Shannon entropy H(P) = - sum_{h} P(h | D) * log2(P(h | D)).
"""

from __future__ import annotations

import math
from typing import Any, Dict, List, Optional, Set, Tuple
import numpy as np

from app.config import (
    CALIBRATED_ALERT_THRESHOLD,
    CALIBRATED_BASELINE_MEAN,
    CALIBRATED_CONTAMINATION_GAIN,
    CALIBRATED_NOISE_SIGMA,
)
from app.network import compute_path_delay_and_dilution, get_downstream_nodes, load_network_data
from app.simulation import compute_true_concentration


def log_sum_exp(values: List[float]) -> float:
    """Numerically stable log-sum-exp."""
    if not values:
        return -float("inf")
    max_val = max(values)
    if math.isinf(max_val) and max_val < 0:
        return -float("inf")
    sum_exp = sum(math.exp(v - max_val) for v in values)
    return max_val + math.log(sum_exp)


def run_bayesian_inference(
    observations: List[Dict[str, Any]],
    current_step: int,
    noise_sigma: float = CALIBRATED_NOISE_SIGMA,
) -> Dict[str, Any]:
    """Execute Bayesian source ranking using only public observations and topology.
    
    GUARANTEE: Has no reference to or knowledge of the hidden source.
    """
    net_data = load_network_data()
    # Candidate hypotheses: all reservoirs and junctions
    candidate_nodes = [n["id"] for n in net_data["nodes"] if n["type"] in ("reservoir", "junction")]

    if not observations:
        # Prior is uniform
        prior_p = 1.0 / len(candidate_nodes)
        ranking = [
            {
                "node_id": cid,
                "rank": i + 1,
                "probability": round(prior_p, 4),
                "supporting_sensors": [],
                "contradicting_sensors": [],
                "path_summary": "Uniform prior prior to observations.",
                "node_type": "reservoir" if cid.startswith("R") else "junction",
            }
            for i, cid in enumerate(candidate_nodes)
        ]
        return {
            "top_candidates": ranking[:3],
            "full_ranking": ranking,
            "entropy": round(math.log2(len(candidate_nodes)), 2),
            "uncertainty_level": "HIGH",
            "summary": "No sensor readings recorded yet. Prior probability is evenly distributed.",
        }

    # Onset search space
    max_onset = max(1, min(current_step, 10))
    onset_grid = list(range(1, max_onset + 1))
    log_p_onset = -math.log(len(onset_grid))

    # Pre-calculate log normalizer constant
    log_gaussian_norm = -0.5 * math.log(2 * math.pi * (noise_sigma ** 2))

    log_marginal_likelihoods: Dict[str, float] = {}

    for h in candidate_nodes:
        onset_log_likelihoods = []
        for t0 in onset_grid:
            ll = 0.0
            for obs in observations:
                v = obs["node_id"]
                t = obs["step"]
                y = obs["value"]

                # Expected concentration at node v at step t given source h with onset t0
                c_hat = compute_true_concentration(
                    source_node=h,
                    onset_step=t0,
                    target_node=v,
                    current_step=t,
                )
                mu_hat = CALIBRATED_BASELINE_MEAN + CALIBRATED_CONTAMINATION_GAIN * c_hat

                # Gaussian log-density
                diff = y - mu_hat
                ll += log_gaussian_norm - 0.5 * ((diff / noise_sigma) ** 2)

            onset_log_likelihoods.append(ll + log_p_onset)

        log_marginal_likelihoods[h] = log_sum_exp(onset_log_likelihoods)

    # Normalize across all candidate hypotheses
    all_log_marginal = list(log_marginal_likelihoods.values())
    evidence_norm = log_sum_exp(all_log_marginal)

    posteriors: Dict[str, float] = {}
    for h, lml in log_marginal_likelihoods.items():
        norm_log_post = lml - evidence_norm
        posteriors[h] = math.exp(norm_log_post)

    # Clean rounding and normalize exact sum to 1.0
    total_p = sum(posteriors.values())
    if total_p > 0:
        for h in posteriors:
            posteriors[h] /= total_p

    # Sort descending
    sorted_candidates = sorted(candidate_nodes, key=lambda c: posteriors[c], reverse=True)

    # Compute supporting & contradicting evidence for each candidate
    ranking_records = []
    # Identify sensors that have ever alarmed
    alarmed_sensors = set(obs["node_id"] for obs in observations if obs.get("is_alert"))
    normal_sensors = set(obs["node_id"] for obs in observations if not obs.get("is_alert")) - alarmed_sensors

    for rank_idx, cid in enumerate(sorted_candidates, start=1):
        desc = get_downstream_nodes(cid)
        # Supporting: alarmed sensors downstream of candidate
        supporting = sorted(list(alarmed_sensors.intersection(desc)))
        # Contradicting: alarmed sensors NOT downstream (candidate cannot explain their alarm)
        contradicting = sorted(list(alarmed_sensors - desc))

        # Build clear path summary
        if supporting:
            path_info = compute_path_delay_and_dilution(cid, supporting[0])
            path_str = " -> ".join(path_info[2]) if path_info else f"{cid} to {supporting[0]}"
            summary_str = f"Explains elevated readings at {len(supporting)} sensor(s). Primary plume path: {path_str}."
        elif contradicting:
            summary_str = f"Contradicted by abnormal readings at {len(contradicting)} sensor(s) located outside its downstream zone."
        else:
            summary_str = "Low probability consistent with baseline sensor fluctuations."

        node_meta = next((n for n in net_data["nodes"] if n["id"] == cid), {})

        ranking_records.append({
            "node_id": cid,
            "rank": rank_idx,
            "probability": round(float(posteriors[cid]), 4),
            "supporting_sensors": supporting,
            "contradicting_sensors": contradicting,
            "path_summary": summary_str,
            "node_type": node_meta.get("type", "junction"),
        })

    # Shannon Entropy H(P)
    entropy = 0.0
    for p in posteriors.values():
        if p > 1e-9:
            entropy -= p * math.log2(p)
    entropy = round(entropy, 2)

    if entropy < 1.5:
        uncertainty_level = "LOW"
    elif entropy < 3.0:
        uncertainty_level = "MEDIUM"
    else:
        uncertainty_level = "HIGH"

    top1 = ranking_records[0]
    summary_text = (
        f"Top candidate {top1['node_id']} carries {round(top1['probability'] * 100, 1)}% posterior probability "
        f"with {uncertainty_level.lower()} entropy ({entropy} bits)."
    )

    return {
        "top_candidates": ranking_records[:3],
        "full_ranking": ranking_records,
        "entropy": entropy,
        "uncertainty_level": uncertainty_level,
        "summary": summary_text,
    }
