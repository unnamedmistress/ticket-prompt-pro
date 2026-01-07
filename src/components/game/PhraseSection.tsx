import { Phrase } from '@/types/game';
import { PhraseChip } from './PhraseChip';

interface PhraseSectionProps {
  title: string;
  description: string;
  phrases: Phrase[];
  selectedIds: Set<string>;
  disabledIds: Set<string>;
  onToggle: (phrase: Phrase) => void;
}

export function PhraseSection({ 
  title, 
  description, 
  phrases, 
  selectedIds, 
  disabledIds,
  onToggle 
}: PhraseSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {phrases.map((phrase) => {
          const id = phrase.label;
          return (
            <PhraseChip
              key={id}
              phrase={phrase}
              isSelected={selectedIds.has(id)}
              isDisabled={disabledIds.has(id)}
              onClick={() => onToggle(phrase)}
            />
          );
        })}
      </div>
    </div>
  );
}
