import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Double-Click', desc: 'Edit element text directly' },
    { key: 'Ctrl + C / ⌘ + C', desc: 'Copy selected element(s)' },
    { key: 'Ctrl + V / ⌘ + V', desc: 'Paste copied element(s)' },
    { key: 'Ctrl + X / ⌘ + X', desc: 'Cut selected element(s)' },
    { key: 'Ctrl + D / ⌘ + D', desc: 'Duplicate selected element(s)' },
    { key: 'Delete / Backspace', desc: 'Delete selected element(s) or connections' },
    { key: 'Ctrl + Z / ⌘ + Z', desc: 'Undo last canvas action' },
    { key: 'Ctrl + Y / ⌘ + Shift + Z', desc: 'Redo previously undone action' },
    { key: 'Ctrl + A / ⌘ + A', desc: 'Select all elements on canvas' },
    { key: 'Ctrl + G / ⌘ + G', desc: 'Group selected elements' },
    { key: 'Ctrl + Shift + G', desc: 'Ungroup selected group' },
    { key: 'Shift + Click', desc: 'Add/remove element from multi-selection' },
    { key: 'Space + Drag', desc: 'Pan canvas freely' },
    { key: 'Mouse Wheel', desc: 'Pan vertically (or Zoom with Ctrl)' },
    { key: 'Escape', desc: 'Deselect all elements or exit text editing' },
    { key: 'Right Click', desc: 'Open context menu with layering and actions' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Keyboard Shortcuts</h3>
              <p className="text-[11px] text-neutral-400">Power controls for high-speed diagramming</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/50 text-xs"
              >
                <span className="text-neutral-600 font-medium truncate pr-2">{s.desc}</span>
                <kbd className="px-2 py-0.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 font-mono text-[11px] font-semibold shadow-2xs whitespace-nowrap">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
