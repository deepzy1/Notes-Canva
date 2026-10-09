import { CanvasCardItem, Connection, ThemeId, Folder } from '../types/canvas';
import { INITIAL_CARDS, INITIAL_CONNECTIONS, DEFAULT_FOLDERS } from '../constants/pythonBasicsData';

const STORAGE_KEYS = {
  CARDS: 'learncanvas_cards',
  CONNECTIONS: 'learncanvas_connections',
  THEME: 'learncanvas_theme',
  FOLDERS: 'learncanvas_folders',
  ACTIVE_FOLDER: 'learncanvas_active_folder',
  USER_PROFILE: 'learncanvas_user_profile',
  CANVAS_NAME: 'learncanvas_canvas_name',
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

export const storageService = {
  getCards(): CanvasCardItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARDS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load cards from storage', e);
    }
    return INITIAL_CARDS;
  },

  saveCards(cards: CanvasCardItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save cards to storage', e);
    }
  },

  getConnections(): Connection[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load connections from storage', e);
    }
    return INITIAL_CONNECTIONS;
  },

  saveConnections(connections: Connection[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
    } catch (e) {
      console.error('Failed to save connections to storage', e);
    }
  },

  getTheme(): ThemeId {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeId;
      if (theme) return theme;
    } catch (e) {
      // fallback
    }
    return 'instagram';
  },

  saveTheme(theme: ThemeId): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  },

  getFolders(): Folder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      if (data) return JSON.parse(data);
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

  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      // fallback
    }
    return DEFAULT_USER;
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  resetToDefault(): { cards: CanvasCardItem[]; connections: Connection[] } {
    localStorage.removeItem(STORAGE_KEYS.CARDS);
    localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);
    return {
      cards: INITIAL_CARDS,
      connections: INITIAL_CONNECTIONS,
    };
  },
};
