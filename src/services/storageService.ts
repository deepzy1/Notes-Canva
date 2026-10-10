import { CanvasCardItem, Connection, ThemeId, Folder, Workspace } from '../types/canvas';
import { INITIAL_CARDS, INITIAL_CONNECTIONS, DEFAULT_FOLDERS } from '../constants/pythonBasicsData';
import { authService } from './authService';

export const storageService = {
  // Helper to get user-specific storage key
  getUserKey(baseKey: string): string {
    const user = authService.getCurrentUser();
    const userId = user ? user.id : 'guest';
    return `${baseKey}_${userId}`;
  },

  // --- Workspace CRUD (User-Scoped) ---
  getWorkspaces(): Workspace[] {
    try {
      const userKey = this.getUserKey('learncanvas_workspaces');
      const data = localStorage.getItem(userKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load workspaces', e);
    }

    // Default workspaces for this user
    const user = authService.getCurrentUser();
    const isSeedUser = user?.id === 'user-default-deepak';

    const defaultWorkspaces: Workspace[] = isSeedUser
      ? [
          {
            id: 'ws-python-basics',
            name: 'Python Basics',
            folderId: 'python',
            cards: INITIAL_CARDS,
            connections: INITIAL_CONNECTIONS,
            theme: 'instagram',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'ws-fastapi',
            name: 'FastAPI REST Architecture',
            folderId: 'fastapi',
            cards: [
              {
                id: 'fa-banner-seed',
                type: 'banner',
                x: 60,
                y: 50,
                width: 600,
                title: 'FastAPI REST Architecture',
                accent: 'emerald',
                hasGlow: true,
                data: {
                  subtitle: 'High performance web framework with automatic OpenAPI docs',
                  tags: [
                    { label: 'FastAPI', variant: 'green' },
                    { label: 'Async', variant: 'purple' },
                    { label: 'Pydantic', variant: 'blue' },
                  ],
                },
              },
            ],
            connections: [],
            theme: 'nature',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
      : [
          {
            id: `ws-${Date.now()}`,
            name: `${user?.name || 'My'} Workspace`,
            folderId: 'projects',
            cards: [
              {
                id: `card-welcome-${Date.now()}`,
                type: 'banner',
                x: 60,
                y: 50,
                width: 580,
                title: `Welcome, ${user?.name || 'Developer'}!`,
                accent: 'purple',
                hasGlow: true,
                data: {
                  subtitle: 'Your personal visual learning canvas. Drag, sketch, connect, or generate with AI.',
                  tags: [
                    { label: 'Personal', variant: 'purple' },
                    { label: 'Interactive', variant: 'green' },
                  ],
                },
              },
            ],
            connections: [],
            theme: 'instagram',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

    this.saveWorkspaces(defaultWorkspaces);
    return defaultWorkspaces;
  },

  saveWorkspaces(workspaces: Workspace[]): void {
    try {
      const userKey = this.getUserKey('learncanvas_workspaces');
      localStorage.setItem(userKey, JSON.stringify(workspaces));
    } catch (e) {
      console.error('Failed to save workspaces', e);
    }
  },

  getActiveWorkspaceId(): string {
    try {
      const userKey = this.getUserKey('learncanvas_active_ws_id');
      const id = localStorage.getItem(userKey);
      if (id) return id;
    } catch (e) {}
    const workspaces = this.getWorkspaces();
    return workspaces[0]?.id || 'ws-default';
  },

  setActiveWorkspaceId(id: string): void {
    try {
      const userKey = this.getUserKey('learncanvas_active_ws_id');
      localStorage.setItem(userKey, id);
    } catch (e) {}
  },

  createWorkspace(name: string, folderId: string): Workspace {
    const workspaces = this.getWorkspaces();
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: name.trim() || 'Untitled Workspace',
      folderId,
      cards: [
        {
          id: `card-welcome-${Date.now()}`,
          type: 'banner',
          x: 60,
          y: 50,
          width: 580,
          title: name.trim() || 'New Workspace',
          accent: 'purple',
          hasGlow: true,
          data: {
            subtitle: 'Start sketching concepts, flowcharts, code blocks, or notes.',
            tags: [
              { label: 'Workspace', variant: 'purple' },
              { label: 'Interactive', variant: 'blue' },
            ],
          },
        },
      ],
      connections: [],
      theme: 'instagram',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    workspaces.push(newWs);
    this.saveWorkspaces(workspaces);
    this.setActiveWorkspaceId(newWs.id);
    return newWs;
  },

  renameWorkspace(id: string, newName: string): void {
    const workspaces = this.getWorkspaces().map(w =>
      w.id === id ? { ...w, name: newName.trim(), updatedAt: new Date().toISOString() } : w
    );
    this.saveWorkspaces(workspaces);
  },

  duplicateWorkspace(id: string): Workspace | null {
    const workspaces = this.getWorkspaces();
    const source = workspaces.find(w => w.id === id);
    if (!source) return null;

    const copy: Workspace = {
      ...source,
      id: `ws-${Date.now()}`,
      name: `${source.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: source.cards.map(c => ({
        ...c,
        id: `card-dup-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      })),
      connections: [...source.connections],
    };
    workspaces.push(copy);
    this.saveWorkspaces(workspaces);
    return copy;
  },

  deleteWorkspace(id: string): boolean {
    const workspaces = this.getWorkspaces();
    if (workspaces.length <= 1) {
      alert('Cannot delete the only remaining workspace.');
      return false;
    }
    const filtered = workspaces.filter(w => w.id !== id);
    this.saveWorkspaces(filtered);
    if (this.getActiveWorkspaceId() === id) {
      this.setActiveWorkspaceId(filtered[0].id);
    }
    return true;
  },

  moveWorkspace(id: string, targetFolderId: string): void {
    const workspaces = this.getWorkspaces().map(w =>
      w.id === id ? { ...w, folderId: targetFolderId, updatedAt: new Date().toISOString() } : w
    );
    this.saveWorkspaces(workspaces);
  },

  updateWorkspaceData(id: string, cards: CanvasCardItem[], connections: Connection[]): void {
    const workspaces = this.getWorkspaces().map(w =>
      w.id === id ? { ...w, cards, connections, updatedAt: new Date().toISOString() } : w
    );
    this.saveWorkspaces(workspaces);
  },

  // --- Folder CRUD (User-Scoped) ---
  getFolders(): Folder[] {
    try {
      const userKey = this.getUserKey('learncanvas_folders');
      const data = localStorage.getItem(userKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load folders', e);
    }
    return DEFAULT_FOLDERS;
  },

  saveFolders(folders: Folder[]): void {
    try {
      const userKey = this.getUserKey('learncanvas_folders');
      localStorage.setItem(userKey, JSON.stringify(folders));
    } catch (e) {
      console.error('Failed to save folders', e);
    }
  },

  createFolder(name: string, color = '#8b5cf6'): Folder {
    const folders = this.getFolders();
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: name.trim() || 'New Folder',
      iconColor: color,
      count: 0,
    };
    folders.push(newFolder);
    this.saveFolders(folders);
    return newFolder;
  },

  renameFolder(id: string, newName: string): void {
    const folders = this.getFolders().map(f =>
      f.id === id ? { ...f, name: newName.trim() } : f
    );
    this.saveFolders(folders);
  },

  deleteFolder(id: string): boolean {
    const folders = this.getFolders();
    if (folders.length <= 1) {
      alert('Cannot delete the last folder.');
      return false;
    }
    const filtered = folders.filter(f => f.id !== id);
    this.saveFolders(filtered);

    // Reassign workspaces in deleted folder to the first available folder
    const fallbackFolderId = filtered[0].id;
    const workspaces = this.getWorkspaces().map(w =>
      w.folderId === id ? { ...w, folderId: fallbackFolderId } : w
    );
    this.saveWorkspaces(workspaces);
    return true;
  },

  // Reset current user's workspace back to default
  resetToDefault(): Workspace {
    const userKey = this.getUserKey('learncanvas_workspaces');
    localStorage.removeItem(userKey);
    return this.getWorkspaces()[0];
  },
};
