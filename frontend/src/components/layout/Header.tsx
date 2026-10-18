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
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#3368A0] focus:text-[#F2EFE7] focus:rounded-lg focus:shadow-lg font-bold"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
          theme === 'dark'
            ? 'bg-[#0F1E2E]/95 border-[#3368A0]/30 text-[#F2EFE7]'
            : 'bg-[#F2EFE7]/95 border-[#3368A0]/20 text-[#0F1E2E]'
        } py-2 px-4 sm:px-6`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-[#66A3BF] rounded-lg p-1"
          >
            <div className="w-7 h-7 rounded-lg bg-[#3368A0] flex items-center justify-center text-[#F2EFE7] group-hover:bg-[#285380] transition-colors border border-[#66A3BF]/50 shadow-sm">
              <Droplet size={15} fill="#C8DFDB" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base leading-tight tracking-tight text-current">
                JALRAKSHAK <span className="text-[#66A3BF] text-xs font-sans font-semibold tracking-normal">AI</span>
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
                    ? 'bg-[#3368A0] text-[#F2EFE7] font-semibold shadow-sm'
                    : 'text-[#66A3BF] hover:text-current hover:bg-[#3368A0]/15'
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
                    ? 'bg-[#3368A0] text-[#F2EFE7] font-semibold shadow-sm'
                    : 'text-[#66A3BF] hover:text-current hover:bg-[#3368A0]/15'
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
                    ? 'bg-[#3368A0] text-[#F2EFE7] font-semibold shadow-sm'
                    : 'text-[#66A3BF] hover:text-current hover:bg-[#3368A0]/15'
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
                    ? 'bg-[#3368A0] text-[#F2EFE7] font-semibold shadow-sm'
                    : 'text-[#66A3BF] hover:text-current hover:bg-[#3368A0]/15'
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
                    ? 'bg-[#3368A0] text-[#F2EFE7] font-semibold shadow-sm'
                    : 'text-[#66A3BF] hover:text-current hover:bg-[#3368A0]/15'
                }`}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
              >
                <span>More</span>
                <ChevronDown size={13} className={`transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-[#162C42] border border-[#3368A0]/40 rounded-lg shadow-xl py-1 z-50 text-xs">
                  <NavLink
                    to="/about"
                    onClick={() => setMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 transition-colors ${
                        isActive ? 'text-[#F2EFE7] font-semibold bg-[#3368A0]' : 'text-[#C8DFDB] hover:text-[#F2EFE7] hover:bg-[#1E3B57]'
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
                        isActive ? 'text-[#F2EFE7] font-semibold bg-[#3368A0]' : 'text-[#C8DFDB] hover:text-[#F2EFE7] hover:bg-[#1E3B57]'
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
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#162C42] border border-[#3368A0]/40 text-[11px] font-mono text-[#F2EFE7]"
              title={aiStatus?.message || `Configured model: ${modelName} (runs locally)`}
            >
              <Cpu size={12} className="text-[#66A3BF]" />
              <span className="text-[#C8DFDB]">AI:</span>
              <span className="text-[#F2EFE7] font-semibold">{modelName}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isAiOnline ? 'bg-[#C8DFDB] shadow-[0_0_6px_#C8DFDB]' : 'bg-[#FDF4AF]'
                }`}
                aria-label={isAiOnline ? 'Model online' : 'Rule-based fallback active'}
              />
            </div>

            {/* Search shortcut */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border border-[#3368A0]/40 bg-[#162C42] text-[#C8DFDB] hover:text-[#F2EFE7] hover:border-[#66A3BF] transition-colors"
              aria-label="Search site"
              title="Search (Ctrl+K)"
            >
              <Search size={13} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden xl:inline px-1 py-0.2 text-[9px] bg-[#1E3B57] rounded border border-[#3368A0]/40 text-[#C8DFDB]">
                Ctrl+K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[#3368A0]/40 bg-[#162C42] text-[#C8DFDB] hover:text-[#F2EFE7] transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-1.5 rounded-lg border border-[#3368A0]/40 bg-[#162C42] text-[#F2EFE7]"
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
            className="fixed top-0 right-0 h-full w-72 bg-[#162C42] border-l border-[#3368A0]/40 p-5 flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#3368A0]/40 mb-4">
                <span className="font-serif font-bold text-base text-[#F2EFE7]">JALRAKSHAK AI</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#C8DFDB] hover:text-[#F2EFE7]"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile AI status badge */}
              <div className="mb-4 p-2.5 rounded-lg bg-[#0F1E2E] border border-[#3368A0]/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#C8DFDB]">
                  <Cpu size={13} className="text-[#66A3BF]" />
                  <span>Open-weight AI:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-[#F2EFE7]">{modelName}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${isAiOnline ? 'bg-[#C8DFDB]' : 'bg-[#FDF4AF]'}`}
                  />
                </div>
              </div>

              <nav className="flex flex-col gap-1.5 text-sm">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? 'bg-[#3368A0] text-[#F2EFE7]' : 'text-[#C8DFDB] hover:text-[#F2EFE7]'
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
                      isActive || isCommandCenter ? 'bg-[#3368A0] text-[#F2EFE7]' : 'text-[#C8DFDB] hover:text-[#F2EFE7]'
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
                      isActive ? 'bg-[#3368A0] text-[#F2EFE7]' : 'text-[#C8DFDB] hover:text-[#F2EFE7]'
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
                      isActive ? 'bg-[#3368A0] text-[#F2EFE7]' : 'text-[#C8DFDB] hover:text-[#F2EFE7]'
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
                      isActive ? 'bg-[#3368A0] text-[#F2EFE7]' : 'text-[#C8DFDB] hover:text-[#F2EFE7]'
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
                      isActive ? 'bg-[#3368A0] text-[#F2EFE7]' : 'text-[#C8DFDB] hover:text-[#F2EFE7]'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </nav>
            </div>

            <div className="pt-3 border-t border-[#3368A0]/30 text-center text-xs text-[#C8DFDB]">
              Simplified educational simulation.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
