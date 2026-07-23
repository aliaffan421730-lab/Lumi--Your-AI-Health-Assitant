import React from 'react';
import {
  Wallet,
  Shield,
  Award,
  Heart,
  Activity,
  Pill,
  FileText,
  FlaskConical,
  Phone,
  Plus,
  Download,
  CheckCircle2,
  AlertTriangle,
  Droplet
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HealthWallet: React.FC = () => {
  const { userProfile, prescriptions, labReports, healthScore, showToast } = useApp();

  const handleExportPDF = () => {
    showToast('Generating AI Health Summary PDF report...', 'info');
    setTimeout(() => {
      showToast('Health Summary downloaded!', 'success');
    }, 1500);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-blue-600" />
            Digital Health Wallet
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Centralized encrypted vault for medical history, lab reports, prescriptions, and AI summary.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Health Summary</span>
        </button>
      </div>

      {/* AI Health Summary Score Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">
              AI Health Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">{healthScore}</span>
              <span className="text-lg opacity-80 font-medium">/ 100</span>
            </div>
            <p className="text-xs opacity-90 max-w-md leading-relaxed">
              Based on regular medication adherence, recent lab findings (improving blood glucose), and stable vitals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
            <div>
              <span className="text-[10px] opacity-70 block">Blood Group</span>
              <span className="text-sm font-bold">{userProfile.bloodGroup}</span>
            </div>
            <div>
              <span className="text-[10px] opacity-70 block">Active Meds</span>
              <span className="text-sm font-bold">3 Medicines</span>
            </div>
            <div>
              <span className="text-[10px] opacity-70 block">Interactions</span>
              <span className="text-sm font-bold text-emerald-300">None</span>
            </div>
          </div>
        </div>

        {/* Recommendations Row */}
        <div className="pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Medication Adherence 94%</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-sky-300" />
            <span>Blood Sugar Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-300" />
            <span>Iron Rich Diet Recommended</span>
          </div>
        </div>
      </div>

      {/* Vault Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Vitals & Allergies */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            Medical Profile & Allergies
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[10px] text-slate-400 block">Height / Weight</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {userProfile.heightCm} cm / {userProfile.weightKg} kg
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[10px] text-slate-400 block">Age & Gender</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {userProfile.age} Yrs • {userProfile.gender}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Known Allergies
            </span>
            <div className="flex flex-wrap gap-2">
              {userProfile.allergies.map((alg, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 text-xs font-semibold"
                >
                  ⚠️ {alg}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Chronic Conditions
            </span>
            <div className="flex flex-wrap gap-2">
              {userProfile.chronicConditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 text-xs font-semibold"
                >
                  🩺 {cond}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contacts Vault */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-500" />
            Emergency Contacts
          </h3>

          <div className="space-y-2">
            {userProfile.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{contact.name}</p>
                  <p className="text-[10px] text-slate-400">{contact.relationship}</p>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center gap-1 text-[11px] transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
