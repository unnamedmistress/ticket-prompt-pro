import { Phrase } from '@/types/game';

// All phrases have positive scores - no wrong answers, just better/worse choices
// The 4 "optimal" phrases are marked and together score 100 points
export const phrases: Phrase[] = [
  // === OPTIMAL ANSWERS (25 points each = 100 total) ===
  { label: "Define the incident and desired outcome", weight: 25, category: "incident", type: "relevant", optimal: true },
  { label: "Specify environment (OS build, security, permissions)", weight: 25, category: "environment", type: "relevant", optimal: true },
  { label: "State constraints (no admin rights, preserve data, minimal downtime)", weight: 25, category: "constraints", type: "relevant", optimal: true },
  { label: "Provide a safe prioritized step-by-step plan", weight: 25, category: "plan", type: "relevant", optimal: true },

  // === GOOD ANSWERS (15-20 points) ===
  { label: "Summarize symptoms and timing", weight: 20, category: "symptoms", type: "relevant" },
  { label: "List evidence collected (Task Manager, Reliability Monitor, SMART)", weight: 18, category: "evidence", type: "relevant" },
  { label: "Include rollback guidance if update regressed performance", weight: 18, category: "plan", type: "relevant" },
  { label: "End with a concise ticket note summary", weight: 15, category: "incident", type: "relevant" },
  { label: "Follow corporate security policies (BitLocker, antivirus)", weight: 17, category: "constraints", type: "relevant" },
  { label: "Recommend escalation path if steps fail", weight: 15, category: "plan", type: "relevant" },

  // === DECENT ANSWERS (8-12 points) ===
  { label: "Mention recent changes (updates, new apps, config changes)", weight: 12, category: "symptoms", type: "helpful" },
  { label: "Preserve data and avoid data loss", weight: 12, category: "constraints", type: "helpful" },
  { label: "Minimize downtime for the user", weight: 10, category: "constraints", type: "helpful" },
  { label: "Reply concisely without filler", weight: 10, category: "style", type: "helpful" },
  { label: "Use numbered steps with short bullets", weight: 10, category: "style", type: "helpful" },
  { label: "Ask up to 5 clarifying questions first", weight: 10, category: "clarifying", type: "clarifying" },
  { label: "Suggest preventive measures for future", weight: 8, category: "plan", type: "helpful" },
  { label: "Group steps by priority (critical, recommended, optional)", weight: 8, category: "style", type: "helpful" },
  { label: "Add confidence ratings per step", weight: 8, category: "style", type: "helpful" },

  // === WEAK ANSWERS (2-5 points) - not wrong, just less effective ===
  { label: "Include user's personal opinions about IT", weight: 3, category: "style", type: "weak" },
  { label: "Discuss system history from previous years", weight: 3, category: "context", type: "weak" },
  { label: "Use empathetic language throughout", weight: 5, category: "style", type: "weak" },
  { label: "Apologize for the inconvenience first", weight: 4, category: "style", type: "weak" },
  { label: "Request screenshots of all error messages", weight: 5, category: "evidence", type: "weak" },
  { label: "Ask about recent software installations", weight: 5, category: "context", type: "weak" },
  { label: "Mention the ticket will be escalated if needed", weight: 4, category: "plan", type: "weak" },
  { label: "Promise to follow up within 24 hours", weight: 3, category: "style", type: "weak" },
  { label: "Suggest restarting the computer first", weight: 2, category: "plan", type: "weak" },
  { label: "Recommend checking for Windows updates", weight: 2, category: "plan", type: "weak" },
  { label: "Ask if the issue happens in Safe Mode", weight: 4, category: "clarifying", type: "weak" },
];

// Shuffle function for mixing phrases
export function shufflePhrases(): Phrase[] {
  return [...phrases].sort(() => Math.random() - 0.5);
}
