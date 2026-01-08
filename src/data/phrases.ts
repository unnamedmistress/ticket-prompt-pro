import { Phrase } from '@/types/game';

// All phrases have positive scores - no wrong answers, just better/worse choices
// The 4 "optimal" phrases are marked and together score 100 points
export const phrases: Phrase[] = [
// === OPTIMAL ANSWERS (25 points each = 100 total) ===
  { label: "Describe what you want to do: schedule meetings with availability polling", weight: 25, category: "goal", type: "relevant", optimal: true },
  { label: "State your Outlook version and platform (desktop, web, mobile)", weight: 25, category: "environment", type: "relevant", optimal: true },
  { label: "Mention your account type (Microsoft 365, Exchange, personal)", weight: 25, category: "context", type: "relevant", optimal: true },
  { label: "Ask how to find or enable this scheduling feature", weight: 25, category: "plan", type: "relevant", optimal: true },

  // === GOOD ANSWERS (15-20 points) ===
  { label: "Ask if the feature requires admin permissions or a specific license", weight: 20, category: "permissions", type: "relevant" },
  { label: "Ask what the feature is officially called in Outlook", weight: 18, category: "goal", type: "relevant" },
  { label: "Ask if it's available in your region or being rolled out", weight: 18, category: "context", type: "relevant" },
  { label: "Mention where you've already looked (ribbon, settings, add-ins)", weight: 15, category: "troubleshooting", type: "relevant" },
  { label: "Ask if it's a built-in feature or an add-in to install", weight: 17, category: "context", type: "relevant" },
  { label: "Ask for a link to Microsoft's official instructions", weight: 15, category: "plan", type: "relevant" },

  // === DECENT ANSWERS (8-12 points) ===
  { label: "Mention you've searched the ribbon and calendar settings", weight: 12, category: "troubleshooting", type: "helpful" },
  { label: "Ask if your IT department needs to enable it", weight: 12, category: "permissions", type: "helpful" },
  { label: "Ask for a brief, focused answer", weight: 10, category: "style", type: "helpful" },
  { label: "Request step-by-step bullet points", weight: 10, category: "style", type: "helpful" },
  { label: "Ask the AI to clarify anything it needs first", weight: 10, category: "clarifying", type: "clarifying" },
  { label: "Ask about alternative ways to poll for meeting times", weight: 8, category: "plan", type: "helpful" },
  { label: "Ask if the feature has a different name in older versions", weight: 8, category: "context", type: "helpful" },
  { label: "Ask for keyboard shortcuts to access it faster", weight: 8, category: "style", type: "helpful" },

  // === WEAK ANSWERS (2-5 points) - not wrong, just less effective ===
  { label: "Explain exactly what your colleague said about it", weight: 3, category: "context", type: "weak" },
  { label: "Ask what version your colleague is using", weight: 3, category: "context", type: "weak" },
  { label: "Keep the tone casual and friendly", weight: 5, category: "style", type: "weak" },
  { label: "Mention you're frustrated you can't find it", weight: 4, category: "style", type: "weak" },
  { label: "Ask for screenshots showing where to click", weight: 5, category: "plan", type: "weak" },
  { label: "Say you've been searching for a long time", weight: 5, category: "context", type: "weak" },
  { label: "Ask whether Scheduler is new or old", weight: 4, category: "context", type: "weak" },
  { label: "Thank the AI before it responds", weight: 3, category: "style", type: "weak" },
  { label: "Try restarting Outlook before asking", weight: 2, category: "troubleshooting", type: "weak" },
  { label: "Ask if updating Outlook might help", weight: 2, category: "troubleshooting", type: "weak" },
  { label: "Ask if the feature works without internet", weight: 4, category: "clarifying", type: "weak" },
];

// Shuffle function for mixing phrases
export function shufflePhrases(): Phrase[] {
  return [...phrases].sort(() => Math.random() - 0.5);
}
