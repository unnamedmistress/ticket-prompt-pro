import { Phrase, GameResult } from '@/types/game';

const MAX_BASE_SCORE = 100; // 4 optimal phrases × 25 points
const TIME_BONUS_MAX = 20; // Up to 20 bonus points for speed
const FAST_TIME_THRESHOLD = 15; // Under 15 seconds = max bonus
const SLOW_TIME_THRESHOLD = 60; // Over 60 seconds = no bonus

export function computeScore(selectedPhrases: Phrase[], timerSeconds: number): GameResult {
  const baseScore = selectedPhrases.reduce((sum, p) => sum + p.weight, 0);
  const optimalCount = selectedPhrases.filter(p => p.optimal).length;
  
  // Time bonus: faster = more points (linear scale from 0-20)
  let timeBonus = 0;
  if (timerSeconds <= FAST_TIME_THRESHOLD) {
    timeBonus = TIME_BONUS_MAX;
  } else if (timerSeconds < SLOW_TIME_THRESHOLD) {
    const timeRange = SLOW_TIME_THRESHOLD - FAST_TIME_THRESHOLD;
    const timeOver = timerSeconds - FAST_TIME_THRESHOLD;
    timeBonus = Math.round(TIME_BONUS_MAX * (1 - timeOver / timeRange));
  }
  
  const totalScore = baseScore + timeBonus;
  const maxPossible = MAX_BASE_SCORE + TIME_BONUS_MAX;
  const percentage = Math.round((totalScore / maxPossible) * 100);

  return {
    totalScore,
    maxPossible,
    percentage,
    optimalCount,
    elapsedSeconds: timerSeconds,
    selectedPhrases,
    timeBonus,
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
