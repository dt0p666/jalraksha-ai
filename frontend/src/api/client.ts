import type {
  AiReportResponse,
  AiStatusResponse,
  ContactMessageRequest,
  ContactMessageResponse,
  HealthResponse,
  HistogramResponse,
  InstructorUnlockResponse,
  InvestigationRunResponse,
  MetaResponse,
  NetworkTopologyResponse,
  RevealResponse,
  SamplingExecuteResponse,
  SamplingRecommendResponse,
  SensorObservationsResponse,
  SimulationStateResponse,
} from './types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorDetail = `HTTP Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.detail) {
        errorDetail = errJson.detail;
      }
    } catch {
      // Non-json error response
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

export const api = {
  // System metadata
  getHealth: () => fetchJson<HealthResponse>('/health'),
  getMeta: () => fetchJson<MetaResponse>('/meta'),
  getAiStatus: () => fetchJson<AiStatusResponse>('/ai/status'),

  // Network & Dataset
  getNetwork: () => fetchJson<NetworkTopologyResponse>('/network'),
  getDatasetProfile: () => fetchJson<any>('/dataset/profile'),
  getHistogram: (column: string, bins = 15) =>
    fetchJson<HistogramResponse>(`/dataset/histogram?column=${encodeURIComponent(column)}&bins=${bins}`),

  // Simulation controls
  initSimulation: (seed = 42, sourceType = 'random') =>
    fetchJson<{ session_id: string; current_step: number; status: string; total_nodes: number; active_sensors: number; message: string }>(
      '/simulation/init',
      {
        method: 'POST',
        body: JSON.stringify({ seed, source_type: sourceType }),
      }
    ),
  advanceSimulation: (steps = 1) =>
    fetchJson<SimulationStateResponse>('/simulation/advance', {
      method: 'POST',
      body: JSON.stringify({ steps }),
    }),
  getSimulationState: () => fetchJson<SimulationStateResponse>('/simulation/state'),
  getSensorObservations: () => fetchJson<SensorObservationsResponse>('/sensors/observations'),
  resetSimulation: () => fetchJson<{ session_id: string; current_step: number; status: string; total_nodes: number; active_sensors: number; message: string }>('/simulation/reset', { method: 'POST' }),

  // Investigation & Sampling
  runInvestigation: () => fetchJson<InvestigationRunResponse>('/investigation/run', { method: 'POST' }),
  recommendSampling: () => fetchJson<SamplingRecommendResponse>('/sampling/recommend', { method: 'POST' }),
  executeSampling: (nodeId: string) =>
    fetchJson<SamplingExecuteResponse>('/sampling/execute', {
      method: 'POST',
      body: JSON.stringify({ node_id: nodeId }),
    }),
  revealInvestigation: () => fetchJson<RevealResponse>('/investigation/reveal', { method: 'POST' }),

  // AI incident report
  generateAiReport: () => fetchJson<AiReportResponse>('/ai/report', { method: 'POST' }),

  // Forms and classroom tools
  submitContact: (data: ContactMessageRequest) =>
    fetchJson<ContactMessageResponse>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  unlockInstructor: (passcode: string) =>
    fetchJson<InstructorUnlockResponse>('/instructor/unlock', {
      method: 'POST',
      body: JSON.stringify({ passcode }),
    }),
};
