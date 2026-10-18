# Third-Party Notices and Licenses

JALRAKSHAK AI uses open-source libraries and open-weight models.

## Open-Weight AI Model
- **Gemma 4 (e.g. gemma4:e2b)** by Google DeepMind / Google
  - Terms of Use: https://ai.google.dev/gemma/terms
  - Accessed locally via Ollama (`http://localhost:11434`, model tag `gemma4:e2b` or configured environment)
  - No external API calls are made at runtime; model execution is entirely local.

## Frontend Libraries
- **React & React DOM**: MIT License (Meta Platforms, Inc.)
- **Three.js**: MIT License (Ricardo Cabello / mrdoob and Three.js authors)
- **@react-three/fiber**: MIT License (Poimandres)
- **@react-three/drei**: MIT License (Poimandres)
- **Vite**: MIT License (Yuxi Evan You & Vite Contributors)
- **TypeScript**: Apache License 2.0 (Microsoft Corp.)
- **Tailwind CSS**: MIT License (Tailwind Labs, Inc.)
- **React Flow (@xyflow/react)**: MIT License (webkid GmbH / xyflow)
- **Framer Motion**: MIT License (Framer B.V.)
- **Recharts**: MIT License (Recharts Group)
- **Lucide React**: ISC License (Lucide Contributors)
- **@fontsource/fraunces, @fontsource/inter, @fontsource/jetbrains-mono**: Open Font License / Apache License 2.0
- **Fuse.js**: Apache License 2.0 (Kiro Risk)

## Backend Libraries
- **FastAPI**: MIT License (Sebastián Ramírez)
- **Uvicorn**: BSD 3-Clause License (Encode OSS)
- **Pydantic**: MIT License (Samuel Colvin & Pydantic Contributors)
- **NetworkX**: 3-Clause BSD License (NetworkX Developers)
- **NumPy**: BSD 3-Clause License (NumPy Developers)
- **Pandas**: BSD 3-Clause License (AQR Capital Management, LLC, Lambda Foundry, Inc. and PyData Development Team)
- **Scikit-learn**: BSD 3-Clause License (Scikit-learn Developers)
- **HTTPX**: BSD 3-Clause License (Encode OSS)
- **Pytest**: MIT License (Holger Krekel and pytest-dev team)

## Dataset Notice
- `water_dataX.csv` is user-provided water quality monitoring records from historical monitoring stations (CPCB historical water quality data format). The raw dataset is not redistributed; only computed summary distribution profiles are included in the repository.
