import React, { useState } from 'react';
import {
  Heart,
  Lock,
  Mail,
  KeyRound,
  User,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Coins,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { login, signup, showToast, darkMode, toggleDarkMode } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      if (!email || !password) {
        showToast('Please enter your email and password.', 'warning');
        return;
      }
      login(email, password, fullName || 'Ali Affan');
    } else {
      if (!fullName || !email || !password) {
        showToast('Please fill in all required fields.', 'warning');
        return;
      }
      signup(fullName, email, phone || '+92 300 1234567', password, bloodGroup);
    }
  };

  const handleDemoLogin = () => {
    login('aliaffan.pharma@gmail.com', 'demo123', 'Ali Affan');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] flex items-center justify-center p-4 sm:p-6 md:p-10 transition-colors duration-200">
      {/* Top Absolute Controls (Dark Mode Switch) */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-md hover:scale-105 transition-all flex items-center gap-2 text-xs font-semibold px-4"
        >
          {darkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-all">
        {/* Left Branding & Highlights Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Decorative Accents */}
          <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Logo Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
                <Heart className="w-6 h-6 fill-white/20 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight leading-none font-display">Lumi</h1>
                <p className="text-[11px] text-blue-100 font-medium mt-1 tracking-wide uppercase">AI Healthcare Assistant</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold leading-snug font-display">
                Medical Intelligence for Patients & Families in Pakistan
              </h2>
              <p className="text-xs text-blue-100/90 leading-relaxed font-normal">
                Effortlessly scan doctor prescriptions, translate lab reports into simple terms, verify DRAP generic medicine prices, and consult your health history safely.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3.5 text-xs bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Prescription & Lab OCR</p>
                  <p className="text-[10px] text-blue-100/80">Translates handwriting & complex lab units</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-xs bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">DRAP Generic Price Checker</p>
                  <p className="text-[10px] text-blue-100/80">Find affordable substitutes in Pakistani Rupees</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-xs bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                <div className="w-8 h-8 rounded-xl bg-indigo-400/20 text-indigo-200 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Urdu & Regional Support</p>
                  <p className="text-[10px] text-blue-100/80">Urdu, Sindhi, Pashto, Punjabi & English</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/15 flex items-center gap-2 text-[11px] text-blue-100/80">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Private & Encrypted Local Data Storage</span>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
          {/* Header Switcher */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800">
              🇵🇰 Pakistan Edition
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                {mode === 'signin' ? 'Sign in to Lumi 👋' : 'Create Patient Account 🏥'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'signin'
                  ? 'Access your saved medical records, prescription history, and AI health assistant.'
                  : 'Register your details to start storing family health records securely.'}
              </p>
            </div>

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ali Affan"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aliaffan.pharma@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
            >
              <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200/80 dark:border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instant Quick Demo Access (Ali Affan)</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
              Explore all features with pre-configured sample profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
