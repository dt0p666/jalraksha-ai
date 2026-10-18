export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'If sensor J-08 alarms with high conductivity, which nodes could NOT be the source?',
    options: [
      'Nodes upstream of J-08 (like R1, J-01, J-02)',
      'Nodes downstream of J-08 or on unrelated branches (like R2, J-04)',
      'Junction J-03',
      'The source could be anywhere in the network',
    ],
    correctIndex: 1,
    explanation: 'Contamination cannot flow upstream or jump between disconnected branches. Therefore, nodes downstream of J-08 or on other branches cannot have caused J-08 to alarm.',
  },
  {
    id: 2,
    question: 'Why is a sensor that continues to read normal baseline water informative?',
    options: [
      'It is not informative and is discarded by the engine',
      'It indicates that sensor has run out of battery',
      'It acts as negative evidence, ruling out potential sources upstream of that sensor',
      'It proves the entire village network is 100% safe',
    ],
    correctIndex: 2,
    explanation: 'Under Bayesian inference, normal sensor readings provide vital negative evidence: if an upstream candidate were truly contaminated, that sensor would have triggered.',
  },
  {
    id: 3,
    question: 'What is the primary objective of the grab sampling recommendation algorithm?',
    options: [
      'To sample at the reservoir to confirm baseline water',
      'To sample where reading is highest to verify maximum concentration',
      'To maximize Expected Information Gain and reduce posterior entropy',
      'To randomly test household taps until a complaint is lodged',
    ],
    correctIndex: 2,
    explanation: 'Optimal sampling targets junctions that bisect top competing hypotheses, reducing uncertainty as quickly as possible within budget.',
  },
  {
    id: 4,
    question: 'What does a Shannon entropy of 4.5 bits signify during an ongoing investigation?',
    options: [
      'The investigation is completely finished and certain',
      'Significant ambiguity remains, with probability distributed among many candidate nodes',
      'The AI model has encountered a network failure',
      'Contamination has breached 4.5 reservoirs',
    ],
    correctIndex: 1,
    explanation: 'Higher entropy reflects broader uncertainty across candidate sources. As more sensor readings or samples arrive, entropy drops towards zero.',
  },
  {
    id: 5,
    question: 'What should a field engineer do immediately when the simulator suggests a high-probability source?',
    options: [
      'Declare the water safe to drink immediately without testing',
      'Isolate the relevant pipe sector, alert local health authorities, and collect verification samples',
      'Ignore the warning because algorithms are never useful in the field',
      'Discharge the entire reservoir onto agricultural crops',
    ],
    correctIndex: 1,
    explanation: 'Models guide rapid valve isolation and field investigation, but official safety declarations always require municipal health coordination and certified laboratory testing.',
  },
];
