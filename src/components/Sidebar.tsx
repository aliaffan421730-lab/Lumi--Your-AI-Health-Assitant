import React, { useState } from 'react';
import {
  Home,
  FileText,
  FlaskConical,
  Pill,
  ShieldAlert,
  Coins,
  Wallet,
  Bell,
  MessageSquare,
  Globe,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Heart,
  Siren,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import { LANGUAGES } from '../data/mockData';
import { getTranslation } from '../utils/translations';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    userProfile,
    setIsEmergencyOpen
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);

  const navItems: { tab: TabType; labelKey: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'home', labelKey: 'home', icon: Home },
    { tab: 'prescriptions', labelKey: 'prescriptions', icon: FileText },
    { tab: 'lab-reports', labelKey: 'labReports', icon: FlaskConical },
    { tab: 'medicines', labelKey: 'medicines', icon: Pill },
    { tab: 'interactions', labelKey: 'interactions', icon: ShieldAlert },
    { tab: 'alternatives', labelKey: 'alternatives', icon: Coins },
    { tab: 'health-wallet', labelKey: 'healthWallet', icon: Wallet },
    { tab: 'reminders', labelKey: 'reminders', icon: Bell },
    { tab: 'ask-lumi', labelKey: 'askLumi', icon: MessageSquare },
  ];

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <aside className="w-64 bg-white dark:bg-[#0c1222] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-2xl bg-[#4F7CFF] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-[#4F7CFF]/20">
              <Heart className="w-5 h-5 fill-white/20 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none font-display">
                {getTranslation(language, 'appTitle')}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                {getTranslation(language, 'appSubTitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency SOS Banner Button */}
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="w-full mt-4 py-2 px-3 bg-red-50/80 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 font-bold text-xs rounded-xl border border-red-200/60 dark:border-red-900/50 flex items-center justify-center gap-2 transition-all shadow-2xs"
        >
          <Siren className="w-4 h-4 text-red-600 animate-pulse shrink-0" />
          <span>Emergency SOS Card</span>
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="px-3 py-2 flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-[#4F7CFF] text-white font-bold shadow-md shadow-[#4F7CFF]/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span className="truncate">{getTranslation(language, item.labelKey)}</span>
            </button>
          );
        })}

        {/* Medical Dictionary Link */}
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 ${
            activeTab === 'dictionary'
              ? 'bg-[#4F7CFF] text-white font-bold shadow-md shadow-[#4F7CFF]/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'dictionary' ? 'text-white' : 'text-slate-400'}`} />
          <span className="truncate">{getTranslation(language, 'dictionary')}</span>
        </button>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>{currentLangObj.name} ({currentLangObj.nativeName})</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 max-h-56 overflow-y-auto">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                    language === l.code ? 'text-blue-600 font-semibold bg-blue-50/50 dark:bg-blue-950/40' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{l.name}</span>
                  <span className="text-slate-400">{l.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark Mode Switch */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-xs">
          <div className="flex items-center gap-2.5">
            {darkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span className="font-semibold">{getTranslation(language, 'darkMode')}</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
              darkMode ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* User Profile Card */}
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={userProfile.photoURL}
              alt={userProfile.fullName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {userProfile.fullName}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                {userProfile.email}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
};
