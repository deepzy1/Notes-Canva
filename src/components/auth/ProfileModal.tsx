import React, { useState } from 'react';
import { X, User, Mail, Lock, LogOut, Check, Sparkles, Shield, Layers, Folder } from 'lucide-react';
import { User as UserType } from '../../types/auth';
import { authService } from '../../services/authService';

interface ProfileModalProps {
  isOpen: boolean;
  user: UserType;
  workspacesCount: number;
  foldersCount: number;
  onClose: () => void;
  onUpdateUser: (user: UserType) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  workspacesCount,
  foldersCount,
  onClose,
  onUpdateUser,
  onLogout,
}) => {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = authService.updateProfile(name, avatarUrl);
    onUpdateUser(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      authService.changePassword(oldPassword, newPassword);
      setPassMsg({ text: 'Password successfully updated!', isError: false });
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setShowPasswordChange(false), 1500);
    } catch (err: any) {
      setPassMsg({ text: err.message || 'Failed to update password', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-50/70 via-pink-50/50 to-amber-50/40 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Profile & Account
              </h2>
              <p className="text-xs text-neutral-500">Manage your profile, data, and security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-5">
          {/* Avatar and Info Header */}
          <div className="flex items-center space-x-4">
            <img
              src={avatarUrl || user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-400 shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-base font-bold text-neutral-900">{user.name}</h3>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                  {user.provider === 'google' ? 'Google Account' : 'Verified Email'}
                </span>
                <span className="text-[10px] text-neutral-400">Personal Workspaces</span>
              </div>
            </div>
          </div>

          {/* Account Usage Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800">{workspacesCount}</p>
                <p className="text-[11px] text-neutral-400">Saved Canvases</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                <Folder className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800">{foldersCount}</p>
                <p className="text-[11px] text-neutral-400">Organized Folders</p>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-emerald-600 font-medium">
                {savedNotice && '✓ Profile updated!'}
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>

          {/* Security & Password */}
          <div className="pt-2 border-t border-neutral-100">
            {!showPasswordChange ? (
              <button
                type="button"
                onClick={() => setShowPasswordChange(true)}
                className="text-xs font-semibold text-neutral-600 hover:text-purple-600 flex items-center space-x-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Change Account Password</span>
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800">Change Password</span>
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className="text-[11px] text-neutral-400 hover:text-neutral-600"
                  >
                    Cancel
                  </button>
                </div>

                {passMsg && (
                  <p
                    className={`text-[11px] font-medium ${
                      passMsg.isError ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {passMsg.text}
                  </p>
                )}

                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 outline-hidden"
                />

                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 outline-hidden"
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400 font-mono">
            User ID: {user.id.slice(0, 16)}...
          </span>
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
