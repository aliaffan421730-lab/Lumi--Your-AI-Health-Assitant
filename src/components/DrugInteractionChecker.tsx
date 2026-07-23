import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Pill,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DrugInteractionChecker: React.FC = () => {
  const { language, showToast } = useApp();

  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([
    'Metformin 500mg',
    'Amlodipine 5mg',
  ]);
  const [newMedInput, setNewMedInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interactionResult, setInteractionResult] = useState<any>({
    overallRisk: 'Safe',
    summary: 'No severe or hazardous drug interactions detected between Metformin and Amlodipine. They are frequently prescribed together for blood sugar and blood pressure management.',
    interactions: [
      {
        drug1: 'Metformin',
        drug2: 'Amlodipine',
        severity: 'Safe',
        mechanism: 'Metformin lowers blood sugar via insulin sensitivity, while Amlodipine relaxes blood vessel walls. They work through separate metabolic pathways without blocking each other.',
        symptomsToWatch: 'Mild dizziness if blood pressure drops when standing up rapidly.',
        advice: 'Safe to take together. Ensure adequate water intake throughout the day.',
      },
    ],
    foodWarnings: ['Avoid grapefruit juice with Amlodipine', 'Take Metformin after food'],
    alcoholWarning: 'Moderate risk: Alcohol may increase risk of low blood sugar or low blood pressure.',
  });

  const handleAddMed = () => {
    if (!newMedInput.trim()) return;
    if (selectedMedicines.includes(newMedInput.trim())) {
      showToast('Medicine already in list', 'info');
      return;
    }
    setSelectedMedicines([...selectedMedicines, newMedInput.trim()]);
    setNewMedInput('');
  };

  const handleRemoveMed = (med: string) => {
    setSelectedMedicines(selectedMedicines.filter((m) => m !== med));
  };

  const checkInteractions = async () => {
    if (selectedMedicines.length < 2) {
      showToast('Please add at least 2 medicines to check interactions', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: selectedMedicines, language }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setInteractionResult(resData.data);
      } else {
        throw new Error(resData.error);
      }
    } catch (err) {
      showToast('Failed to analyze interactions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-blue-600" />
          Drug Interaction Checker
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Check if taking multiple medications together is safe or if they cause negative interactions.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Select or Type Medications to Compare
        </h3>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMedInput}
            onChange={(e) => setNewMedInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMed()}
            placeholder="Type medicine name (e.g. Aspirin, Ibuprofen, Lisinopril)..."
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            onClick={handleAddMed}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Selected Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedMedicines.map((med) => (
            <span
              key={med}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-xs font-bold"
            >
              <Pill className="w-3.5 h-3.5" />
              {med}
              <button onClick={() => handleRemoveMed(med)} className="hover:text-red-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={checkInteractions}
            disabled={isLoading || selectedMedicines.length < 2}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Analyze Drug Interactions</span>
          </button>
        </div>
      </div>

      {/* Results Matrix */}
      {interactionResult && (
        <div className="space-y-4">
          {/* Risk Level Badge */}
          <div
            className={`p-5 rounded-2xl border flex items-center justify-between ${
              interactionResult.overallRisk === 'High Risk'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200'
                : interactionResult.overallRisk === 'Moderate'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {interactionResult.overallRisk === 'Safe' ? (
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              )}
              <div>
                <h3 className="text-base font-bold">
                  Overall Risk: {interactionResult.overallRisk}
                </h3>
                <p className="text-xs mt-0.5 leading-relaxed">{interactionResult.summary}</p>
              </div>
            </div>
          </div>

          {/* Individual Interactions List */}
          {interactionResult.interactions?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {item.drug1} + {item.drug2}
                </h4>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                  {item.severity}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Mechanism:</strong>{' '}
                  {item.mechanism}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Symptoms to watch out for:</strong>{' '}
                  {item.symptomsToWatch}
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-blue-700 dark:text-blue-300 font-medium">
                  <strong>Advice:</strong> {item.advice}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
