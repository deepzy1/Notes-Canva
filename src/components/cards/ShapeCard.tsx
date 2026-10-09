import React, { useState } from 'react';
import { ShapeSubtype, ShapeStyle, TextStyle } from '../../types/canvas';

interface ShapeCardProps {
  id: string;
  width: number;
  height: number;
  shapeStyle?: ShapeStyle;
  textStyle?: TextStyle;
  text?: string;
  isEditing: boolean;
  onTextChange: (newText: string) => void;
  onStartEditing: () => void;
}

export const ShapeCard: React.FC<ShapeCardProps> = ({
  width,
  height,
  shapeStyle = {},
  textStyle = {},
  text = 'Double-click to edit',
  isEditing,
  onTextChange,
  onStartEditing,
}) => {
  const subtype = shapeStyle.subtype || 'rectangle';
  const fillColor = shapeStyle.fillColor || '#f8fafc';
  const strokeColor = shapeStyle.strokeColor || '#94a3b8';
  const strokeWidth = shapeStyle.strokeWidth || 2;
  const strokeDash =
    shapeStyle.strokeStyle === 'dashed'
      ? '6 4'
      : shapeStyle.strokeStyle === 'dotted'
      ? '2 2'
      : undefined;

  const [localText, setLocalText] = useState(text);

  const textCss: React.CSSProperties = {
    fontSize: textStyle.fontSize ? `${textStyle.fontSize}px` : '14px',
    fontWeight: textStyle.fontWeight || 'normal',
    fontStyle: textStyle.fontStyle || 'normal',
    textDecoration: textStyle.textDecoration || 'none',
    textAlign: textStyle.textAlign || 'center',
    color: textStyle.textColor || '#1e293b',
    fontFamily: textStyle.fontFamily || 'inherit',
  };

  const renderShapeSvg = () => {
    const w = width || 160;
    const h = height || 120;
    const pad = strokeWidth / 2;

    switch (subtype) {
      case 'circle':
        return (
          <ellipse
            cx={w / 2}
            cy={h / 2}
            rx={Math.max(2, w / 2 - pad)}
            ry={Math.max(2, h / 2 - pad)}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'diamond':
        return (
          <polygon
            points={`${w / 2},${pad} ${w - pad},${h / 2} ${w / 2},${h - pad} ${pad},${h / 2}`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'triangle':
        return (
          <polygon
            points={`${w / 2},${pad} ${w - pad},${h - pad} ${pad},${h - pad}`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'star': {
        const cx = w / 2;
        const cy = h / 2;
        const spikes = 5;
        const outerRadius = Math.min(w, h) / 2 - pad;
        const innerRadius = outerRadius / 2.2;
        let points = '';
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;

        for (let i = 0; i < spikes; i++) {
          let x = cx + Math.cos(rot) * outerRadius;
          let y = cy + Math.sin(rot) * outerRadius;
          points += `${x},${y} `;
          rot += step;

          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          points += `${x},${y} `;
          rot += step;
        }

        return (
          <polygon
            points={points.trim()}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );
      }

      case 'sticky':
        return (
          <g>
            <rect
              x={pad}
              y={pad}
              width={w - strokeWidth}
              height={h - strokeWidth}
              rx={6}
              fill="#fef08a"
              stroke="#eab308"
              strokeWidth={strokeWidth}
            />
            {/* Folded corner */}
            <path
              d={`M ${w - 18} ${pad} L ${w - pad} ${18} L ${w - 18} ${18} Z`}
              fill="#fde047"
              stroke="#ca8a04"
              strokeWidth={1}
            />
          </g>
        );

      case 'rounded_rectangle':
        return (
          <rect
            x={pad}
            y={pad}
            width={w - strokeWidth}
            height={h - strokeWidth}
            rx={16}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );

      case 'rectangle':
      default:
        return (
          <rect
            x={pad}
            y={pad}
            width={w - strokeWidth}
            height={h - strokeWidth}
            rx={4}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        );
    }
  };

  return (
    <div
      onDoubleClick={onStartEditing}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ opacity: shapeStyle.opacity ?? 1 }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        width={width}
        height={height}
      >
        {renderShapeSvg()}
      </svg>

      {/* Text layer inside shape */}
      <div className="relative z-10 p-4 max-w-full max-h-full overflow-hidden flex items-center justify-center">
        {isEditing ? (
          <textarea
            autoFocus
            value={localText}
            onChange={e => {
              setLocalText(e.target.value);
              onTextChange(e.target.value);
            }}
            onBlur={() => onTextChange(localText)}
            style={textCss}
            className="bg-white/80 border border-purple-400 rounded p-1 outline-hidden resize-none w-full"
            rows={Math.max(1, localText.split('\n').length)}
          />
        ) : (
          <span style={textCss} className="whitespace-pre-wrap break-words leading-tight">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};
