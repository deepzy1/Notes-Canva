import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizCardProps {
  title?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  title = 'Knowledge Check',
  question = 'What is the output of print(type([])) in Python?',
  options = ["<class 'list'>", "<class 'array'>", "<class 'tuple'>"],
  correctIndex = 0,
  explanation = 'In Python, square brackets define a list object instance.',
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    setSelectedOption(idx);
    if (idx === correctIndex) {
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
          <HelpCircle className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
          {title}
        </h2>
      </div>

      <p className="text-xs font-medium text-neutral-800">{question}</p>

      {/* Options */}
      <div className="space-y-1.5 text-xs">
        {options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === correctIndex;
          let btnStyle = 'border-neutral-200 hover:bg-neutral-50 text-neutral-700';

          if (selectedOption !== null) {
            if (isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold';
            } else if (isSelected) {
              btnStyle = 'border-rose-400 bg-rose-50 text-rose-700';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              {selectedOption !== null && isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
              {selectedOption !== null && isSelected && !isCorrect && (
                <XCircle className="w-4 h-4 text-rose-500" />
              )}
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <div className="p-2 rounded-xl bg-purple-50/80 border border-purple-100 text-[11px] text-purple-900 leading-relaxed">
          <span className="font-bold">Explanation: </span>
          {explanation}
        </div>
      )}
    </div>
  );
};
