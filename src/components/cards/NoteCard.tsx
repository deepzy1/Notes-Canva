import React, { useState } from 'react';
import { StickyNote, Edit3, Plus, Trash2 } from 'lucide-react';

interface NoteCardProps {
  title?: string;
  bullets?: string[];
}

export const NoteCard: React.FC<NoteCardProps> = ({
  title = 'Notes',
  bullets = [
    'Use meaningful variable names.',
    'Follow PEP 8 style guide.',
    'Practice with small programs.',
    'Build real projects.',
  ],
}) => {
  const [items, setItems] = useState<string[]>(bullets);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <StickyNote className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-neutral-400 hover:text-amber-600 transition-colors cursor-pointer"
          title="Edit Notes"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bullet points */}
      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/50 space-y-2 text-xs">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            <span className="text-amber-500 font-bold text-base leading-none">•</span>
            {isEditing ? (
              <input
                type="text"
                value={item}
                onChange={e => {
                  const updated = [...items];
                  updated[idx] = e.target.value;
                  setItems(updated);
                }}
                className="w-full bg-white px-2 py-0.5 rounded border border-amber-300 text-xs text-neutral-800"
              />
            ) : (
              <span className="text-neutral-700 leading-snug">{item}</span>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={() => setItems([...items, 'New note bullet'])}
            className="mt-2 text-[11px] text-amber-700 font-medium flex items-center space-x-1 hover:underline cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Point</span>
          </button>
        )}
      </div>
    </div>
  );
};
