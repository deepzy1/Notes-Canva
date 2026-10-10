import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Sparkles, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { authService } from '../../services/authService';
import { User, AuthModalView } from '../../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  initialView?: AuthModalView;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialView = 'login',
  onClose,
  onAuthSuccess,
}) => {
  const [view, setView] = useState<AuthModalView>(initialView);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [demoCodeNotice, setDemoCodeNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setDemoCodeNotice(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(email, password);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await authService.signup(name, email, password);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.loginWithGoogle();
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authService.forgotPassword(email);
      setSuccessMsg('Verification code sent! Enter it below to reset your password.');
      setDemoCodeNotice(`Verification code: ${res.resetCode}`);
      setResetCode(res.resetCode);
    } catch (err: any) {
      setError(err.message || 'Could not send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email, resetCode, newPassword);
      setSuccessMsg('Password updated successfully! Please log in.');
      setTimeout(() => {
        setView('login');
        resetForm();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Purple-Pink Accent */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-purple-50/70 via-pink-50/50 to-amber-50/40 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 shadow-xs flex items-center justify-center">
              <div className="w-full h-full bg-white/20 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                {view === 'login' && 'Welcome to LearnCanvas'}
                {view === 'signup' && 'Create Your Account'}
                {view === 'forgot_password' && 'Reset Password'}
              </h2>
              <p className="text-xs text-neutral-500">
                {view === 'login' && 'Log in to access your personal visual workspaces'}
                {view === 'signup' && 'Start organizing software architecture visually'}
                {view === 'forgot_password' && 'Enter your email for password recovery'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Container */}
        <div className="p-6">
          {/* Notifications / Errors */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200/80 flex items-start space-x-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start space-x-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{successMsg}</p>
                {demoCodeNotice && (
                  <p className="mt-1 font-mono text-[11px] bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-lg inline-block">
                    {demoCodeNotice}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Social Sign-In: Continue with Google */}
          {view !== 'forgot_password' && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center justify-center space-x-2.5 shadow-2xs transition-all cursor-pointer"
              >
                {/* Official Google 'G' icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-neutral-200/80 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider absolute">
                  or with email
                </span>
              </div>
            </>
          )}

          {/* Form: LOGIN */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="deepak@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot_password');
                      resetForm();
                    }}
                    className="text-[11px] font-semibold text-purple-600 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white font-bold text-xs shadow-md hover:shadow-lg hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Logging in...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2 text-xs text-neutral-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setView('signup');
                    resetForm();
                  }}
                  className="font-bold text-purple-600 hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* Form: SIGN UP */}
          {view === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Smith"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Password (min. 6 characters)
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white font-bold text-xs shadow-md hover:shadow-lg hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2 text-xs text-neutral-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    resetForm();
                  }}
                  className="font-bold text-purple-600 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* Form: FORGOT PASSWORD */}
          {view === 'forgot_password' && (
            <div className="space-y-3.5">
              {!demoCodeNotice ? (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Account Email
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="deepak@example.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Sending...' : 'Send Verification Code'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      6-Digit Verification Code
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={resetCode}
                        onChange={e => setResetCode(e.target.value)}
                        placeholder="123456"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      New Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:border-purple-400 focus:bg-white outline-hidden text-neutral-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !newPassword}
                    className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Updating...' : 'Set New Password'}</span>
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    resetForm();
                  }}
                  className="text-xs font-bold text-neutral-600 hover:text-purple-600 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
