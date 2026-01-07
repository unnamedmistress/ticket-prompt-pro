import { Phrase, GameResult } from '@/types/game';

const MAX_SCORE = 100; // 4 optimal phrases × 25 points

export function computeScore(selectedPhrases: Phrase[], timerSeconds: number): GameResult {
  const totalScore = selectedPhrases.reduce((sum, p) => sum + p.weight, 0);
  const optimalCount = selectedPhrases.filter(p => p.optimal).length;
  const percentage = Math.round((totalScore / MAX_SCORE) * 100);

  return {
    totalScore,
    maxPossible: MAX_SCORE,
    percentage,
    optimalCount,
    elapsedSeconds: timerSeconds,
    selectedPhrases,
  };
}

export function getCoachMessage(result: GameResult): string {
  if (result.optimalCount === 4) {
    return "🏆 Perfect! You found the optimal prompt combination!";
  } else if (result.percentage >= 90) {
    return "Excellent! You're very close to the perfect prompt.";
  } else if (result.percentage >= 75) {
    return "Great job! Strong prompt with room for refinement.";
  } else if (result.percentage >= 50) {
    return "Good start. Try to identify the highest-impact phrases.";
  } else {
    return "Keep practicing! Focus on incident, environment, constraints, and plan.";
  }
}
