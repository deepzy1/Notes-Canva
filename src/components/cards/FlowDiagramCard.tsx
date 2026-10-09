import React from 'react';
import { GitBranch, Workflow, ArrowDown, ArrowRight, CornerDownRight } from 'lucide-react';

interface FlowDiagramCardProps {
  title?: string;
}

export const FlowDiagramCard: React.FC<FlowDiagramCardProps> = ({
  title = 'Python Flow Diagram',
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <Workflow className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
        </div>
        <GitBranch className="w-4 h-4 text-neutral-300" />
      </div>

      {/* Visual Flow Diagram */}
      <div className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200/60 flex flex-col items-center space-y-1.5 text-xs font-medium">
        {/* Start */}
        <div className="px-5 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-700 font-bold shadow-2xs">
          Start
        </div>

        <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />

        {/* Read Input */}
        <div className="px-4 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 shadow-2xs">
          Read Input
        </div>

        <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />

        {/* Condition Diamond */}
        <div className="relative my-0.5">
          <div className="px-4 py-1 rounded-md bg-sky-100 border border-sky-300 text-sky-800 font-semibold shadow-2xs">
            Condition?
          </div>
        </div>

        {/* Branches: Yes & No */}
        <div className="w-full grid grid-cols-2 gap-3 pt-1">
          {/* Yes branch */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-600">Yes</span>
            <div className="w-full text-center px-2 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] shadow-2xs">
              Execute Block A
            </div>
          </div>

          {/* No branch */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[10px] font-bold text-rose-500">No</span>
            <div className="w-full text-center px-2 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] shadow-2xs">
              Execute Block B
            </div>
          </div>
        </div>

        <ArrowDown className="w-3.5 h-3.5 text-neutral-400 pt-0.5" />

        {/* End */}
        <div className="px-5 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-700 font-bold shadow-2xs">
          End
        </div>
      </div>
    </div>
  );
};
