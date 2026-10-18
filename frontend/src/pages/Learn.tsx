import React, { useState } from 'react';
import { LESSONS } from '../content/lessons';
import { GLOSSARY } from '../content/glossary';
import { DatasetExplorer } from '../components/learn/DatasetExplorer';
import { QuizModal } from '../components/learn/QuizModal';
import { BookOpen, HelpCircle, Award, ChevronRight } from 'lucide-react';

export const Learn: React.FC = () => {
  const [quizOpen, setQuizOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSONS[0].id);

  const activeLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 text-[#EAF1F8]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#425B9A]/30">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#EAF1F8]">
            Water Network Science &amp; Diagnostics
          </h1>
          <p className="text-sm text-[#9FB0C9] mt-1">
            Understand how drinking water flows, how contamination moves, and how mathematical inference finds the source.
          </p>
        </div>

        <button
          onClick={() => setQuizOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold border border-[#76C0EC]/50 shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Award size={16} className="text-[#76C0EC]" />
          <span>Take Knowledge Quiz</span>
        </button>
      </div>

      {/* Interactive Lessons Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-[#76C0EC]" />
          <h2 className="text-xl font-serif font-bold text-[#EAF1F8]">
            Core Concepts in Water Hydraulics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Lesson Selector */}
          <div className="md:col-span-4 space-y-2">
            {LESSONS.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLessonId(lesson.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between text-xs ${
                  activeLessonId === lesson.id
                    ? 'bg-[#1D2A52] border-[#76C0EC] text-white shadow-sm'
                    : 'bg-[#141E3D] border-[#425B9A]/30 text-[#9FB0C9] hover:bg-[#1D2A52]/50 hover:text-[#EAF1F8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[#76C0EC] font-bold">0{idx + 1}.</span>
                  <span className="font-semibold">{lesson.title}</span>
                </div>
                <ChevronRight size={14} className={activeLessonId === lesson.id ? 'text-[#76C0EC]' : 'text-[#9FB0C9]'} />
              </button>
            ))}
          </div>

          {/* Right Column: Active Lesson Content */}
          <div className="md:col-span-8 p-6 bg-[#141E3D] border border-[#425B9A]/40 rounded-xl space-y-4 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-[#EAF1F8]">
              {activeLesson.title}
            </h3>
            <p className="text-sm font-medium text-[#76C0EC]">
              {activeLesson.summary}
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-[#9FB0C9] leading-relaxed">
              {activeLesson.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="p-3 bg-[#0D1630] rounded-lg border-l-4 border-[#76C0EC] text-xs font-semibold text-[#EAF1F8]">
              Takeaway: {activeLesson.takeaway}
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Distribution Explorer */}
      <section className="space-y-4">
        <DatasetExplorer />
      </section>

      {/* Glossary Section */}
      <section className="space-y-4 pt-4 border-t border-[#425B9A]/30">
        <div className="flex items-center gap-2">
          <HelpCircle size={20} className="text-[#76C0EC]" />
          <h2 className="text-xl font-serif font-bold text-[#EAF1F8]">
            Interactive Technical Glossary
          </h2>
        </div>
        <p className="text-xs text-[#9FB0C9]">
          Hover or focus on highlighted terms throughout the app for quick definitions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {Object.values(GLOSSARY).map(term => (
            <div
              key={term.id}
              id={`glossary-${term.id}`}
              className="p-4 bg-[#141E3D] border border-[#425B9A]/30 rounded-xl space-y-1.5 shadow-sm"
            >
              <span className="font-semibold text-sm text-[#76C0EC] block">{term.term}</span>
              <p className="text-xs text-[#EAF1F8] font-medium leading-snug">{term.shortDef}</p>
              <p className="text-[11px] text-[#9FB0C9] leading-relaxed">{term.detailedDef}</p>
            </div>
          ))}
        </div>
      </section>

      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </main>
  );
};
