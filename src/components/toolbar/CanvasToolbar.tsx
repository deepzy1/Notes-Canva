import React, { useState } from 'react';
import {
  MousePointer,
  Type,
  CreditCard,
  StickyNote,
  GitFork,
  Square,
  ArrowRight,
  MessageSquare,
  MoreHorizontal,
  Undo2,
  Redo2,
  Share2,
  ChevronDown,
  Trash2,
  Group,
  Ungroup,
  Layers,
  Circle,
  Diamond,
  Triangle,
  Star,
  Keyboard,
  HelpCircle,
} from 'lucide-react';
import { ActiveTool, ShapeSubtype } from '../../types/canvas';

interface CanvasToolbarProps {
  canvasName: string;
  folderName: string;
  onRenameCanvas: (newName: string) => void;
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  onAddCard: (type: string, subtype?: ShapeSubtype) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
  onOpenShareModal: () => void;
  onOpenShortcutsModal: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onGroupSelected: () => void;
  onUngroupSelected: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  canvasName,
  folderName,
  onRenameCanvas,
  activeTool,
  onSelectTool,
  onAddCard,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomChange,
  onResetZoom,
  onOpenShareModal,
  onOpenShortcutsModal,
  selectedCount,
  onDeleteSelected,
  onGroupSelected,
  onUngroupSelected,
}) => {
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  const shapes: { id: ShapeSubtype; label: string; icon: React.ReactNode }[] = [
    { id: 'rectangle', label: 'Rectangle', icon: <Square className="w-3.5 h-3.5" /> },
    { id: 'rounded_rectangle', label: 'Rounded Rect', icon: <Square className="w-3.5 h-3.5 rounded" /> },
    { id: 'circle', label: 'Circle', icon: <Circle className="w-3.5 h-3.5" /> },
    { id: 'diamond', label: 'Diamond', icon: <Diamond className="w-3.5 h-3.5" /> },
    { id: 'triangle', label: 'Triangle', icon: <Triangle className="w-3.5 h-3.5" /> },
    { id: 'star', label: 'Star', icon: <Star className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-14 px-4 sm:px-6 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between select-none z-10 flex-shrink-0">
      {/* Breadcrumb Left */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-neutral-500 font-medium">{folderName}</span>
        <span className="text-neutral-400">/</span>
        <button
          onClick={() => {
            const name = prompt('Rename workspace:', canvasName);
            if (name && name.trim()) onRenameCanvas(name.trim());
          }}
          className="flex items-center space-x-1 font-bold text-neutral-900 hover:text-purple-600 transition-colors cursor-pointer"
          title="Click to rename workspace"
        >
          <span className="truncate max-w-[120px] sm:max-w-[200px]">{canvasName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
        </button>
      </div>

      {/* Center Tool Pills */}
      <div className="flex items-center space-x-1 p-1 bg-neutral-100/80 rounded-2xl border border-neutral-200/60 shadow-xs">
        {/* Select Tool */}
        <button
          onClick={() => onSelectTool('select')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTool === 'select'
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
          }`}
          title="Select Tool (V)"
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Select</span>
        </button>

        {/* Text Tool */}
        <button
          onClick={() => {
            onSelectTool('text');
            onAddCard('text');
          }}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTool === 'text'
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
          }`}
          title="Add Text Box (T)"
        >
          <Type className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Text</span>
        </button>

        {/* Shape Tool with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowShapeMenu(!showShapeMenu)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTool === 'shape'
                ? 'bg-purple-600 text-white shadow-xs font-semibold'
                : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
            }`}
            title="Shapes & Icons"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Shape</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {showShapeMenu && (
            <div className="absolute top-full mt-2 left-0 w-44 bg-white rounded-2xl shadow-xl border border-neutral-100 p-1.5 z-50 text-xs">
              <div className="px-2 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Select Shape
              </div>
              {shapes.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    onAddCard('shape', s.id);
                    setShowShapeMenu(false);
                    onSelectTool('select');
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card Tool */}
        <button
          onClick={() => {
            onSelectTool('card');
            onAddCard('card');
          }}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTool === 'card'
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
          }`}
          title="Add Concept Card"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Card</span>
        </button>

        {/* Sticky Note Tool */}
        <button
          onClick={() => {
            onSelectTool('note');
            onAddCard('note');
          }}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTool === 'note'
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
          title="Add Sticky Note"
        >
          <StickyNote className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Note</span>
        </button>

        {/* Diagram Tool */}
        <button
          onClick={() => {
            onSelectTool('diagram');
            onAddCard('diagram');
          }}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTool === 'diagram'
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
          }`}
          title="Add Flow Diagram"
        >
          <GitFork className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Diagram</span>
        </button>

        {/* Arrow / Connector Tool */}
        <button
          onClick={() => onSelectTool('arrow')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTool === 'arrow'
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
          }`}
          title="Connect Elements with Arrow"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Arrow</span>
        </button>

        {/* Comment Tool */}
        <button
          onClick={() => {
            onSelectTool('comment');
            onAddCard('comment');
          }}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTool === 'comment'
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
          }`}
          title="Add Comment Bubble"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Comment</span>
        </button>

        {/* More Tools Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMoreTools(!showMoreTools)}
            className="p-1.5 rounded-xl text-neutral-500 hover:bg-white hover:text-neutral-900 transition-all cursor-pointer"
            title="More components"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMoreTools && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 text-xs">
              <button
                onClick={() => {
                  onAddCard('code');
                  setShowMoreTools(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700"
              >
                <span>Code Sandbox</span>
              </button>
              <button
                onClick={() => {
                  onAddCard('mindmap');
                  setShowMoreTools(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700"
              >
                <span>Mind Map</span>
              </button>
              <button
                onClick={() => {
                  onAddCard('quiz');
                  setShowMoreTools(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700"
              >
                <span>Quiz Knowledge Check</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Action Tools (Group, Delete) */}
      <div className="flex items-center space-x-1.5">
        {selectedCount > 0 && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-purple-50 rounded-xl border border-purple-200">
            <span className="text-[11px] font-bold text-purple-700 px-1">
              {selectedCount} selected
            </span>
            {selectedCount > 1 && (
              <button
                onClick={onGroupSelected}
                className="p-1 text-purple-700 hover:bg-purple-100 rounded cursor-pointer"
                title="Group (Ctrl+G)"
              >
                <Group className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onUngroupSelected}
              className="p-1 text-purple-700 hover:bg-purple-100 rounded cursor-pointer"
              title="Ungroup (Ctrl+Shift+G)"
            >
              <Ungroup className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDeleteSelected}
              className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
              title="Delete Selected (Del)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-xl border border-neutral-200/60 transition-colors ${
              canUndo
                ? 'text-neutral-600 hover:bg-neutral-100 cursor-pointer'
                : 'text-neutral-300 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-xl border border-neutral-200/60 transition-colors ${
              canRedo
                ? 'text-neutral-600 hover:bg-neutral-100 cursor-pointer'
                : 'text-neutral-300 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Selector */}
        <div className="relative">
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl border border-neutral-200/60 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span>{Math.round(zoom * 100)}%</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {showZoomMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-neutral-100 p-1 z-50 text-xs">
              <button
                onClick={() => {
                  onZoomChange(0.5);
                  setShowZoomMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700 cursor-pointer"
              >
                50%
              </button>
              <button
                onClick={() => {
                  onZoomChange(0.75);
                  setShowZoomMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700 cursor-pointer"
              >
                75%
              </button>
              <button
                onClick={() => {
                  onResetZoom();
                  setShowZoomMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-purple-50 text-purple-700 font-semibold cursor-pointer"
              >
                100% (Reset)
              </button>
              <button
                onClick={() => {
                  onZoomChange(1.25);
                  setShowZoomMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700 cursor-pointer"
              >
                125%
              </button>
              <button
                onClick={() => {
                  onZoomChange(1.5);
                  setShowZoomMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700 cursor-pointer"
              >
                150%
              </button>
            </div>
          )}
        </div>

        {/* Shortcuts Help */}
        <button
          onClick={onOpenShortcutsModal}
          className="p-1.5 rounded-xl border border-neutral-200/60 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-sm hover:shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
