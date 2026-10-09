import React, { useState } from 'react';
import { Network, Sparkles, Plus } from 'lucide-react';

interface MindMapCardProps {
  title?: string;
  center?: string;
  topics?: { name: string; color: string }[];
  onUpdate?: (updated: { center?: string; topics?: { name: string; color: string }[] }) => void;
}

export const MindMapCard: React.FC<MindMapCardProps> = ({
  title = 'Mind Map: Python Topics',
  center = 'Python',
  topics = [
    { name: 'Variables', color: 'blue' },
    { name: 'Data Types', color: 'emerald' },
    { name: 'Functions', color: 'pink' },
    { name: 'Lists & Dicts', color: 'purple' },
    { name: 'File Handling', color: 'rose' },
    { name: 'Modules', color: 'cyan' },
    { name: 'OOP', color: 'amber' },
    { name: 'Control Flow', color: 'yellow' },
  ],
  onUpdate,
}) => {
  const [localCenter, setLocalCenter] = useState(center);
  const [localTopics, setLocalTopics] = useState(topics);
  const [editingIndex, setEditingIndex] = useState<number | 'center' | null>(null);

  const saveCenter = () => {
    setEditingIndex(null);
    if (onUpdate) onUpdate({ center: localCenter, topics: localTopics });
  };

  const saveTopic = (idx: number, newName: string) => {
    const updated = [...localTopics];
    updated[idx] = { ...updated[idx], name: newName };
    setLocalTopics(updated);
    setEditingIndex(null);
    if (onUpdate) onUpdate({ center: localCenter, topics: updated });
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
            <Network className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
        </div>
        <Sparkles className="w-4 h-4 text-pink-400" />
      </div>

      {/* Radial Mind Map Area */}
      <div className="relative w-full h-52 bg-neutral-50/60 rounded-xl border border-neutral-200/60 overflow-hidden flex items-center justify-center">
        {/* SVG curved connector lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-purple-300/80 stroke-2 fill-none">
          <path d="M 190 104 Q 150 50 110 35" />
          <path d="M 190 104 Q 230 50 270 35" />
          <path d="M 190 104 Q 260 85 305 85" />
          <path d="M 190 104 Q 260 130 305 130" />
          <path d="M 190 104 Q 230 160 260 175" />
          <path d="M 190 104 Q 160 160 130 175" />
          <path d="M 190 104 Q 120 130 80 130" />
          <path d="M 190 104 Q 120 85 80 85" />
        </svg>

        {/* Center Node */}
        {editingIndex === 'center' ? (
          <input
            autoFocus
            type="text"
            value={localCenter}
            onChange={e => setLocalCenter(e.target.value)}
            onBlur={saveCenter}
            className="relative z-10 px-3 py-1 rounded-xl bg-purple-600 text-white font-bold text-xs text-center border-2 border-white"
          />
        ) : (
          <div
            onDoubleClick={() => setEditingIndex('center')}
            className="relative z-10 px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-md ring-4 ring-purple-100 flex items-center space-x-1.5 cursor-text"
            title="Double-click to edit center topic"
          >
            <span>{localCenter}</span>
          </div>
        )}

        {/* Nodes with edit on double click */}
        {/* 1. Top-Left */}
        <div
          onDoubleClick={() => setEditingIndex(0)}
          className="absolute top-2 left-16 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs cursor-text"
        >
          {editingIndex === 0 ? (
            <input
              autoFocus
              type="text"
              value={localTopics[0]?.name || ''}
              onChange={e => saveTopic(0, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              className="bg-transparent text-center outline-hidden w-16"
            />
          ) : (
            localTopics[0]?.name || 'Topic'
          )}
        </div>

        {/* 2. Top-Right */}
        <div
          onDoubleClick={() => setEditingIndex(1)}
          className="absolute top-2 right-14 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs cursor-text"
        >
          {editingIndex === 1 ? (
            <input
              autoFocus
              type="text"
              value={localTopics[1]?.name || ''}
              onChange={e => saveTopic(1, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              className="bg-transparent text-center outline-hidden w-16"
            />
          ) : (
            localTopics[1]?.name || 'Topic'
          )}
        </div>

        {/* 3. Mid-Right */}
        <div
          onDoubleClick={() => setEditingIndex(2)}
          className="absolute top-18 right-3 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-pink-100 text-pink-800 border border-pink-200 shadow-2xs cursor-text"
        >
          {editingIndex === 2 ? (
            <input
              autoFocus
              type="text"
              value={localTopics[2]?.name || ''}
              onChange={e => saveTopic(2, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              className="bg-transparent text-center outline-hidden w-16"
            />
          ) : (
            localTopics[2]?.name || 'Topic'
          )}
        </div>

        {/* 4. Lower-Right */}
        <div
          onDoubleClick={() => setEditingIndex(3)}
          className="absolute top-28 right-3 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs cursor-text"
        >
          {editingIndex === 3 ? (
            <input
              autoFocus
              type="text"
              value={localTopics[3]?.name || ''}
              onChange={e => saveTopic(3, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              className="bg-transparent text-center outline-hidden w-16"
            />
          ) : (
            localTopics[3]?.name || 'Topic'
          )}
        </div>

        {/* 5. Bottom-Right */}
        <div
          onDoubleClick={() => setEditingIndex(4)}
          className="absolute bottom-2 right-16 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs cursor-text"
        >
          {editingIndex === 4 ? (
            <input
              autoFocus
              type="text"
              value={localTopics[4]?.name || ''}
              onChange={e => saveTopic(4, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              className="bg-transparent text-center outline-hidden w-16"
            />
          ) : (
            localTopics[4]?.name || 'Topic'
          )}
        </div>

        {/* 6. Bottom-Left */}
        <div
          onDoubleClick={() => setEditingIndex(5)}
          className="absolute bottom-2 left-20 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200 shadow-2xs cursor-text"
        >
          {editingIndex === 5 ? (
            <input
              autoFocus
              type="text"
              value={localTopics[5]?.name || ''}
              onChange={e => saveTopic(5, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              className="bg-transparent text-center outline-hidden w-16"
            />
          ) : (
            localTopics[5]?.name || 'Topic'
          )}
        </div>

        {/* 7. Lower-Left */}
        <div
          onDoubleClick={() => setEditingIndex(6)}
          className="absolute top-28 left-6 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs cursor-text"
        >
          {editingIndex === 6 ? (
            <input
              autoFocus
              type="text"
              value={localTopics[6]?.name || ''}
              onChange={e => saveTopic(6, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              className="bg-transparent text-center outline-hidden w-16"
            />
          ) : (
            localTopics[6]?.name || 'Topic'
          )}
        </div>

        {/* 8. Mid-Left */}
        <div
          onDoubleClick={() => setEditingIndex(7)}
          className="absolute top-18 left-3 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-2xs cursor-text"
        >
          {editingIndex === 7 ? (
            <input
              autoFocus
              type="text"
              value={localTopics[7]?.name || ''}
              onChange={e => saveTopic(7, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              className="bg-transparent text-center outline-hidden w-16"
            />
          ) : (
            localTopics[7]?.name || 'Topic'
          )}
        </div>
      </div>
    </div>
  );
};
