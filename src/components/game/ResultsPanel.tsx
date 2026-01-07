import { GameResult } from '@/types/game';
import { getCoachMessage } from '@/utils/scoring';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  result: GameResult;
  formatTime: (seconds: number) => string;
}

export function ResultsPanel({ result, formatTime }: ResultsPanelProps) {
  const coachMessage = getCoachMessage(result.finalXP);

  return (
    <section className="rounded-xl border border-border bg-secondary/50 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <h3 className="font-semibold text-foreground">Results</h3>
        <span className="rounded-full bg-[hsl(var(--success-bg))] border border-[hsl(var(--success-border))] px-3 py-0.5 text-sm font-semibold text-[hsl(var(--success-foreground))] tabular-nums">
          Final XP: {result.finalXP}
        </span>
      </div>

      <div className="flex justify-between flex-wrap gap-1 text-xs text-muted-foreground mb-3">
        <span>Elapsed: {formatTime(result.elapsedSeconds)}</span>
        <span>
          Selection: {result.relevantCount} relevant / {result.helpfulCount} helpful / {result.distractorCount} distractors
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm mb-3">
        <span className="text-muted-foreground">Relevant</span>
        <span className="text-right font-medium tabular-nums">{result.relevantScore}</span>

        <span className="text-muted-foreground">Helpful/Clarifying</span>
        <span className="text-right font-medium tabular-nums">{result.helpfulScore}</span>

        <span className="text-muted-foreground">Distractors</span>
        <span className={cn("text-right font-medium tabular-nums", result.distractorScore < 0 && "text-destructive")}>
          {result.distractorScore}
        </span>

        <span className="text-muted-foreground">Essentials</span>
        <span className="text-right font-medium tabular-nums">{result.essentialsBonus}</span>

        <span className="text-muted-foreground">Diversity</span>
        <span className="text-right font-medium tabular-nums">{result.diversityBonus}</span>

        <span className="text-muted-foreground">Time</span>
        <span className={cn("text-right font-medium tabular-nums", result.timeBonus < 0 && "text-destructive")}>
          {result.timeBonus}
        </span>

        <span className="font-semibold text-foreground">Final XP</span>
        <span className="text-right font-semibold tabular-nums">{result.finalXP}</span>
      </div>

      <p className="text-sm text-foreground">{coachMessage}</p>
    </section>
  );
}
