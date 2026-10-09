import React from 'react';
import { Globe, BarChart2, Settings, Cpu, Layers } from 'lucide-react';

interface ImageConceptCardProps {
  title?: string;
}

export const ImageConceptCard: React.FC<ImageConceptCardProps> = ({
  title = 'Image / Concept',
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Ecosystem Canvas */}
      <div className="relative p-3 bg-neutral-50/70 rounded-xl border border-neutral-200/60 flex flex-col items-center justify-center min-h-[140px]">
        {/* Top Two Modules */}
        <div className="w-full flex justify-between items-center px-1 mb-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-cyan-600" />
            <span>Web Dev</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold shadow-2xs">
            <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data Analysis</span>
          </div>
        </div>

        {/* Central Python Logo */}
        <div className="my-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-neutral-200/80 flex items-center justify-center">
            <span className="font-extrabold text-lg tracking-tighter bg-gradient-to-tr from-blue-600 to-amber-500 bg-clip-text text-transparent">
              Python
            </span>
          </div>
        </div>

        {/* Bottom Two Modules */}
        <div className="w-full flex justify-between items-center px-1 mt-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold shadow-2xs">
            <Settings className="w-3.5 h-3.5 text-amber-600" />
            <span>Automation</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-semibold shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>Machine Learning</span>
          </div>
        </div>
      </div>
    </div>
  );
};
