import React, { useState } from 'react';
import {
  FlaskConical,
  Upload,
  Sparkles,
  CheckCircle2,
  Loader2,
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
      // Validate file size (Vercel limit is 4.5MB total request)
      if (file.size > 4 * 1024 * 1024) {
        showToast('File too large. Please upload an image under 4MB.', 'error');
        return;
      }
      
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

      // Fix for "Unexpected token T" - Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        throw new Error(`Server error: ${response.status}. Please check Vercel logs.`);
      }

      const resData = await response.json();
      
      if (resData.success && resData.data) {
        const data = resData.data;
        
        const newReport: LabReportRecord = {
          id: 'lab_' + Date.now(),
          reportType: data.reportType || 'Laboratory Report',
          labName: data.labName || 'Detected Lab',
          date: data.date || new Date().toLocaleDateString(),
          patientName: data.patientName || 'Patient',
          status: 'Analyzed',
          summary: data.summary || 'Lab report processed successfully.',
          parameters: (data.parameters || []).map((p: any, idx: number) => ({
            id: 'p_' + idx + '_' + Date.now(),
            parameterName: p.parameterName || 'Unknown Test',
            value: p.value || '-',
            unit: p.unit || '',
            referenceRange: p.referenceRange || 'N/A',
            status: (p.status || 'normal').toLowerCase(),
            aiExplanation: p.aiExplanation || 'No specific explanation provided.',
            causes: p.causes || [],
            recommendations: p.recommendations || [],
          })),
        };

        addLabReport(newReport);
        setActiveReport(newReport);
        showToast('Lab report analyzed successfully!', 'success');
      } else {
        throw new Error(resData.error || 'Failed to parse AI response');
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      showToast(err.message || 'Could not analyze image.', 'error');
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
          Upload any medical lab report (CBC, LFT, KFT, Lipid, Blood Sugar) for an AI-powered explanation.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${isLoading ? 'border-teal-500 bg-teal-50/20' : 'border-slate-200 dark:border-slate-700 hover:border-teal-500'}`}>
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Lumi is reading your report...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Upload Lab Report Image
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG or WebP supported</p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <label className="cursor-pointer px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse File</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  onClick={() => processLabReport()}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Try Sample</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Navigation */}
      {labReports.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {labReports.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                currentReport?.id === report.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {report.reportType} - {report.date}
            </button>
          ))}
        </div>
      )}

      {/* Results Display */}
      {currentReport && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                Lumi AI Clinical Summary
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {currentReport.summary}
              </p>
            </div>
          </div>

          {/* Parameters List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 px-1">
              Analysis Results
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {currentReport.parameters.map((param) => {
                const status = param.status.toLowerCase();
                const isNormal = status === 'normal';
                const isLow = status === 'low';

                return (
                  <div
                    key={param.id}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60 mb-3">
                      <div>
                        <h4
                          onClick={() => setDictionaryTerm(param.parameterName)}
                          className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-teal-600 cursor-pointer transition-colors"
                        >
                          {param.parameterName}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 uppercase">
                          Ref: {param.referenceRange}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                            {param.value} <span className="text-xs font-medium text-slate-500">{param.unit}</span>
                          </span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                            isNormal
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : isLow
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                              : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                          }`}
                        >
                          {isNormal ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : isLow ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <TrendingUp className="w-3 h-3" />
                          )}
                          {status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        "{param.aiExplanation}"
                      </p>

                      {param.recommendations && param.recommendations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                          <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase mb-1">
                            Suggested Next Steps:
                          </p>
                          <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
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
