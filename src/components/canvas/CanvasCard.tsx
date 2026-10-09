import React, { useState, useRef } from 'react';
import {
  X,
  Copy,
  Sparkles,
  Trash2,
  RotateCw,
  Lock,
  Unlock,
} from 'lucide-react';
import { CanvasCardItem, AccentColor } from '../../types/canvas';

interface CanvasCardProps {
  card: CanvasCardItem;
  isSelected: boolean;
  isMultiSelected?: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onStartDrag: (e: React.MouseEvent, cardId: string) => void;
  onStartResize: (e: React.MouseEvent, cardId: string, handle: string) => void;
  onStartRotate: (e: React.MouseEvent, cardId: string) => void;
  onDelete: (cardId: string) => void;
  onDuplicate: (cardId: string) => void;
  onToggleGlow: (cardId: string) => void;
  onStartConnect: (
    e: React.MouseEvent,
    cardId: string,
    side: 'top' | 'right' | 'bottom' | 'left'
  ) => void;
  onContextMenu: (e: React.MouseEvent, cardId: string) => void;
  isEditingText: boolean;
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
  isMultiSelected,
  onSelect,
  onStartDrag,
  onStartResize,
  onStartRotate,
  onDelete,
  onDuplicate,
  onToggleGlow,
  onStartConnect,
  onContextMenu,
  isEditingText,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const blobColor = ACCENT_BLOB_COLORS[card.accent] || '#8b5cf6';

  const width = card.width || 280;
  const height = card.height || 'auto';
  const rotation = card.rotation || 0;
  const zIndex = card.zIndex ?? (isSelected ? 35 : 10);

  const isShape = card.type === 'shape';
  const isText = card.type === 'text';

  return (
    <div
      style={{
        position: 'absolute',
        left: `${card.x}px`,
        top: `${card.y}px`,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: 'center center',
        zIndex,
      }}
      onClick={onSelect}
      onContextMenu={e => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, card.id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group cursor-default select-none transition-shadow ${
        isSelected ? 'z-30' : ''
      }`}
    >
      {/* 1. Selection Bounding Box with Resize Handles */}
      {isSelected && (
        <div className="absolute -inset-1 border-2 border-purple-500 rounded-2xl pointer-events-none z-40">
          {/* Rotation Stalk and Handle */}
          <div
            onMouseDown={e => {
              e.stopPropagation();
              onStartRotate(e, card.id);
            }}
            className="absolute -top-7 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-purple-600 rounded-full shadow-md cursor-grab active:cursor-grabbing pointer-events-auto flex items-center justify-center hover:scale-125 transition-transform"
            title="Rotate element"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-purple-500" />
          </div>

          {/* 8-point Resize Handles */}
          {/* Top-Left (NW) */}
          <div
            onMouseDown={e => {
              e.stopPropagation();
              onStartResize(e, card.id, 'nw');
            }}
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-purple-600 rounded-xs cursor-nwse-resize pointer-events-auto shadow-xs hover:scale-125 transition-transform"
          />
          {/* Top-Center (N) */}
          <div
            onMouseDown={e => {
              e.stopPropagation();
              onStartResize(e, card.id, 'n');
            }}
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-purple-600 rounded-xs cursor-ns-resize pointer-events-auto shadow-xs hover:scale-125 transition-transform"
          />
          {/* Top-Right (NE) */}
          <div
            onMouseDown={e => {
              e.stopPropagation();
              onStartResize(e, card.id, 'ne');
            }}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-purple-600 rounded-xs cursor-nesw-resize pointer-events-auto shadow-xs hover:scale-125 transition-transform"
          />
          {/* Mid-Right (E) */}
          <div
            onMouseDown={e => {
              e.stopPropagation();
              onStartResize(e, card.id, 'e');
            }}
            className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-purple-600 rounded-xs cursor-ew-resize pointer-events-auto shadow-xs hover:scale-125 transition-transform"
          />
          {/* Bottom-Right (SE) */}
          <div
            onMouseDown={e => {
              e.stopPropagation();
              onStartResize(e, card.id, 'se');
            }}
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-purple-600 rounded-xs cursor-nwse-resize pointer-events-auto shadow-xs hover:scale-125 transition-transform"
          />
          {/* Bottom-Center (S) */}
          <div
            onMouseDown={e => {
              e.stopPropagation();
              onStartResize(e, card.id, 's');
            }}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-purple-600 rounded-xs cursor-ns-resize pointer-events-auto shadow-xs hover:scale-125 transition-transform"
          />
          {/* Bottom-Left (SW) */}
          <div
            onMouseDown={e => {
              e.stopPropagation();
              onStartResize(e, card.id, 'sw');
            }}
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-purple-600 rounded-xs cursor-nesw-resize pointer-events-auto shadow-xs hover:scale-125 transition-transform"
          />
          {/* Mid-Left (W) */}
          <div
            onMouseDown={e => {
              e.stopPropagation();
              onStartResize(e, card.id, 'w');
            }}
            className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-purple-600 rounded-xs cursor-ew-resize pointer-events-auto shadow-xs hover:scale-125 transition-transform"
          />
        </div>
      )}

      {/* 2. Outer Card Shell */}
      <div
        className={`relative w-full h-full rounded-2xl overflow-hidden transition-all duration-200 ${
          isShape || isText
            ? ''
            : isSelected
            ? 'shadow-2xl'
            : 'shadow-[0_10px_30px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl'
        }`}
      >
        {/* Animated Blob Glow behind frosted glass */}
        {card.hasGlow && !isShape && !isText && (
          <div
            className="absolute z-1 -top-8 -left-8 w-44 h-44 rounded-full opacity-70 filter blur-xl animate-blob-bounce pointer-events-none"
            style={{ backgroundColor: blobColor }}
          />
        )}

        {/* Card Surface Container */}
        <div
          className={`relative z-2 w-full h-full overflow-hidden ${
            isShape || isText
              ? ''
              : 'bg-white/95 backdrop-blur-xl border border-white/80 rounded-2xl p-4'
          }`}
        >
          {/* Quick Action Floating Bar on Hover */}
          {!isEditingText && (isHovered || isSelected) && !isText && (
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
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDelete(card.id);
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Delete (Del)"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Drag Handle Top Bar */}
          {!isEditingText && (
            <div
              onMouseDown={e => onStartDrag(e, card.id)}
              className="h-3 w-full cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity mb-1"
            >
              <div className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>
          )}

          {/* Card Body / Render Target */}
          <div
            onMouseDown={e => {
              if (!isEditingText) {
                onStartDrag(e, card.id);
              }
            }}
            className="relative z-10 w-full h-full"
          >
            {children}
          </div>
        </div>
      </div>

      {/* 3. Connection Ports (Top, Right, Bottom, Left) */}
      {(isHovered || isSelected) && !isEditingText && (
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
