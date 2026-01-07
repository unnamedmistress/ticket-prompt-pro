export interface Phrase {
  label: string;
  weight: number;
  category: string;
  type: 'relevant' | 'helpful' | 'clarifying' | 'weak';
  optimal?: boolean;
}

export interface GameResult {
  totalScore: number;
  maxPossible: number;
  percentage: number;
  optimalCount: number;
  elapsedSeconds: number;
  selectedPhrases: Phrase[];
}
