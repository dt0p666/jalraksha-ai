import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './state/appStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/layout/CookieBanner';
import { ScrollProgressBar } from './components/layout/ScrollProgressBar';
import { BackToTop } from './components/layout/BackToTop';
import { FloatingContactButton } from './components/layout/FloatingContactButton';
import { SiteSearchModal } from './components/layout/SiteSearchModal';
import { ContactModal } from './components/layout/ContactModal';
import { SplashIntro } from './components/intro/SplashIntro';

import { Home } from './pages/Home';
import { CommandCenter } from './pages/CommandCenter';
import { NetworkExplorer } from './pages/NetworkExplorer';
import { SimulationPage } from './pages/SimulationPage';
import { InvestigationPage } from './pages/InvestigationPage';
import { AiBriefingPage } from './pages/AiBriefingPage';
import { EvaluationLabPage } from './pages/EvaluationLabPage';
import { Learn } from './pages/Learn';
import { Faq } from './pages/Faq';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      <BrowserRouter>
        {/* Cinematic Opening Splash Animation */}
        {showSplash && <SplashIntro onComplete={() => setShowSplash(false)} />}

        <div className="min-h-screen flex flex-col bg-[#071018] text-[#EAF4F7] selection:bg-[#38D9E6]/30 selection:text-white transition-colors">
          <ScrollProgressBar />
          <Header />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/command-center" element={<CommandCenter />} />
              <Route path="/network" element={<NetworkExplorer />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/investigation" element={<InvestigationPage />} />
              <Route path="/investigate" element={<Navigate to="/investigation" replace />} />
              <Route path="/ai-briefing" element={<AiBriefingPage />} />
              <Route path="/evaluation" element={<EvaluationLabPage />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />
          <CookieBanner />
          <BackToTop />
          <FloatingContactButton />
          <SiteSearchModal />
          <ContactModal />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
