import React, { useState } from 'react';
import {
  X,
  Copy,
  Sparkles,
  Move,
  GripHorizontal,
  Trash2,
} from 'lucide-react';
import { CanvasCardItem, AccentColor } from '../../types/canvas';

interface CanvasCardProps {
  card: CanvasCardItem;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onStartDrag: (e: React.MouseEvent, cardId: string) => void;
  onDelete: (cardId: string) => void;
  onDuplicate: (cardId: string) => void;
  onToggleGlow: (cardId: string) => void;
  onStartConnect: (e: React.MouseEvent, cardId: string, side: 'top' | 'right' | 'bottom' | 'left') => void;
  children: React.ReactNode;
}

const ACCENT_BLOB_COLORS: Record<AccentColor, string> = {
  pink: '#ec4899',
  blue: '#3b82f6',
  emerald: '#10b981',
  orange: '#f97316',
  purple: '#8b5cf6',
  yellow: '#eab308',
  cyan: '#06b6d4',
  rose: '#f43f5e',
};

export const CanvasCard: React.FC<CanvasCardProps> = ({
  card,
  isSelected,
  onSelect,
  onStartDrag,
  onDelete,
  onDuplicate,
  onToggleGlow,
  onStartConnect,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const blobColor = ACCENT_BLOB_COLORS[card.accent] || '#8b5cf6';

  return (
    <div
      style={{
        position: 'absolute',
        left: `${card.x}px`,
        top: `${card.y}px`,
        width: card.width ? `${card.width}px` : 'auto',
      }}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group cursor-default select-none transition-shadow ${
        isSelected ? 'z-30' : 'z-10'
      }`}
    >
      {/* Outer Card Container with Neumorphic / Subtle Glow Styling */}
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          isSelected
            ? 'ring-2 ring-purple-500 shadow-2xl scale-[1.01]'
            : 'shadow-[0_10px_30px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl'
        }`}
      >
        {/* Animated Blob Glow behind frosted glass */}
        {card.hasGlow && (
          <div
            className="absolute z-1 -top-8 -left-8 w-44 h-44 rounded-full opacity-70 filter blur-xl animate-blob-bounce pointer-events-none"
            style={{
              backgroundColor: blobColor,
            }}
          />
        )}

        {/* Frosted Glass Overlay */}
        <div className="relative z-2 bg-white/95 backdrop-blur-xl border border-white/80 rounded-2xl p-4 overflow-hidden">
          {/* Card Top Action Toolbar on Hover */}
          {(isHovered || isSelected) && (
            <div className="absolute top-2 right-2 flex items-center space-x-1 z-30 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-neutral-200/80 shadow-xs">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onToggleGlow(card.id);
                }}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  card.hasGlow
                    ? 'text-pink-500 hover:bg-pink-50'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
                title="Toggle ambient aura glow"
              >
                <Sparkles className="w-3 h-3" />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDuplicate(card.id);
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                title="Duplicate card"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDelete(card.id);
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Delete card"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Drag Handle Top Bar */}
          <div
            onMouseDown={e => onStartDrag(e, card.id)}
            className="h-3 w-full cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity mb-1"
          >
            <div className="w-10 h-1 bg-neutral-300 rounded-full" />
          </div>

          {/* Actual Card Body Content */}
          <div className="relative z-10">{children}</div>
        </div>
      </div>

      {/* Connection Port Handles (Hover reveal: Top, Right, Bottom, Left) */}
      {(isHovered || isSelected) && (
        <>
          {/* Top Port */}
          <button
            onMouseDown={e => {
              e.stopPropagation();
              onStartConnect(e, card.id, 'top');
            }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-purple-500 shadow-md hover:scale-130 transition-transform cursor-crosshair z-40 flex items-center justify-center"
            title="Connect top port"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          </button>

          {/* Right Port */}
          <button
            onMouseDown={e => {
              e.stopPropagation();
              onStartConnect(e, card.id, 'right');
            }}
            className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-purple-500 shadow-md hover:scale-130 transition-transform cursor-crosshair z-40 flex items-center justify-center"
            title="Connect right port"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          </button>

          {/* Bottom Port */}
          <button
            onMouseDown={e => {
              e.stopPropagation();
              onStartConnect(e, card.id, 'bottom');
            }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-purple-500 shadow-md hover:scale-130 transition-transform cursor-crosshair z-40 flex items-center justify-center"
            title="Connect bottom port"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          </button>

          {/* Left Port */}
          <button
            onMouseDown={e => {
              e.stopPropagation();
              onStartConnect(e, card.id, 'left');
            }}
            className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-purple-500 shadow-md hover:scale-130 transition-transform cursor-crosshair z-40 flex items-center justify-center"
            title="Connect left port"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          </button>
        </>
      )}
    </div>
  );
};
