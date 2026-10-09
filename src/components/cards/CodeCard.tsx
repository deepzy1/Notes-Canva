import React, { useState } from 'react';
import { Copy, Check, Play, CornerDownRight, Edit2 } from 'lucide-react';
import { AccentColor } from '../../types/canvas';

interface CodeCardProps {
  badgeNumber?: number;
  title: string;
  description: string;
  language?: string;
  code: string;
  output?: string;
  accent?: AccentColor;
  onUpdate?: (updated: { title?: string; description?: string; code?: string; output?: string }) => void;
}

const BADGE_COLOR_MAP: Record<AccentColor, string> = {
  pink: 'bg-pink-500 text-white',
  blue: 'bg-blue-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  orange: 'bg-orange-500 text-white',
  purple: 'bg-purple-500 text-white',
  yellow: 'bg-amber-500 text-white',
  cyan: 'bg-cyan-500 text-white',
  rose: 'bg-rose-500 text-white',
};

export const CodeCard: React.FC<CodeCardProps> = ({
  badgeNumber = 2,
  title,
  description,
  language = 'python',
  code,
  output,
  accent = 'blue',
  onUpdate,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [localTitle, setLocalTitle] = useState(title);
  const [localCode, setLocalCode] = useState(code);
  const [currentOutput, setCurrentOutput] = useState(output);

  const badgeStyle = BADGE_COLOR_MAP[accent] || 'bg-blue-500 text-white';

  const handleCopy = () => {
    navigator.clipboard.writeText(localCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      // Simple simulated output based on print statements
      const prints = localCode
        .split('\n')
        .filter(l => l.trim().startsWith('print('))
        .map(l => {
          const match = l.match(/print\((.*)\)/);
          return match ? match[1].replace(/["']/g, '') : '';
        })
        .filter(Boolean);

      const computed = prints.length > 0 ? prints.join('\n') : (output || 'Executed without output.');
      setCurrentOutput(computed);
      if (onUpdate) onUpdate({ output: computed });
    }, 300);
  };

  const saveTitle = () => {
    setIsEditingTitle(false);
    if (onUpdate) onUpdate({ title: localTitle });
  };

  const saveCode = () => {
    setIsEditingCode(false);
    if (onUpdate) onUpdate({ code: localCode });
  };

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5 flex-1 pr-2">
          <div
            className={`w-6 h-6 rounded-lg ${badgeStyle} font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0`}
          >
            {badgeNumber}
          </div>

          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={localTitle}
              onChange={e => setLocalTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={e => e.key === 'Enter' && saveTitle()}
              className="text-sm font-bold text-neutral-900 border border-purple-400 rounded px-1.5 py-0.5 outline-hidden w-full bg-white"
            />
          ) : (
            <h2
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-sm font-bold text-neutral-900 tracking-tight cursor-text hover:text-purple-700"
              title="Double-click to edit title"
            >
              {localTitle}
            </h2>
          )}
        </div>
        <CornerDownRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
      </div>

      <p className="text-xs text-neutral-600">{description}</p>

      {/* Code Window */}
      <div className="rounded-xl overflow-hidden bg-[#1e293b] text-neutral-200 text-xs font-mono shadow-inner border border-neutral-700/50">
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0f172a] border-b border-neutral-700/50 text-[11px] text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <span className="w-2 h-2 rounded-full bg-green-500/80" />
            <span className="pl-1 text-neutral-400 font-sans font-medium">{language}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsEditingCode(!isEditingCode)}
              className="p-1 hover:text-sky-300 text-neutral-400 rounded transition-colors cursor-pointer"
              title="Edit code directly"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={handleRun}
              className="p-1 hover:text-green-400 text-neutral-400 rounded transition-colors cursor-pointer"
              title="Run Code"
            >
              <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleCopy}
              className="p-1 hover:text-white text-neutral-400 rounded transition-colors cursor-pointer"
              title="Copy code"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Code Content or Editable Textarea */}
        <div className="p-3 leading-relaxed">
          {isEditingCode ? (
            <textarea
              autoFocus
              rows={5}
              value={localCode}
              onChange={e => setLocalCode(e.target.value)}
              onBlur={saveCode}
              className="w-full bg-transparent text-sky-300 font-mono text-[11px] outline-hidden resize-none border-b border-sky-500/50"
            />
          ) : (
            <pre
              onDoubleClick={() => setIsEditingCode(true)}
              className="text-[11px] cursor-text"
              title="Double-click to edit code"
            >
              {localCode.split('\n').map((line, idx) => (
                <div key={idx} className="flex">
                  <span className="select-none text-neutral-600 w-5 text-right pr-2">
                    {idx + 1}
                  </span>
                  <span className="text-sky-300">{line}</span>
                </div>
              ))}
            </pre>
          )}
        </div>
      </div>

      {/* Output Console Box */}
      {currentOutput && (
        <div className="bg-neutral-50 rounded-xl p-2.5 border border-neutral-200/80 text-[11px]">
          <span className="text-neutral-400 font-medium block mb-0.5">Output:</span>
          <span className="font-mono text-neutral-800 font-semibold">{currentOutput}</span>
        </div>
      )}
    </div>
  );
};
