"""Targeted water grab sampling recommendation engine for JALRAKSHAK AI.

MATHEMATICAL FOUNDATION:
========================
Optimal Experimental Design (OED) via Expected Information Gain (EIG):
Let H be candidate source nodes with current posterior distribution P(h | D) and entropy H_curr.
For any unmonitored node u:
  Taking a sample at u yields observation Y_u.
  Under hypothesis h, if u is downstream of h:
    Y_u will be elevated (P(Y_u = high | h) ~= 1 - epsilon).
  If u is not downstream of h:
    Y_u will be baseline normal (P(Y_u = normal | h) ~= 1 - epsilon).

Probability of elevated reading at u:
  P(Y_u = high) = sum_{h} P(h) * 1(u in downstream(h))
Probability of normal reading at u:
  P(Y_u = normal) = 1 - P(Y_u = high)

Conditional posteriors:
  P(h | Y_u = high) proportional to P(h) * 1(u in downstream(h))
  P(h | Y_u = normal) proportional to P(h) * 1(u NOT in downstream(h))

Expected conditional entropy:
  E[H | u] = P(Y_u = high) * H(P | Y_u = high) + P(Y_u = normal) * H(P | Y_u = normal)
Expected Information Gain (EIG):
  IG(u) = H_curr - E[H | u]

The optimal sample location u* maximizes IG(u*), bisecting the hypothesis space
most cleanly.
"""

from __future__ import annotations

import math
from typing import Any, Dict, List, Optional, Set
import numpy as np

from app.network import compute_path_delay_and_dilution, get_downstream_nodes, load_network_data


def compute_entropy_of_distribution(probs: List[float]) -> float:
    """Calculate Shannon entropy in bits for a normalized probability vector."""
    ent = 0.0
    for p in probs:
        if p > 1e-9:
            ent -= p * math.log2(p)
    return ent


def recommend_next_samples(
    current_ranking: List[Dict[str, Any]],
    current_entropy: float,
    sampled_nodes: List[str],
    budget_remaining: int,
) -> Dict[str, Any]:
    """Identify optimal node for targeted sampling to minimize posterior uncertainty.
    
    GUARANTEE: Does NOT import or inspect hidden ground truth.
    """
    net_data = load_network_data()
    fixed_sensors = set(net_data["sensors"])
    already_sampled = set(sampled_nodes)

    # Eligible nodes to sample: junctions and zones not already observed
    all_eligible = [
        n["id"] for n in net_data["nodes"]
        if n["id"] not in fixed_sensors and n["id"] not in already_sampled
    ]

    if not all_eligible or budget_remaining <= 0:
        return {
            "recommended_node": None,
            "top_recommendations": [],
            "budget_remaining": budget_remaining,
            "reason": "Sample budget exhausted or all candidates evaluated.",
        }

    # Extract current candidate probabilities
    h_probs = {r["node_id"]: r["probability"] for r in current_ranking}
    top_candidates = [r["node_id"] for r in current_ranking[:4] if r["probability"] > 0.05]

    scores: List[Dict[str, Any]] = []

    for u in all_eligible:
        # Check which hypotheses place u downstream
        downstream_of = [h for h, p in h_probs.items() if u in get_downstream_nodes(h)]
        p_high = sum(h_probs[h] for h in downstream_of)
        p_normal = max(0.0, 1.0 - p_high)

        # High branch posterior
        probs_if_high = [h_probs[h] if h in downstream_of else 0.0 for h in h_probs]
        sum_h = sum(probs_if_high)
        if sum_h > 1e-9:
            probs_if_high = [p / sum_h for p in probs_if_high]
            ent_high = compute_entropy_of_distribution(probs_if_high)
        else:
            ent_high = current_entropy

        # Normal branch posterior
        probs_if_norm = [h_probs[h] if h not in downstream_of else 0.0 for h in h_probs]
        sum_n = sum(probs_if_norm)
        if sum_n > 1e-9:
            probs_if_norm = [p / sum_n for p in probs_if_norm]
            ent_normal = compute_entropy_of_distribution(probs_if_norm)
        else:
            ent_normal = current_entropy

        expected_posterior_entropy = (p_high * ent_high) + (p_normal * ent_normal)
        info_gain = max(0.0, current_entropy - expected_posterior_entropy)

        # Generate human-readable reason
        if len(top_candidates) >= 2:
            top_a = top_candidates[0]
            top_b = top_candidates[1]
            a_in = u in get_downstream_nodes(top_a)
            b_in = u in get_downstream_nodes(top_b)
            if a_in != b_in:
                higher_src = top_a if a_in else top_b
                lower_src = top_b if a_in else top_a
                reason_text = f"Reads high if {higher_src} is source, near baseline if {lower_src} is source."
            else:
                reason_text = f"High diagnostic value: partitions {len(downstream_of)} candidate hypotheses."
        else:
            reason_text = f"High diagnostic value: expected entropy reduction of {round(info_gain, 2)} bits."

        node_info = next((n for n in net_data["nodes"] if n["id"] == u), {})
        zone_label = node_info.get("label", u)

        scores.append({
            "node_id": u,
            "expected_information_gain": round(float(info_gain), 3),
            "reason": reason_text,
            "zone_or_branch": zone_label,
        })

    # Sort descending by information gain
    scores.sort(key=lambda s: s["expected_information_gain"], reverse=True)

    ranked_recommendations = []
    for rank_idx, s in enumerate(scores[:5], start=1):
        s["rank"] = rank_idx
        ranked_recommendations.append(s)

    top_pick = ranked_recommendations[0] if ranked_recommendations else None

    return {
        "recommended_node": top_pick,
        "top_recommendations": ranked_recommendations,
        "budget_remaining": budget_remaining,
    }
