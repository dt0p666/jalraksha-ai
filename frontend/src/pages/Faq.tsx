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
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-[#EAF7F5]">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#6FBEB2]/30">
        <div className="flex items-center gap-2 text-[#A5E9DD]">
          <HelpCircle size={24} />
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#EAF7F5]">
            Frequently Asked Questions
          </h1>
        </div>
        <p className="text-sm text-[#A5E9DD]">
          Direct, honest answers about the physics simulation, Bayesian mathematics, and open-weight AI report constraints.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5E9DD]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions or topics..."
            className="w-full pl-9 pr-3 py-2 bg-[#0F2226] border border-[#6FBEB2]/40 rounded-lg text-xs text-[#EAF7F5] placeholder-[#6FBEB2] focus:outline-none focus:border-[#A5E9DD]"
          />
        </div>

        <div className="flex flex-wrap gap-1 text-xs">
          {['all', 'physics', 'math', 'ai', 'education'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#34908B] text-[#FDF4AF] font-bold border border-[#6FBEB2]'
                  : 'bg-[#0F2226] text-[#A5E9DD] hover:bg-[#163238] border border-[#6FBEB2]/30'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map(item => {
          const isOpen = openIds.has(item.id);
          return (
            <div
              key={item.id}
              id={item.id}
              className="rounded-xl bg-[#0F2226] border border-[#6FBEB2]/30 overflow-hidden transition-all shadow-md"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-[#163238]/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-serif font-bold text-sm text-[#EAF7F5]">
                  {item.question}
                </span>
                <span className="text-[#A5E9DD] shrink-0">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-xs text-[#A5E9DD] leading-relaxed border-t border-[#6FBEB2]/20 mt-1">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-[#A5E9DD] text-sm">
            No matching questions found for "{searchQuery}".
          </div>
        )}
      </div>
    </main>
  );
};
