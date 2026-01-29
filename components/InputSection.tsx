import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Send, AlertCircle } from 'lucide-react';

// Define types for Web Speech API since they are not available in all TS environments
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: any) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize SpeechRecognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setText((prev) => prev + (prev ? ' ' : '') + finalTranscript);
          setSpeechError(null);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        // Only log unexpected errors to console
        if (event.error !== 'network' && event.error !== 'no-speech' && event.error !== 'not-allowed') {
          console.error("Speech recognition error", event.error);
        }
        
        setIsListening(false);
        
        if (event.error === 'network') {
          setSpeechError("Network connection error. Speech recognition requires an active internet connection.");
        } else if (event.error === 'not-allowed') {
          setSpeechError("Microphone access denied. Please allow permissions in your browser settings.");
        } else if (event.error === 'no-speech') {
          // Don't show an error for no-speech, just stop listening silently or show a mild hint
          // User might have just paused too long.
          setSpeechError("No speech detected. Click the microphone to try again.");
        } else {
          setSpeechError("Voice input failed. Please try typing.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition is not supported in this browser.");
      return;
    }
    
    // Clear previous error when trying again
    if (speechError) setSpeechError(null);

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition", err);
        setSpeechError("Could not start microphone.");
        setIsListening(false);
      }
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (speechError) setSpeechError(null);
          }}
          placeholder="How was your day? Share what's on your mind..."
          className={`w-full h-48 p-6 rounded-2xl border-2 ${speechError ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : 'border-slate-100 focus:border-brand-300 focus:ring-brand-50'} bg-white shadow-sm resize-none focus:outline-none focus:ring-4 transition-all text-lg text-slate-700 placeholder:text-slate-400`}
          disabled={isLoading}
        />
        
        {/* Mic Button absolute positioned */}
        <button
          onClick={toggleListening}
          disabled={isLoading}
          className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 ${
            isListening 
              ? 'bg-rose-100 text-rose-600 animate-pulse ring-2 ring-rose-200' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          title={isListening ? "Stop recording" : "Start voice recording"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      {/* Error Message Display */}
      {speechError && (
        <div className="flex items-center justify-center gap-2 text-rose-600 text-sm animate-in slide-in-from-top-1 fade-in duration-300 bg-rose-50 p-2 rounded-lg border border-rose-100">
          <AlertCircle className="w-4 h-4" />
          <span>{speechError}</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white shadow-md transition-all
            ${!text.trim() || isLoading 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Reflection</span>
            </>
          )}
        </button>
      </div>
      
      {isListening && !speechError && (
        <p className="text-center text-sm text-slate-500 animate-pulse">
          Listening... speak clearly into your microphone.
        </p>
      )}
    </div>
  );
};

export default InputSection;