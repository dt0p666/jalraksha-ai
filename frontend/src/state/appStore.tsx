import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../api/client';
import type {
  InvestigationRunResponse,
  NetworkTopologyResponse,
  RevealResponse,
  SamplingRecommendResponse,
  SamplingExecuteResponse,
  SimulationStateResponse,
  AiReportResponse,
} from '../api/types';
import type { ThemeMode } from '../styles/tokens';

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface AppContextType {
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // Topology & Simulation
  network: NetworkTopologyResponse | null;
  simState: SimulationStateResponse | null;
  isLoadingNetwork: boolean;
  backendError: string | null;
  initSimulation: (seed?: number, sourceType?: string) => Promise<void>;
  advanceSimulation: (steps?: number) => Promise<void>;
  resetSimulation: () => Promise<void>;
  isPlaying: boolean;
  togglePlay: () => void;
  stepForward: () => void;

  // Investigation
  investigation: InvestigationRunResponse | null;
  isInvestigating: boolean;
  runInvestigation: () => Promise<void>;

  // Sampling
  samplingRec: SamplingRecommendResponse | null;
  recommendedNode: string | null;
  collectedSamples: Record<string, SamplingExecuteResponse>;
  findBestSample: () => Promise<void>;
  collectSample: (nodeId: string) => Promise<void>;

  // Reveal & Evaluation
  revealResult: RevealResponse | null;
  revealSource: () => Promise<void>;
  teacherView: boolean;
  setTeacherView: (v: boolean) => void;

  // AI Report
  aiReport: AiReportResponse | null;
  aiReportLoading: boolean;
  aiReportError: string | null;
  generateReport: () => Promise<void>;
  aiReportModalOpen: boolean;
  setAiReportModalOpen: (open: boolean) => void;

  // Inspected node
  inspectedNodeId: string | null;
  setInspectedNodeId: (id: string | null) => void;

  // UI Modals & Tour
  startModalOpen: boolean;
  setStartModalOpen: (open: boolean) => void;
  contactModalOpen: boolean;
  setContactModalOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  confirmModal: ConfirmModalState | null;
  openConfirmModal: (conf: Omit<ConfirmModalState, 'isOpen'>) => void;
  closeConfirmModal: () => void;

  // Guided Tour
  tourActive: boolean;
  startTour: () => void;
  endTour: () => void;
  tourStep: number;
  nextTourStep: () => void;

  // Preferences & Tracking
  cookieConsent: 'accepted' | 'declined' | null;
  setCookieConsent: (val: 'accepted' | 'declined') => void;
  introSkipped: boolean;
  setIntroSkipped: (skipped: boolean) => void;
  instructorUnlocked: boolean;
  setInstructorUnlocked: (val: boolean) => void;
  utmParams: Record<string, string>;
  activeSeed: number;
  setActiveSeed: (s: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('jalrakshak_theme') as ThemeMode;
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    if (localStorage.getItem('jalrakshak_cookie_consent') === 'accepted') {
      localStorage.setItem('jalrakshak_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // 2. Cookie & UTM tracking
  const [cookieConsent, setCookieConsentState] = useState<'accepted' | 'declined' | null>(() => {
    return (localStorage.getItem('jalrakshak_cookie_consent') as any) || null;
  });

  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const captured: Record<string, string> = {};
    utmKeys.forEach(k => {
      const v = params.get(k);
      if (v) captured[k] = v;
    });

    if (Object.keys(captured).length > 0) {
      setUtmParams(captured);
      sessionStorage.setItem('jalrakshak_utm', JSON.stringify(captured));
      if (cookieConsent === 'accepted') {
        localStorage.setItem('jalrakshak_utm', JSON.stringify(captured));
      }
    } else {
      const saved = sessionStorage.getItem('jalrakshak_utm') || localStorage.getItem('jalrakshak_utm');
      if (saved) {
        try { setUtmParams(JSON.parse(saved)); } catch {}
      }
    }
  }, [cookieConsent]);

  const setCookieConsent = (val: 'accepted' | 'declined') => {
    setCookieConsentState(val);
    localStorage.setItem('jalrakshak_cookie_consent', val);
    if (val === 'accepted') {
      localStorage.setItem('jalrakshak_theme', theme);
      if (Object.keys(utmParams).length > 0) {
        localStorage.setItem('jalrakshak_utm', JSON.stringify(utmParams));
      }
    } else {
      localStorage.removeItem('jalrakshak_theme');
      localStorage.removeItem('jalrakshak_utm');
    }
  };

  // 3. Intro state
  const [introSkipped, setIntroSkippedState] = useState<boolean>(() => {
    return sessionStorage.getItem('jalrakshak_intro_skipped') === 'true' ||
           localStorage.getItem('jalrakshak_intro_skipped') === 'true';
  });

  const setIntroSkipped = (skipped: boolean) => {
    setIntroSkippedState(skipped);
    sessionStorage.setItem('jalrakshak_intro_skipped', String(skipped));
    if (cookieConsent === 'accepted') {
      localStorage.setItem('jalrakshak_intro_skipped', String(skipped));
    }
  };

  // 4. Network and Simulation Core
  const [network, setNetwork] = useState<NetworkTopologyResponse | null>(null);
  const [simState, setSimState] = useState<SimulationStateResponse | null>(null);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [activeSeed, setActiveSeed] = useState<number>(42);

  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<number | null>(null);

  // Investigation & Sampling
  const [investigation, setInvestigation] = useState<InvestigationRunResponse | null>(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [samplingRec, setSamplingRec] = useState<SamplingRecommendResponse | null>(null);
  const [recommendedNode, setRecommendedNode] = useState<string | null>(null);
  const [collectedSamples, setCollectedSamples] = useState<Record<string, SamplingExecuteResponse>>({});

  // Reveal & Inspection
  const [revealResult, setRevealResult] = useState<RevealResponse | null>(null);
  const [teacherView, setTeacherView] = useState(false);
  const [inspectedNodeId, setInspectedNodeId] = useState<string | null>(null);

  // AI Report
  const [aiReport, setAiReport] = useState<AiReportResponse | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiReportError, setAiReportError] = useState<string | null>(null);
  const [aiReportModalOpen, setAiReportModalOpen] = useState(false);

  // Modals & Tour
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null);
  const [instructorUnlocked, setInstructorUnlocked] = useState(false);

  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const openConfirmModal = (conf: Omit<ConfirmModalState, 'isOpen'>) => {
    setConfirmModal({ ...conf, isOpen: true });
  };
  const closeConfirmModal = () => setConfirmModal(null);

  const startTour = () => {
    setTourActive(true);
    setTourStep(0);
  };
  const endTour = () => setTourActive(false);
  const nextTourStep = () => setTourStep(s => s + 1);

  // Load initial network and simulation state
  const fetchInitialData = useCallback(async () => {
    setIsLoadingNetwork(true);
    setBackendError(null);
    try {
      const net = await api.getNetwork();
      setNetwork(net);
      const state = await api.getSimulationState();
      setSimState(state);
    } catch (err: any) {
      setBackendError(err.message || 'Cannot connect to backend server on http://127.0.0.1:8000');
    } finally {
      setIsLoadingNetwork(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Simulation controls
  const initSimulation = async (seed = 42, sourceType = 'random') => {
    setActiveSeed(seed);
    setIsPlaying(false);
    setInvestigation(null);
    setSamplingRec(null);
    setRecommendedNode(null);
    setCollectedSamples({});
    setRevealResult(null);
    setTeacherView(false);
    setAiReport(null);

    try {
      await api.initSimulation(seed, sourceType);
      const state = await api.getSimulationState();
      setSimState(state);
    } catch (err: any) {
      setBackendError(err.message);
    }
  };

  const advanceSimulation = async (steps = 1) => {
    try {
      const updated = await api.advanceSimulation(steps);
      setSimState(updated);
    } catch (err: any) {
      setBackendError(err.message);
    }
  };

  const stepForward = () => {
    advanceSimulation(1);
    if (tourActive && tourStep === 1) nextTourStep();
  };

  const togglePlay = () => {
    setIsPlaying(p => !p);
  };

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = window.setInterval(async () => {
        try {
          const updated = await api.advanceSimulation(1);
          setSimState(updated);
          if (updated.current_step >= updated.total_steps) {
            setIsPlaying(false);
          }
        } catch {
          setIsPlaying(false);
        }
      }, 1200);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  const resetSimulation = async () => {
    setIsPlaying(false);
    try {
      await api.resetSimulation();
      setInvestigation(null);
      setSamplingRec(null);
      setRecommendedNode(null);
      setCollectedSamples({});
      setRevealResult(null);
      setTeacherView(false);
      setAiReport(null);
      const state = await api.getSimulationState();
      setSimState(state);
    } catch (err: any) {
      setBackendError(err.message);
    }
  };

  // Investigation & Sampling
  const runInvestigation = async () => {
    setIsInvestigating(true);
    try {
      const res = await api.runInvestigation();
      setInvestigation(res);
      if (tourActive && tourStep === 2) nextTourStep();
    } catch (err: any) {
      setBackendError(err.message);
    } finally {
      setIsInvestigating(false);
    }
  };

  const findBestSample = async () => {
    try {
      const rec = await api.recommendSampling();
      setSamplingRec(rec);
      if (rec.recommended_node) {
        setRecommendedNode(rec.recommended_node.node_id);
        setInspectedNodeId(rec.recommended_node.node_id);
      }
    } catch (err: any) {
      setBackendError(err.message);
    }
  };

  const collectSample = async (nodeId: string) => {
    try {
      const res = await api.executeSampling(nodeId);
      setCollectedSamples(prev => ({ ...prev, [nodeId]: res }));
      const state = await api.getSimulationState();
      setSimState(state);
      // Automatically re-run inference with new sample evidence
      const invRes = await api.runInvestigation();
      setInvestigation(invRes);
      // Refresh recommendations
      const recRes = await api.recommendSampling();
      setSamplingRec(recRes);
      setRecommendedNode(recRes.recommended_node?.node_id || null);
      if (tourActive && tourStep === 3) nextTourStep();
    } catch (err: any) {
      setBackendError(err.message);
    }
  };

  const revealSource = async () => {
    try {
      const res = await api.revealInvestigation();
      setRevealResult(res);
      setTeacherView(true);
      setInspectedNodeId(res.true_source);
      if (tourActive && tourStep === 5) nextTourStep();
    } catch (err: any) {
      setBackendError(err.message);
    }
  };

  const generateReport = async () => {
    setAiReportLoading(true);
    setAiReportError(null);
    setAiReportModalOpen(true);
    try {
      const res = await api.generateAiReport();
      setAiReport(res);
      if (tourActive && tourStep === 4) nextTourStep();
    } catch (err: any) {
      setAiReportError(err.message || 'Error generating incident report.');
    } finally {
      setAiReportLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        network,
        simState,
        isLoadingNetwork,
        backendError,
        initSimulation,
        advanceSimulation,
        resetSimulation,
        isPlaying,
        togglePlay,
        stepForward,
        investigation,
        isInvestigating,
        runInvestigation,
        samplingRec,
        recommendedNode,
        collectedSamples,
        findBestSample,
        collectSample,
        revealResult,
        revealSource,
        teacherView,
        setTeacherView,
        aiReport,
        aiReportLoading,
        aiReportError,
        generateReport,
        aiReportModalOpen,
        setAiReportModalOpen,
        inspectedNodeId,
        setInspectedNodeId,
        startModalOpen,
        setStartModalOpen,
        contactModalOpen,
        setContactModalOpen,
        searchOpen,
        setSearchOpen,
        confirmModal,
        openConfirmModal,
        closeConfirmModal,
        tourActive,
        startTour,
        endTour,
        tourStep,
        nextTourStep,
        cookieConsent,
        setCookieConsent,
        introSkipped,
        setIntroSkipped,
        instructorUnlocked,
        setInstructorUnlocked,
        utmParams,
        activeSeed,
        setActiveSeed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
