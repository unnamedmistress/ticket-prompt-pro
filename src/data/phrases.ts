import { Phrase } from '@/types/game';

export const phrases: Phrase[] = [
  // Relevant (+10)
  {
    label: "Define the incident and desired outcome",
    weight: 10,
    category: "incident",
    type: "relevant",
  },
  {
    label: "Summarize symptoms and timing",
    weight: 10,
    category: "symptoms",
    type: "relevant",
  },
  {
    label: "Specify environment (OS build, security, permissions)",
    weight: 10,
    category: "environment",
    type: "relevant",
  },
  {
    label: "List evidence to collect (Task Manager, Reliability Monitor, Update history, SMART, free space, thermals)",
    weight: 10,
    category: "evidence",
    type: "relevant",
  },
  {
    label: "State constraints (no admin rights, preserve data, minimal downtime)",
    weight: 10,
    category: "constraints",
    type: "relevant",
  },
  {
    label: "Request a safe prioritized step-by-step plan",
    weight: 10,
    category: "plan",
    type: "relevant",
  },
  {
    label: "Include rollback guidance if update regressed performance",
    weight: 10,
    category: "plan",
    type: "relevant",
  },
  {
    label: "End with a concise ticket note summary",
    weight: 10,
    category: "incident",
    type: "relevant",
  },

  // Helpful style/structure (+6)
  {
    label: "Reply concisely without filler",
    weight: 6,
    category: "style",
    type: "helpful",
  },
  {
    label: "Create numbered steps with short bullets",
    weight: 6,
    category: "style",
    type: "helpful",
  },
  {
    label: "Add confidence ratings per step",
    weight: 6,
    category: "style",
    type: "helpful",
  },

  // Clarifying (+6)
  {
    label: "Ask up to 5 clarifying questions (crash frequency, BSOD codes, disk %, temps, AV status)",
    weight: 6,
    category: "clarifying",
    type: "clarifying",
  },

  // Distractors (negative)
  {
    label: "Blame the user (−10)",
    weight: -10,
    category: "distractor",
    type: "distractor",
  },
  {
    label: "Ask for personal data (home address) (−20)",
    weight: -20,
    category: "distractor",
    type: "distractor",
  },
  {
    label: "Request admin password (−18)",
    weight: -18,
    category: "distractor",
    type: "distractor",
  },
  {
    label: "Recommend buying a new laptop immediately (−12)",
    weight: -12,
    category: "distractor",
    type: "distractor",
  },
  {
    label: "Ignore security policies (−12)",
    weight: -12,
    category: "distractor",
    type: "distractor",
  },
  {
    label: "Delete negative comments (−10)",
    weight: -10,
    category: "distractor",
    type: "distractor",
  },
  {
    label: "Use defensive language (−8)",
    weight: -8,
    category: "distractor",
    type: "distractor",
  },
  {
    label: "Tell unrelated jokes (−8)",
    weight: -8,
    category: "distractor",
    type: "distractor",
  },
  {
    label: "Discuss sports or weather (−8)",
    weight: -8,
    category: "distractor",
    type: "distractor",
  },
  {
    label: "Reimage the device immediately (−16)",
    weight: -16,
    category: "distractor",
    type: "distractor",
  },
];
