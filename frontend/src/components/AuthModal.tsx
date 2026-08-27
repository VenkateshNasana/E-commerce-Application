import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await register(name, email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-cyan-600/20 via-purple-800/20 to-pink-600/20 border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {mode === 'login' ? 'Welcome Back, Gamer' : 'Join NexusGaming'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'login' ? 'Sign in to your gaming account' : 'Create your free gaming account'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Toggle Tabs */}
          <div className="flex bg-slate-900/80 rounded-xl p-1 mt-4">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center space-x-2 bg-red-950/60 border border-red-500/40 text-red-300 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold">{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name / Gamer Tag"
                required
                className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Password (min. 6 chars)' : 'Password'}
              required
              className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold text-sm py-3.5 rounded-xl hover:opacity-90 transition shadow-neon disabled:opacity-60 mt-2"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? '🎮 Sign In to NexusGaming'
              : '🚀 Create Account'}
          </button>

          {/* Dev Test Credentials Helper */}
          <div className="border-t border-slate-800 pt-4 mt-2">
            <p className="text-[10px] text-slate-500 text-center mb-2 font-semibold uppercase tracking-wider">Quick Test Login</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setEmail('user@nexusgaming.com'); setPassword('User@123456'); setMode('login'); }}
                className="text-[10px] bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 py-2 rounded-lg font-semibold transition"
              >
                👤 Customer Demo
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@nexusgaming.com'); setPassword('Admin@123456'); setMode('login'); }}
                className="text-[10px] bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-purple-400 py-2 rounded-lg font-semibold transition"
              >
                🛡️ Admin Demo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
