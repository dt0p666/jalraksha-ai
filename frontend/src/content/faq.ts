export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'system' | 'inference' | 'data' | 'safety';
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-what-is-jalrakshak',
    question: 'What is JALRAKSHAK AI?',
    answer:
      'JALRAKSHAK AI is an interactive educational control room designed to teach water engineers, students, and civic officers how waterborne contamination travels through piped rural networks, and how mathematical inference and targeted sampling can rapidly locate the origin point.',
    category: 'system',
  },
  {
    id: 'faq-is-it-real-data',
    question: 'Is this real village network data?',
    answer:
      'The 42-node distribution graph is a stylized educational topology modeled after rural Indian multi-village piped water schemes (with reservoirs, branch lines, loop cross-links, and tail-end hamlets). The sensor parameters are calibrated from historical Indian Central Pollution Control Board (CPCB) monitoring station records.',
    category: 'data',
  },
  {
    id: 'faq-what-is-the-hidden-source',
    question: 'What does the hidden source mean?',
    answer:
      'When an incident begins, the simulation engine randomly picks an origin node (a reservoir outlet or pipeline junction) and an onset step. This ground truth is strictly encapsulated inside a server-side session. Neither the Bayesian engine, the sampling optimizer, nor the AI analyst can see it until you choose to reveal it.',
    category: 'inference',
  },
  {
    id: 'faq-how-does-ranking-work',
    question: 'How does the Bayesian source ranking work?',
    answer:
      'The engine evaluates every node in the network as a potential origin. For each node, it models how a plume would spread downstream, factoring in pipe travel delays and dilution. It calculates the likelihood of current sensor readings under each hypothesis and applies Bayes theorem to produce normalized probabilities that sum to 100%.',
    category: 'inference',
  },
  {
    id: 'faq-why-is-next-sample-suggested',
    question: 'Why is a specific sampling location recommended?',
    answer:
      'Rather than sampling where contamination is highest, the engine uses Optimal Experimental Design (Expected Information Gain). It calculates which unmonitored node will reduce posterior entropy the most, cleanly distinguishing between the top competing candidate sources.',
    category: 'inference',
  },
  {
    id: 'faq-what-ai-does-and-does-not-do',
    question: 'What does the local AI model do and not do?',
    answer:
      'An open-weight model (Gemma 3 1B running locally via Ollama) writes the structured incident report. It translates mathematical probabilities and sensor readings into clear engineering summaries. It never invents numbers, never changes rankings, and never declares water safe or unsafe for human consumption. If Ollama is unavailable, an honest deterministic summary is produced instead.',
    category: 'system',
  },
  {
    id: 'faq-why-can-the-system-be-wrong',
    question: 'Why can the system sometimes be uncertain or pick the wrong node?',
    answer:
      'Real physical networks have measurement noise, multiple paths that produce similar downstream arrival times, and unmonitored branches. When sensor evidence is ambiguous, the engine honestly reports high entropy. Field grab samples are designed specifically to resolve this ambiguity.',
    category: 'inference',
  },
  {
    id: 'faq-what-dataset-is-used-for',
    question: 'What is the loaded dataset used for?',
    answer:
      'The dataset (water_dataX.csv) provides real distribution statistics for water parameters such as electrical conductivity, pH, and dissolved oxygen. It calibrates realistic baseline averages, natural variation noise, and abnormal detection thresholds so the simulation reflects real water physics rather than arbitrary numbers.',
    category: 'data',
  },
  {
    id: 'faq-is-anything-stored',
    question: 'Is any private data or browsing tracking stored?',
    answer:
      'No external analytics or third-party trackers are used. Session state and investigation logs are stored locally on your server. Contact form submissions are appended to a local JSON file without triggering external emails.',
    category: 'safety',
  },
  {
    id: 'faq-who-is-it-for',
    question: 'Who is JALRAKSHAK AI designed for?',
    answer:
      'It is built for public health trainees, civil and environmental engineering students, water utility operators, and hackathon evaluators who want to understand network hydraulics, Bayesian diagnostics, and transparent AI reporting without proprietary software.',
    category: 'system',
  },
];
