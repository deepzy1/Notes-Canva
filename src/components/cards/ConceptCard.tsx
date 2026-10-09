import React from 'react';
import { Gem, Sparkles } from 'lucide-react';
import { AccentColor } from '../../types/canvas';

interface ConceptCardProps {
  badgeNumber?: number;
  title: string;
  content: string;
  tags?: string[];
  accent?: AccentColor;
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
}) => {
  const badgeStyle = BADGE_COLOR_MAP[accent] || 'bg-pink-500 text-white';

  return (
    <div className="space-y-3">
      {/* Header with Number Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-6 h-6 rounded-lg ${badgeStyle} font-bold text-xs flex items-center justify-center shadow-xs`}
          >
            {badgeNumber}
          </div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
        </div>
        <Gem className="w-4 h-4 text-pink-400" />
      </div>

      {/* Description */}
      <p className="text-xs text-neutral-600 leading-relaxed font-normal">
        {content}
      </p>

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
