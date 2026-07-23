import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Loader2, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEDICAL_DICTIONARY_PRESETS } from '../data/mockData';

export const MedicalDictionary: React.FC = () => {
  const { dictionaryTerm, setDictionaryTerm, language, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState(dictionaryTerm || 'Hemoglobin');
  const [isLoading, setIsLoading] = useState(false);
  const [definition, setDefinition] = useState<any>(
    MEDICAL_DICTIONARY_PRESETS['Hemoglobin'] || {
      term: 'Hemoglobin',
      simpleDefinition: 'The protein inside red blood cells that carries oxygen from your lungs to the rest of your body.',
      normalRange: '13.5 - 17.5 g/dL (Men), 12.0 - 15.5 g/dL (Women)',
      causesHigh: ['Dehydration', 'Smoking', 'High altitude living'],
      causesLow: ['Iron deficiency anemia', 'Blood loss', 'Vitamin B12 deficiency'],
      whenToSeeDoctor: 'If levels fall below 10 g/dL or you feel unusually fatigued and short of breath.',
    }
  );

  const handleSearch = async (termToLookup?: string) => {
    const term = termToLookup || searchTerm;
    if (!term.trim()) return;

    if (MEDICAL_DICTIONARY_PRESETS[term]) {
      setDefinition(MEDICAL_DICTIONARY_PRESETS[term]);
      setDictionaryTerm(term);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/translate-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term, language }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setDefinition(resData.data);
        setDictionaryTerm(term);
      } else {
        throw new Error(resData.error);
      }
    } catch (err) {
      showToast('Could not fetch term definition.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const presetList = Object.keys(MEDICAL_DICTIONARY_PRESETS);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-purple-600" />
          Medical Term Dictionary
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Search or click any complex medical term to get a simple, easy-to-understand explanation.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search medical term (e.g. Bilirubin, HbA1c, Creatinine)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Explain Term</span>
          </button>
        </div>

        {/* Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Popular:</span>
          {presetList.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setSearchTerm(preset);
                handleSearch(preset);
              }}
              className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-[11px] font-semibold shrink-0 transition-colors border border-purple-200/60 dark:border-purple-800"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Term Explanation Card */}
      {definition && (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
              Medical Term
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {definition.term}
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase block mb-1">
              Simple Definition
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {definition.simpleDefinition}
            </p>
          </div>

          {definition.normalRange && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Standard Normal Range: </span>
              <span className="text-slate-600 dark:text-slate-400">{definition.normalRange}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {definition.causesHigh && (
              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
                <span className="font-bold text-red-700 dark:text-red-300 block mb-1.5">
                  What causes HIGH levels?
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {definition.causesHigh.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {definition.causesLow && (
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                <span className="font-bold text-amber-700 dark:text-amber-300 block mb-1.5">
                  What causes LOW levels?
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {definition.causesLow.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {definition.whenToSeeDoctor && (
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
              <strong>When to consult a doctor:</strong> {definition.whenToSeeDoctor}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
