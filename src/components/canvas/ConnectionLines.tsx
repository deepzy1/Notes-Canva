import React from 'react';
import { Connection, CanvasCardItem } from '../../types/canvas';

interface ConnectionLinesProps {
  connections: Connection[];
  cards: CanvasCardItem[];
  pendingConnection: {
    fromId: string;
    fromSide: 'top' | 'right' | 'bottom' | 'left';
    currentX: number;
    currentY: number;
  } | null;
  onDeleteConnection?: (connId: string) => void;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  connections,
  cards,
  pendingConnection,
  onDeleteConnection,
}) => {
  // Map card positions for quick lookup
  const cardMap = new Map<string, CanvasCardItem>();
  cards.forEach(c => cardMap.set(c.id, c));

  const getPortCoordinates = (
    card: CanvasCardItem,
    side: 'top' | 'right' | 'bottom' | 'left'
  ) => {
    const width = card.width || 280;
    // Approximating card height based on type
    let estimatedHeight = 160;
    if (card.type === 'banner') estimatedHeight = 140;
    else if (card.type === 'flowchart') estimatedHeight = 250;
    else if (card.type === 'mindmap') estimatedHeight = 280;
    else if (card.type === 'code') estimatedHeight = 220;
    else if (card.type === 'datatypes') estimatedHeight = 240;
    else if (card.type === 'tasks') estimatedHeight = 220;
    else if (card.type === 'resources') estimatedHeight = 200;

    switch (side) {
      case 'top':
        return { x: card.x + width / 2, y: card.y };
      case 'bottom':
        return { x: card.x + width / 2, y: card.y + estimatedHeight };
      case 'left':
        return { x: card.x, y: card.y + estimatedHeight / 2 };
      case 'right':
        return { x: card.x + width, y: card.y + estimatedHeight / 2 };
    }
  };

  const getBezierPath = (
    x1: number,
    y1: number,
    fromSide: string,
    x2: number,
    y2: number,
    toSide: string
  ) => {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const offset = Math.max(dx * 0.45, dy * 0.45, 50);

    let cx1 = x1;
    let cy1 = y1;
    let cx2 = x2;
    let cy2 = y2;

    if (fromSide === 'right') cx1 += offset;
    else if (fromSide === 'left') cx1 -= offset;
    else if (fromSide === 'bottom') cy1 += offset;
    else if (fromSide === 'top') cy1 -= offset;

    if (toSide === 'left') cx2 -= offset;
    else if (toSide === 'right') cx2 += offset;
    else if (toSide === 'top') cy2 -= offset;
    else if (toSide === 'bottom') cy2 += offset;

    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  };

  return (
    <svg className="absolute inset-0 w-[4000px] h-[4000px] pointer-events-none z-1 overflow-visible">
      <defs>
        {/* Arrowhead markers */}
        {['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f97316', '#f59e0b', '#06b6d4'].map(
          color => (
            <marker
              key={color}
              id={`arrow-${color.replace('#', '')}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill={color} />
            </marker>
          )
        )}
      </defs>

      {/* Render saved connections */}
      {connections.map(conn => {
        const fromCard = cardMap.get(conn.fromId);
        const toCard = cardMap.get(conn.toId);
        if (!fromCard || !toCard) return null;

        const start = getPortCoordinates(fromCard, conn.fromSide);
        const end = getPortCoordinates(toCard, conn.toSide);
        const pathData = getBezierPath(
          start.x,
          start.y,
          conn.fromSide,
          end.x,
          end.y,
          conn.toSide
        );

        const strokeColor = conn.color || '#ec4899';
        const colorKey = strokeColor.replace('#', '');

        return (
          <g key={conn.id} className="group pointer-events-auto cursor-pointer">
            {/* Wider transparent hit-area path for easy hovering/clicking */}
            <path
              d={pathData}
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              onClick={() => {
                if (onDeleteConnection && confirm('Remove this connection line?')) {
                  onDeleteConnection(conn.id);
                }
              }}
            />
            {/* Visual smooth bezier path */}
            <path
              d={pathData}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeDasharray={conn.animated ? '6 4' : undefined}
              className={conn.animated ? 'animate-[dash_15s_linear_infinite]' : ''}
              markerEnd={`url(#arrow-${colorKey})`}
              opacity="0.85"
            />
            {/* Start & End dot handles */}
            <circle cx={start.x} cy={start.y} r="3.5" fill={strokeColor} />
          </g>
        );
      })}

      {/* Pending user dragging connection */}
      {pendingConnection && (() => {
        const fromCard = cardMap.get(pendingConnection.fromId);
        if (!fromCard) return null;
        const start = getPortCoordinates(fromCard, pendingConnection.fromSide);
        const pathData = getBezierPath(
          start.x,
          start.y,
          pendingConnection.fromSide,
          pendingConnection.currentX,
          pendingConnection.currentY,
          'left'
        );

        return (
          <path
            d={pathData}
            fill="none"
            stroke="#ec4899"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            opacity="0.9"
          />
        );
      })()}
    </svg>
  );
};
