import { GameResult } from '@/types/game';
import { getCoachMessage } from '@/utils/scoring';
import { Trophy, Target, Clock, Star, Lightbulb } from 'lucide-react';
import { phrases } from '@/data/phrases';

interface ResultsPanelProps {
  result: GameResult;
  formatTime: (seconds: number) => string;
}

export function ResultsPanel({ result, formatTime }: ResultsPanelProps) {
  const message = getCoachMessage(result);
  const isPerfect = result.optimalCount === 4;
  
  // Find which optimal phrases were missed
  const optimalPhrases = phrases.filter(p => p.optimal);
  const selectedLabels = new Set(result.selectedPhrases.map(p => p.label));
  const missedOptimal = optimalPhrases.filter(p => !selectedLabels.has(p.label));

  return (
    <section className="rounded-xl border border-border bg-secondary/30 p-4">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          {isPerfect ? (
            <Trophy className="w-5 h-5 text-yellow-500" />
          ) : (
            <Target className="w-5 h-5 text-primary" />
          )}
          <span className="font-semibold text-lg">Results</span>
        </div>
        <div className={`rounded-full px-4 py-1 font-bold text-lg ${
          isPerfect 
            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
            : 'bg-[hsl(var(--success-bg))] text-[hsl(var(--success-foreground))] border border-[hsl(var(--success-border))]'
        }`}>
          {result.totalScore} / {result.maxPossible} pts
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
        <div className="bg-card rounded-lg p-3 text-center border border-border">
          <div className="text-2xl font-bold text-primary">{result.percentage}%</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="bg-card rounded-lg p-3 text-center border border-border">
          <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
            {result.optimalCount}<Star className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-xs text-muted-foreground">Optimal Picks</div>
        </div>
        <div className="bg-card rounded-lg p-3 text-center border border-border">
          <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />{formatTime(result.elapsedSeconds)}
          </div>
          <div className="text-xs text-muted-foreground">Time</div>
        </div>
        <div className="bg-card rounded-lg p-3 text-center border border-border">
          <div className={`text-2xl font-bold ${result.timeBonus > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
            +{result.timeBonus}
          </div>
          <div className="text-xs text-muted-foreground">Speed Bonus</div>
        </div>
        <div className="bg-card rounded-lg p-3 text-center border border-border">
          <div className="text-2xl font-bold text-foreground">120</div>
          <div className="text-xs text-muted-foreground">Max Score</div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-3 border border-border mb-3">
        <div className="text-sm font-medium mb-2">Your Selections:</div>
        <div className="space-y-1">
          {result.selectedPhrases.map((phrase) => (
            <div key={phrase.label} className="flex items-center justify-between text-sm gap-2">
              <span className="flex items-center gap-2">
                {phrase.optimal && <Star className="w-3 h-3 text-yellow-500" />}
                <span className={phrase.optimal ? 'font-medium' : ''}>{phrase.label}</span>
              </span>
              <span className={`tabular-nums font-medium ${
                phrase.weight >= 20 ? 'text-green-600' : 
                phrase.weight >= 10 ? 'text-primary' : 
                'text-muted-foreground'
              }`}>
                +{phrase.weight}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm font-medium mb-3">{message}</div>

      {/* Improvement Tips */}
      {missedOptimal.length > 0 && (
        <div className="bg-[hsl(var(--info-bg))] border border-[hsl(var(--info-border))] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-[hsl(var(--info-foreground))]" />
            <span className="font-semibold text-sm text-[hsl(var(--info-foreground))]">Next Time, Consider:</span>
          </div>
          <ul className="space-y-1.5 text-sm">
            {missedOptimal.map((phrase) => (
              <li key={phrase.label} className="flex items-start gap-2">
                <Star className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                <span>
                  <strong>{phrase.category.charAt(0).toUpperCase() + phrase.category.slice(1)}:</strong>{' '}
                  {phrase.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-2">
            These are the optimal phrases you missed. A strong prompt covers: incident, environment, constraints, and plan.
          </p>
        </div>
      )}
    </section>
  );
}
