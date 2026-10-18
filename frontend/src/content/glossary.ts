export interface GlossaryTerm {
  id: string;
  term: string;
  shortDef: string;
  detailedDef: string;
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
  junction: {
    id: 'junction',
    term: 'Junction',
    shortDef: 'A pipe intersection where water flows split or merge.',
    detailedDef: 'In water distribution networks, junctions represent physical nodes where transmission mains branch into sector pipes or merge before distribution.',
  },
  reservoir: {
    id: 'reservoir',
    term: 'Water Tank (Reservoir)',
    shortDef: 'Where the water starts: an elevated storage tank feeding clean water by gravity.',
    detailedDef: 'Primary clean water source built high on natural hills to push water through the village network using natural gravity.',
  },
  sensor: {
    id: 'sensor',
    term: 'Water Quality Sensor',
    shortDef: 'Continuous online monitoring probe measuring electrical conductivity.',
    detailedDef: 'Fixed telemetry station placed at crucial pipeline branches. Flags conductivity deviations above baseline indicating dissolved contaminant ingress.',
  },
  anomaly_index: {
    id: 'anomaly_index',
    term: 'Anomaly Index (Conductivity)',
    shortDef: 'Micro-Siemens per cm (umhos/cm) measuring dissolved ions.',
    detailedDef: 'Calibrated from historical monitoring records. Normal village groundwater has a median baseline of ~183 umhos/cm; chemical intrusion triggers sharp spikes.',
  },
  probability: {
    id: 'probability',
    term: 'Posterior Probability',
    shortDef: 'Mathematical likelihood that a given node is the contamination source.',
    detailedDef: 'Calculated using Bayes theorem by comparing predicted plume arrival times and dilution at all sensors against real telemetry observations.',
  },
  uncertainty: {
    id: 'uncertainty',
    term: 'Uncertainty (Shannon Entropy)',
    shortDef: 'Measurement in bits of remaining investigative ambiguity.',
    detailedDef: 'High entropy means many candidate nodes are equally plausible; low entropy means probability has concentrated on one or two specific source nodes.',
  },
  information_gain: {
    id: 'information_gain',
    term: 'Expected Information Gain',
    shortDef: 'Expected reduction in uncertainty from a single physical sample.',
    detailedDef: 'Based on optimal experimental design (OED). Identifies which unmonitored node bisects remaining candidate hypotheses most cleanly.',
  },
  hop_distance: {
    id: 'hop_distance',
    term: 'Hop Distance',
    shortDef: 'Shortest graph edge distance between candidate and true source.',
    detailedDef: 'Measures topological error. A hop distance of 0 indicates an exact match; 1 hop indicates an adjacent pipe junction was selected.',
  },
  hypothesis: {
    id: 'hypothesis',
    term: 'Candidate Hypothesis',
    shortDef: 'A candidate source node being evaluated by the Bayesian engine.',
    detailedDef: 'The inference engine tests every reservoir and junction in the network as a potential origin point across a grid of unknown injection onset steps.',
  },
};
