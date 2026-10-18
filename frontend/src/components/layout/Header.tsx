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
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#34908B] focus:text-[#081416] focus:rounded-lg focus:shadow-lg font-bold"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
          theme === 'dark'
            ? 'bg-[#081416]/95 border-[#6FBEB2]/30 text-[#EAF7F5]'
            : 'bg-[#F6FBF9]/95 border-[#34908B]/20 text-[#081416]'
        } py-2 px-4 sm:px-6`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-[#A5E9DD] rounded-lg p-1"
          >
            <div className="w-7 h-7 rounded-lg bg-[#34908B] flex items-center justify-center text-[#FDF4AF] group-hover:bg-[#2c7d78] transition-colors border border-[#A5E9DD]/50 shadow-sm">
              <Droplet size={15} fill="#A5E9DD" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base leading-tight tracking-tight text-current">
                JALRAKSHAK <span className="text-[#A5E9DD] text-xs font-sans font-semibold tracking-normal">AI</span>
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
                    ? 'bg-[#34908B] text-[#EAF7F5] font-semibold shadow-sm'
                    : 'text-[#A5E9DD] hover:text-[#EAF7F5] hover:bg-[#34908B]/20'
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
                    ? 'bg-[#34908B] text-[#EAF7F5] font-semibold shadow-sm'
                    : 'text-[#A5E9DD] hover:text-[#EAF7F5] hover:bg-[#34908B]/20'
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
                    ? 'bg-[#34908B] text-[#EAF7F5] font-semibold shadow-sm'
                    : 'text-[#A5E9DD] hover:text-[#EAF7F5] hover:bg-[#34908B]/20'
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
                    ? 'bg-[#34908B] text-[#EAF7F5] font-semibold shadow-sm'
                    : 'text-[#A5E9DD] hover:text-[#EAF7F5] hover:bg-[#34908B]/20'
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
                    ? 'bg-[#34908B] text-[#EAF7F5] font-semibold shadow-sm'
                    : 'text-[#A5E9DD] hover:text-[#EAF7F5] hover:bg-[#34908B]/20'
                }`}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
              >
                <span>More</span>
                <ChevronDown size={13} className={`transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-[#0F2226] border border-[#6FBEB2]/40 rounded-lg shadow-xl py-1 z-50 text-xs">
                  <NavLink
                    to="/about"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 transition-colors ${
                        isActive ? 'text-[#EAF7F5] font-semibold bg-[#34908B]' : 'text-[#A5E9DD] hover:text-[#EAF7F5] hover:bg-[#163238]'
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
                        isActive ? 'text-[#EAF7F5] font-semibold bg-[#34908B]' : 'text-[#A5E9DD] hover:text-[#EAF7F5] hover:bg-[#163238]'
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
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F2226] border border-[#6FBEB2]/40 text-[11px] font-mono text-[#EAF7F5]"
              title={aiStatus?.message || `Configured model: ${modelName} (runs locally)`}
            >
              <Cpu size={12} className="text-[#A5E9DD]" />
              <span className="text-[#6FBEB2]">AI:</span>
              <span className="text-[#EAF7F5] font-semibold">{modelName}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isAiOnline ? 'bg-[#A5E9DD] shadow-[0_0_6px_#A5E9DD]' : 'bg-[#FDF4AF]'
                }`}
                aria-label={isAiOnline ? 'Model online' : 'Rule-based fallback active'}
              />
            </div>

            {/* Search shortcut */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border border-[#6FBEB2]/30 bg-[#0F2226] text-[#A5E9DD] hover:text-[#EAF7F5] hover:border-[#A5E9DD] transition-colors"
              aria-label="Search site"
              title="Search (Ctrl+K)"
            >
              <Search size={13} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden xl:inline px-1 py-0.2 text-[9px] bg-[#163238] rounded border border-[#6FBEB2]/30 text-[#A5E9DD]">
                Ctrl+K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[#6FBEB2]/30 bg-[#0F2226] text-[#A5E9DD] hover:text-[#EAF7F5] transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-1.5 rounded-lg border border-[#6FBEB2]/40 bg-[#0F2226] text-[#EAF7F5]"
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
            className="fixed top-0 right-0 h-full w-72 bg-[#0F2226] border-l border-[#6FBEB2]/40 p-5 flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#6FBEB2]/30 mb-4">
                <span className="font-serif font-bold text-base text-[#EAF7F5]">JALRAKSHAK AI</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#A5E9DD] hover:text-[#EAF7F5]"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile AI status badge */}
              <div className="mb-4 p-2.5 rounded-lg bg-[#081416] border border-[#6FBEB2]/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#6FBEB2]">
                  <Cpu size={13} className="text-[#A5E9DD]" />
                  <span>Open-weight AI:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-[#EAF7F5]">{modelName}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${isAiOnline ? 'bg-[#A5E9DD]' : 'bg-[#FDF4AF]'}`}
                  />
                </div>
              </div>

              <nav className="flex flex-col gap-1.5 text-sm">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? 'bg-[#34908B] text-[#EAF7F5]' : 'text-[#A5E9DD] hover:text-[#EAF7F5]'
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
                      isActive || isCommandCenter ? 'bg-[#34908B] text-[#EAF7F5]' : 'text-[#A5E9DD] hover:text-[#EAF7F5]'
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
                      isActive ? 'bg-[#34908B] text-[#EAF7F5]' : 'text-[#A5E9DD] hover:text-[#EAF7F5]'
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
                      isActive ? 'bg-[#34908B] text-[#EAF7F5]' : 'text-[#A5E9DD] hover:text-[#EAF7F5]'
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
                      isActive ? 'bg-[#34908B] text-[#EAF7F5]' : 'text-[#A5E9DD] hover:text-[#EAF7F5]'
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
                      isActive ? 'bg-[#34908B] text-[#EAF7F5]' : 'text-[#A5E9DD] hover:text-[#EAF7F5]'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </nav>
            </div>

            <div className="pt-3 border-t border-[#6FBEB2]/30 text-center text-xs text-[#A5E9DD]">
              Simplified educational simulation.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
