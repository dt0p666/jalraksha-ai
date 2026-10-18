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
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 text-[#F8F3EF]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#08C4E1]/20">
        <div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[#F8F3EF]">
            Water Network Science &amp; Diagnostics
          </h1>
          <p className="text-sm text-[#F8F3EF] mt-1">
            Understand how drinking water flows, how contamination moves, and how mathematical inference finds the source.
          </p>
        </div>

        <button
          onClick={() => setQuizOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] text-xs font-heading font-bold shadow-lg shadow-[#08C4E1]/25 flex items-center gap-2 self-start sm:self-auto transition-transform hover:scale-105"
        >
          <Award size={16} />
          <span>Take Knowledge Quiz</span>
        </button>
      </div>

      {/* Interactive Lessons Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-[#08C4E1]" />
          <h2 className="text-xl font-heading font-bold text-[#F8F3EF]">
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
                    ? 'bg-[#446882] border-[#08C4E1] text-[#F8F3EF] shadow-md font-semibold'
                    : 'bg-[#446882] border-[#08C4E1]/20 text-[#F8F3EF] hover:bg-[#446882]/60 hover:text-[#F8F3EF]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[#08C4E1] font-bold">0{idx + 1}.</span>
                  <span className="font-semibold">{lesson.title}</span>
                </div>
                <ChevronRight size={14} className={activeLessonId === lesson.id ? 'text-[#08C4E1]' : 'text-[#F8F3EF]'} />
              </button>
            ))}
          </div>

          {/* Right Column: Active Lesson Content */}
          <div className="md:col-span-8 p-6 bg-[#446882] border border-[#08C4E1]/25 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xl font-heading font-bold text-[#F8F3EF]">
              {activeLesson.title}
            </h3>
            <p className="text-sm font-medium text-[#08C4E1]">
              {activeLesson.summary}
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-[#F8F3EF] leading-relaxed">
              {activeLesson.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="p-3 bg-[#1C3C53] rounded-xl border-l-4 border-[#08C4E1] text-xs font-semibold text-[#F8F3EF]">
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
      <section className="space-y-4 pt-4 border-t border-[#08C4E1]/20">
        <div className="flex items-center gap-2">
          <HelpCircle size={20} className="text-[#08C4E1]" />
          <h2 className="text-xl font-heading font-bold text-[#F8F3EF]">
            Interactive Technical Glossary
          </h2>
        </div>
        <p className="text-xs text-[#F8F3EF]">
          Hover or focus on highlighted terms throughout the app for quick definitions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {Object.values(GLOSSARY).map(term => (
            <div
              key={term.id}
              id={`glossary-${term.id}`}
              className="p-4 bg-[#446882] border border-[#08C4E1]/20 rounded-xl space-y-1.5 shadow-md"
            >
              <span className="font-semibold text-sm text-[#08C4E1] block font-heading">{term.term}</span>
              <p className="text-xs text-[#F8F3EF] font-medium leading-snug">{term.shortDef}</p>
              <p className="text-[11px] text-[#F8F3EF] leading-relaxed">{term.detailedDef}</p>
            </div>
          ))}
        </div>
      </section>

      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </main>
  );
};
