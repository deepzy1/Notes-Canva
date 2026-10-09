import React, { useState } from 'react';
import { CheckSquare, Check, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskItem {
  id: string;
  text: string;
  done: boolean;
}

interface TasksCardProps {
  title?: string;
  items?: TaskItem[];
}

export const TasksCard: React.FC<TasksCardProps> = ({
  title = 'Practice Tasks',
  items: initialItems = [
    { id: 't1', text: 'Create a variable and print it', done: true },
    { id: 't2', text: 'Try different data types', done: false },
    { id: 't3', text: 'Write a simple if-else program', done: false },
    { id: 't4', text: 'Create a function', done: false },
    { id: 't5', text: 'Work with lists', done: false },
    { id: 't6', text: 'Build a small mini project', done: false },
  ],
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>(initialItems);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextDone = !task.done;
          if (nextDone) {
            try {
              confetti({
                particleCount: 20,
                spread: 35,
                origin: { y: 0.7 },
              });
            } catch (e) {}
          }
          return { ...task, done: nextDone };
        }
        return task;
      })
    );
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          {completedCount}/{tasks.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Tasks checklist */}
      <div className="space-y-2 pt-1">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center space-x-2 text-xs cursor-pointer group select-none"
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                task.done
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-neutral-300 group-hover:border-emerald-400 bg-white'
              }`}
            >
              {task.done && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span
              className={`text-[12px] leading-snug transition-colors ${
                task.done
                  ? 'line-through text-neutral-400'
                  : 'text-neutral-700 font-medium group-hover:text-neutral-900'
              }`}
            >
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
