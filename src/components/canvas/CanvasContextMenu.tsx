import React from 'react';
import {
  Copy,
  Scissors,
  ClipboardPaste,
  Trash2,
  Layers,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Edit2,
  Group,
  Ungroup,
  Plus,
  Type,
  Square,
  Circle,
  Diamond,
} from 'lucide-react';
import { ContextMenuState } from '../../types/canvas';

interface CanvasContextMenuProps {
  state: ContextMenuState;
  onClose: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onToggleGlow: () => void;
  onStartEditText: () => void;
  onAddElement: (type: string, subtype?: string) => void;
  onSelectAll: () => void;
  onResetZoom: () => void;
  canPaste: boolean;
  isMultiSelect: boolean;
}

export const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  state,
  onClose,
  onCut,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  onBringToFront,
  onSendToBack,
  onGroup,
  onUngroup,
  onToggleGlow,
  onStartEditText,
  onAddElement,
  onSelectAll,
  onResetZoom,
  canPaste,
  isMultiSelect,
}) => {
  if (!state.isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${state.x}px`,
        top: `${state.y}px`,
      }}
      onClick={e => e.stopPropagation()}
      className="z-50 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-200/80 p-1.5 text-xs text-neutral-800 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {state.targetType === 'card' ? (
        <div className="space-y-0.5">
          <button
            onClick={() => {
              onStartEditText();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Edit2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Edit Text</span>
            </div>
            <span className="text-[10px] text-neutral-400">Double-Click</span>
          </button>

          <button
            onClick={() => {
              onCopy();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Copy className="w-3.5 h-3.5 text-neutral-500" />
              <span>Copy</span>
            </div>
            <span className="text-[10px] text-neutral-400">Ctrl+C</span>
          </button>

          <button
            onClick={() => {
              onCut();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Scissors className="w-3.5 h-3.5 text-neutral-500" />
              <span>Cut</span>
            </div>
            <span className="text-[10px] text-neutral-400">Ctrl+X</span>
          </button>

          <button
            onClick={() => {
              onDuplicate();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Copy className="w-3.5 h-3.5 text-neutral-500" />
              <span>Duplicate</span>
            </div>
            <span className="text-[10px] text-neutral-400">Ctrl+D</span>
          </button>

          <div className="h-[1px] bg-neutral-200/80 my-1" />

          {/* Layering */}
          <button
            onClick={() => {
              onBringToFront();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <ArrowUp className="w-3.5 h-3.5 text-neutral-500" />
              <span>Bring to Front</span>
            </div>
          </button>

          <button
            onClick={() => {
              onSendToBack();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <ArrowDown className="w-3.5 h-3.5 text-neutral-500" />
              <span>Send to Back</span>
            </div>
          </button>

          {/* Grouping */}
          {isMultiSelect ? (
            <button
              onClick={() => {
                onGroup();
                onClose();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Group className="w-3.5 h-3.5 text-neutral-500" />
                <span>Group Elements</span>
              </div>
              <span className="text-[10px] text-neutral-400">Ctrl+G</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onUngroup();
                onClose();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Ungroup className="w-3.5 h-3.5 text-neutral-500" />
                <span>Ungroup</span>
              </div>
            </button>
          )}

          <button
            onClick={() => {
              onToggleGlow();
              onClose();
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Toggle Glow Aura</span>
          </button>

          <div className="h-[1px] bg-neutral-200/80 my-1" />

          {/* Delete */}
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors cursor-pointer font-medium"
          >
            <div className="flex items-center space-x-2">
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete</span>
            </div>
            <span className="text-[10px] text-red-400">Del</span>
          </button>
        </div>
      ) : (
        /* Canvas Context Menu */
        <div className="space-y-0.5">
          <button
            onClick={() => {
              onPaste();
              onClose();
            }}
            disabled={!canPaste}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors ${
              canPaste
                ? 'hover:bg-neutral-100 text-neutral-800 cursor-pointer'
                : 'text-neutral-300 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste</span>
            </div>
            <span className="text-[10px] text-neutral-400">Ctrl+V</span>
          </button>

          <div className="h-[1px] bg-neutral-200/80 my-1" />

          <button
            onClick={() => {
              onAddElement('text');
              onClose();
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl cursor-pointer"
          >
            <Type className="w-3.5 h-3.5 text-purple-600" />
            <span>Insert Text Box</span>
          </button>

          <button
            onClick={() => {
              onAddElement('shape', 'rectangle');
              onClose();
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 text-blue-600" />
            <span>Insert Rectangle</span>
          </button>

          <button
            onClick={() => {
              onAddElement('shape', 'circle');
              onClose();
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl cursor-pointer"
          >
            <Circle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Insert Circle</span>
          </button>

          <button
            onClick={() => {
              onAddElement('shape', 'diamond');
              onClose();
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl cursor-pointer"
          >
            <Diamond className="w-3.5 h-3.5 text-amber-600" />
            <span>Insert Diamond</span>
          </button>

          <button
            onClick={() => {
              onAddElement('card');
              onClose();
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-pink-600" />
            <span>Insert Card</span>
          </button>

          <div className="h-[1px] bg-neutral-200/80 my-1" />

          <button
            onClick={() => {
              onSelectAll();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl cursor-pointer"
          >
            <span>Select All</span>
            <span className="text-[10px] text-neutral-400">Ctrl+A</span>
          </button>

          <button
            onClick={() => {
              onResetZoom();
              onClose();
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 hover:bg-neutral-100 rounded-xl cursor-pointer"
          >
            <span>Reset View (100%)</span>
          </button>
        </div>
      )}
    </div>
  );
};
