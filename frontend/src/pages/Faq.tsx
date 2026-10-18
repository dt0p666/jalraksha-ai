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
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-[#EAF1F8]">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#425B9A]/30">
        <div className="flex items-center gap-2 text-[#76C0EC]">
          <HelpCircle size={24} />
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#EAF1F8]">
            Frequently Asked Questions
          </h1>
        </div>
        <p className="text-sm text-[#9FB0C9]">
          Direct, honest answers about the physics simulation, Bayesian mathematics, and open-weight AI report constraints.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB0C9]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search FAQ questions or topics..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#141E3D] border border-[#425B9A]/40 text-xs text-[#EAF1F8] placeholder-[#9FB0C9]/60 focus:border-[#76C0EC] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'system', 'inference', 'data', 'safety'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#425B9A] text-white border border-[#76C0EC]/40'
                  : 'bg-[#141E3D] text-[#9FB0C9] border border-[#425B9A]/30 hover:text-[#EAF1F8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#9FB0C9]">
            No FAQ entries found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          filteredFaqs.map(item => {
            const isOpen = openIds.has(item.id);
            return (
              <div
                key={item.id}
                id={item.id}
                className={`rounded-xl border transition-all ${
                  isOpen
                    ? 'bg-[#141E3D] border-[#76C0EC]/50 shadow-md'
                    : 'bg-[#141E3D]/70 border-[#425B9A]/30 hover:border-[#425B9A]/60'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`answer-${item.id}`}
                  className="w-full flex items-center justify-between p-4 text-left gap-4"
                >
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#EAF1F8]">
                    {item.question}
                  </span>
                  <div className="p-1 rounded bg-[#0D1630] text-[#76C0EC] shrink-0">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`answer-${item.id}`}
                    role="region"
                    className="px-4 pb-4 text-xs sm:text-sm text-[#9FB0C9] leading-relaxed border-t border-[#425B9A]/20 pt-3"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};
