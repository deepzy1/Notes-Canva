import React from 'react';
import { Network, Sparkles } from 'lucide-react';

interface MindMapCardProps {
  title?: string;
  center?: string;
  topics?: { name: string; color: string }[];
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
};

export const MindMapCard: React.FC<MindMapCardProps> = ({
  title = 'Mind Map: Python Topics',
  center = 'Python',
  topics = [
    { name: 'Variables', color: 'blue' },
    { name: 'Data Types', color: 'emerald' },
    { name: 'Functions', color: 'pink' },
    { name: 'Lists & Dicts', color: 'purple' },
    { name: 'File Handling', color: 'rose' },
    { name: 'Modules', color: 'cyan' },
    { name: 'OOP', color: 'amber' },
    { name: 'Control Flow', color: 'yellow' },
  ],
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
            <Network className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
        </div>
        <Sparkles className="w-4 h-4 text-pink-400" />
      </div>

      {/* Radial Mind Map Area */}
      <div className="relative w-full h-52 bg-neutral-50/60 rounded-xl border border-neutral-200/60 overflow-hidden flex items-center justify-center">
        {/* SVG curved connector lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-purple-300/80 stroke-2 fill-none">
          {/* Curves from center (190, 104) to nodes */}
          <path d="M 190 104 Q 150 50 110 35" />
          <path d="M 190 104 Q 230 50 270 35" />
          <path d="M 190 104 Q 260 85 305 85" />
          <path d="M 190 104 Q 260 130 305 130" />
          <path d="M 190 104 Q 230 160 260 175" />
          <path d="M 190 104 Q 160 160 130 175" />
          <path d="M 190 104 Q 120 130 80 130" />
          <path d="M 190 104 Q 120 85 80 85" />
        </svg>

        {/* Center Node */}
        <div className="relative z-10 px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-md ring-4 ring-purple-100 flex items-center space-x-1.5">
          <span>{center}</span>
        </div>

        {/* Node 1: Top-Left (Variables) */}
        <div className="absolute top-2 left-16 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
          Variables
        </div>

        {/* Node 2: Top-Right (Data Types) */}
        <div className="absolute top-2 right-14 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
          Data Types
        </div>

        {/* Node 3: Mid-Right (Functions) */}
        <div className="absolute top-18 right-3 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-pink-100 text-pink-800 border border-pink-200 shadow-2xs">
          Functions
        </div>

        {/* Node 4: Lower-Right (Lists & Dicts) */}
        <div className="absolute top-28 right-3 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
          Lists & Dicts
        </div>

        {/* Node 5: Bottom-Right (File Handling) */}
        <div className="absolute bottom-2 right-16 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
          File Handling
        </div>

        {/* Node 6: Bottom-Left (Modules) */}
        <div className="absolute bottom-2 left-20 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200 shadow-2xs">
          Modules
        </div>

        {/* Node 7: Lower-Left (OOP) */}
        <div className="absolute top-28 left-6 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
          OOP
        </div>

        {/* Node 8: Mid-Left (Control Flow) */}
        <div className="absolute top-18 left-3 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-2xs">
          Control Flow
        </div>
      </div>
    </div>
  );
};
