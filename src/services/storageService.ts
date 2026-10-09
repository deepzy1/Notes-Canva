import { CanvasCardItem, Connection, ThemeId, Folder, Workspace } from '../types/canvas';
import { INITIAL_CARDS, INITIAL_CONNECTIONS, DEFAULT_FOLDERS } from '../constants/pythonBasicsData';

const STORAGE_KEYS = {
  WORKSPACES: 'learncanvas_workspaces',
  ACTIVE_WORKSPACE_ID: 'learncanvas_active_ws_id',
  FOLDERS: 'learncanvas_folders',
  ACTIVE_FOLDER: 'learncanvas_active_folder',
  USER_PROFILE: 'learncanvas_user_profile',
  THEME: 'learncanvas_theme',
};

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}

export const DEFAULT_USER: UserProfile = {
  name: 'Deepak R.',
  email: 'deepakhumdee@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  isLoggedIn: true,
};

const DEFAULT_WORKSPACES: Workspace[] = [
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
      {
        id: 'fa-code-seed',
        type: 'code',
        x: 60,
        y: 230,
        width: 320,
        title: 'Async Route Handler',
        badgeNumber: 1,
        accent: 'blue',
        hasGlow: false,
        data: {
          description: 'Non-blocking I/O endpoint with Pydantic body validation.',
          language: 'python',
          code: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/api/health")\nasync def health():\n    return {"status": "healthy"}`,
          output: '{"status": "healthy"}',
        },
      },
    ],
    connections: [],
    theme: 'nature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  // --- Workspace CRUD ---
  getWorkspaces(): Workspace[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKSPACES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load workspaces', e);
    }
    return DEFAULT_WORKSPACES;
  },

  saveWorkspaces(workspaces: Workspace[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspaces));
    } catch (e) {
      console.error('Failed to save workspaces', e);
    }
  },

  getActiveWorkspaceId(): string {
    try {
      const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID);
      if (id) return id;
    } catch (e) {}
    return 'ws-python-basics';
  },

  setActiveWorkspaceId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID, id);
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

  updateWorkspaceData(
    id: string,
    cards: CanvasCardItem[],
    connections: Connection[],
    theme?: ThemeId
  ): void {
    const workspaces = this.getWorkspaces().map(w => {
      if (w.id === id) {
        return {
          ...w,
          cards,
          connections,
          theme: theme || w.theme,
          updatedAt: new Date().toISOString(),
        };
      }
      return w;
    });
    this.saveWorkspaces(workspaces);
  },

  // --- Folder CRUD ---
  getFolders(): Folder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load folders', e);
    }
    return DEFAULT_FOLDERS;
  },

  saveFolders(folders: Folder[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
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

  // --- Theme & Profile ---
  getTheme(): ThemeId {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeId;
      if (theme) return theme;
    } catch (e) {}
    return 'instagram';
  },

  saveTheme(theme: ThemeId): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {}
  },

  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return DEFAULT_USER;
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {}
  },

  resetToDefault(): Workspace {
    localStorage.removeItem(STORAGE_KEYS.WORKSPACES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID);
    localStorage.removeItem(STORAGE_KEYS.FOLDERS);
    return DEFAULT_WORKSPACES[0];
  },
};
