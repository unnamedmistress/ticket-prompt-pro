export interface Phrase {
  label: string;
  weight: number;
  category: string;
  type: 'relevant' | 'helpful' | 'clarifying' | 'distractor';
}

export interface GameResult {
  relevantScore: number;
  helpfulScore: number;
  distractorScore: number;
  essentialsBonus: number;
  diversityBonus: number;
  timeBonus: number;
  finalXP: number;
  elapsedSeconds: number;
  relevantCount: number;
  helpfulCount: number;
  distractorCount: number;
}
