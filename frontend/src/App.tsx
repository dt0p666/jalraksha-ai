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
import { Learn } from './pages/Learn';
import { Faq } from './pages/Faq';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      <BrowserRouter>
        {/* Sick Opening Splash Animation inspired by SweetTape */}
        {showSplash && <SplashIntro onComplete={() => setShowSplash(false)} />}

        <div className="min-h-screen flex flex-col bg-[#081416] text-[#EAF7F5] selection:bg-[#A5E9DD]/30 selection:text-white transition-colors">
          <ScrollProgressBar />
          <Header />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/command-center" element={<CommandCenter />} />
              <Route path="/investigate" element={<Navigate to="/command-center" replace />} />
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
