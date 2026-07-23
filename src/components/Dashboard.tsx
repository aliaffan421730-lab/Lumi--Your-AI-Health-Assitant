import React from 'react';
import {
  FileText,
  FlaskConical,
  MessageSquare,
  Upload,
  Pill,
  Coins,
  ShieldCheck,
  Globe,
  BookOpen,
  Sparkles,
  ChevronRight,
  Shield,
  Plus,
  Calendar,
  Filter,
  Download,
  Search,
  Activity,
  TrendingUp,
  Clock,
  User,
  MoreHorizontal,
  QrCode,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

export const Dashboard: React.FC = () => {
  const {
    language,
    setActiveTab,
    userProfile,
    prescriptions,
    labReports,
    reminders,
    toggleReminder,
    setDictionaryTerm,
    loadSampleData
  } = useApp();

  // Combine activity feed from uploaded prescriptions and lab reports
  const activityItems = [
    ...prescriptions.map((p) => ({
      id: p.id,
      type: 'prescription',
      title: `Prescription by ${p.doctorName}`,
      subtext: `${p.hospital} • ${p.medicines.length} Medicines`,
      date: p.date,
      status: p.status || 'Analyzed',
      tab: 'prescriptions' as const,
    })),
    ...labReports.map((l) => ({
      id: l.id,
      type: 'lab',
      title: `${l.reportType}`,
      subtext: `${l.labName} • ${l.parameters.length} Parameters`,
      date: l.date,
      status: l.status || 'Analyzed',
      tab: 'lab-reports' as const,
    })),
  ];

  const activeMedicines = prescriptions.flatMap((p) =>
    p.medicines.map((m) => ({
      ...m,
      prescriptionId: p.id,
      doctorName: p.doctorName,
    }))
  );

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1500px] mx-auto space-y-5 md:space-y-7 transition-colors duration-200 bg-[#F8FAFC] dark:bg-[#0b0f17] min-h-screen">
      {/* Main Header / Greeting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 md:pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] dark:text-slate-400 mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#4F7CFF]" />
            <span>{formattedDate}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] font-bold text-[10px] border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              DRAP 2026 DB Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] dark:text-slate-100 font-display tracking-tight">
            Assalam-o-Alaikum, {userProfile.fullName}!
          </h1>
        </div>

        {/* Action Controls & Primary CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadSampleData}
            className="px-3.5 py-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#111827] dark:text-slate-200 font-medium text-xs border border-[#E5E7EB] dark:border-slate-700 shadow-2xs transition-colors"
          >
            Load Sample
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#4F7CFF] hover:bg-[#3d68e5] text-white font-semibold text-xs shadow-md shadow-[#4F7CFF]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Top Grid: 4 Cards Row (Responsive 1 col mobile -> 2 cols tablet -> 4 cols desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: Health Report Pending / Overview */}
        <div className="bg-white dark:bg-[#111827] rounded-[20px] border border-[#E5E7EB] dark:border-slate-800 p-5 lumi-card-shadow flex flex-col justify-between hover:border-[#4F7CFF]/50 transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827] dark:text-slate-100 font-display">
                Health Reports Overview
              </h3>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#F8FAFC] dark:bg-slate-800 text-[#4F7CFF] font-semibold border border-[#E5E7EB] dark:border-slate-700">
                Synced
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl font-bold text-[#111827] dark:text-slate-100 font-display">
                {labReports.length + prescriptions.length}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-[#4F7CFF] text-white px-2 py-0.5 rounded-full font-bold">
                  {activityItems.length} Uploaded
                </span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-[#10B981] px-2 py-0.5 rounded-full font-bold border border-emerald-200/50">
                  Active
                </span>
              </div>
            </div>

            {/* Mini Wave Chart Graphic */}
            <div className="mt-4 h-16 w-full relative flex items-end">
              <svg className="w-full h-full text-[#4F7CFF]" viewBox="0 0 200 60" fill="none">
                <path
                  d="M0 45 Q 30 45, 50 30 T 100 20 T 150 40 T 200 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="20" r="4" fill="#4F7CFF" />
                <line x1="100" y1="20" x2="100" y2="60" stroke="#4F7CFF" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-2 border-t border-[#E5E7EB] dark:border-slate-800/80">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
          </div>
        </div>

        {/* Card 2: Featured Info Card (News From The Doctor / Ask Lumi) */}
        <div className="bg-[#4F7CFF] text-white rounded-[20px] p-5 relative overflow-hidden lumi-blue-glow flex flex-col justify-between group">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          
          <div>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 fill-white/80" />
              </div>
              <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full font-bold">
                Today's Info
              </span>
            </div>

            <h3 className="text-base font-bold text-white font-display mt-3">
              Ask Lumi AI Assistant
            </h3>
            <p className="text-xs text-white/90 mt-2 leading-relaxed font-normal">
              Analyze DRAP medicine prices, search generic alternatives, and interpret lab report parameters instantly.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('ask-lumi')}
            className="mt-4 w-full py-2 px-3 bg-white hover:bg-slate-50 text-[#4F7CFF] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Start Consultation</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Health Trend Chart */}
        <div className="bg-white dark:bg-[#111827] rounded-[20px] border border-[#E5E7EB] dark:border-slate-800 p-5 lumi-card-shadow flex flex-col justify-between hover:border-[#4F7CFF]/50 transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827] dark:text-slate-100 font-display">
                Health Trend Chart
              </h3>
              <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-[#111827] dark:text-slate-100 font-display">
                85%
              </span>
              <span className="text-[11px] font-bold text-[#10B981] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                +0.75%
              </span>
            </div>

            {/* Smooth Blue Trend Line Graphic */}
            <div className="mt-3 h-16 w-full relative">
              <svg className="w-full h-full text-[#4F7CFF]" viewBox="0 0 200 60" fill="none">
                <path
                  d="M0 50 L 50 45 L 100 25 L 150 20 L 200 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="5" r="4" fill="#4F7CFF" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-2 border-t border-[#E5E7EB] dark:border-slate-800/80">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
          </div>
        </div>

        {/* Card 4: Checkup Progress */}
        <div className="bg-white dark:bg-[#111827] rounded-[20px] border border-[#E5E7EB] dark:border-slate-800 p-5 lumi-card-shadow flex flex-col justify-between hover:border-[#4F7CFF]/50 transition-all group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111827] dark:text-slate-100 font-display">
              Checkup Progress
            </h3>
            <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
          </div>

          <div className="space-y-3 mt-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#111827] dark:text-slate-200">22 August, 2024</span>
                <span className="text-[10px] text-[#4F7CFF] font-bold">75%</span>
              </div>
              <div className="w-full bg-[#F8FAFC] dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-[#E5E7EB] dark:border-slate-700">
                <div className="bg-[#4F7CFF] h-full rounded-full w-[75%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#111827] dark:text-slate-200">16 August, 2024</span>
                <span className="text-[10px] text-emerald-600 font-bold">100%</span>
              </div>
              <div className="w-full bg-[#F8FAFC] dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-[#E5E7EB] dark:border-slate-700">
                <div className="bg-[#10B981] h-full rounded-full w-[100%]" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className="mt-3 text-[11px] font-bold text-[#4F7CFF] dark:text-[#6D5EF8] hover:underline flex items-center justify-end gap-1"
          >
            <span>View All Schedules</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Content Row: Medical Info, Patient Health Report Chart & Care Team (3 Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Medical Information (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111827] rounded-[20px] border border-[#E5E7EB] dark:border-slate-800 p-6 lumi-card-shadow space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-slate-800">
            <h3 className="text-base font-bold text-[#111827] dark:text-slate-100 font-display">
              Medical Information
            </h3>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-semibold text-[#4F7CFF] hover:underline"
            >
              See Details
            </button>
          </div>

          {/* User Profile Info Card */}
          <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#F8FAFC] dark:bg-slate-800/50 border border-[#E5E7EB] dark:border-slate-700">
            <div className="flex items-center gap-3">
              <img
                src={userProfile.photoURL}
                alt={userProfile.fullName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-[#4F7CFF]/30"
              />
              <div>
                <h4 className="text-xs font-bold text-[#111827] dark:text-slate-100">
                  {userProfile.fullName}
                </h4>
                <p className="text-[10px] text-[#6B7280]">Patient Profile • Age {userProfile.age || 28}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-[#6B7280] border border-[#E5E7EB] dark:border-slate-600">
              <QrCode className="w-4 h-4" />
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">Medical History</p>
              <p className="font-semibold text-[#111827] dark:text-slate-200 mt-0.5">
                {prescriptions.length > 0 ? 'Regular OPD Consults' : 'No Chronic History'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">Current Medications</p>
              <p className="font-semibold text-[#111827] dark:text-slate-200 mt-0.5">
                {activeMedicines.length > 0 ? `${activeMedicines.length} Prescribed Active` : 'None Active'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">Allergies</p>
              <p className="font-semibold text-[#111827] dark:text-slate-200 mt-0.5">
                {userProfile.allergies?.length ? userProfile.allergies.join(', ') : 'No allergies present'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">Primary Physician</p>
              <p className="font-semibold text-[#111827] dark:text-slate-200 mt-0.5">
                {prescriptions[0]?.doctorName || 'Dr. Tariq Mahmood'}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('prescriptions')}
              className="w-full py-2.5 px-4 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#111827] dark:text-slate-200 font-bold text-xs rounded-xl border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-[#4F7CFF]" />
              <span>Manage Prescription Records</span>
            </button>
          </div>
        </div>

        {/* Column 2: Patient Health Report Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] rounded-[20px] border border-[#E5E7EB] dark:border-slate-800 p-6 lumi-card-shadow space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827] dark:text-slate-100 font-display">
                Patient Health Report
              </h3>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Health recovery metrics from uploaded lab reports</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-semibold text-[#6B7280]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4F7CFF]" />
                Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#6D5EF8]/40" />
                Recovery
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="relative pt-6 pb-2">
            {/* Tooltip Popup on Highlighted Bar */}
            <div className="absolute top-0 left-[26%] -translate-x-1/2 bg-[#111827] text-white text-[10px] p-2 rounded-xl shadow-lg z-10 space-y-0.5 pointer-events-none">
              <p className="font-bold text-white">Monday</p>
              <p className="text-blue-300">• towards recovery</p>
              <p className="text-slate-300">• treatment process</p>
            </div>

            <div className="flex items-end justify-between h-44 px-2">
              {/* Bar 1: Jan */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-t-xl h-24" />
                <span className="text-[10px] text-[#6B7280] font-medium">Jan</span>
              </div>
              {/* Bar 2: Feb (Active Highlighted) */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-gradient-to-t from-[#4F7CFF] to-[#6D5EF8] rounded-t-xl h-36 shadow-md shadow-[#4F7CFF]/30" />
                <span className="text-[10px] text-[#4F7CFF] font-bold">Feb</span>
              </div>
              {/* Bar 3: Mar */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-t-xl h-20" />
                <span className="text-[10px] text-[#6B7280] font-medium">Mar</span>
              </div>
              {/* Bar 4: Apr */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-t-xl h-28" />
                <span className="text-[10px] text-[#6B7280] font-medium">Apr</span>
              </div>
              {/* Bar 5: May */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#4F7CFF] rounded-t-xl h-32" />
                <span className="text-[10px] text-[#6B7280] font-medium">May</span>
              </div>
              {/* Bar 6: Jun */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-t-xl h-28" />
                <span className="text-[10px] text-[#6B7280] font-medium">Jun</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-3 border-t border-[#E5E7EB] dark:border-slate-800">
            <span className="text-[#6B7280] font-medium">Lab Tests Analyzed: {labReports.length}</span>
            <button
              onClick={() => setActiveTab('lab-reports')}
              className="font-bold text-[#4F7CFF] hover:underline"
            >
              Analyze Lab Report →
            </button>
          </div>
        </div>

        {/* Column 3: Quick Tools & Care Directory (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] rounded-[20px] border border-[#E5E7EB] dark:border-slate-800 p-6 lumi-card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111827] dark:text-slate-100 font-display">
              Quick Tools
            </h3>
            <button
              onClick={() => setActiveTab('alternatives')}
              className="text-xs font-semibold text-[#4F7CFF] hover:underline"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {/* Tool 1 */}
            <div
              onClick={() => setActiveTab('medicines')}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-[#E5E7EB] dark:border-slate-700/60 hover:border-[#4F7CFF] cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#4F7CFF]/10 text-[#4F7CFF] flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-slate-100">
                    Medicine Timeline
                  </h4>
                  <p className="text-[10px] text-[#6B7280]">Daily Doses & Schedules</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </div>

            {/* Tool 2 */}
            <div
              onClick={() => setActiveTab('alternatives')}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-[#E5E7EB] dark:border-slate-700/60 hover:border-[#4F7CFF] cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-slate-100">
                    DRAP Price Comparison
                  </h4>
                  <p className="text-[10px] text-[#6B7280]">Affordable Generic Alternatives</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </div>

            {/* Tool 3 */}
            <div
              onClick={() => setActiveTab('interactions')}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-[#E5E7EB] dark:border-slate-700/60 hover:border-[#4F7CFF] cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-slate-100">
                    Drug Interaction Check
                  </h4>
                  <p className="text-[10px] text-[#6B7280]">Safety & Side Effects</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </div>

            {/* Tool 4 */}
            <div
              onClick={() => setActiveTab('dictionary')}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-[#E5E7EB] dark:border-slate-700/60 hover:border-[#4F7CFF] cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-slate-100">
                    Medical Dictionary
                  </h4>
                  <p className="text-[10px] text-[#6B7280]">Clear Terminology Index</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline & Reminders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-[20px] border border-[#E5E7EB] dark:border-slate-800 p-6 lumi-card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111827] dark:text-slate-100 font-display">
              {getTranslation(language, 'recentActivity')}
            </h3>
            {activityItems.length > 0 && (
              <button
                onClick={() => setActiveTab('prescriptions')}
                className="text-xs font-semibold text-[#4F7CFF] hover:underline"
              >
                {getTranslation(language, 'viewAll')}
              </button>
            )}
          </div>

          {activityItems.length === 0 ? (
            <div className="p-8 text-center space-y-3 bg-[#F8FAFC] dark:bg-slate-800/40 rounded-2xl border border-dashed border-[#E5E7EB] dark:border-slate-700">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-[#4F7CFF] flex items-center justify-center mx-auto border border-[#E5E7EB] shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827] dark:text-slate-100 font-display">
                  No Medical Activity Yet
                </h4>
                <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
                  Upload a doctor prescription or lab test report to automatically analyze and populate your health record.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('prescriptions')}
                  className="px-4 py-2 bg-[#4F7CFF] hover:bg-[#3e6beb] text-white font-semibold text-xs rounded-full transition-all shadow-sm"
                >
                  Scan Prescription
                </button>
                <button
                  onClick={() => setActiveTab('lab-reports')}
                  className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-semibold text-xs rounded-full transition-all shadow-sm"
                >
                  Analyze Lab Report
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB] dark:divide-slate-800">
              {activityItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab(item.tab)}
                  className="py-3.5 flex items-center justify-between hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === 'prescription'
                        ? 'bg-[#4F7CFF]/10 text-[#4F7CFF]'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }`}>
                      {item.type === 'prescription' ? <FileText className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111827] dark:text-slate-100">
                        {item.title} <span className="text-[#6B7280] font-normal ml-2">• {item.date}</span>
                      </p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">
                        {item.subtext}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#10B981] dark:bg-emerald-950/60 border border-emerald-200/50">
                      {item.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Column: Reminders & Disclaimer */}
        <div className="space-y-6">
          {/* Reminders Card */}
          <div className="bg-white dark:bg-[#111827] rounded-[20px] border border-[#E5E7EB] dark:border-slate-800 p-6 lumi-card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111827] dark:text-slate-100 font-display">
                {getTranslation(language, 'reminders')}
              </h3>
              <button
                onClick={() => setActiveTab('reminders')}
                className="text-xs font-semibold text-[#4F7CFF] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {getTranslation(language, 'addNew')}
              </button>
            </div>

            <div className="space-y-2.5">
              {reminders.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-[#E5E7EB] dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111827] dark:text-slate-100">{r.title}</p>
                      <p className="text-[10px] text-[#6B7280]">{r.time} • {r.subtext}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleReminder(r.id)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      r.isActive ? 'bg-[#4F7CFF] justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-2xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="p-4 rounded-[20px] bg-[#F8FAFC] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700/60 flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#4F7CFF] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#6B7280] dark:text-slate-300 leading-relaxed font-medium">
              {getTranslation(language, 'disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
