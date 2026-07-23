import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, toastType, hideToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold text-white ${
          toastType === 'success'
            ? 'bg-emerald-600 border-emerald-500'
            : toastType === 'warning'
            ? 'bg-amber-600 border-amber-500'
            : toastType === 'error'
            ? 'bg-red-600 border-red-500'
            : 'bg-blue-600 border-blue-500'
        }`}
      >
        {toastType === 'success' ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : toastType === 'warning' ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <Info className="w-4 h-4" />
        )}

        <span>{toastMessage}</span>

        <button onClick={hideToast} className="p-1 hover:opacity-80">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
