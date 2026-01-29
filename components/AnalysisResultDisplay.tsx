import React from 'react';
import { AnalysisResult, BurnoutRiskLevel } from '../types';
import SupportCard from './SupportCard';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
  
  const getRiskBadge = (level: BurnoutRiskLevel) => {
    switch (level) {
      case BurnoutRiskLevel.LOW:
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Low Risk</span>
          </div>
        );
      case BurnoutRiskLevel.MODERATE:
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Moderate Risk</span>
          </div>
        );
      case BurnoutRiskLevel.HIGH:
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">High Risk</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Risk Level Header */}
      <div className="flex flex-col items-center justify-center mb-8">
        <h2 className="text-slate-500 uppercase tracking-widest text-xs font-semibold mb-3">Analysis Complete</h2>
        {getRiskBadge(result.burnoutRiskLevel)}
      </div>

      {/* Noticing Section */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">What I'm noticing</h3>
        <ul className="space-y-3">
          {result.noticing.map((insight, index) => (
            <li key={index} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Support Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SupportCard type="immediate" content={result.suggestedSupport.immediateRelief} />
        <SupportCard type="structural" content={result.suggestedSupport.structuralAdjustment} />
        <SupportCard type="emotional" content={result.suggestedSupport.emotionalReframe} />
      </div>

      {/* Closing Line */}
      <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-slate-600 italic font-medium">"{result.closingLine}"</p>
      </div>
    </div>
  );
};

export default AnalysisResultDisplay;