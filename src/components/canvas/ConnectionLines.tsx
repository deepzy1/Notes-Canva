import React, { useState } from 'react';
import { Connection, CanvasCardItem } from '../../types/canvas';
import { Trash2 } from 'lucide-react';

interface ConnectionLinesProps {
  connections: Connection[];
  cards: CanvasCardItem[];
  pendingConnection: {
    fromId: string;
    fromSide: 'top' | 'right' | 'bottom' | 'left';
    currentX: number;
    currentY: number;
  } | null;
  selectedConnectionId?: string | null;
  onSelectConnection?: (connId: string | null) => void;
  onDeleteConnection?: (connId: string) => void;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  connections,
  cards,
  pendingConnection,
  selectedConnectionId,
  onSelectConnection,
  onDeleteConnection,
}) => {
  const cardMap = new Map<string, CanvasCardItem>();
  cards.forEach(c => cardMap.set(c.id, c));

  const [hoveredConnId, setHoveredConnId] = useState<string | null>(null);

  const getPortCoordinates = (
    card: CanvasCardItem,
    side: 'top' | 'right' | 'bottom' | 'left'
  ) => {
    const width = card.width || 280;
    let height = card.height;
    if (typeof height !== 'number') {
      if (card.type === 'banner') height = 140;
      else if (card.type === 'flowchart') height = 260;
      else if (card.type === 'mindmap') height = 280;
      else if (card.type === 'code') height = 230;
      else if (card.type === 'datatypes') height = 240;
      else if (card.type === 'tasks') height = 230;
      else if (card.type === 'resources') height = 200;
      else if (card.type === 'shape') height = 120;
      else if (card.type === 'text') height = 60;
      else height = 170;
    }

    switch (side) {
      case 'top':
        return { x: card.x + width / 2, y: card.y };
      case 'bottom':
        return { x: card.x + width / 2, y: card.y + height };
      case 'left':
        return { x: card.x, y: card.y + height / 2 };
      case 'right':
        return { x: card.x + width, y: card.y + height / 2 };
    }
  };

  const getBezierPath = (
    x1: number,
    y1: number,
    fromSide: string,
    x2: number,
    y2: number,
    toSide: string,
    style?: 'curved' | 'straight' | 'dashed'
  ) => {
    if (style === 'straight') {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const offset = Math.max(dx * 0.45, dy * 0.45, 40);

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
    <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none z-5 overflow-visible">
      <defs>
        {/* Directional arrowhead markers */}
        {['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f97316', '#f59e0b', '#06b6d4', '#475569'].map(
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

      {/* Render active connections */}
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
          conn.toSide,
          conn.style
        );

        const strokeColor = conn.color || '#ec4899';
        const colorKey = strokeColor.replace('#', '');
        const isSelected = selectedConnectionId === conn.id;
        const isHovered = hoveredConnId === conn.id;

        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        return (
          <g
            key={conn.id}
            className="group pointer-events-auto cursor-pointer"
            onMouseEnter={() => setHoveredConnId(conn.id)}
            onMouseLeave={() => setHoveredConnId(null)}
            onClick={e => {
              e.stopPropagation();
              if (onSelectConnection) onSelectConnection(conn.id);
            }}
          >
            {/* Hit testing fat path */}
            <path
              d={pathData}
              fill="none"
              stroke="transparent"
              strokeWidth="20"
            />

            {/* Selection highlight aura */}
            {isSelected && (
              <path
                d={pathData}
                fill="none"
                stroke="#a855f7"
                strokeWidth="7"
                opacity="0.4"
              />
            )}

            {/* Main visual bezier path */}
            <path
              d={pathData}
              fill="none"
              stroke={strokeColor}
              strokeWidth={isSelected || isHovered ? '3.5' : '2.5'}
              strokeDasharray={conn.style === 'dashed' || conn.animated ? '6 4' : undefined}
              className={conn.animated ? 'animate-[dash_15s_linear_infinite]' : ''}
              markerEnd={`url(#arrow-${colorKey})`}
              opacity={isSelected || isHovered ? '1' : '0.85'}
            />

            {/* Connector Port Dots */}
            <circle cx={start.x} cy={start.y} r="4" fill={strokeColor} />
            <circle cx={end.x} cy={end.y} r="3" fill={strokeColor} />

            {/* Quick delete button at midpoint on hover or selection */}
            {(isHovered || isSelected) && onDeleteConnection && (
              <g
                transform={`translate(${midX - 10}, ${midY - 10})`}
                onClick={e => {
                  e.stopPropagation();
                  onDeleteConnection(conn.id);
                }}
                className="cursor-pointer hover:scale-125 transition-transform"
              >
                <circle cx="10" cy="10" r="10" fill="#ef4444" />
                <path
                  d="M 6 6 L 14 14 M 14 6 L 6 14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
        );
      })}

      {/* Pending user dragging connection line */}
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
            stroke="#a855f7"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            opacity="0.9"
          />
        );
      })()}
    </svg>
  );
};
