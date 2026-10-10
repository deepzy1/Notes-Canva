import React, { useState } from 'react';
import { StickyNote, Edit3, Plus, Trash2, Check } from 'lucide-react';

interface NoteCardProps {
  title?: string;
  bullets?: string[];
  onUpdate?: (updated: { title?: string; bullets?: string[] }) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  title = 'Notes',
  bullets = [
    'Use meaningful variable names.',
    'Follow PEP 8 style guide.',
    'Practice with small programs.',
    'Build real projects.',
  ],
  onUpdate,
}) => {
  const [items, setItems] = useState<string[]>(bullets);
  const [localTitle, setLocalTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const saveTitle = () => {
    setIsEditingTitle(false);
    onUpdate?.({ title: localTitle, bullets: items });
  };

  const updateBullet = (idx: number, val: string) => {
    const updated = [...items];
    updated[idx] = val;
    setItems(updated);
    onUpdate?.({ title: localTitle, bullets: updated });
  };

  const removeBullet = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    onUpdate?.({ title: localTitle, bullets: updated });
  };

  const addBullet = () => {
    const updated = [...items, 'New note bullet'];
    setItems(updated);
    onUpdate?.({ title: localTitle, bullets: updated });
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 pr-2">
          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <StickyNote className="w-3.5 h-3.5" />
          </div>
          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={localTitle}
              onChange={e => setLocalTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={e => e.key === 'Enter' && saveTitle()}
              className="text-sm font-bold text-neutral-900 border border-amber-400 rounded px-1.5 py-0.5 outline-hidden w-full bg-white"
            />
          ) : (
            <h2
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-sm font-bold text-neutral-900 tracking-tight cursor-text hover:text-amber-700 transition-colors"
              title="Double-click to edit note title"
            >
              {localTitle}
            </h2>
          )}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-neutral-400 hover:text-amber-600 transition-colors cursor-pointer"
          title="Edit Notes"
        >
          {isEditing ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Edit3 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Bullet points */}
      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/50 space-y-2 text-xs">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start space-x-2 group">
            <span className="text-amber-500 font-bold text-base leading-none">•</span>
            {isEditing ? (
              <div className="flex-1 flex items-center space-x-1">
                <input
                  type="text"
                  value={item}
                  onChange={e => updateBullet(idx, e.target.value)}
                  className="w-full bg-white px-2 py-0.5 rounded border border-amber-300 text-xs text-neutral-800"
                />
                <button
                  onClick={() => removeBullet(idx)}
                  className="text-neutral-400 hover:text-red-500 p-0.5 cursor-pointer"
                  title="Remove point"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span
                onDoubleClick={() => setIsEditing(true)}
                className="text-neutral-700 leading-snug cursor-text hover:text-amber-900 flex-1"
                title="Double-click to edit"
              >
                {item}
              </span>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={addBullet}
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
