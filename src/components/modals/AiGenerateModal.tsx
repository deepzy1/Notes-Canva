import React, { useState } from 'react';
import { Sparkles, X, Wand2, Loader2, BookOpen, Cpu, Terminal } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { CanvasCardItem, Connection } from '../../types/canvas';

interface AiGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCards: (cards: CanvasCardItem[], connections: Connection[], title?: string) => void;
}

export const AiGenerateModal: React.FC<AiGenerateModalProps> = ({
  isOpen,
  onClose,
  onApplyCards,
}) => {
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const presets = [
    {
      title: 'Python Asyncio & Concurrency',
      text: 'Explain Python asyncio, event loops, tasks, awaitable coroutines with code examples, common pitfalls, and practice exercises.',
    },
    {
      title: 'FastAPI Architecture & Dependency Injection',
      text: 'Build a roadmap for FastAPI with Pydantic validation, dependency injection, async route handlers, and database connections.',
    },
    {
      title: 'Docker & Containerization Workflow',
      text: 'Visual guide to Dockerfiles, images, containers, volumes, multi-stage builds, and docker-compose networking.',
    },
    {
      title: 'Object-Oriented Design in Python',
      text: 'Classes, dunder methods (__init__, __str__, __repr__), inheritance, composition, and dataclasses in Python.',
    },
  ];

  const handleGenerate = async () => {
    if (!promptText.trim()) return;
    setIsLoading(true);

    try {
      const result = await geminiService.generateCardsFromText(promptText);
      onApplyCards(result.cards, result.connections, result.title);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-pink-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white/20 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                AI Text-to-Canvas Generator
              </h3>
              <p className="text-xs text-neutral-500">
                Paste any text or lecture notes to auto-generate visual roadmap cards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Enter topic, notes, or code to structure:
            </label>
            <textarea
              rows={4}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder="e.g. Paste documentation for Rust Memory Ownership, Python Decorators, or CSS Grid..."
              className="w-full text-xs p-3.5 rounded-2xl border border-neutral-200 focus:border-purple-400 focus:ring-3 focus:ring-purple-100 transition-all outline-hidden text-neutral-800 placeholder-neutral-400"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Popular Presets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptText(preset.text)}
                  className="text-left p-2.5 rounded-xl border border-neutral-200/80 hover:border-purple-300 hover:bg-purple-50/40 transition-all text-xs group cursor-pointer"
                >
                  <p className="font-semibold text-neutral-800 group-hover:text-purple-700">
                    {preset.title}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {preset.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Powered by Google Gemini API
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !promptText.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center space-x-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Cards...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Visual Canvas</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
