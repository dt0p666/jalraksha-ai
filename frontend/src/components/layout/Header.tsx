import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Droplet, Search, Sun, Moon, Menu, X, Play } from 'lucide-react';
import { useApp } from '../../state/appStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme, setSearchOpen, setStartModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCommandCenter = location.pathname === '/command-center';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/command-center', label: 'Command Center' },
    { to: '/learn', label: 'Learn' },
    { to: '/faq', label: 'FAQ' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleStartClick = () => {
    if (location.pathname !== '/command-center') {
      navigate('/command-center');
    }
    setStartModalOpen(true);
  };

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
            ? 'bg-[#0D1630]/90 border-[#425B9A]/30 text-[#EAF1F8]'
            : 'bg-[#F3F7FB]/95 border-[#425B9A]/20 text-[#14203F]'
        } ${isCommandCenter ? 'py-2 px-4 sm:px-6' : 'py-3 px-4 sm:px-8'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-[#76C0EC] rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-[#425B9A] flex items-center justify-center text-[#76C0EC] group-hover:bg-[#4f6cb6] transition-colors border border-[#76C0EC]/40 shadow-sm">
              <Droplet size={18} fill="#76C0EC" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-tight tracking-tight text-[#EAF1F8] dark:text-[#EAF1F8] light:text-[#14203F]">
                JALRAKSHAK <span className="text-[#76C0EC] text-sm font-sans font-semibold tracking-normal">AI</span>
              </span>
              {!isCommandCenter && (
                <span className="text-[11px] font-sans text-[#9FB0C9] hidden sm:inline leading-none">
                  Detect • Trace • Protect
                </span>
              )}
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#425B9A]/30 text-[#76C0EC] font-semibold border border-[#76C0EC]/30'
                      : 'text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1D2A52]/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right action tools */}
          <div className="flex items-center gap-2.5">
            {/* Search shortcut */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#425B9A]/30 bg-[#141E3D] text-[#9FB0C9] hover:text-[#76C0EC] hover:border-[#76C0EC]/40 transition-colors"
              aria-label="Search site"
              title="Search (Ctrl+K)"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline px-1 py-0.5 text-[10px] bg-[#1D2A52] rounded border border-[#425B9A]/40 text-[#9FB0C9]">
                Ctrl+K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[#425B9A]/30 bg-[#141E3D] text-[#9FB0C9] hover:text-[#76C0EC] transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'daylight' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={handleStartClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-[#425B9A] text-white hover:bg-[#4f6cb6] border border-[#76C0EC]/50 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play size={14} fill="currentColor" />
              <span>Start investigation</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg border border-[#425B9A]/40 bg-[#141E3D] text-[#EAF1F8]"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="fixed top-0 right-0 h-full w-72 bg-[#141E3D] border-l border-[#425B9A]/40 p-6 flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#425B9A]/30 mb-6">
                <span className="font-serif font-bold text-lg text-[#EAF1F8]">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#9FB0C9] hover:text-[#76C0EC]"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-[#425B9A]/30 text-[#76C0EC] font-semibold border border-[#76C0EC]/30'
                          : 'text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1D2A52]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#425B9A]/30 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleStartClick();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-[#425B9A] text-white border border-[#76C0EC]/50"
              >
                <Play size={14} fill="currentColor" />
                <span>Start investigation</span>
              </button>
              <div className="text-center text-xs text-[#9FB0C9]">
                Educational water simulation.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
