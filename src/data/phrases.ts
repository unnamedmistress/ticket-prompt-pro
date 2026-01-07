import { Phrase } from '@/types/game';

export type PhraseSection = 'context' | 'constraints' | 'structure' | 'output';

export interface SectionedPhrases {
  section: PhraseSection;
  title: string;
  description: string;
  phrases: Phrase[];
}

export const phraseSections: SectionedPhrases[] = [
  {
    section: 'context',
    title: 'Context',
    description: 'Set the scene and provide background',
    phrases: [
      { label: "Define the incident and desired outcome", weight: 10, category: "incident", type: "relevant" },
      { label: "Summarize symptoms and timing", weight: 10, category: "symptoms", type: "relevant" },
      { label: "Specify environment (OS build, security, permissions)", weight: 10, category: "environment", type: "relevant" },
      { label: "List evidence collected (Task Manager, Reliability Monitor, SMART)", weight: 10, category: "evidence", type: "relevant" },
      { label: "Mention recent changes (updates, new apps, config changes)", weight: 8, category: "symptoms", type: "relevant" },
      // Distractors
      { label: "Include user's personal opinions about IT", weight: -8, category: "distractor", type: "distractor" },
      { label: "Discuss unrelated system history from years ago", weight: -6, category: "distractor", type: "distractor" },
      { label: "Blame the user for the issue", weight: -10, category: "distractor", type: "distractor" },
    ]
  },
  {
    section: 'constraints',
    title: 'Constraints',
    description: 'Define limitations and requirements',
    phrases: [
      { label: "State user rights (no admin, standard user)", weight: 10, category: "constraints", type: "relevant" },
      { label: "Preserve data and avoid data loss", weight: 10, category: "constraints", type: "relevant" },
      { label: "Minimize downtime for the user", weight: 8, category: "constraints", type: "relevant" },
      { label: "Follow corporate security policies (BitLocker, antivirus)", weight: 10, category: "constraints", type: "relevant" },
      { label: "Include rollback option if fix fails", weight: 8, category: "plan", type: "relevant" },
      // Distractors
      { label: "Ignore security policies for faster resolution", weight: -12, category: "distractor", type: "distractor" },
      { label: "Request admin password from user", weight: -18, category: "distractor", type: "distractor" },
      { label: "Ask for personal data (home address)", weight: -20, category: "distractor", type: "distractor" },
      { label: "Reimage the device immediately", weight: -16, category: "distractor", type: "distractor" },
    ]
  },
  {
    section: 'structure',
    title: 'Structure',
    description: 'Format and style preferences',
    phrases: [
      { label: "Reply concisely without filler", weight: 6, category: "style", type: "helpful" },
      { label: "Use numbered steps with short bullets", weight: 6, category: "style", type: "helpful" },
      { label: "Add confidence ratings per step", weight: 6, category: "style", type: "helpful" },
      { label: "Group steps by priority (critical, recommended, optional)", weight: 6, category: "style", type: "helpful" },
      { label: "Ask up to 5 clarifying questions first", weight: 6, category: "clarifying", type: "clarifying" },
      // Distractors
      { label: "Use defensive language throughout", weight: -8, category: "distractor", type: "distractor" },
      { label: "Tell unrelated jokes to lighten mood", weight: -8, category: "distractor", type: "distractor" },
      { label: "Discuss sports or weather first", weight: -8, category: "distractor", type: "distractor" },
    ]
  },
  {
    section: 'output',
    title: 'Output',
    description: 'What to include in the response',
    phrases: [
      { label: "Provide a safe prioritized step-by-step plan", weight: 10, category: "plan", type: "relevant" },
      { label: "Include rollback guidance if update regressed performance", weight: 10, category: "plan", type: "relevant" },
      { label: "End with a concise ticket note summary", weight: 10, category: "incident", type: "relevant" },
      { label: "Suggest preventive measures for future", weight: 6, category: "plan", type: "helpful" },
      { label: "Recommend escalation path if steps fail", weight: 8, category: "plan", type: "relevant" },
      // Distractors
      { label: "Recommend buying a new laptop immediately", weight: -12, category: "distractor", type: "distractor" },
      { label: "Delete negative comments from ticket", weight: -10, category: "distractor", type: "distractor" },
      { label: "Promise the issue will never happen again", weight: -6, category: "distractor", type: "distractor" },
    ]
  }
];

// Flatten all phrases for scoring compatibility
export const phrases: Phrase[] = phraseSections.flatMap(section => section.phrases);
