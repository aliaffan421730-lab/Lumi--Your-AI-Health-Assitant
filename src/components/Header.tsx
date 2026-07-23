import React, { useState } from 'react';
import { Search, Bell, Sparkles, X, Moon, Sun, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

export const Header: React.FC = () => {
  const {
    language,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    reminders,
    darkMode,
    toggleDarkMode,
    logout,
    userProfile
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0c1222]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-3.5 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines, lab reports, DRAP prices, or medical terms..."
            className="w-full pl-10 pr-12 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          )}
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-3 px-4 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">Notifications & Reminders</h4>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                    {reminders.filter(r => r.isActive).length} Active
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {reminders.map((r) => (
                    <div key={r.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{r.title}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{r.time} • {r.subtext}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ask Lumi Quick Action Pill Button */}
          <button
            onClick={() => setActiveTab('ask-lumi')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F7CFF] hover:bg-[#3d68e5] text-white font-semibold text-xs shadow-md shadow-[#4F7CFF]/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white/80" />
            <span>{getTranslation(language, 'askLumi')}</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
