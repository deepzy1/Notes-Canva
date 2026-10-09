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
  MoreVertical,
  Edit2,
  Copy,
  ChevronRight,
  FolderPlus,
} from 'lucide-react';
import { Folder, Workspace } from '../../types/canvas';

interface SidebarProps {
  folders: Folder[];
  activeFolderId: string;
  onSelectFolder: (id: string) => void;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onNewWorkspace: () => void;
  onRenameWorkspace: (id: string, name: string) => void;
  onDuplicateWorkspace: (id: string) => void;
  onDeleteWorkspace: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  onOpenAiAssistant: () => void;
  onOpenTemplates: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  activeFolderId,
  onSelectFolder,
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onNewWorkspace,
  onRenameWorkspace,
  onDuplicateWorkspace,
  onDeleteWorkspace,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onOpenAiAssistant,
  onOpenTemplates,
}) => {
  const [activeNav, setActiveNav] = useState('home');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);
  const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState<string | null>(null);

  // Filter workspaces by active folder
  const currentFolderWorkspaces = workspaces.filter(w => w.folderId === activeFolderId);

  return (
    <aside className="w-64 flex-shrink-0 h-screen bg-white border-r border-neutral-200/80 flex flex-col justify-between select-none z-20">
      {/* Top Branding & Navigation */}
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
          onClick={onNewWorkspace}
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

        {/* Workspaces in Active Folder Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Canvases ({currentFolderWorkspaces.length})
            </span>
            <button
              onClick={onNewWorkspace}
              title="Add Canvas in this folder"
              className="p-1 text-neutral-400 hover:text-purple-600 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {currentFolderWorkspaces.map(ws => {
              const isSelected = ws.id === activeWorkspaceId;
              const isEditing = editingWorkspaceId === ws.id;

              return (
                <div
                  key={ws.id}
                  onMouseEnter={() => setHoveredWorkspaceId(ws.id)}
                  onMouseLeave={() => setHoveredWorkspaceId(null)}
                  className={`group relative flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-purple-100/80 text-purple-900 font-bold shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
                  }`}
                >
                  <button
                    onClick={() => onSelectWorkspace(ws.id)}
                    className="flex-1 text-left truncate flex items-center space-x-2 cursor-pointer"
                  >
                    <Layers className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-purple-600' : 'text-neutral-400'}`} />
                    {isEditing ? (
                      <input
                        autoFocus
                        defaultValue={ws.name}
                        onBlur={e => {
                          setEditingWorkspaceId(null);
                          if (e.target.value.trim()) onRenameWorkspace(ws.id, e.target.value.trim());
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            setEditingWorkspaceId(null);
                            if (e.currentTarget.value.trim()) onRenameWorkspace(ws.id, e.currentTarget.value.trim());
                          }
                        }}
                        className="w-full bg-white text-xs px-1 py-0.5 border border-purple-400 rounded outline-hidden"
                      />
                    ) : (
                      <span className="truncate">{ws.name}</span>
                    )}
                  </button>

                  {/* Actions on hover */}
                  {!isEditing && hoveredWorkspaceId === ws.id && (
                    <div className="flex items-center space-x-1 pl-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setEditingWorkspaceId(ws.id);
                        }}
                        className="p-1 hover:text-purple-600 text-neutral-400 rounded"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDuplicateWorkspace(ws.id);
                        }}
                        className="p-1 hover:text-purple-600 text-neutral-400 rounded"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {workspaces.length > 1 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onDeleteWorkspace(ws.id);
                          }}
                          className="p-1 hover:text-red-600 text-neutral-400 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Folders Management Section */}
        <div className="pt-3">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Folders
            </span>
            <button
              onClick={() => {
                const name = prompt('New Folder name:');
                if (name && name.trim()) onCreateFolder(name.trim());
              }}
              title="Add Folder"
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {folders.map(folder => {
              const isActive = folder.id === activeFolderId;
              const isTrash = folder.id === 'trash';
              const isBookmark = folder.id === 'bookmarks';
              const isEditing = editingFolderId === folder.id;
              const folderWorkspacesCount = workspaces.filter(w => w.folderId === folder.id).length;

              return (
                <div
                  key={folder.id}
                  onMouseEnter={() => setHoveredFolderId(folder.id)}
                  onMouseLeave={() => setHoveredFolderId(null)}
                  className={`group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
                  }`}
                >
                  <button
                    onClick={() => onSelectFolder(folder.id)}
                    className="flex items-center space-x-2.5 truncate flex-1 text-left cursor-pointer"
                  >
                    {isTrash ? (
                      <Trash2 className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    ) : isBookmark ? (
                      <Bookmark className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    ) : isActive ? (
                      <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" style={{ color: folder.iconColor }} />
                    ) : (
                      <FolderIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: folder.iconColor }} />
                    )}

                    {isEditing ? (
                      <input
                        autoFocus
                        defaultValue={folder.name}
                        onBlur={e => {
                          setEditingFolderId(null);
                          if (e.target.value.trim()) onRenameFolder(folder.id, e.target.value.trim());
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            setEditingFolderId(null);
                            if (e.currentTarget.value.trim()) onRenameFolder(folder.id, e.currentTarget.value.trim());
                          }
                        }}
                        className="w-full bg-white text-xs px-1 py-0.5 border border-purple-400 rounded outline-hidden"
                      />
                    ) : (
                      <span className="truncate">{folder.name}</span>
                    )}
                  </button>

                  {/* Actions on hover */}
                  {!isEditing && hoveredFolderId === folder.id && !isTrash && !isBookmark && (
                    <div className="flex items-center space-x-1 pl-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setEditingFolderId(folder.id);
                        }}
                        className="p-1 hover:text-purple-600 text-neutral-400 rounded"
                        title="Rename Folder"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {folders.length > 1 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onDeleteFolder(folder.id);
                          }}
                          className="p-1 hover:text-red-600 text-neutral-400 rounded"
                          title="Delete Folder"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {folderWorkspacesCount > 0 && !hoveredFolderId && (
                    <span className="text-[11px] px-1.5 py-0.2 rounded-full font-semibold bg-neutral-100 text-neutral-400">
                      {folderWorkspacesCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="p-3 border-t border-neutral-100 text-center">
        <p className="text-[11px] text-neutral-400 font-medium">
          LearnCanvas v2.5 • Professional Editor
        </p>
      </div>
    </aside>
  );
};
