import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { QUIZ_QUESTIONS } from '../../content/quiz';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedOpt(idx);
    setShowExplanation(true);
    if (idx === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(i => i + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Network Diagnostic Quiz" maxWidth="max-w-xl">
      <div className="space-y-4 text-xs sm:text-sm text-[#EAF1F8]">
        {!finished ? (
          <>
            <div className="flex items-center justify-between text-xs text-[#9FB0C9] pb-2 border-b border-[#425B9A]/30">
              <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>Score: {score} correct</span>
            </div>

            <p className="font-semibold text-base text-[#EAF1F8] leading-snug">
              {currentQ.question}
            </p>

            {/* Options list */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-[#0D1630] border-[#425B9A]/30 text-[#EAF1F8] hover:border-[#76C0EC]/50';

                if (showExplanation) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-[#91AC67]/20 border-[#91AC67] text-[#91AC67] font-semibold';
                  } else if (idx === selectedOpt) {
                    btnStyle = 'bg-[#D9534F]/20 border-[#D9534F] text-[#D9534F] font-semibold';
                  } else {
                    btnStyle = 'bg-[#0D1630]/50 border-[#425B9A]/20 text-[#9FB0C9] opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={showExplanation}
                    className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="font-mono text-xs mt-0.5 text-[#9FB0C9] font-bold">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {showExplanation && idx === currentQ.correctIndex && (
                      <CheckCircle2 size={16} className="text-[#91AC67] shrink-0 mt-0.5" />
                    )}
                    {showExplanation && idx === selectedOpt && idx !== currentQ.correctIndex && (
                      <XCircle size={16} className="text-[#D9534F] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card */}
            {showExplanation && (
              <div className="p-3 bg-[#1D2A52] rounded-lg border border-[#76C0EC]/40 space-y-2 animate-fadeIn">
                <span className="font-semibold text-xs text-[#76C0EC] block">
                  {selectedOpt === currentQ.correctIndex ? 'Correct reasoning' : 'Review physics rationale'}:
                </span>
                <p className="text-xs text-[#9FB0C9] leading-relaxed">
                  {currentQ.explanation}
                </p>
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold flex items-center gap-1.5 ml-auto"
                >
                  <span>{currentIdx + 1 === QUIZ_QUESTIONS.length ? 'View Results' : 'Next Question'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Quiz Results Card */
          <div className="text-center py-6 space-y-4">
            <h3 className="text-2xl font-serif font-bold text-[#EAF1F8]">
              Quiz Completed
            </h3>
            <div className="p-4 bg-[#0D1630] rounded-xl border border-[#425B9A]/30 max-w-xs mx-auto">
              <span className="text-xs text-[#9FB0C9] block">Your Investigator Score</span>
              <span className="text-4xl font-mono font-bold text-[#76C0EC] my-1 block">
                {score} / {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-xs text-[#91AC67]">
                {score >= 4 ? 'Excellent hydraulic understanding' : 'Good review of core concepts'}
              </span>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-lg bg-[#1D2A52] hover:bg-[#425B9A]/40 text-[#EAF1F8] text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#425B9A] hover:bg-[#4f6cb6] text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
