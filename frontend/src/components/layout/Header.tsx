import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Droplet, Search, Sun, Moon, Menu, X, ChevronDown, Cpu } from 'lucide-react';
import { useApp } from '../../state/appStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme, setSearchOpen, aiStatus } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isCommandCenter = location.pathname === '/command-center' || location.pathname === '/investigate';

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

  const isMoreActive = location.pathname === '/about' || location.pathname === '/contact';

  const modelName = aiStatus?.model_name || 'gemma4:e2b';
  const isAiOnline = Boolean(aiStatus?.ollama_reachable && aiStatus?.model_available);

  return (
    <>
      {/* Skip to Content accessible link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#425B9A] focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
          theme === 'dark'
            ? 'bg-[#0E1733]/92 border-[#425B9A]/30 text-[#EAF1F8]'
            : 'bg-[#F3F6FA]/95 border-[#425B9A]/20 text-[#121D38]'
        } py-2 px-4 sm:px-6`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-[#76C0EC] rounded-lg p-1"
          >
            <div className="w-7 h-7 rounded-lg bg-[#425B9A] flex items-center justify-center text-[#76C0EC] group-hover:bg-[#4f6cb6] transition-colors border border-[#76C0EC]/40 shadow-sm">
              <Droplet size={15} fill="#76C0EC" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base leading-tight tracking-tight text-[#EAF1F8] dark:text-[#EAF1F8] light:text-[#121D38]">
                JALRAKSHAK <span className="text-[#76C0EC] text-xs font-sans font-semibold tracking-normal">AI</span>
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs" aria-label="Main Navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#425B9A]/30 text-[#76C0EC] font-semibold border border-[#76C0EC]/30'
                    : 'text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1E2F62]/50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/command-center"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive || isCommandCenter
                    ? 'bg-[#425B9A]/30 text-[#76C0EC] font-semibold border border-[#76C0EC]/30'
                    : 'text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1E2F62]/50'
                }`
              }
            >
              Investigate
            </NavLink>
            <NavLink
              to="/learn"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#425B9A]/30 text-[#76C0EC] font-semibold border border-[#76C0EC]/30'
                    : 'text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1E2F62]/50'
                }`
              }
            >
              Learn
            </NavLink>
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#425B9A]/30 text-[#76C0EC] font-semibold border border-[#76C0EC]/30'
                    : 'text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1E2F62]/50'
                }`
              }
            >
              FAQ
            </NavLink>

            {/* "More" Menu Dropdown (About, Contact) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isMoreActive
                    ? 'bg-[#425B9A]/30 text-[#76C0EC] font-semibold border border-[#76C0EC]/30'
                    : 'text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1E2F62]/50'
                }`}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
              >
                <span>More</span>
                <ChevronDown size={13} className={`transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-[#152248] border border-[#425B9A]/40 rounded-lg shadow-xl py-1 z-50 text-xs">
                  <NavLink
                    to="/about"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 transition-colors ${
                        isActive ? 'text-[#76C0EC] font-semibold bg-[#425B9A]/30' : 'text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1E2F62]'
                      }`
                    }
                  >
                    About
                  </NavLink>
                  <NavLink
                    to="/contact"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 transition-colors ${
                        isActive ? 'text-[#76C0EC] font-semibold bg-[#425B9A]/30' : 'text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1E2F62]'
                      }`
                    }
                  >
                    Contact
                  </NavLink>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Tools & AI Model Status Chip */}
          <div className="flex items-center gap-2">
            {/* Real Open-weight AI Status Chip */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#152248] border border-[#425B9A]/35 text-[11px] font-mono"
              title={aiStatus?.message || `Configured model: ${modelName} (runs locally)`}
            >
              <Cpu size={12} className="text-[#76C0EC]" />
              <span className="text-[#9FB0C9]">AI:</span>
              <span className="text-[#EAF1F8] font-semibold">{modelName}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isAiOnline ? 'bg-[#91AC67] shadow-[0_0_6px_#91AC67]' : 'bg-[#E8A33D]'
                }`}
                aria-label={isAiOnline ? 'Model online' : 'Rule-based fallback active'}
              />
            </div>

            {/* Search shortcut */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border border-[#425B9A]/30 bg-[#152248] text-[#9FB0C9] hover:text-[#76C0EC] hover:border-[#76C0EC]/40 transition-colors"
              aria-label="Search site"
              title="Search (Ctrl+K)"
            >
              <Search size={13} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden xl:inline px-1 py-0.2 text-[9px] bg-[#1E2F62] rounded border border-[#425B9A]/40 text-[#9FB0C9]">
                Ctrl+K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[#425B9A]/30 bg-[#152248] text-[#9FB0C9] hover:text-[#76C0EC] transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-1.5 rounded-lg border border-[#425B9A]/40 bg-[#152248] text-[#EAF1F8]"
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
          className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 h-full w-72 bg-[#152248] border-l border-[#425B9A]/40 p-5 flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#425B9A]/30 mb-4">
                <span className="font-serif font-bold text-base text-[#EAF1F8]">JALRAKSHAK AI</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#9FB0C9] hover:text-[#76C0EC]"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile AI status badge */}
              <div className="mb-4 p-2.5 rounded-lg bg-[#0E1733] border border-[#425B9A]/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#9FB0C9]">
                  <Cpu size={13} className="text-[#76C0EC]" />
                  <span>Open-weight AI:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-[#EAF1F8]">{modelName}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${isAiOnline ? 'bg-[#91AC67]' : 'bg-[#E8A33D]'}`}
                  />
                </div>
              </div>

              <nav className="flex flex-col gap-1.5 text-sm">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? 'bg-[#425B9A]/30 text-[#76C0EC]' : 'text-[#9FB0C9] hover:text-[#EAF1F8]'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/command-center"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive || isCommandCenter ? 'bg-[#425B9A]/30 text-[#76C0EC]' : 'text-[#9FB0C9] hover:text-[#EAF1F8]'
                    }`
                  }
                >
                  Investigate
                </NavLink>
                <NavLink
                  to="/learn"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? 'bg-[#425B9A]/30 text-[#76C0EC]' : 'text-[#9FB0C9] hover:text-[#EAF1F8]'
                    }`
                  }
                >
                  Learn
                </NavLink>
                <NavLink
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? 'bg-[#425B9A]/30 text-[#76C0EC]' : 'text-[#9FB0C9] hover:text-[#EAF1F8]'
                    }`
                  }
                >
                  FAQ
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? 'bg-[#425B9A]/30 text-[#76C0EC]' : 'text-[#9FB0C9] hover:text-[#EAF1F8]'
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? 'bg-[#425B9A]/30 text-[#76C0EC]' : 'text-[#9FB0C9] hover:text-[#EAF1F8]'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </nav>
            </div>

            <div className="pt-3 border-t border-[#425B9A]/30 text-center text-xs text-[#9FB0C9]">
              Simplified educational simulation.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
