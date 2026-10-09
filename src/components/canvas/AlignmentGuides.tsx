import React from 'react';
import { SnapGuide } from '../../types/canvas';

interface AlignmentGuidesProps {
  guides: SnapGuide[];
}

export const AlignmentGuides: React.FC<AlignmentGuidesProps> = ({ guides }) => {
  if (!guides || guides.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible">
      {guides.map((g, idx) => {
        if (g.type === 'vertical') {
          return (
            <line
              key={idx}
              x1={g.pos}
              y1={g.start}
              x2={g.pos}
              y2={g.end}
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          );
        } else {
          return (
            <line
              key={idx}
              x1={g.start}
              y1={g.pos}
              x2={g.end}
              y2={g.pos}
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          );
        }
      })}
    </svg>
  );
};
