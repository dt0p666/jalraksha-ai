"""Dataset loader, cleaner, profiler, and parameter calibration for JALRAKSHAK AI.

Calibrates simulation sensor baselines and thresholds against real water quality
monitoring records. Works seamlessly whether the raw CSV is present or only the
pre-computed profile JSON is available.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
import pandas as pd

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
RAW_CSV_PATH = DATA_DIR / "water_dataX.csv"
FALLBACK_CSV_PATH = BASE_DIR.parent.parent / "water_dataX.csv"
PROFILE_PATH = DATA_DIR / "dataset_profile.json"


def find_csv_path() -> Optional[Path]:
    """Locate the dataset CSV, checking local data folder then parent folder."""
    if RAW_CSV_PATH.is_file():
        return RAW_CSV_PATH
    if FALLBACK_CSV_PATH.is_file():
        return FALLBACK_CSV_PATH
    return None


def clean_column_name(col: str) -> str:
    """Normalize column names, stripping invalid characters like broken micro signs."""
    c = str(col).strip()
    c = c.replace("\xb5", "u").replace("µ", "u")
    return c


def load_raw_dataset() -> Tuple[Optional[pd.DataFrame], Dict[str, Any]]:
    """Load and clean the raw CSV file if present.
    
    Handles encoding nuances (latin1/utf-8-sig) and string 'NAN' markers.
    Returns (DataFrame, cleaning_report).
    """
    csv_path = find_csv_path()
    if not csv_path:
        return None, {"status": "missing", "message": "Raw CSV file not found on disk."}

    # Try utf-8-sig first, fall back to latin1 if byte decoding fails
    encodings = ["utf-8-sig", "latin1", "cp1252"]
    df = None
    loaded_encoding = None

    for enc in encodings:
        try:
            df = pd.read_csv(csv_path, encoding=enc, na_values=["NAN", "NAN ", "nan", "NA", "null", ""])
            loaded_encoding = enc
            break
        except (UnicodeDecodeError, Exception):
            continue

    if df is None:
        return None, {"status": "error", "message": "Failed to decode CSV with supported encodings."}

    # Normalize column names for safe JSON and display
    rename_map = {orig: clean_column_name(orig) for orig in df.columns}
    df.rename(columns=rename_map, inplace=True)

    # Clean numeric columns
    numeric_candidates = [
        "Temp",
        "D.O. (mg/l)",
        "PH",
        "CONDUCTIVITY (umhos/cm)",
        "B.O.D. (mg/l)",
        "NITRATENAN N+ NITRITENANN (mg/l)",
        "FECAL COLIFORM (MPN/100ml)",
        "TOTAL COLIFORM (MPN/100ml)Mean",
    ]

    coerced_counts: Dict[str, int] = {}
    for col in numeric_candidates:
        if col in df.columns:
            non_numeric_mask = pd.to_numeric(df[col], errors="coerce").isna() & df[col].notna()
            coerced_counts[col] = int(non_numeric_mask.sum())
            df[col] = pd.to_numeric(df[col], errors="coerce")

    duplicates = int(df.duplicated().sum())

    report = {
        "status": "loaded",
        "path": str(csv_path),
        "encoding": loaded_encoding,
        "rows": len(df),
        "columns": len(df.columns),
        "duplicates": duplicates,
        "coerced_counts": coerced_counts,
    }
    return df, report


def generate_dataset_profile() -> Dict[str, Any]:
    """Generate summary statistics profile from the CSV or return existing profile."""
    df, report = load_raw_dataset()

    if df is None:
        if PROFILE_PATH.is_file():
            with open(PROFILE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "status": "unavailable",
            "message": "Neither raw CSV nor precomputed profile is available.",
            "columns": {},
            "calibration": get_default_calibration(),
        }

    profile: Dict[str, Any] = {
        "status": "available",
        "source": "User-provided dataset (Indian CPCB Water Quality Monitoring Network format)",
        "rows": int(len(df)),
        "columns_count": int(len(df.columns)),
        "duplicate_rows": int(df.duplicated().sum()),
        "has_label": False,
        "label_column": None,
        "columns": {},
    }

    # Check for any label column
    for col in df.columns:
        if col.lower() in ["label", "potable", "safe", "class", "is_safe"]:
            profile["has_label"] = True
            profile["label_column"] = col
            break

    for col in df.columns:
        s = df[col]
        missing = int(s.isna().sum())
        non_null = int(s.notna().sum())

        if pd.api.types.is_numeric_dtype(s):
            clean_s = s.dropna()
            # Trim extreme non-physical outliers for sensible calibration (e.g. pH > 14)
            if col == "PH":
                phys_s = clean_s[(clean_s >= 0) & (clean_s <= 14)]
            else:
                phys_s = clean_s

            stats = {
                "dtype": "numeric",
                "missing_count": missing,
                "non_null_count": non_null,
                "mean": round(float(phys_s.mean()), 2) if len(phys_s) > 0 else 0.0,
                "std": round(float(phys_s.std()), 2) if len(phys_s) > 1 else 0.0,
                "min": round(float(phys_s.min()), 2) if len(phys_s) > 0 else 0.0,
                "p5": round(float(phys_s.quantile(0.05)), 2) if len(phys_s) > 0 else 0.0,
                "p50": round(float(phys_s.quantile(0.50)), 2) if len(phys_s) > 0 else 0.0,
                "p95": round(float(phys_s.quantile(0.95)), 2) if len(phys_s) > 0 else 0.0,
                "max": round(float(phys_s.max()), 2) if len(phys_s) > 0 else 0.0,
            }
        else:
            stats = {
                "dtype": "categorical",
                "missing_count": missing,
                "non_null_count": non_null,
                "unique_count": int(s.nunique()),
                "sample_values": [str(x) for x in s.dropna().unique()[:5]],
            }
        profile["columns"][col] = stats

    # Calibrate simulation anomaly index from dataset
    # We choose Conductivity (umhos/cm) as the core anomaly proxy:
    # Baseline normal = median (183.0 umhos/cm).
    # Normal variation sigma = ~25.0 umhos/cm.
    # Alert threshold = 350.0 umhos/cm (~75th-80th percentile of clean potable water).
    cond_stats = profile["columns"].get("CONDUCTIVITY (umhos/cm)", {})
    if cond_stats and cond_stats.get("dtype") == "numeric":
        baseline_mean = float(cond_stats.get("p50", 183.0))
        # Use robust scale (approx sigma from IQR or trimmed std)
        noise_sigma = round(max(5.0, min(30.0, (float(cond_stats.get("p95", 500.0)) - baseline_mean) / 20.0)), 2)
        alert_threshold = round(baseline_mean + 3.0 * noise_sigma, 2)
    else:
        baseline_mean = 183.0
        noise_sigma = 15.0
        alert_threshold = 230.0

    profile["calibration"] = {
        "signal_column": "CONDUCTIVITY (umhos/cm)",
        "unit": "umhos/cm",
        "description": "Electrical conductivity indicating dissolved ionic contaminants and mineral intrusion.",
        "baseline_mean": baseline_mean,
        "noise_sigma": noise_sigma,
        "alert_threshold": alert_threshold,
        "contamination_gain": 400.0,  # Peak concentration (1.0) adds 400 umhos/cm
    }

    # Persist to profile path
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(PROFILE_PATH, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2)

    return profile


def get_default_calibration() -> Dict[str, Any]:
    """Documented synthetic parameters used if dataset is missing."""
    return {
        "signal_column": "SYNTHETIC_ANOMALY_INDEX",
        "unit": "index",
        "description": "Documented synthetic anomaly parameters based on standard water conductivity distribution.",
        "baseline_mean": 183.0,
        "noise_sigma": 15.0,
        "alert_threshold": 230.0,
        "contamination_gain": 400.0,
    }


def get_dataset_profile() -> Dict[str, Any]:
    """Retrieve profile from cache or generate it."""
    if PROFILE_PATH.is_file():
        try:
            with open(PROFILE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return generate_dataset_profile()


def get_column_histogram(column: str, bins: int = 15) -> Dict[str, Any]:
    """Compute histogram data for a numeric column."""
    df, _ = load_raw_dataset()
    if df is None or column not in df.columns:
        # Check if column in profile
        profile = get_dataset_profile()
        if column not in profile.get("columns", {}):
            raise KeyError(f"Column '{column}' not found in dataset.")
        # If raw CSV not present, construct synthetic binning from profile quantiles
        col_meta = profile["columns"][column]
        if col_meta.get("dtype") != "numeric":
            raise ValueError(f"Column '{column}' is not numeric.")
        min_v = col_meta.get("p5", 0.0)
        max_v = col_meta.get("p95", 100.0)
        edges = np.linspace(min_v, max_v, bins + 1)
        sim_bins = []
        for i in range(bins):
            sim_bins.append({
                "bin_start": round(float(edges[i]), 2),
                "bin_end": round(float(edges[i + 1]), 2),
                "count": int(100 / bins),
            })
        return {
            "column": column,
            "bins": sim_bins,
            "total_rows": profile.get("rows", 0),
            "estimated": True,
        }

    s = pd.to_numeric(df[column], errors="coerce").dropna()
    if len(s) == 0:
        raise ValueError(f"Column '{column}' contains no valid numeric values.")

    # Exclude extreme 1% outliers for displayable binning
    p1 = float(s.quantile(0.01))
    p99 = float(s.quantile(0.99))
    s_filtered = s[(s >= p1) & (s <= p99)]
    if len(s_filtered) == 0:
        s_filtered = s

    counts, bin_edges = np.histogram(s_filtered, bins=bins)
    result_bins = []
    for i in range(len(counts)):
        result_bins.append({
            "bin_start": round(float(bin_edges[i]), 2),
            "bin_end": round(float(bin_edges[i + 1]), 2),
            "count": int(counts[i]),
        })

    return {
        "column": column,
        "bins": result_bins,
        "total_rows": int(len(s)),
        "displayed_rows": int(len(s_filtered)),
        "min": round(float(s.min()), 2),
        "max": round(float(s.max()), 2),
        "estimated": False,
    }
