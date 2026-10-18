export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  content: string;
  actionRequired: 'start' | 'advance' | 'investigate' | 'sample' | 'report' | 'reveal' | 'none';
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'tour-start',
    targetSelector: '[data-tour="start-btn"]',
    title: '1. Initiate Contamination Event',
    content: 'Click "Start contamination" to inject an unknown source into the network. The source is hidden privately on the server.',
    actionRequired: 'start',
  },
  {
    id: 'tour-timeline',
    targetSelector: '[data-tour="timeline-controls"]',
    title: '2. Advance Simulation Timeline',
    content: 'Click "Step" or "Play" to advance the timeline. Watch as physical plume delay conveys the plume downstream to telemetry sensors.',
    actionRequired: 'advance',
  },
  {
    id: 'tour-investigate',
    targetSelector: '[data-tour="investigate-btn"]',
    title: '3. Run Bayesian Source Ranking',
    content: 'Click "Run investigation" to compute real-time posterior probabilities and compare against the Random Forest second opinion.',
    actionRequired: 'investigate',
  },
  {
    id: 'tour-sample',
    targetSelector: '[data-tour="sample-btn"]',
    title: '4. Execute Targeted Grab Sample',
    content: 'Click "Find best sample" to locate the junction with highest Expected Information Gain, then collect a field reading.',
    actionRequired: 'sample',
  },
  {
    id: 'tour-report',
    targetSelector: '[data-tour="report-btn"]',
    title: '5. Synthesize Incident Report',
    content: 'Click "Incident Report" to generate an engineering summary via Gemma 3 1B or the honest rule-based fallback.',
    actionRequired: 'report',
  },
  {
    id: 'tour-reveal',
    targetSelector: '[data-tour="reveal-btn"]',
    title: '6. Reveal True Source & Evaluate',
    content: 'Click "Reveal source" to unlock the ground truth, check hop distance error, and activate Teacher View.',
    actionRequired: 'reveal',
  },
];
