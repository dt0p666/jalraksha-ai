export interface NodeModel {
  id: string;
  label: string;
  type: 'reservoir' | 'junction' | 'zone';
  x: number;
  y: number;
  elevation_m?: number;
  households?: number;
  has_sensor: boolean;
}

export interface EdgeModel {
  id: string;
  from: string;
  to: string;
  delay_steps: number;
  dilution: number;
  length_m: number;
  diameter_mm: number;
}

export interface NetworkTopologyResponse {
  nodes: NodeModel[];
  edges: EdgeModel[];
  sensors: string[];
  zones: string[];
  reservoirs: string[];
  total_nodes: number;
  total_edges: number;
}

export interface SensorReading {
  sensor_id: string;
  node_id: string;
  step: number;
  value: number;
  unit: string;
  threshold: number;
  is_alert: boolean;
}

export interface TimelineEvent {
  step: number;
  type: string;
  description: string;
}

export interface SimulationStateResponse {
  current_step: number;
  status: 'NORMAL' | 'WARNING' | 'INCIDENT';
  sensor_readings: SensorReading[];
  alert_count: number;
  samples_taken: number;
  budget_remaining: number;
  incident_detected: boolean;
  timeline_events: TimelineEvent[];
  total_steps: number;
}

export interface ObservationModel {
  node_id: string;
  step: number;
  value: number;
  threshold: number;
  is_alert: boolean;
  is_sensor: boolean;
  is_sample: boolean;
}

export interface SensorObservationsResponse {
  current_step: number;
  observations: ObservationModel[];
  sensors_exceeding_threshold: string[];
}

export interface CandidateSource {
  node_id: string;
  rank: number;
  probability: number;
  supporting_sensors: string[];
  contradicting_sensors: string[];
  path_summary: string;
  node_type: string;
}

export interface MlSecondOpinion {
  top_pick: string;
  confidence: number;
  agrees_with_bayes: boolean;
  held_out_accuracy: number;
  label: string;
}

export interface InvestigationRunResponse {
  top_candidates: CandidateSource[];
  full_ranking: CandidateSource[];
  entropy: number;
  uncertainty_level: 'LOW' | 'MEDIUM' | 'HIGH';
  ml_second_opinion: MlSecondOpinion;
  summary: string;
}

export interface SampleRecommendation {
  node_id: string;
  rank: number;
  expected_information_gain: number;
  reason: string;
  zone_or_branch: string;
}

export interface SamplingRecommendResponse {
  recommended_node: SampleRecommendation | null;
  top_recommendations: SampleRecommendation[];
  budget_remaining: number;
}

export interface SamplingExecuteResponse {
  node_id: string;
  reading: number;
  threshold: number;
  is_alert: boolean;
  budget_remaining: number;
  step: number;
  multi_parameter_sample?: {
    conductivity: number;
    ph: number;
    dissolved_oxygen: number;
    turbidity_ntu: number;
  };
}

export interface RevealResponse {
  true_source: string;
  true_source_type: string;
  onset_step: number;
  is_top1_correct: boolean;
  top1_candidate: string;
  hop_error: number;
  samples_used: number;
  final_probability: number;
  summary: string;
  true_spread_nodes: string[];
}

export interface AiReportResponse {
  report_markdown: string;
  generation_time_sec: number;
  model_used: string;
  is_ai_generated: boolean;
  verified: boolean;
  warnings: string[];
  evidence_sent: any;
}

export interface AiStatusResponse {
  ollama_reachable: boolean;
  model_available: boolean;
  model_name: string;
  ollama_url: string;
  message: string;
}

export interface MetaResponse {
  build_time: string;
  dataset_file_modified?: string;
  version: string;
  disclaimer: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface HistogramBin {
  bin_start: number;
  bin_end: number;
  count: number;
}

export interface HistogramResponse {
  column: string;
  bins: HistogramBin[];
  total_rows: number;
  min?: number;
  max?: number;
  estimated: boolean;
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  topic: string;
  message: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface ContactMessageResponse {
  success: boolean;
  reference_id: string;
  timestamp: string;
  message: string;
}

export interface InstructorUnlockResponse {
  success: boolean;
  message: string;
  tools_unlocked: boolean;
}
