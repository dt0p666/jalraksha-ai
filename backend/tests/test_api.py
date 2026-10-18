"""Tests for full demo investigation flow through the FastAPI REST API."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_and_meta_endpoints():
    """Verify health, meta, and network endpoints."""
    res_health = client.get("/api/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "ok"

    res_meta = client.get("/api/meta")
    assert res_meta.status_code == 200
    assert "disclaimer" in res_meta.json()

    res_net = client.get("/api/network")
    assert res_net.status_code == 200
    net = res_net.json()
    assert net["total_nodes"] == 42
    assert len(net["sensors"]) == 8


def test_full_investigation_demo_flow():
    """Execute complete 14-step investigation flow via API."""
    # 1. Initialize simulation with fixed seed
    init_res = client.post("/api/simulation/init", json={"seed": 42, "source_type": "junction"})
    assert init_res.status_code == 200
    assert init_res.json()["current_step"] == 0

    # 2. Advance simulation steps so plume propagates and sensors detect
    for _ in range(6):
        adv_res = client.post("/api/simulation/advance", json={"steps": 1})
        assert adv_res.status_code == 200

    # 3. Check simulation state and sensor observations
    state_res = client.get("/api/simulation/state")
    assert state_res.status_code == 200
    st_data = state_res.json()
    assert st_data["current_step"] == 6

    obs_res = client.get("/api/sensors/observations")
    assert obs_res.status_code == 200
    obs_data = obs_res.json()
    assert len(obs_data["observations"]) > 0

    # 4. Run investigation: Bayesian ranking & ML crosscheck
    inv_res = client.post("/api/investigation/run")
    assert inv_res.status_code == 200
    inv_data = inv_res.json()
    assert len(inv_data["top_candidates"]) == 3
    assert "ml_second_opinion" in inv_data
    assert "entropy" in inv_data

    # 5. Recommend next grab sample
    rec_res = client.post("/api/sampling/recommend")
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    rec_node = rec_data["recommended_node"]["node_id"]
    assert rec_node is not None

    # 6. Execute sample at recommended node
    samp_res = client.post("/api/sampling/execute", json={"node_id": rec_node})
    assert samp_res.status_code == 200
    samp_data = samp_res.json()
    assert samp_data["node_id"] == rec_node
    assert "reading" in samp_data
    assert samp_data["budget_remaining"] == 5

    # 7. Generate incident report
    rep_res = client.post("/api/ai/report")
    assert rep_res.status_code == 200
    rep_data = rep_res.json()
    assert len(rep_data["report_markdown"]) > 50
    assert "Observed Anomalies" in rep_data["report_markdown"]

    # 8. Reveal true source
    rev_res = client.post("/api/investigation/reveal")
    assert rev_res.status_code == 200
    rev_data = rev_res.json()
    assert "true_source" in rev_data
    assert "is_top1_correct" in rev_data
    assert "hop_error" in rev_data
    assert len(rev_data["true_spread_nodes"]) > 0

    # 9. Reset simulation
    rst_res = client.post("/api/simulation/reset")
    assert rst_res.status_code == 200
    assert rst_res.json()["current_step"] == 0
