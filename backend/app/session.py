"""Session management for JALRAKSHAK AI.

CRITICAL ARCHITECTURE REQUIREMENT:
The hidden source and hidden onset step are strictly encapsulated in private
fields (_hidden_source, _hidden_onset_step). They are never accessible to,
passed to, or imported by inference.py, sampling.py, ml_crosscheck.py, or ai_report.py.
Only the explicit reveal() method exposes the true source at investigation completion.
"""

from __future__ import annotations

import uuid
from typing import Any, Dict, List, Optional, Set, Tuple
import numpy as np

from app.config import (
    CALIBRATED_ALERT_THRESHOLD,
    CALIBRATED_BASELINE_MEAN,
    CALIBRATED_CONTAMINATION_GAIN,
    CALIBRATED_NOISE_SIGMA,
    DEFAULT_RANDOM_SEED,
    DEFAULT_SAMPLE_BUDGET,
    MAX_SIMULATION_STEPS,
    SENSORS_FOR_INCIDENT,
)
from app.network import get_downstream_nodes, load_network_data
from app.simulation import compute_all_node_concentrations, generate_noisy_reading


class InvestigationSession:
    """Encapsulates a single simulated contamination scenario."""

    def __init__(
        self,
        session_id: Optional[str] = None,
        seed: int = DEFAULT_RANDOM_SEED,
        source_type: str = "random",
    ):
        self.session_id: str = session_id or str(uuid.uuid4())[:8]
        self.seed: int = seed
        self._rng: np.random.Generator = np.random.default_rng(seed)

        # Network metadata
        net_data = load_network_data()
        self.network_data: Dict[str, Any] = net_data
        self.sensors: List[str] = net_data["sensors"]

        # PRIVATE: Hidden contamination ground truth (strictly guarded)
        self._hidden_source: str = self._select_hidden_source(source_type)
        self._hidden_onset_step: int = int(self._rng.integers(2, 6))

        # Simulation progress
        self.current_step: int = 0
        self.sample_budget: int = DEFAULT_SAMPLE_BUDGET
        self.samples_taken: List[str] = []
        self.status: str = "NORMAL"  # "NORMAL" | "WARNING" | "INCIDENT"
        self.revealed: bool = False

        # Private full truth history (step -> node_id -> concentration)
        self._true_state_history: Dict[int, Dict[str, float]] = {}

        # Publicly accessible evidence (sensor observations & sampled nodes)
        self.public_observations: List[Dict[str, Any]] = []
        self.timeline_events: List[Dict[str, Any]] = [
            {"step": 0, "type": "SESSION_INIT", "description": "Drinking-water network monitoring online. All 8 baseline sensors active."}
        ]

        # Record initial step 0 state
        self._record_step_state()

    def _select_hidden_source(self, source_type: str) -> str:
        """Select hidden source node based on selected category using seeded RNG."""
        net_data = self.network_data
        reservoirs = net_data["reservoirs"]
        junctions = [n["id"] for n in net_data["nodes"] if n["type"] == "junction"]

        # Partition junctions into trunk/distribution for source type selection
        trunk_junctions = ["J-01", "J-02", "J-03", "J-04", "J-05", "J-06", "J-08", "J-09", "J-11"]
        branch_junctions = [j for j in junctions if j not in trunk_junctions]

        if source_type == "reservoir":
            choice = str(self._rng.choice(reservoirs))
        elif source_type == "junction":
            choice = str(self._rng.choice(trunk_junctions))
        elif source_type == "branch":
            choice = str(self._rng.choice(branch_junctions))
        else:  # "random"
            eligible = reservoirs + trunk_junctions + branch_junctions
            choice = str(self._rng.choice(eligible))

        return choice

    def _record_step_state(self) -> None:
        """Calculate true physical plume state and record noisy sensor readings for current_step."""
        # Compute true physical plume
        concentrations = compute_all_node_concentrations(
            source_node=self._hidden_source,
            onset_step=self._hidden_onset_step,
            current_step=self.current_step,
        )
        self._true_state_history[self.current_step] = concentrations

        # Record readings for all 8 fixed sensors
        step_alert_count = 0
        for sensor_id in self.sensors:
            true_c = concentrations.get(sensor_id, 0.0)
            val, is_alert = generate_noisy_reading(
                true_concentration=true_c,
                rng=self._rng,
            )
            obs = {
                "node_id": sensor_id,
                "step": self.current_step,
                "value": val,
                "threshold": CALIBRATED_ALERT_THRESHOLD,
                "is_alert": is_alert,
                "is_sensor": True,
                "is_sample": False,
            }
            self.public_observations.append(obs)
            if is_alert:
                step_alert_count += 1

        # Check status transition
        if step_alert_count >= SENSORS_FOR_INCIDENT and self.status != "INCIDENT":
            self.status = "INCIDENT"
            self.timeline_events.append({
                "step": self.current_step,
                "type": "ALERT_TRIGGERED",
                "description": f"Abnormal conductivity detected across {step_alert_count} network sensors. Incident status flagged.",
            })
        elif step_alert_count == 1 and self.status == "NORMAL":
            self.status = "WARNING"
            self.timeline_events.append({
                "step": self.current_step,
                "type": "WARNING_TRIGGERED",
                "description": f"Single sensor reading elevated ({CALIBRATED_ALERT_THRESHOLD} umhos/cm threshold crossed).",
            })

    def advance(self, steps: int = 1) -> int:
        """Advance simulation by the requested number of discrete steps."""
        for _ in range(steps):
            if self.current_step >= MAX_SIMULATION_STEPS:
                break
            self.current_step += 1
            self._record_step_state()
        return self.current_step

    def execute_sample(self, node_id: str) -> Dict[str, Any]:
        """Perform a targeted water grab sample at the given node."""
        if self.sample_budget <= 0:
            raise ValueError("Sample budget exhausted. No further samples available.")

        # Read true concentration at this node at current_step
        curr_concentrations = self._true_state_history.get(self.current_step, {})
        true_c = curr_concentrations.get(node_id, 0.0)

        # Generate reading with noise
        reading_val, is_alert = generate_noisy_reading(
            true_concentration=true_c,
            rng=self._rng,
        )

        obs = {
            "node_id": node_id,
            "step": self.current_step,
            "value": reading_val,
            "threshold": CALIBRATED_ALERT_THRESHOLD,
            "is_alert": is_alert,
            "is_sensor": False,
            "is_sample": True,
        }
        self.public_observations.append(obs)
        self.sample_budget -= 1
        self.samples_taken.append(node_id)

        self.timeline_events.append({
            "step": self.current_step,
            "type": "SAMPLE_COLLECTED",
            "description": f"Field grab sample collected at {node_id}: {reading_val} umhos/cm ({'ABNORMAL' if is_alert else 'NORMAL'}).",
        })

        # Multi-parameter illustrative reading for educational richness
        multi_param = {
            "conductivity": reading_val,
            "ph": round(7.3 - (0.8 * true_c) + float(self._rng.normal(0, 0.05)), 2),
            "dissolved_oxygen": round(max(0.5, 6.7 - (3.2 * true_c) + float(self._rng.normal(0, 0.1))), 2),
            "turbidity_ntu": round(max(0.8, 1.2 + (8.5 * true_c) + float(self._rng.normal(0, 0.2))), 2),
        }

        return {
            "node_id": node_id,
            "reading": reading_val,
            "threshold": CALIBRATED_ALERT_THRESHOLD,
            "is_alert": is_alert,
            "budget_remaining": self.sample_budget,
            "step": self.current_step,
            "multi_parameter_sample": multi_param,
        }

    def get_public_observations(self) -> List[Dict[str, Any]]:
        """Return publicly observable sensor logs and field grab sample readings."""
        return list(self.public_observations)

    def get_latest_sensor_readings(self) -> List[Dict[str, Any]]:
        """Return the most recent reading for each of the 8 fixed sensors."""
        readings = []
        for s in self.sensors:
            sensor_obs = [o for o in self.public_observations if o["node_id"] == s and o["is_sensor"]]
            if sensor_obs:
                latest = sensor_obs[-1]
                readings.append({
                    "sensor_id": s,
                    "node_id": s,
                    "step": latest["step"],
                    "value": latest["value"],
                    "unit": "umhos/cm",
                    "threshold": latest["threshold"],
                    "is_alert": latest["is_alert"],
                })
        return readings

    def get_active_alert_count(self) -> int:
        """Count how many sensors currently exceed alert threshold."""
        latest = self.get_latest_sensor_readings()
        return sum(1 for r in latest if r["is_alert"])

    def reveal(self, top1_candidate: str) -> Dict[str, Any]:
        """Reveal ground truth hidden source and evaluate investigator accuracy.
        
        This is the ONLY method in the entire codebase that exposes _hidden_source.
        """
        self.revealed = True
        is_correct = (top1_candidate == self._hidden_source)

        from app.network import get_hop_distance
        hop_error = get_hop_distance(top1_candidate, self._hidden_source)

        # Get true spread nodes for teacher view
        true_spread = sorted(list(get_downstream_nodes(self._hidden_source)))

        # Find node type of true source
        node_meta = next((n for n in self.network_data["nodes"] if n["id"] == self._hidden_source), {})
        stype = node_meta.get("type", "unknown")

        self.timeline_events.append({
            "step": self.current_step,
            "type": "SOURCE_REVEALED",
            "description": f"Ground truth revealed: {self._hidden_source} ({stype}). Top-1 pick: {top1_candidate} (Error: {hop_error} hops).",
        })

        return {
            "true_source": self._hidden_source,
            "true_source_type": stype,
            "onset_step": self._hidden_onset_step,
            "is_top1_correct": is_correct,
            "top1_candidate": top1_candidate,
            "hop_error": hop_error,
            "samples_used": len(self.samples_taken),
            "true_spread_nodes": true_spread,
        }


# Active sessions cache
_active_sessions: Dict[str, InvestigationSession] = {}


def get_or_create_session(
    session_id: Optional[str] = None,
    seed: int = DEFAULT_RANDOM_SEED,
    source_type: str = "random",
) -> InvestigationSession:
    """Retrieve existing session or instantiate a new one."""
    if session_id and session_id in _active_sessions:
        return _active_sessions[session_id]

    sess = InvestigationSession(session_id=session_id, seed=seed, source_type=source_type)
    _active_sessions[sess.session_id] = sess
    return sess


def reset_session(session_id: str, seed: int = DEFAULT_RANDOM_SEED, source_type: str = "random") -> InvestigationSession:
    """Reset a session with new random state or new seed."""
    sess = InvestigationSession(session_id=session_id, seed=seed, source_type=source_type)
    _active_sessions[session_id] = sess
    return sess
