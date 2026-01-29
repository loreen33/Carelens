import React from 'react';
import { HistoryEntry, BurnoutRiskLevel } from '../types';
import { Calendar, Shield, ArrowRight } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryEntry[];
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack }) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(timestamp));
  };

  const getRiskColor = (level: BurnoutRiskLevel) => {
    switch (level) {
      case BurnoutRiskLevel.LOW:
        return "bg-emerald-50 border-emerald-100 text-emerald-800";
      case BurnoutRiskLevel.MODERATE:
        return "bg-amber-50 border-amber-100 text-amber-800";
      case BurnoutRiskLevel.HIGH:
        return "bg-rose-50 border-rose-100 text-rose-800";
      default:
        return "bg-slate-50 border-slate-100 text-slate-800";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Journey</h2>
          <p className="text-slate-500 mt-1">Reflecting on your path, one step at a time.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
        >
          Back to Check-in
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">No entries yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto mb-6">
            Your journey starts with a single reflection. Take a moment to check in with yourself today.
          </p>
          <button 
            onClick={onBack}
            className="text-brand-600 font-medium hover:underline"
          >
            Start your first reflection
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((entry) => (
            <div 
              key={entry.id} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(entry.burnoutRiskLevel)}`}>
                    {entry.burnoutRiskLevel} Risk
                  </div>
                  <span className="text-sm text-slate-400 font-medium">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Summary</h4>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    "{entry.summary}"
                  </p>
                </div>

                <div className="bg-brand-50/50 p-4 rounded-xl flex gap-3 items-start">
                  <Shield className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">Resilience Noted</h4>
                    <p className="text-brand-900/80 text-sm italic">
                      {entry.resilienceNoted}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;