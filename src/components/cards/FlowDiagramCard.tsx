import React, { useState } from 'react';
import { GitBranch, Workflow, ArrowDown } from 'lucide-react';

interface FlowDiagramCardProps {
  title?: string;
  data?: Record<string, any>;
  onUpdate?: (data: Record<string, any>) => void;
}

export const FlowDiagramCard: React.FC<FlowDiagramCardProps> = ({
  title = 'Python Flow Diagram',
  data = {},
  onUpdate,
}) => {
  const [startText, setStartText] = useState(data.start || 'Start');
  const [inputText, setInputText] = useState(data.input || 'Read Input');
  const [condText, setCondText] = useState(data.condition || 'Condition?');
  const [yesText, setYesText] = useState(data.yes || 'Execute Block A');
  const [noText, setNoText] = useState(data.no || 'Execute Block B');
  const [endText, setEndText] = useState(data.end || 'End');

  const [editingNode, setEditingNode] = useState<string | null>(null);

  const save = () => {
    setEditingNode(null);
    if (onUpdate) {
      onUpdate({
        start: startText,
        input: inputText,
        condition: condText,
        yes: yesText,
        no: noText,
        end: endText,
      });
    }
  };

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

      {/* Visual Flow Diagram with editable nodes */}
      <div className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200/60 flex flex-col items-center space-y-1.5 text-xs font-medium">
        {/* Start */}
        {editingNode === 'start' ? (
          <input
            autoFocus
            type="text"
            value={startText}
            onChange={e => setStartText(e.target.value)}
            onBlur={save}
            className="px-3 py-1 text-xs rounded-full border border-blue-400 bg-white text-center"
          />
        ) : (
          <div
            onDoubleClick={() => setEditingNode('start')}
            className="px-5 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-700 font-bold shadow-2xs cursor-text"
            title="Double-click to edit node"
          >
            {startText}
          </div>
        )}

        <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />

        {/* Read Input */}
        {editingNode === 'input' ? (
          <input
            autoFocus
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onBlur={save}
            className="px-3 py-1 text-xs rounded-lg border border-teal-400 bg-white text-center"
          />
        ) : (
          <div
            onDoubleClick={() => setEditingNode('input')}
            className="px-4 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 shadow-2xs cursor-text"
            title="Double-click to edit node"
          >
            {inputText}
          </div>
        )}

        <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />

        {/* Condition Diamond */}
        <div className="relative my-0.5">
          {editingNode === 'cond' ? (
            <input
              autoFocus
              type="text"
              value={condText}
              onChange={e => setCondText(e.target.value)}
              onBlur={save}
              className="px-3 py-1 text-xs rounded border border-sky-400 bg-white text-center"
            />
          ) : (
            <div
              onDoubleClick={() => setEditingNode('cond')}
              className="px-4 py-1 rounded-md bg-sky-100 border border-sky-300 text-sky-800 font-semibold shadow-2xs cursor-text"
              title="Double-click to edit condition"
            >
              {condText}
            </div>
          )}
        </div>

        {/* Branches */}
        <div className="w-full grid grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-600">Yes</span>
            {editingNode === 'yes' ? (
              <input
                autoFocus
                type="text"
                value={yesText}
                onChange={e => setYesText(e.target.value)}
                onBlur={save}
                className="w-full text-center px-2 py-1 text-[11px] rounded border border-emerald-400 bg-white"
              />
            ) : (
              <div
                onDoubleClick={() => setEditingNode('yes')}
                className="w-full text-center px-2 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] shadow-2xs cursor-text"
                title="Double-click to edit branch"
              >
                {yesText}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center space-y-1">
            <span className="text-[10px] font-bold text-rose-500">No</span>
            {editingNode === 'no' ? (
              <input
                autoFocus
                type="text"
                value={noText}
                onChange={e => setNoText(e.target.value)}
                onBlur={save}
                className="w-full text-center px-2 py-1 text-[11px] rounded border border-rose-400 bg-white"
              />
            ) : (
              <div
                onDoubleClick={() => setEditingNode('no')}
                className="w-full text-center px-2 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] shadow-2xs cursor-text"
                title="Double-click to edit branch"
              >
                {noText}
              </div>
            )}
          </div>
        </div>

        <ArrowDown className="w-3.5 h-3.5 text-neutral-400 pt-0.5" />

        {/* End */}
        {editingNode === 'end' ? (
          <input
            autoFocus
            type="text"
            value={endText}
            onChange={e => setEndText(e.target.value)}
            onBlur={save}
            className="px-3 py-1 text-xs rounded-full border border-purple-400 bg-white text-center"
          />
        ) : (
          <div
            onDoubleClick={() => setEditingNode('end')}
            className="px-5 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-700 font-bold shadow-2xs cursor-text"
            title="Double-click to edit node"
          >
            {endText}
          </div>
        )}
      </div>
    </div>
  );
};
