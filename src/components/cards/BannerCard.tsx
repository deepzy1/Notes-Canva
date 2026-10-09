import React, { useState } from 'react';
import { Rocket } from 'lucide-react';

interface BannerCardProps {
  title: string;
  subtitle: string;
  tags?: { label: string; variant: 'green' | 'purple' | 'blue' }[];
  onUpdate?: (updated: { title?: string; subtitle?: string }) => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({
  title,
  subtitle,
  tags = [
    { label: 'Beginner', variant: 'green' },
    { label: '12 Cards', variant: 'purple' },
    { label: 'Progress 40%', variant: 'blue' },
  ],
  onUpdate,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSub, setIsEditingSub] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localSub, setLocalSub] = useState(subtitle);

  const saveTitle = () => {
    setIsEditingTitle(false);
    if (onUpdate) onUpdate({ title: localTitle });
  };

  const saveSub = () => {
    setIsEditingSub(false);
    if (onUpdate) onUpdate({ subtitle: localSub });
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-400/20 to-indigo-500/20 p-5 border border-purple-200/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Mascot Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-white/90 rounded-[14px] flex items-center justify-center font-black text-2xl tracking-tighter">
              <span className="text-blue-500">Py</span>
              <span className="text-amber-500">th</span>
            </div>
          </div>

          {/* Banner Text with inline editing */}
          <div className="flex-1 pr-4">
            {isEditingTitle ? (
              <input
                autoFocus
                type="text"
                value={localTitle}
                onChange={e => setLocalTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={e => e.key === 'Enter' && saveTitle()}
                className="text-2xl font-bold text-neutral-900 border border-purple-400 rounded-lg px-2 py-0.5 outline-hidden w-full bg-white/90"
              />
            ) : (
              <h1
                onDoubleClick={() => setIsEditingTitle(true)}
                className="text-2xl font-bold text-neutral-900 tracking-tight cursor-text hover:text-purple-700"
                title="Double-click to edit banner title"
              >
                {localTitle}
              </h1>
            )}

            {isEditingSub ? (
              <input
                autoFocus
                type="text"
                value={localSub}
                onChange={e => setLocalSub(e.target.value)}
                onBlur={saveSub}
                onKeyDown={e => e.key === 'Enter' && saveSub()}
                className="text-xs text-neutral-800 border border-purple-400 rounded-lg px-2 py-0.5 outline-hidden w-full bg-white/90 mt-1"
              />
            ) : (
              <p
                onDoubleClick={() => setIsEditingSub(true)}
                className="text-xs text-neutral-600 mt-1 cursor-text hover:text-purple-700"
                title="Double-click to edit subtitle"
              >
                {localSub}
              </p>
            )}

            {/* Tags Row */}
            <div className="flex items-center space-x-2 mt-3">
              {tags.map((tag, i) => {
                let badgeClass = 'bg-purple-100 text-purple-700 border-purple-200';
                if (tag.variant === 'green') {
                  badgeClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                } else if (tag.variant === 'blue') {
                  badgeClass = 'bg-sky-100 text-sky-700 border-sky-200';
                }
                return (
                  <span
                    key={i}
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass} flex items-center space-x-1`}
                  >
                    <span>{tag.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rocket graphic */}
        <div className="hidden sm:flex flex-col items-center justify-center pl-2 pr-2 flex-shrink-0">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-600/30 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-pink-500 -rotate-45 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
