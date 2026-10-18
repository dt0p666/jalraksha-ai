import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FAQ_ITEMS } from '../content/faq';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

export const Faq: React.FC = () => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const location = useLocation();

  // Open item automatically if hash matches in URL
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      if (FAQ_ITEMS.some(f => f.id === targetId)) {
        setOpenIds(prev => new Set(prev).add(targetId));
        setTimeout(() => {
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  }, [location.hash]);

  const toggleItem = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredFaqs = FAQ_ITEMS.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-[#F8F3EF]">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#08C4E1]/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#446882] border border-[#08C4E1]/30 text-[#08C4E1]">
            <HelpCircle size={22} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[#F8F3EF]">
            Frequently Asked Questions
          </h1>
        </div>
        <p className="text-sm text-[#F8F3EF]">
          Direct, technical answers about the hydraulic model, Bayesian mathematics, and open-weight AI report verification.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-3 text-[#F8F3EF]" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#446882] border border-[#08C4E1]/25 text-xs text-[#F8F3EF] placeholder-[#F8F3EF]/50 focus:outline-none focus:border-[#08C4E1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['all', 'physics', 'math', 'ai', 'general'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-[#08C4E1] text-[#1C3C53] font-bold shadow-md'
                  : 'bg-[#446882] text-[#F8F3EF] hover:text-[#F8F3EF] border border-[#08C4E1]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map(item => {
          const isOpen = openIds.has(item.id);
          return (
            <div
              key={item.id}
              id={item.id}
              className="rounded-2xl border border-[#08C4E1]/20 bg-[#446882] overflow-hidden transition-all shadow-md"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#446882]/40 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-heading font-semibold text-sm sm:text-base text-[#F8F3EF]">
                  {item.question}
                </span>
                <span className="shrink-0 text-[#08C4E1]">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#F8F3EF] leading-relaxed border-t border-[#08C4E1]/10 animate-fadeIn">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};
