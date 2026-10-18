"""FastAPI main application for JALRAKSHAK AI.

Provides REST API endpoints for drinking-water network topology, contamination simulation,
Bayesian source inference, Random Forest second opinion, optimal sampling, AI incident reporting,
dataset distribution inspection, and contact messaging.
"""

from __future__ import annotations

from datetime import datetime, timezone
import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from app.ai_report import (
    build_evidence_package,
    check_ollama_status,
    generate_incident_report,
)
from app.config import (
    INSTRUCTOR_PASSCODE,
    MAX_SIMULATION_STEPS,
    PROJECT_ROOT,
)
from app.contact import save_contact_message, validate_contact_payload
from app.dataset import (
    RAW_CSV_PATH,
    get_column_histogram,
    get_dataset_profile,
)
from app.inference import run_bayesian_inference
from app.ml_crosscheck import compute_ml_crosscheck
from app.network import load_network_data
from app.sampling import recommend_next_samples
from app.schemas import (
    AiReportRequest,
    AiReportResponse,
    AiStatusResponse,
    ContactMessageRequest,
    ContactMessageResponse,
    HealthResponse,
    InstructorUnlockRequest,
    InstructorUnlockResponse,
    InvestigationRunResponse,
    MetaResponse,
    NetworkTopologyResponse,
    ObservationModel,
    RevealResponse,
    SamplingExecuteRequest,
    SamplingExecuteResponse,
    SamplingRecommendResponse,
    SensorObservationsResponse,
    SensorReading,
    SimulationAdvanceRequest,
    SimulationInitRequest,
    SimulationInitResponse,
    SimulationStateResponse,
)
from app.session import get_or_create_session, reset_session

APP_START_TIME = datetime.now(timezone.utc).isoformat()
HISTORY_DIR = Path(__file__).resolve().parent / "history"
INVESTIGATIONS_FILE = HISTORY_DIR / "investigations.json"

app = FastAPI(
    title="JALRAKSHAK AI API",
    description="Educational drinking-water contamination source identification and investigation engine.",
    version="1.0.0",
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------
# System & Metadata Endpoints
# -------------------------------------------------------------

@app.get("/api/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    """Honest service health check."""
    return HealthResponse(
        status="ok",
        service="jalrakshak-ai-backend",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.get("/api/meta", response_model=MetaResponse)
def get_meta() -> MetaResponse:
    """Build metadata and dataset timestamp."""
    csv_mod_time = None
    if RAW_CSV_PATH.is_file():
        mtime = os.path.getmtime(RAW_CSV_PATH)
        csv_mod_time = datetime.fromtimestamp(mtime, tz=timezone.utc).isoformat()

    return MetaResponse(
        build_time=APP_START_TIME,
        dataset_file_modified=csv_mod_time,
        version="1.0.0",
        disclaimer=(
            "Educational simulation only. Not a validated hydraulic or water-safety model. "
            "Never use this software for municipal or public health safety decisions."
        ),
    )


@app.get("/api/ai/status", response_model=AiStatusResponse)
async def get_ai_status() -> AiStatusResponse:
    """Check Ollama reachability and Gemma 3 1B availability."""
    res = await check_ollama_status()
    return AiStatusResponse(**res)


# -------------------------------------------------------------
# Network Topology & Dataset Endpoints
# -------------------------------------------------------------

@app.get("/api/network", response_model=NetworkTopologyResponse)
def get_network() -> NetworkTopologyResponse:
    """Return fixed 42-node water distribution network topology."""
    data = load_network_data()
    return NetworkTopologyResponse(
        nodes=data["nodes"],
        edges=data["edges"],
        sensors=data["sensors"],
        zones=data["zones"],
        reservoirs=data["reservoirs"],
        total_nodes=data["total_nodes"],
        total_edges=data["total_edges"],
    )


@app.get("/api/dataset/profile")
def get_profile() -> Dict[str, Any]:
    """Return summary profile and calibration parameters from water quality records."""
    return get_dataset_profile()


@app.get("/api/dataset/histogram")
def get_histogram(column: str = Query(..., description="Column name"), bins: int = Query(15, ge=3, le=50)) -> Dict[str, Any]:
    """Return histogram binning for a numeric dataset column."""
    try:
        return get_column_histogram(column, bins=bins)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Column '{column}' does not exist in dataset.",
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )


# -------------------------------------------------------------
# Simulation State Endpoints
# -------------------------------------------------------------

@app.post("/api/simulation/init", response_model=SimulationInitResponse)
def init_simulation(payload: Optional[SimulationInitRequest] = None) -> SimulationInitResponse:
    """Initialize a new simulation with a private hidden source and seeded RNG."""
    seed = payload.seed if payload and payload.seed is not None else 42
    stype = payload.source_type if payload and payload.source_type else "random"

    # Always reset the default session
    sess = reset_session("default", seed=seed, source_type=stype)

    return SimulationInitResponse(
        session_id=sess.session_id,
        current_step=sess.current_step,
        status=sess.status,
        total_nodes=len(sess.network_data["nodes"]),
        active_sensors=len(sess.sensors),
        message=f"Simulation initialized with {stype} source profile. Ready to advance.",
    )


@app.post("/api/simulation/advance", response_model=SimulationStateResponse)
def advance_simulation(payload: SimulationAdvanceRequest) -> SimulationStateResponse:
    """Step forward discrete simulation timeline and collect real sensor readings."""
    sess = get_or_create_session("default")
    sess.advance(payload.steps)
    return get_simulation_state()


@app.get("/api/simulation/state", response_model=SimulationStateResponse)
def get_simulation_state() -> SimulationStateResponse:
    """Return current observable simulation status, alert count, and readings."""
    sess = get_or_create_session("default")
    readings = [SensorReading(**r) for r in sess.get_latest_sensor_readings()]
    alert_count = sess.get_active_alert_count()

    return SimulationStateResponse(
        current_step=sess.current_step,
        status=sess.status,
        sensor_readings=readings,
        alert_count=alert_count,
        samples_taken=len(sess.samples_taken),
        budget_remaining=sess.sample_budget,
        incident_detected=(sess.status == "INCIDENT"),
        timeline_events=sess.timeline_events,
        total_steps=MAX_SIMULATION_STEPS,
    )


@app.get("/api/sensors/observations", response_model=SensorObservationsResponse)
def get_sensor_observations() -> SensorObservationsResponse:
    """Return full historical log of sensor and sample observations."""
    sess = get_or_create_session("default")
    obs_list = [ObservationModel(**o) for o in sess.get_public_observations()]
    alarmed = sorted(list(set(o.node_id for o in obs_list if o.is_alert and o.is_sensor)))

    return SensorObservationsResponse(
        current_step=sess.current_step,
        observations=obs_list,
        sensors_exceeding_threshold=alarmed,
    )


@app.post("/api/simulation/reset", response_model=SimulationInitResponse)
def reset_simulation() -> SimulationInitResponse:
    """Reset simulation back to initial clean state."""
    sess = reset_session("default", seed=42, source_type="random")
    return SimulationInitResponse(
        session_id=sess.session_id,
        current_step=sess.current_step,
        status=sess.status,
        total_nodes=len(sess.network_data["nodes"]),
        active_sensors=len(sess.sensors),
        message="Simulation state reset. All sensors clean.",
    )


# -------------------------------------------------------------
# Investigation: Inference, ML Cross-Check & Sampling
# -------------------------------------------------------------

@app.post("/api/investigation/run", response_model=InvestigationRunResponse)
def run_investigation() -> InvestigationRunResponse:
    """Execute Bayesian source ranking and Random Forest second opinion."""
    sess = get_or_create_session("default")
    obs = sess.get_public_observations()

    # Bayesian inference (no access to hidden source)
    bayes_res = run_bayesian_inference(
        observations=obs,
        current_step=sess.current_step,
    )

    top1_node = bayes_res["top_candidates"][0]["node_id"] if bayes_res["top_candidates"] else "J-01"

    # ML cross-check second opinion
    ml_res = compute_ml_crosscheck(
        observations=obs,
        bayes_top1_node=top1_node,
    )

    return InvestigationRunResponse(
        top_candidates=bayes_res["top_candidates"],
        full_ranking=bayes_res["full_ranking"],
        entropy=bayes_res["entropy"],
        uncertainty_level=bayes_res["uncertainty_level"],
        ml_second_opinion=ml_res,
        summary=bayes_res["summary"],
    )


@app.post("/api/sampling/recommend", response_model=SamplingRecommendResponse)
def recommend_sampling() -> SamplingRecommendResponse:
    """Recommend next optimal grab-sampling location via Expected Information Gain."""
    sess = get_or_create_session("default")
    obs = sess.get_public_observations()

    bayes_res = run_bayesian_inference(obs, sess.current_step)
    rec_res = recommend_next_samples(
        current_ranking=bayes_res["full_ranking"],
        current_entropy=bayes_res["entropy"],
        sampled_nodes=sess.samples_taken,
        budget_remaining=sess.sample_budget,
    )

    return SamplingRecommendResponse(**rec_res)


@app.post("/api/sampling/execute", response_model=SamplingExecuteResponse)
def execute_sampling(payload: SamplingExecuteRequest) -> SamplingExecuteResponse:
    """Execute physical grab sample at the chosen network node."""
    sess = get_or_create_session("default")
    if payload.node_id in sess.samples_taken:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Node {payload.node_id} has already been sampled in this investigation.",
        )
    if sess.sample_budget <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sample budget exhausted. Cannot collect further samples.",
        )

    res = sess.execute_sample(payload.node_id)
    return SamplingExecuteResponse(**res)


@app.post("/api/investigation/reveal", response_model=RevealResponse)
def reveal_investigation() -> RevealResponse:
    """Reveal ground truth hidden source and evaluate investigator accuracy."""
    sess = get_or_create_session("default")
    obs = sess.get_public_observations()
    bayes_res = run_bayesian_inference(obs, sess.current_step)
    top1 = bayes_res["top_candidates"][0]["node_id"] if bayes_res["top_candidates"] else "unknown"
    top1_prob = bayes_res["top_candidates"][0]["probability"] if bayes_res["top_candidates"] else 0.0

    eval_res = sess.reveal(top1_candidate=top1)

    # Save to history file
    HISTORY_DIR.mkdir(parents=True, exist_ok=True)
    history_record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "session_id": sess.session_id,
        "seed": sess.seed,
        "true_source": eval_res["true_source"],
        "top1_candidate": top1,
        "is_correct": eval_res["is_top1_correct"],
        "hop_error": eval_res["hop_error"],
        "samples_used": eval_res["samples_used"],
        "final_step": sess.current_step,
    }

    try:
        invs = []
        if INVESTIGATIONS_FILE.is_file():
            with open(INVESTIGATIONS_FILE, "r", encoding="utf-8") as f:
                invs = json.load(f)
        invs.append(history_record)
        with open(INVESTIGATIONS_FILE, "w", encoding="utf-8") as f:
            json.dump(invs, f, indent=2)
    except Exception:
        pass

    outcome_str = "SUCCESS: Engine correctly identified the contamination source!" if eval_res["is_top1_correct"] else f"APPROXIMATION: Top candidate was {eval_res['hop_error']} hop(s) away from true source."

    return RevealResponse(
        true_source=eval_res["true_source"],
        true_source_type=eval_res["true_source_type"],
        onset_step=eval_res["onset_step"],
        is_top1_correct=eval_res["is_top1_correct"],
        top1_candidate=top1,
        hop_error=eval_res["hop_error"],
        samples_used=eval_res["samples_used"],
        final_probability=top1_prob,
        summary=outcome_str,
        true_spread_nodes=eval_res["true_spread_nodes"],
    )


# -------------------------------------------------------------
# AI Incident Report
# -------------------------------------------------------------

@app.post("/api/ai/report", response_model=AiReportResponse)
async def create_ai_report(payload: Optional[AiReportRequest] = None) -> AiReportResponse:
    """Generate structured incident report using local Gemma 3 1B or deterministic fallback."""
    sess = get_or_create_session("default")
    obs = sess.get_public_observations()

    bayes_res = run_bayesian_inference(obs, sess.current_step)
    rec_res = recommend_next_samples(
        bayes_res["full_ranking"],
        bayes_res["entropy"],
        sess.samples_taken,
        sess.sample_budget,
    )

    evidence = build_evidence_package(
        ranking_data=bayes_res,
        observations=obs,
        current_step=sess.current_step,
        samples_taken=sess.samples_taken,
        sample_recommendation=rec_res.get("recommended_node"),
        timeline_events=sess.timeline_events,
    )

    result = await generate_incident_report(evidence)
    return AiReportResponse(**result)


# -------------------------------------------------------------
# Contact & Classroom Instructor Tools
# -------------------------------------------------------------

@app.post("/api/contact", response_model=ContactMessageResponse)
def submit_contact_message(payload: ContactMessageRequest) -> ContactMessageResponse:
    """Submit a message and save to local messages.json."""
    data = payload.model_dump()
    valid, err_msg = validate_contact_payload(data)
    if not valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=err_msg)

    res = save_contact_message(data)
    return ContactMessageResponse(**res)


@app.post("/api/instructor/unlock", response_model=InstructorUnlockResponse)
def unlock_instructor(payload: InstructorUnlockRequest) -> InstructorUnlockResponse:
    """Verify instructor passcode to unlock classroom configuration controls."""
    if payload.passcode.strip() == INSTRUCTOR_PASSCODE.strip():
        return InstructorUnlockResponse(
            success=True,
            message="Instructor access unlocked. Classroom configuration tools enabled.",
            tools_unlocked=True,
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid instructor passcode. Please verify classroom access credentials.",
    )
