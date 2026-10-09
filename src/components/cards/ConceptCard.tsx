import React, { useState } from 'react';
import { Gem, Plus, X } from 'lucide-react';
import { AccentColor } from '../../types/canvas';

interface ConceptCardProps {
  badgeNumber?: number;
  title: string;
  content: string;
  tags?: string[];
  accent?: AccentColor;
  onUpdate?: (updated: { title?: string; content?: string; tags?: string[] }) => void;
}

const BADGE_COLOR_MAP: Record<AccentColor, string> = {
  pink: 'bg-pink-500 text-white',
  blue: 'bg-blue-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  orange: 'bg-orange-500 text-white',
  purple: 'bg-purple-500 text-white',
  yellow: 'bg-amber-500 text-white',
  cyan: 'bg-cyan-500 text-white',
  rose: 'bg-rose-500 text-white',
};

export const ConceptCard: React.FC<ConceptCardProps> = ({
  badgeNumber = 1,
  title,
  content,
  tags = ['Easy to learn', 'Versatile', 'Large community'],
  accent = 'pink',
  onUpdate,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);

  const badgeStyle = BADGE_COLOR_MAP[accent] || 'bg-pink-500 text-white';

  const saveTitle = () => {
    setIsEditingTitle(false);
    if (onUpdate) onUpdate({ title: localTitle });
  };

  const saveContent = () => {
    setIsEditingContent(false);
    if (onUpdate) onUpdate({ content: localContent });
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5 flex-1 pr-2">
          <div
            className={`w-6 h-6 rounded-lg ${badgeStyle} font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0`}
          >
            {badgeNumber}
          </div>

          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={localTitle}
              onChange={e => setLocalTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={e => e.key === 'Enter' && saveTitle()}
              className="text-sm font-bold text-neutral-900 border border-purple-400 rounded px-1.5 py-0.5 outline-hidden w-full bg-white"
            />
          ) : (
            <h2
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-sm font-bold text-neutral-900 tracking-tight cursor-text hover:text-purple-700 transition-colors"
              title="Double-click to edit title"
            >
              {localTitle}
            </h2>
          )}
        </div>
        <Gem className="w-4 h-4 text-pink-400 flex-shrink-0" />
      </div>

      {/* Description / Content */}
      {isEditingContent ? (
        <textarea
          autoFocus
          rows={3}
          value={localContent}
          onChange={e => setLocalContent(e.target.value)}
          onBlur={saveContent}
          className="text-xs text-neutral-800 border border-purple-400 rounded-lg p-2 outline-hidden w-full bg-white resize-none"
        />
      ) : (
        <p
          onDoubleClick={() => setIsEditingContent(true)}
          className="text-xs text-neutral-600 leading-relaxed font-normal cursor-text hover:bg-purple-50/40 p-1 rounded transition-colors"
          title="Double-click to edit description"
        >
          {localContent}
        </p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100/80"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
