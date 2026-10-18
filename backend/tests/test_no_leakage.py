"""Tests verifying strict information boundary: zero ground truth leakage.

Verifies that inference, sampling, ml_crosscheck, and ai_report have no access
to the private hidden source or ground truth plume state.
"""

import inspect
import pytest
from app import ai_report, inference, ml_crosscheck, sampling


def test_code_does_not_import_private_session_attributes():
    """Verify that investigation modules do not import private session attributes."""
    modules_to_check = [inference, sampling, ml_crosscheck, ai_report]

    for mod in modules_to_check:
        src = inspect.getsource(mod)
        assert "_hidden_source" not in src, f"Module {mod.__name__} references _hidden_source directly!"
        assert "_hidden_onset_step" not in src, f"Module {mod.__name__} references _hidden_onset_step directly!"
        assert "_true_state_history" not in src, f"Module {mod.__name__} references _true_state_history directly!"


def test_modules_execute_without_any_ground_truth_object():
    """Verify that all analytical functions operate strictly on public observation dicts."""
    # Synthetic public observations
    synthetic_obs = [
        {"node_id": "J-02", "step": 3, "value": 245.0, "threshold": 230.0, "is_alert": True, "is_sensor": True, "is_sample": False},
        {"node_id": "J-05", "step": 3, "value": 182.0, "threshold": 230.0, "is_alert": False, "is_sensor": True, "is_sample": False},
        {"node_id": "J-08", "step": 3, "value": 190.0, "threshold": 230.0, "is_alert": False, "is_sensor": True, "is_sample": False},
    ]

    # 1. Inference runs completely without session or ground truth
    bayes_res = inference.run_bayesian_inference(synthetic_obs, current_step=3)
    assert "top_candidates" in bayes_res
    assert len(bayes_res["top_candidates"]) > 0

    # 2. ML cross-check runs on public observations alone
    top1 = bayes_res["top_candidates"][0]["node_id"]
    ml_res = ml_crosscheck.compute_ml_crosscheck(synthetic_obs, top1)
    assert "top_pick" in ml_res
    assert "agrees_with_bayes" in ml_res

    # 3. Sampling recommendation runs on public ranking alone
    rec_res = sampling.recommend_next_samples(
        bayes_res["full_ranking"],
        bayes_res["entropy"],
        sampled_nodes=[],
        budget_remaining=5,
    )
    assert "recommended_node" in rec_res

    # 4. Fallback report generator runs on evidence package alone
    evidence = ai_report.build_evidence_package(
        ranking_data=bayes_res,
        observations=synthetic_obs,
        current_step=3,
        samples_taken=[],
        sample_recommendation=rec_res.get("recommended_node"),
        timeline_events=[],
    )
    report_text = ai_report.generate_rule_based_fallback_report(evidence)
    assert len(report_text) > 50
    assert "### 1. Observed Anomalies" in report_text
