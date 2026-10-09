import React, { useState } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  MoreHorizontal,
  LogOut,
  User,
  Settings,
  Sparkles,
  Command,
  Flame,
  Leaf,
  Check,
} from 'lucide-react';
import { ThemeId } from '../../types/canvas';
import { THEMES } from '../../constants/themes';
import { UserProfile } from '../../services/storageService';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: UserProfile) => void;
  onOpenAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  currentTheme,
  onSelectTheme,
  userProfile,
  onUpdateUserProfile,
  onOpenAiAssistant,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const themeList: { id: ThemeId; label: string; icon: string; dotColor: string }[] = [
    { id: 'apple', label: 'Apple', icon: '', dotColor: '#000000' },
    { id: 'nothing', label: 'Nothing', icon: '●', dotColor: '#d71920' },
    { id: 'instagram', label: 'Instagram', icon: '📷', dotColor: '#e1306c' },
    { id: 'youtube', label: 'YouTube', icon: '▶', dotColor: '#ff0000' },
    { id: 'facebook', label: 'Facebook', icon: 'f', dotColor: '#1877f2' },
    { id: 'nature', label: 'Nature', icon: '🌿', dotColor: '#10b981' },
  ];

  return (
    <header className="h-14 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md px-4 flex items-center justify-between select-none z-10 flex-shrink-0">
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search your canvases, notes, or ask AI..."
            className="w-full pl-9 pr-14 py-1.5 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs text-neutral-800 rounded-full border border-transparent focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all outline-hidden placeholder-neutral-400"
          />
          <div className="absolute right-2.5 flex items-center space-x-1">
            <span className="text-[10px] font-mono text-neutral-400 bg-white border border-neutral-200/80 rounded px-1 py-0.5 shadow-2xs">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      {/* Center: Theme Selector Pills */}
      <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-neutral-100/60 rounded-full border border-neutral-200/60">
        {themeList.map(theme => {
          const isActive = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-xs scale-102 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-white/50'
              }`}
            >
              {theme.id === 'instagram' ? (
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 inline-block" />
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
          className={`px-2 py-1 rounded-full text-xs transition-colors flex items-center space-x-1 ${
            currentTheme === 'dark'
              ? 'bg-neutral-900 text-white font-medium shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
          title="Toggle Dark Mode"
        >
          <Moon className="w-3 h-3" />
          <span>Dark</span>
        </button>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center space-x-2">
        {/* Ask AI quick badge */}
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
                <span>Notifications</span>
                <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                  1 New
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100/60">
                  <p className="font-medium text-neutral-800">Workspace ready!</p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Python Basics interactive workspace loaded with 13 cards.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-neutral-100 transition-all cursor-pointer border border-neutral-200/50"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-400"
            />
            <span className="text-xs font-semibold text-neutral-800 truncate max-w-[80px] sm:max-w-[110px]">
              {userProfile.name}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-neutral-100">
                <p className="font-semibold text-neutral-800">{userProfile.name}</p>
                <p className="text-[11px] text-neutral-400 truncate">{userProfile.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    const newName = prompt('Enter your display name:', userProfile.name);
                    if (newName) {
                      onUpdateUserProfile({ ...userProfile, name: newName });
                    }
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-neutral-50 rounded-xl text-neutral-700 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    alert('All canvas cards and connections are automatically autosaved to persistent storage!');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-neutral-50 rounded-xl text-neutral-700 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Sync & Cloud Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
