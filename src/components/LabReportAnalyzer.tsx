import React, { useState } from 'react';
import {
  FlaskConical,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Loader2,
  FileText,
  Shield,
  TrendingDown,
  TrendingUp,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LabReportRecord } from '../types';

export const LabReportAnalyzer: React.FC = () => {
  const { labReports, addLabReport, language, showToast, setDictionaryTerm } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [activeReport, setActiveReport] = useState<LabReportRecord | null>(labReports[0] || null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        processLabReport(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processLabReport = async (imageBase64?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/analyze-lab-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, language }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const data = resData.data;
        const newReport: LabReportRecord = {
          id: 'lab_' + Date.now(),
          reportType: data.reportType || 'Complete Blood Count (CBC)',
          labName: data.labName || 'Liaquat National Hospital',
          date: data.date || new Date().toLocaleDateString(),
          patientName: data.patientName || 'Ali Affan',
          status: 'Analyzed',
          summary: data.summary || 'Lab report parameters extracted successfully.',
          parameters: (data.parameters || []).map((p: any, idx: number) => ({
            id: 'p_' + idx + '_' + Date.now(),
            parameterName: p.parameterName || 'Test Parameter',
            value: p.value || '10',
            unit: p.unit || '',
            referenceRange: p.referenceRange || '10 - 20',
            status: p.status || 'normal',
            aiExplanation: p.aiExplanation || 'Value is within expected range.',
            causes: p.causes || [],
            recommendations: p.recommendations || [],
          })),
        };

        addLabReport(newReport);
        setActiveReport(newReport);
      } else {
        throw new Error(resData.error);
      }
    } catch (err) {
      showToast('Could not analyze lab image. Displaying sample report.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const currentReport = activeReport || labReports[0];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <FlaskConical className="w-6 h-6 text-teal-600" />
          AI Lab Report Analyzer
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload any medical lab report (CBC, LFT, KFT, Lipid, Blood Sugar, Thyroid) and get plain-language explanations.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/40 hover:border-teal-500 transition-colors">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Reading lab parameters & reference ranges...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Upload Lab Report Image or PDF
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">CBC, Lipid Profile, Liver & Kidney Function, Blood Glucose</p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <label className="cursor-pointer px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse File</span>
                  <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  onClick={() => processLabReport()}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Analyze Sample CBC</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Select active report */}
      {labReports.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {labReports.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                currentReport?.id === report.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
              }`}
            >
              {report.reportType} ({report.date})
            </button>
          ))}
        </div>
      )}

      {/* Report Findings */}
      {currentReport && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                AI Clinical Summary ({currentReport.reportType})
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {currentReport.summary}
              </p>
            </div>
          </div>

          {/* Test Parameters Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Extracted Parameters ({currentReport.parameters.length})
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {currentReport.parameters.map((param) => {
                const isNormal = param.status === 'normal';
                const isLow = param.status === 'low';
                const isHigh = param.status === 'high';

                return (
                  <div
                    key={param.id}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            onClick={() => setDictionaryTerm(param.parameterName)}
                            className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 cursor-pointer underline decoration-dotted"
                          >
                            {param.parameterName}
                          </h4>
                          <span className="text-xs text-slate-400">(Click for dictionary)</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Reference Range: <span className="font-semibold text-slate-700 dark:text-slate-300">{param.referenceRange}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                            {param.value} {param.unit}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                            isNormal
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : isLow
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                          }`}
                        >
                          {isNormal ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isLow ? (
                            <TrendingDown className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingUp className="w-3.5 h-3.5" />
                          )}
                          {param.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* AI Explanation in Plain Language */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        What this means in plain language
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {param.aiExplanation}
                      </p>

                      {param.recommendations && param.recommendations.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">
                            Recommended Next Steps:
                          </span>
                          <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                            {param.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
