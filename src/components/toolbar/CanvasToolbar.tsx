import React, { useState } from 'react';
import {
  MousePointer,
  Type,
  CreditCard,
  StickyNote,
  Image as ImageIcon,
  GitFork,
  Square,
  ArrowRight,
  MessageSquare,
  MoreHorizontal,
  Undo2,
  Redo2,
  Share2,
  ChevronDown,
  Plus,
  Network,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { ActiveTool } from '../../types/canvas';

interface CanvasToolbarProps {
  canvasName: string;
  folderName: string;
  onRenameCanvas: (newName: string) => void;
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  onAddCard: (type: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
  onOpenShareModal: () => void;
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
}) => {
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  const tools: { id: ActiveTool; label: string; icon: React.ReactNode }[] = [
    { id: 'select', label: 'Select', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'card', label: 'Card', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'note', label: 'Note', icon: <StickyNote className="w-4 h-4" /> },
    { id: 'image', label: 'Image', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'diagram', label: 'Diagram', icon: <GitFork className="w-4 h-4" /> },
    { id: 'shape', label: 'Shape', icon: <Square className="w-4 h-4" /> },
    { id: 'arrow', label: 'Arrow', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'comment', label: 'Comment', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="h-14 px-6 border-b border-neutral-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between select-none z-10 flex-shrink-0">
      {/* Breadcrumb Left */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-neutral-500 font-medium">{folderName}</span>
        <span className="text-neutral-400">/</span>
        <button
          onClick={() => {
            const name = prompt('Rename canvas:', canvasName);
            if (name && name.trim()) onRenameCanvas(name.trim());
          }}
          className="flex items-center space-x-1 font-bold text-neutral-900 hover:text-purple-600 transition-colors cursor-pointer"
        >
          <span>{canvasName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      </div>

      {/* Center: Tools Pill Bar */}
      <div className="flex items-center space-x-1 p-1 bg-neutral-100/80 rounded-2xl border border-neutral-200/60 shadow-xs">
        {tools.map(tool => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                onSelectTool(tool.id);
                if (tool.id !== 'select') {
                  // Direct add helper
                  onAddCard(tool.id);
                }
              }}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
              }`}
              title={tool.label}
            >
              {tool.icon}
              <span className="hidden md:inline">{tool.label}</span>
            </button>
          );
        })}

        {/* More Tools Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMoreTools(!showMoreTools)}
            className="p-1.5 rounded-xl text-neutral-500 hover:bg-white hover:text-neutral-900 transition-all cursor-pointer"
            title="More card types"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMoreTools && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 text-xs">
              <div className="px-2 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Insert Components
              </div>
              <button
                onClick={() => {
                  onAddCard('mindmap');
                  setShowMoreTools(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700 font-medium"
              >
                <Network className="w-4 h-4 text-rose-500" />
                <span>Mind Map</span>
              </button>
              <button
                onClick={() => {
                  onAddCard('code');
                  setShowMoreTools(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700 font-medium"
              >
                <Code2 className="w-4 h-4 text-blue-500" />
                <span>Code Sandbox</span>
              </button>
              <button
                onClick={() => {
                  onAddCard('quiz');
                  setShowMoreTools(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700 font-medium"
              >
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span>Interactive Quiz</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: History & Zoom & Share */}
      <div className="flex items-center space-x-2">
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
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700"
              >
                50%
              </button>
              <button
                onClick={() => {
                  onZoomChange(0.75);
                  setShowZoomMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700"
              >
                75%
              </button>
              <button
                onClick={() => {
                  onResetZoom();
                  setShowZoomMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-purple-50 text-purple-700 font-semibold"
              >
                100% (Reset)
              </button>
              <button
                onClick={() => {
                  onZoomChange(1.25);
                  setShowZoomMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700"
              >
                125%
              </button>
              <button
                onClick={() => {
                  onZoomChange(1.5);
                  setShowZoomMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-neutral-50 text-neutral-700"
              >
                150%
              </button>
            </div>
          )}
        </div>

        {/* Share Button (Purple Gradient) */}
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
