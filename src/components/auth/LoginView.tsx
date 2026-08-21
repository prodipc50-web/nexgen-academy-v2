import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Headphones,
  CreditCard,
  GraduationCap,
  Shield,
  Phone
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, staffList } = useAcademy();

  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(identifier, password, rememberMe);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg(res.message);
      }
    }, 350);
  };

  const handleQuickFill = (staffUsername: string, staffPass: string) => {
    setIdentifier(staffUsername);
    setPassword(staffPass);
    setErrorMsg('');
  };

  const quickRoles = [
    {
      role: 'Super Admin',
      name: 'Prodip Chowdhury',
      user: 'admin',
      pass: 'admin123',
      icon: Shield,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
      tag: 'Executive Control'
    },
    {
      role: 'Manager',
      name: 'Nusrat Jahan',
      user: 'manager',
      pass: 'manager123',
      icon: Briefcase,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      tag: 'Operations'
    },
    {
      role: 'Counselor',
      name: 'Tanvir Ahmed',
      user: 'counselor',
      pass: 'counselor123',
      icon: Headphones,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
      tag: 'CRM & Sales'
    },
    {
      role: 'Accounts',
      name: 'Shamim Hossain',
      user: 'accounts',
      pass: 'accounts123',
      icon: CreditCard,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      tag: 'Payments'
    },
    {
      role: 'Lead Trainer',
      name: 'Rashedul Karim',
      user: 'trainer',
      pass: 'trainer123',
      icon: GraduationCap,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
      tag: 'Academics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Crest & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <NexgenLogo variant="crest" size={54} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Nexgen Computer Academy
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 font-medium mt-1">
              Enterprise Office & Operations Management Portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Staff Secure Login</h2>
              <p className="text-xs text-slate-500">Sign in with your assigned username & password</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2.5 text-rose-800 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2.5 text-emerald-800 text-xs animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username or Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Username or Official Email / Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. admin, manager, or prodipc50@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 font-medium">Remember my session</span>
              </label>

              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>SSL Encrypted</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-75 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Profiles */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                1-Click Fast Switch Credentials:
              </span>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                Demo Quick Fill
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickRoles.map(item => {
                const Icon = item.icon;
                const isSelected = identifier === item.user;
                return (
                  <button
                    key={item.user}
                    type="button"
                    onClick={() => handleQuickFill(item.user, item.pass)}
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      item.badgeColor
                    } ${isSelected ? 'ring-2 ring-indigo-600' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase">{item.role}</span>
                      <Icon className="w-3 h-3 opacity-75" />
                    </div>
                    <div className="mt-1 text-[11px] font-bold truncate">{item.user}</div>
                    <div className="text-[9px] text-slate-500 font-mono">pwd: {item.pass}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Security & System Info Footer */}
        <div className="text-center text-xs text-indigo-200/70 space-y-1 font-medium">
          <p>© {new Date().getFullYear()} Nexgen Computer Academy. All Rights Reserved.</p>
          <div className="flex items-center justify-center space-x-2 text-[11px]">
            <span>Version 2.6</span>
            <span>•</span>
            <span>Role-Based Access Control (RBAC)</span>
            <span>•</span>
            <span>256-Bit Protection</span>
          </div>
        </div>
      </div>

      {/* Forgot Password / Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Account Recovery & Help</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Nexgen Computer Academy ERP credentials are restricted to authorized employees, trainers, and directors.
              </p>

              <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100 space-y-2">
                <div className="font-bold text-indigo-900 flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Default System Credentials:</span>
                </div>
                <ul className="space-y-1 text-indigo-950 font-medium pl-4 list-disc">
                  <li><strong>Super Admin:</strong> <code className="bg-white px-1.5 py-0.5 rounded font-mono">admin</code> / <code className="bg-white px-1.5 py-0.5 rounded font-mono">admin123</code></li>
                  <li><strong>Director Email:</strong> <code className="bg-white px-1.5 py-0.5 rounded font-mono">prodipc50@gmail.com</code></li>
                  <li><strong>Universal Override Key:</strong> <code className="bg-white px-1.5 py-0.5 rounded font-mono">admin123</code></li>
                </ul>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Academy Support Helpline:</span>
                </div>
                <p className="text-slate-700">Phone: <strong>+880 1711-001122</strong></p>
                <p className="text-slate-700">Email: <strong>support@nexgenacademy.edu</strong></p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowHelpModal(false);
                  handleQuickFill('admin', 'admin123');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Auto-fill Super Admin & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
