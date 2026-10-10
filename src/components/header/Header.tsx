import React, { useState } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  LogOut,
  User as UserIcon,
  Settings,
  Sparkles,
  LogIn,
  KeyRound,
} from 'lucide-react';
import { ThemeId } from '../../types/canvas';
import { User } from '../../types/auth';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  currentUser: User | null;
  onOpenProfile: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenAiAssistant: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  currentTheme,
  onSelectTheme,
  currentUser,
  onOpenProfile,
  onOpenAuthModal,
  onLogout,
  onOpenAiAssistant,
  onToggleMobileSidebar,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const themeList: { id: ThemeId; label: string; dotColor: string }[] = [
    { id: 'instagram', label: 'Instagram', dotColor: '#e1306c' },
    { id: 'apple', label: 'Apple', dotColor: '#000000' },
    { id: 'nothing', label: 'Nothing', dotColor: '#d71920' },
    { id: 'nature', label: 'Nature', dotColor: '#10b981' },
    { id: 'youtube', label: 'YouTube', dotColor: '#ff0000' },
  ];

  return (
    <header className="h-14 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between select-none z-10 flex-shrink-0">
      {/* Left: Mobile Hamburger & Search */}
      <div className="flex items-center space-x-2 flex-1 max-w-sm sm:max-w-md">
        {/* Hamburger Menu on Mobile */}
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-xl text-neutral-600 hover:bg-neutral-100 md:hidden flex-shrink-0 cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 flex items-center">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search canvas or cards..."
            className="w-full pl-8 pr-10 py-1.5 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs text-neutral-800 rounded-full border border-transparent focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all outline-hidden placeholder-neutral-400"
          />
        </div>
      </div>

      {/* Center: Theme Selector Pills (Hidden on very small screens, scrollable on tablets) */}
      <div className="hidden md:flex items-center space-x-1 px-2.5 py-1 bg-neutral-100/60 rounded-full border border-neutral-200/60 overflow-x-auto no-scrollbar mx-2">
        {themeList.map(theme => {
          const isActive = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-xs scale-102 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-white/50'
              }`}
            >
              {theme.id === 'instagram' ? (
                <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 inline-block" />
              ) : (
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: theme.dotColor }}
                />
              )}
              <span>{theme.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => onSelectTheme(currentTheme === 'dark' ? 'instagram' : 'dark')}
          className={`px-2 py-0.5 rounded-full text-xs transition-colors flex items-center space-x-1 cursor-pointer ${
            currentTheme === 'dark'
              ? 'bg-neutral-900 text-white font-medium shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
          title="Toggle Dark Mode"
        >
          <Moon className="w-3 h-3" />
        </button>
      </div>

      {/* Right: Actions, Ask AI, User Account */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Ask AI quick badge (Hidden on mobile) */}
        <button
          onClick={onOpenAiAssistant}
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100/80 text-xs font-medium border border-purple-200/50 transition-all cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
          <span>Ask AI</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-100 p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 font-semibold text-neutral-800">
                <span>Account Status</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold">
                  Autosaved
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100/60">
                  <p className="font-medium text-neutral-800">Workspace Synced</p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Your personal workspaces are automatically saved and isolated to your account.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account Pill or Sign In Button */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1.5 pl-1 pr-2 py-0.5 rounded-full hover:bg-neutral-100 transition-all cursor-pointer border border-neutral-200/50"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-400"
              />
              <span className="text-xs font-semibold text-neutral-800 truncate max-w-[70px] sm:max-w-[100px] hidden xs:inline">
                {currentUser.name}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 p-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-neutral-100">
                  <p className="font-bold text-neutral-800 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-neutral-400 truncate">{currentUser.email}</p>
                </div>
                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 hover:bg-neutral-50 rounded-xl text-neutral-700 transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                    <span>Profile & Account</span>
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
