import React from 'react';
import { Target, CheckCircle2, Circle, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoalItem {
  id: string;
  text: string;
  done: boolean;
}

interface GoalCardProps {
  title?: string;
  goals?: GoalItem[];
  onToggleGoal?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  title = 'Learning Goal',
  goals = [
    { id: 'g1', text: 'Understand Python fundamentals', done: true },
    { id: 'g2', text: 'Practice with examples', done: true },
    { id: 'g3', text: 'Build small projects', done: false },
  ],
  onToggleGoal,
}) => {
  const handleToggle = (id: string, currentlyDone: boolean) => {
    if (!currentlyDone) {
      try {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
    if (onToggleGoal) {
      onToggleGoal(id);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 pr-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-rose-100 flex items-center justify-center text-rose-500">
              <Target className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-neutral-800 tracking-tight">
              {title}
            </span>
          </div>
          <button className="text-neutral-300 hover:text-neutral-500 transition-colors">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-2">
          {goals.map(g => (
            <div
              key={g.id}
              onClick={() => handleToggle(g.id, g.done)}
              className="flex items-center space-x-2 text-xs cursor-pointer group"
            >
              <button
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  g.done
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'border-neutral-300 hover:border-rose-400'
                }`}
              >
                {g.done && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <span
                className={`text-[12px] transition-colors ${
                  g.done
                    ? 'line-through text-neutral-400'
                    : 'text-neutral-700 font-medium group-hover:text-neutral-900'
                }`}
              >
                {g.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Target Dart Graphic */}
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
        <div className="relative">
          <Target className="w-9 h-9 text-rose-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
