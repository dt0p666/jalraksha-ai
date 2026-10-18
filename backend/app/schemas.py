"""Pydantic v2 schemas for JALRAKSHAK AI API endpoints."""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "jalrakshak-ai-backend"
    timestamp: str


class MetaResponse(BaseModel):
    build_time: str
    dataset_file_modified: Optional[str]
    version: str = "1.0.0"
    disclaimer: str = (
        "Educational simulation only. Not a validated hydraulic or water-safety model. "
        "Do not use for real municipal water decisions."
    )


class AiStatusResponse(BaseModel):
    ollama_reachable: bool
    model_available: bool
    model_name: str
    ollama_url: str
    message: str


class NodeModel(BaseModel):
    id: str
    label: str
    type: str  # "reservoir" | "junction" | "zone"
    x: float
    y: float
    elevation_m: Optional[float] = None
    households: Optional[int] = None
    has_sensor: bool = False


class EdgeModel(BaseModel):
    id: str
    from_node: str = Field(..., alias="from")
    to_node: str = Field(..., alias="to")
    delay_steps: int
    dilution: float
    length_m: float
    diameter_mm: float

    model_config = {"populate_by_name": True}


class NetworkTopologyResponse(BaseModel):
    nodes: List[NodeModel]
    edges: List[EdgeModel]
    sensors: List[str]
    zones: List[str]
    reservoirs: List[str]
    total_nodes: int
    total_edges: int


class SimulationInitRequest(BaseModel):
    seed: Optional[int] = 42
    source_type: Optional[str] = "random"  # "reservoir" | "junction" | "branch" | "random"


class SimulationInitResponse(BaseModel):
    session_id: str
    current_step: int
    status: str  # "NORMAL" | "WARNING" | "INCIDENT"
    total_nodes: int
    active_sensors: int
    message: str


class SimulationAdvanceRequest(BaseModel):
    steps: int = 1


class SensorReading(BaseModel):
    sensor_id: str
    node_id: str
    step: int
    value: float
    unit: str
    threshold: float
    is_alert: bool


class SimulationStateResponse(BaseModel):
    current_step: int
    status: str  # "NORMAL" | "WARNING" | "INCIDENT"
    sensor_readings: List[SensorReading]
    alert_count: int
    samples_taken: int
    budget_remaining: int
    incident_detected: bool
    timeline_events: List[Dict[str, Any]]
    total_steps: int


class ObservationModel(BaseModel):
    node_id: str
    step: int
    value: float
    threshold: float
    is_alert: bool
    is_sensor: bool
    is_sample: bool


class SensorObservationsResponse(BaseModel):
    current_step: int
    observations: List[ObservationModel]
    sensors_exceeding_threshold: List[str]


class CandidateSource(BaseModel):
    node_id: str
    rank: int
    probability: float
    supporting_sensors: List[str]
    contradicting_sensors: List[str]
    path_summary: str
    node_type: str


class MlSecondOpinion(BaseModel):
    top_pick: str
    confidence: float
    agrees_with_bayes: bool
    held_out_accuracy: float
    label: str = "synthetic validation only"


class InvestigationRunResponse(BaseModel):
    top_candidates: List[CandidateSource]
    full_ranking: List[CandidateSource]
    entropy: float
    uncertainty_level: str  # "LOW" | "MEDIUM" | "HIGH"
    ml_second_opinion: MlSecondOpinion
    summary: str


class SampleRecommendation(BaseModel):
    node_id: str
    rank: int
    expected_information_gain: float
    reason: str
    zone_or_branch: str


class SamplingRecommendResponse(BaseModel):
    recommended_node: SampleRecommendation
    top_recommendations: List[SampleRecommendation]
    budget_remaining: int


class SamplingExecuteRequest(BaseModel):
    node_id: str


class SamplingExecuteResponse(BaseModel):
    node_id: str
    reading: float
    threshold: float
    is_alert: bool
    budget_remaining: int
    step: int
    multi_parameter_sample: Optional[Dict[str, Any]] = None


class RevealResponse(BaseModel):
    true_source: str
    true_source_type: str
    onset_step: int
    is_top1_correct: bool
    top1_candidate: str
    hop_error: int
    samples_used: int
    final_probability: float
    summary: str
    true_spread_nodes: List[str]  # Available for teacher view


class AiReportRequest(BaseModel):
    custom_notes: Optional[str] = None


class AiReportResponse(BaseModel):
    report_markdown: str
    generation_time_sec: float
    model_used: str
    is_ai_generated: bool
    verified: bool
    warnings: List[str]
    evidence_sent: Dict[str, Any]


class ContactMessageRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    topic: str = Field(..., min_length=2, max_length=50)
    message: str = Field(..., min_length=5, max_length=2000)
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_term: Optional[str] = None
    utm_content: Optional[str] = None


class ContactMessageResponse(BaseModel):
    success: bool
    reference_id: str
    timestamp: str
    message: str


class InstructorUnlockRequest(BaseModel):
    passcode: str


class InstructorUnlockResponse(BaseModel):
    success: bool
    message: str
    tools_unlocked: bool
