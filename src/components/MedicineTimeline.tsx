import React from 'react';
import {
  Pill,
  Sun,
  Moon,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MedicineTimeline: React.FC = () => {
  const { prescriptions, toggleMedicineTaken } = useApp();

  const activeRx = prescriptions[0];
  const medicines = activeRx ? activeRx.medicines : [];

  // Calculate adherence score
  let totalDoses = 0;
  let takenDoses = 0;

  medicines.forEach((m) => {
    if (m.schedule.morning) {
      totalDoses++;
      if (m.takenToday?.morning) takenDoses++;
    }
    if (m.schedule.afternoon) {
      totalDoses++;
      if (m.takenToday?.afternoon) takenDoses++;
    }
    if (m.schedule.night) {
      totalDoses++;
      if (m.takenToday?.night) takenDoses++;
    }
  });

  const adherencePercent = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Title & Adherence Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-blue-600" />
            Today's Medicine Timeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track your medication doses by time of day. Tap to mark as taken.
          </p>
        </div>

        {/* Adherence Score Card */}
        <div className="bg-blue-50/80 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 rounded-2xl p-4 min-w-[240px] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Adherence Score
            </span>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {adherencePercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-blue-200/60 dark:bg-blue-900/80 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${adherencePercent}%` }}
            />
          </div>

          <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
            {takenDoses} of {totalDoses} doses taken today
          </p>
        </div>
      </div>

      {/* Timeline Sections */}
      <div className="space-y-6">
        {/* Morning Section */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Morning Schedule (8:00 AM)
              </h3>
              <p className="text-xs text-slate-400">Take with breakfast and a glass of water</p>
            </div>
          </div>

          <div className="space-y-3">
            {medicines.filter((m) => m.schedule.morning).map((m) => {
              const isTaken = m.takenToday?.morning;
              return (
                <div
                  key={m.id}
                  onClick={() => activeRx && toggleMedicineTaken(activeRx.id, m.id, 'morning')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isTaken
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isTaken ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isTaken ? 'text-emerald-900 dark:text-emerald-200 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                        {m.brandName} ({m.dosage})
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.instructions}</p>
                    </div>
                  </div>

                  <button className="text-emerald-500">
                    {isTaken ? (
                      <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Afternoon Section */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Afternoon Schedule (2:00 PM)
              </h3>
              <p className="text-xs text-slate-400">Take after lunch</p>
            </div>
          </div>

          <div className="space-y-3">
            {medicines.filter((m) => m.schedule.afternoon).map((m) => {
              const isTaken = m.takenToday?.afternoon;
              return (
                <div
                  key={m.id}
                  onClick={() => activeRx && toggleMedicineTaken(activeRx.id, m.id, 'afternoon')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isTaken
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isTaken ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isTaken ? 'text-emerald-900 dark:text-emerald-200 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                        {m.brandName} ({m.dosage})
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.instructions}</p>
                    </div>
                  </div>

                  <button className="text-emerald-500">
                    {isTaken ? (
                      <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Night Section */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Night Schedule (9:00 PM)
              </h3>
              <p className="text-xs text-slate-400">Take after dinner before going to sleep</p>
            </div>
          </div>

          <div className="space-y-3">
            {medicines.filter((m) => m.schedule.night).map((m) => {
              const isTaken = m.takenToday?.night;
              return (
                <div
                  key={m.id}
                  onClick={() => activeRx && toggleMedicineTaken(activeRx.id, m.id, 'night')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isTaken
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isTaken ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isTaken ? 'text-emerald-900 dark:text-emerald-200 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                        {m.brandName} ({m.dosage})
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.instructions}</p>
                    </div>
                  </div>

                  <button className="text-emerald-500">
                    {isTaken ? (
                      <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
