import React from 'react';
import { Database } from 'lucide-react';

interface DataTypeItem {
  type: string;
  val: string;
  color?: string;
}

interface DataTypesCardProps {
  badgeNumber?: number;
  title?: string;
  description?: string;
  items?: DataTypeItem[];
}

const TYPE_COLOR_MAP: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50 border-blue-200/80', text: 'text-blue-700' },
  cyan: { bg: 'bg-cyan-50 border-cyan-200/80', text: 'text-cyan-700' },
  pink: { bg: 'bg-rose-50 border-rose-200/80', text: 'text-rose-700' },
  amber: { bg: 'bg-amber-50 border-amber-200/80', text: 'text-amber-700' },
  emerald: { bg: 'bg-emerald-50 border-emerald-200/80', text: 'text-emerald-700' },
  purple: { bg: 'bg-purple-50 border-purple-200/80', text: 'text-purple-700' },
};

export const DataTypesCard: React.FC<DataTypesCardProps> = ({
  badgeNumber = 3,
  title = 'Data Types',
  description = 'Python has several built-in data types.',
  items = [
    { type: 'int', val: '10', color: 'blue' },
    { type: 'float', val: '10.5', color: 'cyan' },
    { type: 'str', val: '"Hello"', color: 'pink' },
    { type: 'bool', val: 'True', color: 'amber' },
    { type: 'list', val: '[1, 2, 3]', color: 'emerald' },
    { type: 'dict', val: '{"name": "Deepak"}', color: 'purple' },
  ],
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {badgeNumber}
          </div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
        </div>
        <Database className="w-4 h-4 text-emerald-500" />
      </div>

      <p className="text-xs text-neutral-600">{description}</p>

      {/* Data items list */}
      <div className="space-y-1.5 font-mono text-xs">
        {items.map((item, idx) => {
          const colors = TYPE_COLOR_MAP[item.color || 'blue'] || TYPE_COLOR_MAP.blue;
          return (
            <div
              key={idx}
              className={`flex items-center justify-between px-2.5 py-1 rounded-xl border ${colors.bg}`}
            >
              <span className={`font-semibold ${colors.text}`}>{item.type}</span>
              <span className="text-neutral-700">{item.val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
