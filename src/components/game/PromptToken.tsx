import { X } from 'lucide-react';
import { Phrase } from '@/types/game';

interface PromptTokenProps {
  phrase: Phrase;
  onRemove: () => void;
}

export function PromptToken({ phrase, onRemove }: PromptTokenProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--token-bg))] border border-[hsl(var(--token-border))] px-2.5 py-1 text-sm">
      <span className="max-w-[45vw] truncate sm:max-w-[260px]">
        {phrase.label}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove phrase: ${phrase.label}`}
        className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}
