export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: 'password' | 'google';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthModalView = 'login' | 'signup' | 'forgot_password' | 'profile';
