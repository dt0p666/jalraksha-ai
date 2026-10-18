export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  content: string;
  actionRequired: 'start' | 'advance' | 'investigate' | 'sample' | 'report' | 'reveal';
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'tour-start',
    targetSelector: '[data-tour="start-btn"]',
    title: '1. Start a contamination',
    content: 'Click "Start a contamination" to pick a hidden point in the network. The source is kept privately on the server.',
    actionRequired: 'start',
  },
  {
    id: 'tour-timeline',
    targetSelector: '[data-tour="timeline-controls"]',
    title: '2. Watch the water flow',
    content: 'Click "Step" or "Play" to let the water travel downstream. Sensors will alert when mineral levels rise above normal.',
    actionRequired: 'advance',
  },
  {
    id: 'tour-investigate',
    targetSelector: '[data-tour="investigate-btn"]',
    title: '3. Find the source',
    content: 'Click "Run investigation" to calculate which upstream junction best explains the timing of the sensor readings.',
    actionRequired: 'investigate',
  },
  {
    id: 'tour-sample',
    targetSelector: '[data-tour="sample-btn"]',
    title: '4. Take a water sample',
    content: 'Click "Find best sample" to locate the junction that gives the most diagnostic value, then test that water.',
    actionRequired: 'sample',
  },
  {
    id: 'tour-report',
    targetSelector: '[data-tour="report-btn"]',
    title: '5. Write incident report',
    content: 'Click "Write incident report" to produce an engineering summary via the local open-weight Gemma model.',
    actionRequired: 'report',
  },
  {
    id: 'tour-reveal',
    targetSelector: '[data-tour="reveal-btn"]',
    title: '6. Reveal the real source',
    content: 'Click "Reveal the real source" to see the true origin and check how close your calculated source was.',
    actionRequired: 'reveal',
  },
];
