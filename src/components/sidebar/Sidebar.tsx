import React, { useState } from 'react';
import {
  Home,
  Compass,
  Layers,
  Users,
  LayoutTemplate,
  Sparkles,
  Plus,
  Folder as FolderIcon,
  FolderOpen,
  Bookmark,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { Folder } from '../../types/canvas';

interface SidebarProps {
  folders: Folder[];
  activeFolderId: string;
  onSelectFolder: (id: string) => void;
  onNewCanvas: () => void;
  onOpenAiAssistant: () => void;
  onOpenTemplates: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  activeFolderId,
  onSelectFolder,
  onNewCanvas,
  onOpenAiAssistant,
  onOpenTemplates,
}) => {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <aside className="w-64 flex-shrink-0 h-screen bg-white border-r border-neutral-200/80 flex flex-col justify-between select-none z-20">
      {/* Top Branding & Main Navigation */}
      <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center space-x-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white/20 rounded-[10px] backdrop-blur-sm flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-bold text-xl tracking-tight text-neutral-900">
              Learn<span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Canvas</span>
            </span>
          </div>
        </div>

        {/* Primary Action Button: + New Canvas */}
        <button
          onClick={onNewCanvas}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white font-medium text-sm shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Canvas</span>
        </button>

        {/* Top Nav Items */}
        <nav className="space-y-0.5 pt-1">
          <button
            onClick={() => setActiveNav('home')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeNav === 'home'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
            }`}
          >
            <Home className="w-4 h-4 text-purple-600" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveNav('explore')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeNav === 'explore'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
            }`}
          >
            <Compass className="w-4 h-4 text-neutral-500" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveNav('my-canvases')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeNav === 'my-canvases'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4 text-neutral-500" />
            <span>My Canvases</span>
          </button>

          <button
            onClick={() => setActiveNav('shared')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeNav === 'shared'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
            }`}
          >
            <Users className="w-4 h-4 text-neutral-500" />
            <span>Shared with me</span>
          </button>

          <button
            onClick={() => {
              setActiveNav('templates');
              onOpenTemplates();
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeNav === 'templates'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
            }`}
          >
            <LayoutTemplate className="w-4 h-4 text-neutral-500" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => {
              setActiveNav('ai');
              onOpenAiAssistant();
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-50/80 transition-colors group"
          >
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse group-hover:scale-110 transition-transform" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold">
              AI Assistant
            </span>
          </button>
        </nav>

        {/* Folders Section */}
        <div className="pt-3">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Folders
            </span>
            <button
              title="Add Folder"
              onClick={() => {
                const name = prompt('New Folder name:');
                if (name) {
                  // Folder creation trigger
                }
              }}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {folders.map(folder => {
              const isActive = folder.id === activeFolderId;
              const isTrash = folder.id === 'trash';
              const isBookmark = folder.id === 'bookmarks';

              return (
                <button
                  key={folder.id}
                  onClick={() => onSelectFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-100/70 text-purple-900 font-semibold shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    {isTrash ? (
                      <Trash2 className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    ) : isBookmark ? (
                      <Bookmark className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    ) : isActive ? (
                      <FolderOpen
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: folder.iconColor }}
                      />
                    ) : (
                      <FolderIcon
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: folder.iconColor }}
                      />
                    )}
                    <span className="truncate">{folder.name}</span>
                  </div>

                  {folder.count > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive
                          ? 'bg-purple-200/80 text-purple-800'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {folder.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom status / credits */}
      <div className="p-3 border-t border-neutral-100 text-center">
        <p className="text-[11px] text-neutral-400 font-medium">
          LearnCanvas v2.4 • Visual Workspace
        </p>
      </div>
    </aside>
  );
};
