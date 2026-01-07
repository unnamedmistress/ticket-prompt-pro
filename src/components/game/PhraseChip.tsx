import { cn } from '@/lib/utils';
import { Phrase } from '@/types/game';

interface PhraseChipProps {
  phrase: Phrase;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export function PhraseChip({ phrase, isSelected, isDisabled, onClick }: PhraseChipProps) {
  const isDistractor = phrase.type === 'distractor';

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-all duration-150",
        "hover:shadow-chip hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0",
        // Default state
        !isDistractor && !isSelected && "bg-[hsl(var(--chip-bg))] border-[hsl(var(--chip-border))] text-foreground",
        // Distractor default
        isDistractor && !isSelected && "bg-[hsl(var(--chip-distractor-bg))] border-[hsl(var(--chip-distractor-border))] text-foreground",
        // Selected state
        !isDistractor && isSelected && "bg-[hsl(var(--chip-selected-bg))] border-[hsl(var(--chip-selected-border))] text-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.18)]",
        // Distractor selected
        isDistractor && isSelected && "bg-[hsl(var(--chip-distractor-selected-bg))] border-[hsl(var(--chip-distractor-selected-border))] text-destructive"
      )}
    >
      {phrase.label}
    </button>
  );
}
