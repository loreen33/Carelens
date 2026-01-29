import React, { useState, useEffect } from 'react';
import { AnalysisResult, AnalysisState, HistoryEntry } from './types';
import { analyzeReflection } from './services/geminiService';
import InputSection from './components/InputSection';
import AnalysisResultDisplay from './components/AnalysisResultDisplay';
import HistoryView from './components/HistoryView';
import { Leaf, Info, BookHeart, LayoutDashboard } from 'lucide-react';

const HISTORY_STORAGE_KEY = 'carelens_journey_history';

const App: React.FC = () => {
  const [view, setView] = useState<'new' | 'history'>('new');
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveToHistory = (result: AnalysisResult) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      burnoutRiskLevel: result.burnoutRiskLevel,
      summary: result.summary,
      resilienceNoted: result.resilienceNoted
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleAnalyze = async (text: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await analyzeReflection(text);
      setState({ isLoading: false, result, error: null });
      saveToHistory(result);
    } catch (error) {
      setState({ 
        isLoading: false, 
        result: null, 
        error: "We encountered an issue analyzing your reflection. Please try again in a moment." 
      });
    }
  };

  const resetAnalysis = () => {
    setState({ isLoading: false, result: null, error: null });
    setView('new');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={resetAnalysis}
          >
            <div className="bg-brand-50 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-brand-600" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">CareLens</span>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'history' 
                  ? 'bg-brand-100 text-brand-800' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookHeart className="w-4 h-4" />
              <span className="hidden sm:inline">My Journey</span>
            </button>
            <div className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-500">
              Beta
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-12">
        {view === 'history' ? (
          <HistoryView history={history} onBack={() => setView('new')} />
        ) : (
          <>
            {!state.result ? (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10 max-w-2xl">
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    How are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-teal-500">really</span> feeling today?
                  </h1>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    CareLens helps you reflect on your day, recognize early signs of burnout, and find small, manageable ways to restore your balance.
                  </p>
                </div>

                <InputSection onAnalyze={handleAnalyze} isLoading={state.isLoading} />
                
                {state.error && (
                  <div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center gap-3">
                    <Info className="w-5 h-5 shrink-0" />
                    <p>{state.error}</p>
                  </div>
                )}

                {/* Features / Trust signals */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center opacity-70">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-800">Private Reflection</h3>
                    <p className="text-sm text-slate-500">Your inputs are processed securely and not stored permanently.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-800">Non-Clinical</h3>
                    <p className="text-sm text-slate-500">Supportive guidance for awareness, not a medical diagnosis.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-800">Actionable Steps</h3>
                    <p className="text-sm text-slate-500">Practical micro-habits you can use immediately.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={resetAnalysis}
                    className="text-slate-500 hover:text-brand-600 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    ← Start New Reflection
                  </button>
                  <button
                     onClick={() => setView('history')}
                     className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    View in Journey →
                  </button>
                </div>
                <AnalysisResultDisplay result={state.result} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="mt-24 py-8 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Disclaimer: CareLens is an AI-powered tool for self-reflection and awareness. It is not a substitute for professional medical advice, diagnosis, or treatment. 
            If you are experiencing a mental health crisis or severe distress, please contact your local emergency services or a mental health professional immediately.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;