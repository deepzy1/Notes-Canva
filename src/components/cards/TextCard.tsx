import React, { useState } from 'react';
import { TextStyle } from '../../types/canvas';

interface TextCardProps {
  id: string;
  text?: string;
  textStyle?: TextStyle;
  isEditing: boolean;
  onTextChange: (newText: string) => void;
  onStartEditing: () => void;
}

export const TextCard: React.FC<TextCardProps> = ({
  text = 'Double-click to type text...',
  textStyle = {},
  isEditing,
  onTextChange,
  onStartEditing,
}) => {
  const [localText, setLocalText] = useState(text);

  const style: React.CSSProperties = {
    fontSize: textStyle.fontSize ? `${textStyle.fontSize}px` : '16px',
    fontWeight: textStyle.fontWeight || 'normal',
    fontStyle: textStyle.fontStyle || 'normal',
    textDecoration: textStyle.textDecoration || 'none',
    textAlign: textStyle.textAlign || 'left',
    color: textStyle.textColor || '#1e293b',
    fontFamily: textStyle.fontFamily || 'inherit',
  };

  return (
    <div
      onDoubleClick={onStartEditing}
      className="p-2 min-w-[120px] min-h-[40px] flex items-center"
    >
      {isEditing ? (
        <textarea
          autoFocus
          value={localText}
          onChange={e => {
            setLocalText(e.target.value);
            onTextChange(e.target.value);
          }}
          onBlur={() => onTextChange(localText)}
          style={style}
          className="w-full bg-white/90 border border-purple-400 rounded-lg p-2 outline-hidden resize-none shadow-xs"
          rows={Math.max(1, localText.split('\n').length)}
        />
      ) : (
        <div style={style} className="whitespace-pre-wrap break-words leading-relaxed w-full">
          {text || <span className="text-neutral-400 italic">Empty text box</span>}
        </div>
      )}
    </div>
  );
};
