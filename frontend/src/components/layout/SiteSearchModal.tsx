import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, MapPin, BookOpen, HelpCircle, FileText, Compass, X } from 'lucide-react';
import { useApp } from '../../state/appStore';
import { LESSONS } from '../../content/lessons';
import { GLOSSARY } from '../../content/glossary';
import { FAQ_ITEMS } from '../../content/faq';

interface SearchItem {
  id: string;
  type: 'Page' | 'Node' | 'Lesson' | 'Glossary' | 'FAQ' | 'Action';
  title: string;
  description: string;
  route?: string;
  nodeId?: string;
  action?: () => void;
}

export const SiteSearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, network, setInspectedNodeId, setStartModalOpen, toggleTheme } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [searchOpen]);

  // Build searchable index from real content and topology
  const indexItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [
      // Pages
      { id: 'page-home', type: 'Page', title: 'Overview', description: 'Interactive entry, flow mechanics, and digital twin overview', route: '/' },
      { id: 'page-cc', type: 'Page', title: 'Command Center', description: 'Full-viewport investigation interface, Bayesian source ranking, and grab sampling', route: '/command-center' },
      { id: 'page-network', type: 'Page', title: 'Network Explorer', description: 'Interactive graph topology, node types, and Hazen-Williams parameters', route: '/network' },
      { id: 'page-simulation', type: 'Page', title: 'Simulation Controls', description: 'Live advection steps, sensor curves, and plume progression', route: '/simulation' },
      { id: 'page-investigation', type: 'Page', title: 'Source Investigation', description: 'Bayesian likelihood inversion, candidate ranking, and optimal grab sampling', route: '/investigation' },
      { id: 'page-briefing', type: 'Page', title: 'AI Incident Briefing', description: 'Structured technical dossier synthesized via open-weight inference', route: '/ai-briefing' },
      { id: 'page-eval', type: 'Page', title: 'Evaluation Lab', description: 'Quantitative benchmark metrics, top-1 accuracy, and empirical distributions', route: '/evaluation' },
      { id: 'page-learn', type: 'Page', title: 'Learning Center', description: 'Educational lessons on hydraulic delays, information gain, and dataset explorer', route: '/learn' },
      { id: 'page-faq', type: 'Page', title: 'FAQ', description: 'Frequently asked questions on model limits, sensors, and mathematics', route: '/faq' },
      { id: 'page-about', type: 'Page', title: 'About & Methodology', description: 'Simulation architecture, dataset provenance, and classroom instructor unlock', route: '/about' },
      { id: 'page-contact', type: 'Page', title: 'Contact & Advisory', description: 'Submit questions or feedback directly to local server storage', route: '/contact' },

      // Quick Actions
      { id: 'act-start', type: 'Action', title: 'Action: Start Contamination', description: 'Inject a new hidden plume scenario into the network', action: () => { navigate('/command-center'); setStartModalOpen(true); } },
      { id: 'act-theme', type: 'Action', title: 'Action: Toggle Theme', description: 'Switch between dark Mission Control and daylight mode', action: () => toggleTheme() },
    ];

    // Map Nodes
    if (network?.nodes) {
      network.nodes.forEach(n => {
        items.push({
          id: `node-${n.id}`,
          type: 'Node',
          title: `${n.id} - ${n.label}`,
          description: `${n.type.toUpperCase()}${n.has_sensor ? ' [Fixed Telemetry Sensor]' : ''}${n.households ? ` - ${n.households} households` : ''}`,
          nodeId: n.id,
          route: '/command-center',
        });
      });
    }

    // Lessons
    LESSONS.forEach(l => {
      items.push({
        id: `lesson-${l.id}`,
        type: 'Lesson',
        title: l.title,
        description: l.summary,
        route: `/learn#${l.id}`,
      });
    });

    // Glossary
    Object.values(GLOSSARY).forEach(g => {
      items.push({
        id: `glossary-${g.id}`,
        type: 'Glossary',
        title: g.term,
        description: g.shortDef,
        route: `/learn#glossary-${g.id}`,
      });
    });

    // FAQ
    FAQ_ITEMS.forEach(f => {
      items.push({
        id: `faq-${f.id}`,
        type: 'FAQ',
        title: f.question,
        description: f.answer.substring(0, 100) + '...',
        route: `/faq#${f.id}`,
      });
    });

    return items;
  }, [network, navigate, setStartModalOpen, toggleTheme]);

  const fuse = useMemo(() => {
    return new Fuse(indexItems, {
      keys: ['title', 'description', 'nodeId'],
      threshold: 0.35,
    });
  }, [indexItems]);

  const results = useMemo(() => {
    if (!query.trim()) return indexItems.slice(0, 10);
    return fuse.search(query).map(r => r.item).slice(0, 15);
  }, [query, fuse, indexItems]);

  const handleSelect = (item: SearchItem) => {
    setSearchOpen(false);
    if (item.action) {
      item.action();
      return;
    }
    if (item.nodeId) {
      setInspectedNodeId(item.nodeId);
      navigate('/command-center');
      return;
    }
    if (item.route) {
      navigate(item.route);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={() => setSearchOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
    >
      <div
        className="w-full max-w-xl bg-[#0D1B26] border border-[#38D9E6]/35 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#38D9E6]/20 gap-3 bg-[#071018]">
          <Search size={18} className="text-[#38D9E6]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search nodes, lessons, telemetry, briefings..."
            className="w-full bg-transparent text-sm text-[#EAF4F7] placeholder-[#8EA5B4]/50 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#8EA5B4] hover:text-[#38D9E6]">
              <X size={16} />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#132535] text-[#8EA5B4] rounded border border-[#38D9E6]/20">
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#38D9E6]/10">
          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#8EA5B4]">
              No results found matching &quot;{query}&quot;. Try searching for &quot;J-08&quot;, &quot;entropy&quot;, or &quot;simulation&quot;.
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              let Icon = FileText;
              if (item.type === 'Node') Icon = MapPin;
              else if (item.type === 'Lesson') Icon = BookOpen;
              else if (item.type === 'Glossary') Icon = HelpCircle;
              else if (item.type === 'Action') Icon = Compass;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#132535] border border-[#38D9E6]/40' : 'hover:bg-[#132535]/50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'text-[#38D9E6]' : 'text-[#8EA5B4]'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#EAF4F7] truncate">{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#071018] text-[#38D9E6] border border-[#38D9E6]/25 uppercase">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#8EA5B4] truncate mt-0.5">{item.description}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Search Footer hints */}
        <div className="px-4 py-2 border-t border-[#38D9E6]/20 bg-[#071018] flex items-center justify-between text-[11px] text-[#8EA5B4]">
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="font-mono text-[10px] text-[#38D9E6]">NASA Mission Control Engine</span>
        </div>
      </div>
    </div>
  );
};
