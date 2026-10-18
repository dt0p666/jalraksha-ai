"""Tests for targeted grab sampling recommendations."""

import pytest
from app.inference import run_bayesian_inference
from app.sampling import recommend_next_samples
from app.session import InvestigationSession


def test_sampling_recommendation_information_gain():
    """Recommended sample must have positive and highest expected information gain."""
    sess = InvestigationSession(seed=42)
    sess.advance(6)
    obs = sess.get_public_observations()

    bayes_res = run_bayesian_inference(obs, sess.current_step)
    rec = recommend_next_samples(
        current_ranking=bayes_res["full_ranking"],
        current_entropy=bayes_res["entropy"],
        sampled_nodes=[],
        budget_remaining=6,
    )

    top_rec = rec["recommended_node"]
    assert top_rec is not None
    assert top_rec["expected_information_gain"] >= 0.0

    # Ensure ranking is ordered descending by information gain
    top_list = rec["top_recommendations"]
    for i in range(len(top_list) - 1):
        assert top_list[i]["expected_information_gain"] >= top_list[i + 1]["expected_information_gain"]
