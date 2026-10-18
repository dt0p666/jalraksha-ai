export interface Lesson {
  id: string;
  title: string;
  summary: string;
  body: string[];
  takeaway: string;
}

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-network-anatomy',
    title: 'How a Village Drinking-Water Scheme Operates',
    summary: 'Water moves through branching pipelines driven by gravity from high storage tanks to clustered village hamlets.',
    body: [
      'Piped rural water supply schemes in India and across the global South typically rely on elevated storage reservoirs (ESRs) perched on hills or staging towers.',
      'Water flows under gravity pressure through transmission mains into intermediate distribution junctions, eventually branching into terminal service zones supplying community standposts and household connections.',
      'Understanding pipeline diameters, elevations, and flow directions is essential because any intrusion moves strictly downstream with the moving hydraulic gradient.',
    ],
    takeaway: 'Water networks are directed graphs: water and contaminants only move forward along the pressure gradient.',
  },
  {
    id: 'lesson-plume-transport',
    title: 'Advection, Delay, and Dilution',
    summary: 'Contaminant plumes do not appear everywhere at once; they travel with pipe velocity and dilute at branch junctions.',
    body: [
      'When an intrusion occurs at a pipe junction (such as an illegal tapping point, sewer line ingress, or broken seal), the plume travels downstream with the fluid velocity (advection).',
      'Each pipe segment introduces a transport delay proportional to its length and inversely proportional to flow velocity. Longer mains take several discrete time steps to convey the plume.',
      'At junctions where unpolluted water enters from clean branches, mixing occurs, diluting the contaminant concentration before it reaches downstream consumers.',
    ],
    takeaway: 'Arrival time at a downstream sensor is an exact fingerprint of distance and flow velocity from the source.',
  },
  {
    id: 'lesson-sensor-limits',
    title: 'What Fixed Sensors Can and Cannot Tell You',
    summary: 'A sensor alarm confirms an upstream problem, but normal readings are just as mathematically informative.',
    body: [
      'Continuous telemetry sensors measure surrogate water quality indicators such as electrical conductivity, turbidity, or chlorine residual.',
      'When a sensor alarms, you know with certainty that the contamination origin must lie on an upstream topological path leading to that sensor.',
      'Crucially, sensors that continue to report normal baseline readings provide equally strong negative evidence: they rule out all potential sources situated directly upstream of them.',
    ],
    takeaway: 'Absence of an alarm is evidence: a clean sensor eliminates whole upstream branches of the network.',
  },
  {
    id: 'lesson-bayesian-inference',
    title: 'Demystifying Bayesian Source Probabilities',
    summary: 'Bayes theorem compares how well each candidate node explains both alarmed and normal sensor readings.',
    body: [
      'The inference engine does not guess; it tests every candidate node in the network against the physical propagation equations.',
      'For each candidate node and possible onset step, it computes the expected noise-free reading at every sensor and compares it against actual observations using a Gaussian likelihood model.',
      'Candidate nodes whose downstream paths match the observed alarm timings receive high probability, while nodes contradicted by clean sensors receive near-zero probability.',
    ],
    takeaway: 'Probabilities reflect physical consistency: candidate nodes that explain all observations rise to the top.',
  },
  {
    id: 'lesson-targeted-sampling',
    title: 'Why We Sample Where We Learn the Most',
    summary: 'Targeted field sampling uses Expected Information Gain to bisect competing hypotheses rather than chasing the highest number.',
    body: [
      'With limited field personnel and portable testing kits, deciding where to collect a grab sample is critical.',
      'Intuitively, operators might sample near the highest reading, but optimal experimental design dictates testing at junctions that distinguish between top competing candidates.',
      'If Candidate A would cause node J-14 to read high while Candidate B would leave it clean, sampling J-14 eliminates one candidate regardless of the outcome.',
    ],
    takeaway: 'Sample where uncertainty is resolved most cleanly, not simply where water is dirtiest.',
  },
  {
    id: 'lesson-public-health',
    title: 'Real-World Response Protocols and Lab Confirmation',
    summary: 'Mathematical models are investigative aids; official public health orders require laboratory microbial confirmation.',
    body: [
      'While real-time algorithms guide rapid containment, municipal engineers must isolate suspect pipe valves and advise communities to switch to alternate safe sources.',
      'Field test kits (H2S vials, portable conductivity meters) offer initial triage, but definitive pathogen identification requires certified laboratory incubation.',
      'Public notifications must be issued in coordination with local gram panchayats, district health officers, and community water committees.',
    ],
    takeaway: 'Algorithmic inference guides the valve keys; certified laboratory testing protects human life.',
  },
];
