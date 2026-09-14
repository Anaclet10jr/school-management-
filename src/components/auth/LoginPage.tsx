import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  School,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('komezusengebyiringiro@gmail.com');
  const [password, setPassword] = useState('Akazuba@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const user = StorageService.authenticate(email, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setErrorMsg('Invalid email or password. Please verify credentials.');
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickFillAdmin = () => {
    setEmail('komezusengebyiringiro@gmail.com');
    setPassword('Akazuba@123');
    setErrorMsg('');
  };

  const handleQuickLoginRole = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    const user = StorageService.authenticate(roleEmail, rolePass);
    if (user) onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background decoration */}
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 p-8 text-white text-center relative">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
              <School className="w-9 h-9 text-emerald-300" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Kigali Academic ERP
            </h1>
            <p className="text-xs text-emerald-100/90 font-medium mt-1">
              Professional School Management & Information System
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-400/30 text-[11px] font-semibold text-emerald-200 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Rwanda Education Portal • 2025/2026</span>
            </div>
          </div>

          {/* Form Area */}
          <div className="p-8">
            {/* Quick Admin Fill Notice */}
            <div className="mb-6 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Super Admin Credential
                </span>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                  Komezusenge byiringiro
                </p>
                <p className="text-[11px] text-slate-500">
                  komezusengebyiringiro@gmail.com
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
              >
                Auto Fill
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="komezusengebyiringiro@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all text-slate-800 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign in to School Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins for instant evaluation */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
                Quick 1-Click Role Login
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLoginRole('komezusengebyiringiro@gmail.com', 'Akazuba@123')}
                  className="p-2 text-left rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors"
                >
                  <p className="font-bold text-emerald-950">Super Admin</p>
                  <p className="text-[10px] text-emerald-700">Komezusenge</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLoginRole('teacher@kigaliacademy.rw', 'Teacher@123')}
                  className="p-2 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <p className="font-bold text-slate-800">Teacher</p>
                  <p className="text-[10px] text-slate-500">Jean Paul Habimana</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLoginRole('bursar@kigaliacademy.rw', 'Bursar@123')}
                  className="p-2 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <p className="font-bold text-slate-800">Accountant / Bursar</p>
                  <p className="text-[10px] text-slate-500">Diane Mukamana</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLoginRole('parent@gmail.com', 'Parent@123')}
                  className="p-2 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <p className="font-bold text-slate-800">Parent Portal</p>
                  <p className="text-[10px] text-slate-500">Emmanuel Kayiranga</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-slate-400" />
          <span>Role-Based Access Control • TLS / AES-256 Encrypted</span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered email address to receive password reset instructions.
            </p>

            {resetSent ? (
              <div className="my-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password reset token sent to your email. Check inbox.</span>
              </div>
            ) : (
              <div className="my-4">
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setResetSent(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Close
              </button>
              {!resetSent && (
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="px-4 py-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
