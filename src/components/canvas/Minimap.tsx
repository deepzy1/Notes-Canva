import React from 'react';
import { CanvasCardItem } from '../../types/canvas';
import { Maximize2 } from 'lucide-react';

interface MinimapProps {
  cards: CanvasCardItem[];
  pan: { x: number; y: number };
  zoom: number;
  onPanTo: (x: number, y: number) => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  cards,
  pan,
  zoom,
  onPanTo,
}) => {
  const mapWidth = 160;
  const mapHeight = 110;
  const scale = 0.08;

  return (
    <div className="absolute bottom-6 right-6 w-44 bg-white/90 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-lg p-2.5 z-20 select-none">
      <div className="flex items-center justify-between pb-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
        <span>Canvas Radar</span>
        <span className="text-purple-600">{cards.length} cards</span>
      </div>

      <div
        className="relative w-full h-24 bg-neutral-100/70 rounded-xl overflow-hidden border border-neutral-200/50 cursor-crosshair"
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          // Pan to target
          onPanTo(-clickX / scale + 300, -clickY / scale + 200);
        }}
      >
        {/* Render cards miniature */}
        {cards.map(card => {
          const cx = Math.max(0, Math.min(mapWidth, (card.x + 100) * scale));
          const cy = Math.max(0, Math.min(mapHeight, (card.y + 100) * scale));
          const cw = Math.max(4, (card.width || 280) * scale);
          const ch = 10;

          return (
            <div
              key={card.id}
              className="absolute rounded bg-purple-500/70 border border-purple-600/40"
              style={{
                left: `${cx}px`,
                top: `${cy}px`,
                width: `${cw}px`,
                height: `${ch}px`,
              }}
            />
          );
        })}

        {/* Viewport Box */}
        <div
          className="absolute border border-purple-500 bg-purple-500/10 rounded pointer-events-none"
          style={{
            left: `${Math.max(0, (-pan.x + 100) * scale)}px`,
            top: `${Math.max(0, (-pan.y + 100) * scale)}px`,
            width: `${Math.min(mapWidth, (800 / zoom) * scale)}px`,
            height: `${Math.min(mapHeight, (600 / zoom) * scale)}px`,
          }}
        />
      </div>
    </div>
  );
};
