"""Tests for contamination propagation physics in water network."""

import pytest
from app.network import get_downstream_nodes, compute_path_delay_and_dilution, load_network_data
from app.simulation import compute_true_concentration


def test_propagation_downstream_reach():
    """Contamination must reach downstream nodes after sufficient delay steps."""
    source = "R1"
    target = "J-01"
    onset_step = 2

    # Before onset: concentration 0.0
    assert compute_true_concentration(source, onset_step, target, current_step=1) == 0.0

    # At onset: source has 1.0, downstream target with 1 delay step has not received yet
    assert compute_true_concentration(source, onset_step, source, current_step=2) == 1.0
    assert compute_true_concentration(source, onset_step, target, current_step=2) == 0.0

    # At onset + delay (2 + 1 = 3): target receives diluted concentration
    c_arr = compute_true_concentration(source, onset_step, target, current_step=3)
    assert c_arr > 0.0
    assert c_arr <= 1.0


def test_propagation_never_goes_upstream():
    """Contamination must never flow in reverse against directed pipes."""
    # J-02 is downstream of J-01. If source is J-02, J-01 must never receive contamination.
    source = "J-02"
    upstream_node = "J-01"
    onset = 1

    for t in range(0, 20):
        c = compute_true_concentration(source, onset, upstream_node, current_step=t)
        assert c == 0.0, f"Node {upstream_node} erroneously received plume from downstream {source} at step {t}"


def test_dilution_and_cumulative_delay():
    """Dilution must decrease concentration monotonically along successive pipe hops."""
    path = ["R1", "J-01", "J-02", "J-03"]
    onset = 0

    c_r1 = compute_true_concentration("R1", onset, "R1", current_step=15)
    c_j01 = compute_true_concentration("R1", onset, "J-01", current_step=15)
    c_j02 = compute_true_concentration("R1", onset, "J-02", current_step=15)
    c_j03 = compute_true_concentration("R1", onset, "J-03", current_step=15)

    assert c_r1 == 1.0
    assert c_j01 < c_r1
    assert c_j02 < c_j01
    assert c_j03 < c_j02
