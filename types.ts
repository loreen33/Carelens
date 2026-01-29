export enum BurnoutRiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High'
}

export interface SupportSuggestions {
  immediateRelief: string;
  structuralAdjustment: string;
  emotionalReframe: string;
}

export interface AnalysisResult {
  burnoutRiskLevel: BurnoutRiskLevel;
  noticing: string[];
  suggestedSupport: SupportSuggestions;
  closingLine: string;
  // New fields for History/Journey
  summary: string;
  resilienceNoted: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  burnoutRiskLevel: BurnoutRiskLevel;
  summary: string;
  resilienceNoted: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: AnalysisResult | null;
  error: string | null;
}