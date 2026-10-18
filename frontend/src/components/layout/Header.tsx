import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Droplet, Search, Sun, Moon, Menu, X, ChevronDown, Cpu, Activity, Compass } from 'lucide-react';
import { useApp } from '../../state/appStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme, setSearchOpen, aiStatus, simState } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isCommandCenter = location.pathname.startsWith('/command-center');
  const isIncident = simState?.status === 'INCIDENT' || simState?.status === 'WARNING';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMoreActive = ['/learn', '/faq', '/about', '/contact'].includes(location.pathname);

  const modelName = aiStatus?.model_name || 'gemma4:e2b';
  const isAiOnline = Boolean(aiStatus?.ollama_reachable && aiStatus?.model_available);

  return (
    <>
      {/* Skip to Content accessible link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#24B1B1] focus:text-[#086288] focus:rounded-lg focus:shadow-lg font-bold"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
          theme === 'dark'
            ? 'bg-[#086288]/90 border-[#24B1B1]/20 text-[#95BDD7]'
            : 'bg-[#F3F7FA]/95 border-[#007979]/15 text-[#086288]'
        } py-2.5 px-4 sm:px-6`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-[#24B1B1] rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-[#007979] border border-[#24B1B1]/40 flex items-center justify-center text-[#24B1B1] group-hover:border-[#24B1B1] group-hover:shadow-[0_0_12px_rgba(36,177,177,0.4)] transition-all">
              <Droplet size={17} className="fill-[#24B1B1]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base leading-tight tracking-tight text-current flex items-center gap-1.5">
                JALRAKSHAK <span className="text-[#24B1B1] text-xs font-mono font-semibold px-1 py-0.2 rounded bg-[#24B1B1]/10 border border-[#24B1B1]/30">AI</span>
              </span>
              <span className="text-[10px] font-mono text-[#95BDD7] tracking-wider uppercase">
                Water Intelligence Platform
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs" aria-label="Main Navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#24B1B1]/15 text-[#24B1B1] border border-[#24B1B1]/40 font-semibold'
                    : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/command-center"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  isActive || isCommandCenter
                    ? 'bg-[#24B1B1]/15 text-[#24B1B1] border border-[#24B1B1]/40 font-semibold shadow-sm'
                    : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                }`
              }
            >
              <span>Command Center</span>
              {isIncident && (
                <span className="w-2 h-2 rounded-full bg-[#D9D28B] animate-ping" />
              )}
            </NavLink>
            <NavLink
              to="/network"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#24B1B1]/15 text-[#24B1B1] border border-[#24B1B1]/40 font-semibold'
                    : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                }`
              }
            >
              Network Explorer
            </NavLink>
            <NavLink
              to="/simulation"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#24B1B1]/15 text-[#24B1B1] border border-[#24B1B1]/40 font-semibold'
                    : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                }`
              }
            >
              Simulation
            </NavLink>
            <NavLink
              to="/investigation"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#24B1B1]/15 text-[#24B1B1] border border-[#24B1B1]/40 font-semibold'
                    : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                }`
              }
            >
              Source Localization
            </NavLink>
            <NavLink
              to="/ai-briefing"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#24B1B1]/15 text-[#24B1B1] border border-[#24B1B1]/40 font-semibold'
                    : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                }`
              }
            >
              AI Briefing
            </NavLink>
            <NavLink
              to="/evaluation"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#24B1B1]/15 text-[#24B1B1] border border-[#24B1B1]/40 font-semibold'
                    : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                }`
              }
            >
              Evaluation Lab
            </NavLink>

            {/* "More" Menu Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isMoreActive
                    ? 'bg-[#24B1B1]/15 text-[#24B1B1] border border-[#24B1B1]/40 font-semibold'
                    : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                }`}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
              >
                <span>Docs & About</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-[#007979] border border-[#24B1B1]/30 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-fadeIn">
                  <NavLink
                    to="/learn"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 transition-colors ${
                        isActive ? 'text-[#24B1B1] font-semibold bg-[#007979]' : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                      }`
                    }
                  >
                    <Compass size={13} className="text-[#24B1B1]" />
                    <span>Learning Center</span>
                  </NavLink>
                  <NavLink
                    to="/faq"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 transition-colors ${
                        isActive ? 'text-[#24B1B1] font-semibold bg-[#007979]' : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                      }`
                    }
                  >
                    <Activity size={13} className="text-[#D9D28B]" />
                    <span>FAQ & Architecture</span>
                  </NavLink>
                  <div className="my-1 border-t border-[#24B1B1]/15" />
                  <NavLink
                    to="/about"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 transition-colors ${
                        isActive ? 'text-[#24B1B1] font-semibold bg-[#007979]' : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                      }`
                    }
                  >
                    About Project
                  </NavLink>
                  <NavLink
                    to="/contact"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 transition-colors ${
                        isActive ? 'text-[#24B1B1] font-semibold bg-[#007979]' : 'text-[#95BDD7] hover:text-[#95BDD7] hover:bg-[#007979]'
                      }`
                    }
                  >
                    Contact & Advisory
                  </NavLink>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Tools & AI Model Status Chip */}
          <div className="flex items-center gap-2.5">
            {/* Real Open-weight AI Status Chip */}
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#007979] border border-[#24B1B1]/25 text-[11px] font-mono text-[#95BDD7]"
              title={aiStatus?.message || `Configured model: ${modelName} (runs locally)`}
            >
              <Cpu size={12} className="text-[#24B1B1]" />
              <span className="text-[#95BDD7]">AI:</span>
              <span className="text-[#95BDD7] font-semibold">{modelName}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isAiOnline ? 'bg-[#D9D28B] shadow-[0_0_6px_#D9D28B]' : 'bg-[#D9D28B]'
                }`}
                aria-label={isAiOnline ? 'Model online' : 'Rule-based fallback active'}
              />
            </div>

            {/* Quick Launch CTA if on landing page */}
            {location.pathname === '/' && (
              <button
                onClick={() => navigate('/command-center')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#24B1B1] hover:bg-[#24B1B1]/90 text-[#086288] font-bold text-xs shadow-[0_0_15px_rgba(36,177,177,0.4)] transition-all hover:scale-105"
              >
                Launch Console
              </button>
            )}

            {/* Search shortcut */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border border-[#24B1B1]/25 bg-[#007979] text-[#95BDD7] hover:text-[#95BDD7] hover:border-[#24B1B1]/50 transition-colors"
              aria-label="Search site"
              title="Search (Ctrl+K)"
            >
              <Search size={13} className="text-[#24B1B1]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden xl:inline px-1 py-0.2 text-[9px] bg-[#007979] rounded border border-[#24B1B1]/20 text-[#95BDD7]">
                Ctrl+K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[#24B1B1]/25 bg-[#007979] text-[#95BDD7] hover:text-[#24B1B1] transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-1.5 rounded-lg border border-[#24B1B1]/30 bg-[#007979] text-[#95BDD7]"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-0 z-50 lg:hidden bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 h-full w-72 bg-[#007979] border-l border-[#24B1B1]/30 p-5 flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#24B1B1]/20 mb-4">
                <span className="font-heading font-bold text-base text-[#95BDD7]">JALRAKSHAK AI</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#95BDD7] hover:text-[#95BDD7]"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile AI status badge */}
              <div className="mb-4 p-2.5 rounded-lg bg-[#086288] border border-[#24B1B1]/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#95BDD7]">
                  <Cpu size={13} className="text-[#24B1B1]" />
                  <span>Inference Engine:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-[#95BDD7]">{modelName}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${isAiOnline ? 'bg-[#D9D28B]' : 'bg-[#D9D28B]'}`}
                  />
                </div>
              </div>

              <nav className="flex flex-col gap-1 text-sm font-medium">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#24B1B1]/15 text-[#24B1B1]' : 'text-[#95BDD7] hover:text-[#95BDD7]'
                    }`
                  }
                >
                  Overview
                </NavLink>
                <NavLink
                  to="/command-center"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#24B1B1]/15 text-[#24B1B1]' : 'text-[#95BDD7] hover:text-[#95BDD7]'
                    }`
                  }
                >
                  Command Center
                </NavLink>
                <NavLink
                  to="/network"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#24B1B1]/15 text-[#24B1B1]' : 'text-[#95BDD7] hover:text-[#95BDD7]'
                    }`
                  }
                >
                  Network Explorer
                </NavLink>
                <NavLink
                  to="/simulation"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#24B1B1]/15 text-[#24B1B1]' : 'text-[#95BDD7] hover:text-[#95BDD7]'
                    }`
                  }
                >
                  Simulation
                </NavLink>
                <NavLink
                  to="/investigation"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#24B1B1]/15 text-[#24B1B1]' : 'text-[#95BDD7] hover:text-[#95BDD7]'
                    }`
                  }
                >
                  Source Localization
                </NavLink>
                <NavLink
                  to="/ai-briefing"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#24B1B1]/15 text-[#24B1B1]' : 'text-[#95BDD7] hover:text-[#95BDD7]'
                    }`
                  }
                >
                  AI Briefing
                </NavLink>
                <NavLink
                  to="/evaluation"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#24B1B1]/15 text-[#24B1B1]' : 'text-[#95BDD7] hover:text-[#95BDD7]'
                    }`
                  }
                >
                  Evaluation Lab
                </NavLink>
                <div className="my-1 border-t border-[#24B1B1]/15" />
                <NavLink
                  to="/learn"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#24B1B1]/15 text-[#24B1B1]' : 'text-[#95BDD7] hover:text-[#95BDD7]'
                    }`
                  }
                >
                  Learning Center
                </NavLink>
                <NavLink
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#24B1B1]/15 text-[#24B1B1]' : 'text-[#95BDD7] hover:text-[#95BDD7]'
                    }`
                  }
                >
                  FAQ & Tech Specs
                </NavLink>
              </nav>
            </div>

            <div className="pt-3 border-t border-[#24B1B1]/20 text-center text-xs text-[#95BDD7]">
              NASA Mission Control × Water Intelligence Platform
            </div>
          </div>
        </div>
      )}
    </>
  );
};
