"""Tests for dataset loader, calibration, and histogram computation."""

import pytest
from app.dataset import (
    generate_dataset_profile,
    get_column_histogram,
    get_dataset_profile,
    load_raw_dataset,
)


def test_dataset_loader_and_profile():
    """Verify profile has real columns, stats, and calibration bounds."""
    profile = get_dataset_profile()
    assert profile["status"] in ("available", "loaded")
    assert profile["rows"] > 1000
    assert "columns" in profile
    assert len(profile["columns"]) >= 10

    # Calibration verification
    calib = profile["calibration"]
    assert calib["baseline_mean"] > 0
    assert calib["noise_sigma"] > 0
    assert calib["alert_threshold"] > calib["baseline_mean"]


def test_histogram_valid_column():
    """Histogram endpoint must produce valid binned counts for numeric columns."""
    hist = get_column_histogram("PH", bins=10)
    assert hist["column"] == "PH"
    assert len(hist["bins"]) == 10
    total_binned = sum(b["count"] for b in hist["bins"])
    assert total_binned > 0


def test_histogram_invalid_column():
    """Histogram request on non-existent column must raise KeyError."""
    with pytest.raises(KeyError):
        get_column_histogram("NON_EXISTENT_COLUMN_XYZ", bins=10)
