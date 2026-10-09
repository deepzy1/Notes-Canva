import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
} from 'lucide-react';
import { TextStyle } from '../../types/canvas';

interface TextFormattingBarProps {
  textStyle: TextStyle;
  onChangeTextStyle: (style: TextStyle) => void;
  x: number;
  y: number;
}

const COLOR_PALETTE = [
  '#0f172a', // slate 900
  '#475569', // slate 600
  '#7c3aed', // violet 600
  '#2563eb', // blue 600
  '#059669', // emerald 600
  '#e11d48', // rose 600
  '#d97706', // amber 600
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 32];

export const TextFormattingBar: React.FC<TextFormattingBarProps> = ({
  textStyle,
  onChangeTextStyle,
  x,
  y,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%) translateY(-14px)',
      }}
      onClick={e => e.stopPropagation()}
      className="z-50 bg-white rounded-2xl shadow-xl border border-neutral-200/80 p-1.5 flex items-center space-x-1 select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Font Size Selector */}
      <select
        value={textStyle.fontSize || 14}
        onChange={e => onChangeTextStyle({ ...textStyle, fontSize: Number(e.target.value) })}
        className="text-xs font-semibold px-2 py-1 bg-neutral-100 rounded-lg border border-transparent focus:border-purple-300 outline-hidden cursor-pointer"
      >
        {FONT_SIZES.map(size => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>

      <div className="w-[1px] h-4 bg-neutral-200 mx-0.5" />

      {/* Bold */}
      <button
        onClick={() =>
          onChangeTextStyle({
            ...textStyle,
            fontWeight: textStyle.fontWeight === 'bold' ? 'normal' : 'bold',
          })
        }
        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
          textStyle.fontWeight === 'bold'
            ? 'bg-purple-100 text-purple-700 font-bold'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* Italic */}
      <button
        onClick={() =>
          onChangeTextStyle({
            ...textStyle,
            fontStyle: textStyle.fontStyle === 'italic' ? 'normal' : 'italic',
          })
        }
        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
          textStyle.fontStyle === 'italic'
            ? 'bg-purple-100 text-purple-700'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      {/* Underline */}
      <button
        onClick={() =>
          onChangeTextStyle({
            ...textStyle,
            textDecoration: textStyle.textDecoration === 'underline' ? 'none' : 'underline',
          })
        }
        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
          textStyle.textDecoration === 'underline'
            ? 'bg-purple-100 text-purple-700'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
        title="Underline"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-neutral-200 mx-0.5" />

      {/* Align Left */}
      <button
        onClick={() => onChangeTextStyle({ ...textStyle, textAlign: 'left' })}
        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
          textStyle.textAlign === 'left' || !textStyle.textAlign
            ? 'bg-purple-100 text-purple-700'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
        title="Align Left"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </button>

      {/* Align Center */}
      <button
        onClick={() => onChangeTextStyle({ ...textStyle, textAlign: 'center' })}
        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
          textStyle.textAlign === 'center'
            ? 'bg-purple-100 text-purple-700'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
        title="Align Center"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </button>

      {/* Align Right */}
      <button
        onClick={() => onChangeTextStyle({ ...textStyle, textAlign: 'right' })}
        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
          textStyle.textAlign === 'right'
            ? 'bg-purple-100 text-purple-700'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
        title="Align Right"
      >
        <AlignRight className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-neutral-200 mx-0.5" />

      {/* Color Palette Dots */}
      <div className="flex items-center space-x-1 pl-1">
        {COLOR_PALETTE.map(color => (
          <button
            key={color}
            onClick={() => onChangeTextStyle({ ...textStyle, textColor: color })}
            className="w-4 h-4 rounded-full border border-black/10 hover:scale-125 transition-transform cursor-pointer relative"
            style={{ backgroundColor: color }}
            title={color}
          >
            {textStyle.textColor === color && (
              <span className="absolute inset-0 rounded-full ring-2 ring-purple-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
