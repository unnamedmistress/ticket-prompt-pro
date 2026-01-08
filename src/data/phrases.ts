import { Phrase } from '@/types/game';

// All phrases have positive scores - no wrong answers, just better/worse choices
// The 4 "optimal" phrases are marked and together score 100 points
export const phrases: Phrase[] = [
  // === OPTIMAL ANSWERS (25 points each = 100 total) ===
  { label: "Define what you're looking for and your goal", weight: 25, category: "goal", type: "relevant", optimal: true },
  { label: "Specify your Outlook version and platform (desktop, web, mobile)", weight: 25, category: "environment", type: "relevant", optimal: true },
  { label: "Mention your account type (Microsoft 365, Exchange, personal)", weight: 25, category: "context", type: "relevant", optimal: true },
  { label: "Ask for step-by-step instructions to locate or enable the feature", weight: 25, category: "plan", type: "relevant", optimal: true },

  // === GOOD ANSWERS (15-20 points) ===
  { label: "Ask if the feature requires admin or license activation", weight: 20, category: "permissions", type: "relevant" },
  { label: "Request the official feature name and where to find it", weight: 18, category: "goal", type: "relevant" },
  { label: "Ask about regional or rollout availability", weight: 18, category: "context", type: "relevant" },
  { label: "Include what you've already tried", weight: 15, category: "troubleshooting", type: "relevant" },
  { label: "Ask if it's a browser extension vs built-in feature", weight: 17, category: "context", type: "relevant" },
  { label: "Request links to official documentation", weight: 15, category: "plan", type: "relevant" },

  // === DECENT ANSWERS (8-12 points) ===
  { label: "Mention you checked the ribbon and settings", weight: 12, category: "troubleshooting", type: "helpful" },
  { label: "Ask if your organization has it enabled", weight: 12, category: "permissions", type: "helpful" },
  { label: "Keep the response concise and focused", weight: 10, category: "style", type: "helpful" },
  { label: "Use bullet points for clarity", weight: 10, category: "style", type: "helpful" },
  { label: "Ask up to 3 clarifying questions first", weight: 10, category: "clarifying", type: "clarifying" },
  { label: "Ask about alternative ways to access it", weight: 8, category: "plan", type: "helpful" },
  { label: "Check if feature has different names in different versions", weight: 8, category: "context", type: "helpful" },
  { label: "Request keyboard shortcuts if available", weight: 8, category: "style", type: "helpful" },

  // === WEAK ANSWERS (2-5 points) - not wrong, just less effective ===
  { label: "Describe your colleague's exact words", weight: 3, category: "context", type: "weak" },
  { label: "Ask about your colleague's Outlook setup", weight: 3, category: "context", type: "weak" },
  { label: "Use friendly conversational tone", weight: 5, category: "style", type: "weak" },
  { label: "Express frustration about not finding it", weight: 4, category: "style", type: "weak" },
  { label: "Ask for screenshots of where to click", weight: 5, category: "plan", type: "weak" },
  { label: "Mention you've been searching for a while", weight: 5, category: "context", type: "weak" },
  { label: "Ask if it's a new or old feature", weight: 4, category: "context", type: "weak" },
  { label: "Thank the AI in advance", weight: 3, category: "style", type: "weak" },
  { label: "Suggest restarting Outlook first", weight: 2, category: "troubleshooting", type: "weak" },
  { label: "Ask if you need to update Outlook", weight: 2, category: "troubleshooting", type: "weak" },
  { label: "Ask if the feature works offline", weight: 4, category: "clarifying", type: "weak" },
];

// Shuffle function for mixing phrases
export function shufflePhrases(): Phrase[] {
  return [...phrases].sort(() => Math.random() - 0.5);
}
