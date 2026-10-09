import React, { useState } from 'react';
import { X, Copy, Check, Download, Upload, RotateCcw, Share2, Globe, QrCode } from 'lucide-react';
import { CanvasCardItem, Connection } from '../../types/canvas';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: CanvasCardItem[];
  connections: Connection[];
  canvasName: string;
  onImportData: (data: { cards: CanvasCardItem[]; connections: Connection[]; name?: string }) => void;
  onResetCanvas: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  cards,
  connections,
  canvasName,
  onImportData,
  onResetCanvas,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportJson = () => {
    const payload = JSON.stringify({ name: canvasName, cards, connections }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${canvasName.toLowerCase().replace(/\s+/g, '-')}-canvas.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.cards) {
          onImportData(parsed);
          onClose();
        }
      } catch (err) {
        alert('Invalid canvas JSON format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Share & Export Canvas</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Share Link */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Workspace Live URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Export / Import */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleExportJson}
              className="p-3 rounded-2xl border border-neutral-200 hover:border-purple-300 hover:bg-purple-50/50 flex flex-col items-center justify-center space-y-1.5 transition-all text-neutral-800 cursor-pointer"
            >
              <Download className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-bold">Export JSON</span>
              <span className="text-[10px] text-neutral-400">Save workspace backup</span>
            </button>

            <label className="p-3 rounded-2xl border border-neutral-200 hover:border-purple-300 hover:bg-purple-50/50 flex flex-col items-center justify-center space-y-1.5 transition-all text-neutral-800 cursor-pointer">
              <Upload className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold">Import JSON</span>
              <span className="text-[10px] text-neutral-400">Load canvas file</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Reset Workspace Option */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Need a fresh start?</span>
            <button
              onClick={() => {
                if (confirm('Reset workspace back to original Python Basics course?')) {
                  onResetCanvas();
                  onClose();
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
