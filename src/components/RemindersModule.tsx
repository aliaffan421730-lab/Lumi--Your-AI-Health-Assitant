import React, { useState } from 'react';
import { Bell, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RemindersModule: React.FC = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [type, setType] = useState<'medicine' | 'water' | 'refill' | 'doctor'>('medicine');
  const [subtext, setSubtext] = useState('Take 1 tablet after food');

  const handleAdd = () => {
    if (!title.trim()) {
      showToast('Please enter reminder title', 'warning');
      return;
    }

    addReminder({
      title,
      time,
      type,
      isActive: true,
      subtext,
    });

    setTitle('');
    showToast('Reminder added successfully!', 'success');
  };

  const handleTestNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Lumi Health Reminder', {
            body: 'Time to take Metformin 500mg with a glass of water!',
            icon: '/assets/icon.png',
          });
          showToast('Notification sent!', 'success');
        } else {
          showToast('Browser notifications blocked.', 'warning');
        }
      });
    } else {
      showToast('Simulating reminder notification sound', 'info');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-amber-500" />
            Smart Health Reminders
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Never miss a dose, doctor appointment, or water intake goal.
          </p>
        </div>

        <button
          onClick={handleTestNotification}
          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-xl flex items-center gap-2 border border-amber-200 transition-colors"
        >
          <Bell className="w-4 h-4 text-amber-500" />
          <span>Test Notification</span>
        </button>
      </div>

      {/* Add New Form */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Create New Reminder
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. Drink Water, Take Metformin)"
            className="px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
          />

          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Time (e.g. 08:00 AM, Every 2 hours)"
            className="px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
          />

          <select
            value={type}
            onChange={(e: any) => setType(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="medicine">Medicine Dose</option>
            <option value="water">Drink Water</option>
            <option value="doctor">Doctor Appointment</option>
            <option value="refill">Refill Rx</option>
          </select>
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Save Reminder</span>
        </button>
      </div>

      {/* Existing List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Active Reminders ({reminders.length})
        </h3>

        <div className="space-y-2">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {r.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {r.time} • {r.subtext}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleReminder(r.id)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    r.isActive ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>

                <button
                  onClick={() => deleteReminder(r.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
