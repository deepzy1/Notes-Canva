import { User } from '../types/auth';

const STORAGE_KEYS = {
  USERS: 'learncanvas_users_db',
  CURRENT_USER: 'learncanvas_current_user_session',
  RESET_CODES: 'learncanvas_reset_codes',
};

// Seed default user
const DEFAULT_SEED_USER: User = {
  id: 'user-default-deepak',
  email: 'deepakhumdee@gmail.com',
  name: 'Deepak R.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  provider: 'google',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

interface StoredAccount extends User {
  passwordHash?: string;
}

export const authService = {
  getRegisteredUsers(): StoredAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    // Initial seed
    const seed: StoredAccount[] = [
      {
        ...DEFAULT_SEED_USER,
        passwordHash: 'password123',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seed));
    return seed;
  },

  saveRegisteredUsers(users: StoredAccount[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    // Default to the authenticated user on first visit
    const seedUser = DEFAULT_SEED_USER;
    this.setCurrentUser(seedUser);
    return seedUser;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  async login(email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getRegisteredUsers();
    const account = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!account) {
      throw new Error('No account found with this email address.');
    }

    if (account.passwordHash && account.passwordHash !== password) {
      throw new Error('Incorrect password. Please try again or use Forgot Password.');
    }

    const { passwordHash, ...cleanUser } = account;
    cleanUser.updatedAt = new Date().toISOString();
    this.setCurrentUser(cleanUser);
    return cleanUser;
  },

  async signup(name: string, email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) throw new Error('Name is required.');
    if (!trimmedEmail || !trimmedEmail.includes('@')) throw new Error('Valid email address required.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long.');

    const users = this.getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser: StoredAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: trimmedName,
      email: trimmedEmail,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}`,
      provider: 'password',
      passwordHash: password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveRegisteredUsers(users);

    const { passwordHash, ...cleanUser } = newUser;
    this.setCurrentUser(cleanUser);
    return cleanUser;
  },

  async loginWithGoogle(): Promise<User> {
    // Quick Google sign-in simulation with Deepak R. or custom profile
    const users = this.getRegisteredUsers();
    let account = users.find(u => u.email === 'deepakhumdee@gmail.com');

    if (!account) {
      account = {
        ...DEFAULT_SEED_USER,
        passwordHash: 'password123',
      };
      users.push(account);
      this.saveRegisteredUsers(users);
    }

    const { passwordHash, ...cleanUser } = account;
    this.setCurrentUser(cleanUser);
    return cleanUser;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; resetCode: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getRegisteredUsers();
    const account = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!account) {
      throw new Error('No account found with this email address.');
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESET_CODES) || '{}');
    codes[trimmedEmail] = resetCode;
    localStorage.setItem(STORAGE_KEYS.RESET_CODES, JSON.stringify(codes));

    return { success: true, resetCode };
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    const trimmedEmail = email.trim().toLowerCase();
    const codes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESET_CODES) || '{}');

    if (!codes[trimmedEmail] || codes[trimmedEmail] !== code.trim()) {
      throw new Error('Invalid verification code. Please check your code.');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const users = this.getRegisteredUsers();
    const account = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!account) throw new Error('Account not found.');

    account.passwordHash = newPassword;
    account.updatedAt = new Date().toISOString();
    this.saveRegisteredUsers(users);

    delete codes[trimmedEmail];
    localStorage.setItem(STORAGE_KEYS.RESET_CODES, JSON.stringify(codes));

    return true;
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  updateProfile(name: string, avatarUrl?: string): User {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not logged in');

    const updated: User = {
      ...current,
      name: name.trim() || current.name,
      avatarUrl: avatarUrl || current.avatarUrl,
      updatedAt: new Date().toISOString(),
    };

    const users = this.getRegisteredUsers().map(u => (u.id === current.id ? { ...u, ...updated } : u));
    this.saveRegisteredUsers(users);
    this.setCurrentUser(updated);
    return updated;
  },

  changePassword(oldPass: string, newPass: string): boolean {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not logged in');

    if (newPass.length < 6) throw new Error('Password must be at least 6 characters.');

    const users = this.getRegisteredUsers();
    const account = users.find(u => u.id === current.id);
    if (!account) throw new Error('Account not found');

    if (account.passwordHash && account.passwordHash !== oldPass) {
      throw new Error('Current password does not match.');
    }

    account.passwordHash = newPass;
    account.updatedAt = new Date().toISOString();
    this.saveRegisteredUsers(users);
    return true;
  },
};
