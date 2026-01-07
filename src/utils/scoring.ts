import { Phrase, GameResult } from '@/types/game';

const ESSENTIAL_CATEGORIES = ['incident', 'symptoms', 'environment', 'evidence', 'constraints', 'plan'];

export function computeScore(selectedPhrases: Phrase[], timerSeconds: number): GameResult {
  let relevantScore = 0;
  let helpfulScore = 0;
  let distractorScore = 0;
  let relevantCount = 0;
  let helpfulCount = 0;
  let distractorCount = 0;

  const categoriesPresent = new Set<string>();

  selectedPhrases.forEach((phrase) => {
    categoriesPresent.add(phrase.category);
    if (phrase.type === 'relevant') {
      relevantScore += phrase.weight;
      relevantCount += 1;
    } else if (phrase.type === 'helpful' || phrase.type === 'clarifying') {
      helpfulScore += phrase.weight;
      helpfulCount += 1;
    } else if (phrase.type === 'distractor') {
      distractorScore += phrase.weight;
      distractorCount += 1;
    }
  });

  let essentialsBonus = 0;
  ESSENTIAL_CATEGORIES.forEach((cat) => {
    if (selectedPhrases.some((p) => p.category === cat)) {
      essentialsBonus += 3;
    }
  });

  const diversityBonus = categoriesPresent.size >= 3 ? 2 : 0;

  let timeBonus = 0;
  if (relevantCount >= 3) {
    const t = Math.min(timerSeconds, 240);
    if (t <= 120) {
      timeBonus = Math.round(10 * (1 - t / 120));
    } else {
      timeBonus = Math.round(-10 * ((t - 120) / 120));
    }
  }

  const rawScore = relevantScore + helpfulScore + distractorScore + essentialsBonus + diversityBonus + timeBonus;
  const finalXP = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    relevantScore,
    helpfulScore,
    distractorScore,
    essentialsBonus,
    diversityBonus,
    timeBonus,
    finalXP,
    elapsedSeconds: timerSeconds,
    relevantCount,
    helpfulCount,
    distractorCount,
  };
}

export function getCoachMessage(finalXP: number): string {
  if (finalXP >= 90) {
    return "Excellent—clear framing, evidence, constraints, and safe plan.";
  } else if (finalXP >= 75) {
    return "Strong craft; small refinements could boost clarity.";
  } else if (finalXP >= 50) {
    return "Decent—cover essentials and remove risky language.";
  } else {
    return "Needs work—replace distractors and include core elements.";
  }
}
