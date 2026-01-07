import { cn } from '@/lib/utils';
import { Phrase } from '@/types/game';

interface PhraseChipProps {
  phrase: Phrase;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export function PhraseChip({ phrase, isSelected, isDisabled, onClick }: PhraseChipProps) {
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
        // Default state - same for all phrases (no distractor hint)
        !isSelected && "bg-[hsl(var(--chip-bg))] border-[hsl(var(--chip-border))] text-foreground",
        // Selected state - same for all phrases
        isSelected && "bg-[hsl(var(--chip-selected-bg))] border-[hsl(var(--chip-selected-border))] text-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.18)]"
      )}
    >
      {phrase.label}
    </button>
  );
}
