"""Machine learning cross-check model (Random Forest second opinion).

Trains a RandomForestClassifier on a seeded synthetic simulation dataset
to predict candidate source nodes from sensor observation vectors.
Reports held-out test accuracy computed at training time.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from app.config import (
    CALIBRATED_ALERT_THRESHOLD,
    CALIBRATED_BASELINE_MEAN,
    CALIBRATED_CONTAMINATION_GAIN,
    CALIBRATED_NOISE_SIGMA,
    DEFAULT_RANDOM_SEED,
)
from app.network import load_network_data
from app.simulation import compute_true_concentration, generate_noisy_reading

_model_cache: Optional[Tuple[RandomForestClassifier, List[str], float]] = None


def build_synthetic_training_dataset(
    n_scenarios: int = 60,
    seed: int = DEFAULT_RANDOM_SEED,
) -> Tuple[np.ndarray, np.ndarray, List[str], List[str]]:
    """Simulate synthetic scenarios to train the Random Forest cross-check model."""
    rng = np.random.default_rng(seed)
    net_data = load_network_data()
    sensors = sorted(net_data["sensors"])
    candidates = sorted([n["id"] for n in net_data["nodes"] if n["type"] in ("reservoir", "junction")])

    X_list = []
    y_list = []

    # Features per sensor: [current_reading, max_reading, is_alert_flag] -> 8 sensors * 3 = 24 features
    for _ in range(n_scenarios):
        source = str(rng.choice(candidates))
        onset = int(rng.integers(1, 4))
        final_step = int(rng.integers(onset + 2, onset + 8))

        # Generate sensor values
        feat = []
        for s in sensors:
            readings = []
            alerts = []
            for t in range(0, final_step + 1):
                c = compute_true_concentration(source, onset, s, t)
                val, is_alt = generate_noisy_reading(c, rng)
                readings.append(val)
                alerts.append(1.0 if is_alt else 0.0)

            latest = readings[-1]
            max_val = max(readings)
            any_alert = max(alerts)
            feat.extend([latest, max_val, any_alert])

        X_list.append(feat)
        y_list.append(source)

    return np.array(X_list), np.array(y_list), sensors, candidates


def get_trained_rf_model() -> Tuple[RandomForestClassifier, List[str], float]:
    """Return trained Random Forest and held-out synthetic test accuracy."""
    global _model_cache
    if _model_cache is not None:
        return _model_cache

    X, y, sensors, candidates = build_synthetic_training_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=DEFAULT_RANDOM_SEED, stratify=None
    )

    clf = RandomForestClassifier(n_estimators=20, max_depth=8, random_state=DEFAULT_RANDOM_SEED)
    clf.fit(X_train, y_train)

    accuracy = float(clf.score(X_test, y_test))
    _model_cache = (clf, sensors, round(accuracy, 3))
    return _model_cache


def extract_features_from_observations(
    observations: List[Dict[str, Any]],
    sensors: List[str],
) -> np.ndarray:
    """Transform public sensor observations into the RF feature vector."""
    feat = []
    for s in sensors:
        s_obs = [o for o in observations if o["node_id"] == s and o.get("is_sensor")]
        if not s_obs:
            feat.extend([CALIBRATED_BASELINE_MEAN, CALIBRATED_BASELINE_MEAN, 0.0])
        else:
            latest = s_obs[-1]["value"]
            max_v = max(o["value"] for o in s_obs)
            any_a = 1.0 if any(o.get("is_alert") for o in s_obs) else 0.0
            feat.extend([latest, max_v, any_a])

    return np.array([feat])


def compute_ml_crosscheck(
    observations: List[Dict[str, Any]],
    bayes_top1_node: str,
) -> Dict[str, Any]:
    """Execute Random Forest cross-check to generate an independent second opinion."""
    clf, sensors, held_out_acc = get_trained_rf_model()
    X = extract_features_from_observations(observations, sensors)

    probas = clf.predict_proba(X)[0]
    top_idx = int(np.argmax(probas))
    top_pick = str(clf.classes_[top_idx])
    confidence = round(float(probas[top_idx]), 3)

    agrees = (top_pick == bayes_top1_node)

    return {
        "top_pick": top_pick,
        "confidence": confidence,
        "agrees_with_bayes": agrees,
        "held_out_accuracy": held_out_acc,
        "label": "synthetic validation only",
    }
