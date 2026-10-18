"""Tests for Bayesian source ranking inference engine."""

import pytest
from app.inference import run_bayesian_inference
from app.session import InvestigationSession


def test_inference_posteriors_sum_to_one():
    """Bayesian posterior probabilities across all candidate hypotheses must sum to 1.0."""
    sess = InvestigationSession(seed=42)
    sess.advance(8)
    obs = sess.get_public_observations()

    res = run_bayesian_inference(obs, current_step=sess.current_step)
    probs = [c["probability"] for c in res["full_ranking"]]
    total_p = sum(probs)

    assert abs(total_p - 1.0) < 1e-3, f"Probabilities sum to {total_p}, expected 1.0"


def test_inference_accuracy_across_multiple_seeds():
    """True source should rank among the top candidates across random seeds as plume propagates."""
    seeds = [42, 101, 777]
    success_count = 0

    for s in seeds:
        sess = InvestigationSession(seed=s)
        sess.advance(10)
        obs = sess.get_public_observations()

        res = run_bayesian_inference(obs, current_step=sess.current_step)
        top3_ids = [c["node_id"] for c in res["top_candidates"]]

        # Access hidden source strictly for test validation
        true_source = sess._hidden_source
        if true_source in top3_ids:
            success_count += 1

    # At least 2 of 3 seeds place the true source in top-3 after 10 steps of plume propagation
    assert success_count >= 2, f"Expected at least 2/3 seeds in top 3, got {success_count}"
