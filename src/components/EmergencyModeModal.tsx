import React from 'react';
import { Siren, X, Phone, Heart, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmergencyModeModal: React.FC = () => {
  const { isEmergencyOpen, setIsEmergencyOpen, userProfile, prescriptions } = useApp();

  if (!isEmergencyOpen) return null;

  const activeRx = prescriptions[0];
  const activeMeds = activeRx ? activeRx.medicines : [];

  return (
    <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-2 border-red-500 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-red-100 dark:border-red-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                Emergency Medical Card
              </h2>
              <p className="text-[11px] text-slate-500">Instant critical info for ER doctors & paramedics</p>
            </div>
          </div>

          <button
            onClick={() => setIsEmergencyOpen(false)}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Vitals Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-center">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
              Blood Group
            </span>
            <span className="text-3xl font-black text-red-700 dark:text-red-300">
              {userProfile.bloodGroup}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Patient Name
            </span>
            <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 block truncate">
              {userProfile.fullName}
            </span>
            <span className="text-[11px] text-slate-400">{userProfile.age} Yrs • {userProfile.gender}</span>
          </div>
        </div>

        {/* Known Allergies */}
        <div className="p-4 rounded-2xl bg-red-500 text-white space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
            CRITICAL ALLERGIES
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {userProfile.allergies.map((alg, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-white text-red-600 font-extrabold text-xs">
                ⚠️ {alg}
              </span>
            ))}
          </div>
        </div>

        {/* Active Medications List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            Current Active Medications
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {activeMeds.map((med) => (
              <div key={med.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">{med.brandName}</span>
                <span className="text-slate-500">{med.dosage} ({med.instructions})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call Emergency Contacts */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            Emergency Contacts
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {userProfile.emergencyContacts.map((contact) => (
              <a
                key={contact.id}
                href={`tel:${contact.phone}`}
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between transition-colors shadow-md"
              >
                <div>
                  <p className="text-xs font-bold">{contact.name}</p>
                  <p className="text-[10px] opacity-80">{contact.relationship}</p>
                </div>
                <Phone className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
