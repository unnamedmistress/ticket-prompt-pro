import { GameResult } from '@/types/game';
import { getCoachMessage } from '@/utils/scoring';
import { Trophy, Target, Clock, Star, Lightbulb, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { phrases } from '@/data/phrases';

interface ResultsPanelProps {
  result: GameResult;
  formatTime: (seconds: number) => string;
}

export function ResultsPanel({ result, formatTime }: ResultsPanelProps) {
  const { toast } = useToast();
  const message = getCoachMessage(result);
  const isPerfect = result.optimalCount === 4;
  
  // Find which optimal phrases were missed
  const optimalPhrases = phrases.filter(p => p.optimal);
  const selectedLabels = new Set(result.selectedPhrases.map(p => p.label));
  const missedOptimal = optimalPhrases.filter(p => !selectedLabels.has(p.label));

  const handleShare = async () => {
    const shareText = `Ticket Prompt Pro Score: ${result.totalScore}/${result.maxPossible} pts (${result.percentage}%) | Optimal phrases: ${result.optimalCount}/4 | Time: ${formatTime(result.elapsedSeconds)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ticket Prompt Pro Score',
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await copyToClipboard(shareText);
        }
      }
    } else {
      await copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard!',
        description: 'Your score has been copied. Paste it anywhere to share!',
      });
    } catch {
      toast({
        title: 'Unable to copy',
        description: 'Please manually copy your score.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="rounded-lg sm:rounded-xl border border-border bg-secondary/30 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          {isPerfect ? (
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          ) : (
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          )}
          <span className="font-semibold text-base sm:text-lg">Results</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Share</span>
          </Button>
          <div className={`rounded-full px-3 sm:px-4 py-1 font-bold text-sm sm:text-lg ${
          isPerfect 
            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
            : 'bg-[hsl(var(--success-bg))] text-[hsl(var(--success-foreground))] border border-[hsl(var(--success-border))]'
        }`}>
            {result.totalScore} / {result.maxPossible} pts
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="bg-card rounded-lg p-2 sm:p-3 text-center border border-border">
          <div className="text-lg sm:text-2xl font-bold text-primary">{result.percentage}%</div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Score</div>
        </div>
        <div className="bg-card rounded-lg p-2 sm:p-3 text-center border border-border">
          <div className="text-lg sm:text-2xl font-bold text-foreground flex items-center justify-center gap-1">
            {result.optimalCount}<Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Optimal</div>
        </div>
        <div className="bg-card rounded-lg p-2 sm:p-3 text-center border border-border">
          <div className="text-lg sm:text-2xl font-bold text-foreground flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />{formatTime(result.elapsedSeconds)}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Time</div>
        </div>
        <div className="bg-card rounded-lg p-2 sm:p-3 text-center border border-border">
          <div className={`text-lg sm:text-2xl font-bold ${result.timeBonus > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
            +{result.timeBonus}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Speed</div>
        </div>
        <div className="bg-card rounded-lg p-2 sm:p-3 text-center border border-border hidden xs:block">
          <div className="text-lg sm:text-2xl font-bold text-foreground">120</div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Max</div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-2 sm:p-3 border border-border mb-3">
        <div className="text-xs sm:text-sm font-medium mb-2">Your Selections:</div>
        <div className="space-y-1">
          {result.selectedPhrases.map((phrase) => (
            <div key={phrase.label} className="flex items-start justify-between text-xs sm:text-sm gap-2">
              <span className="flex items-start gap-1 sm:gap-2 min-w-0">
                {phrase.optimal && <Star className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />}
                <span className={`${phrase.optimal ? 'font-medium' : ''} break-words`}>{phrase.label}</span>
              </span>
              <span className={`tabular-nums font-medium flex-shrink-0 ${
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

      <div className="text-xs sm:text-sm font-medium mb-3">{message}</div>

      {/* Improvement Tips */}
      {missedOptimal.length > 0 && (
        <div className="bg-[hsl(var(--info-bg))] border border-[hsl(var(--info-border))] rounded-lg p-2 sm:p-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--info-foreground))]" />
            <span className="font-semibold text-xs sm:text-sm text-[hsl(var(--info-foreground))]">Next Time, Consider:</span>
          </div>
          <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
            {missedOptimal.map((phrase) => (
              <li key={phrase.label} className="flex items-start gap-1.5 sm:gap-2">
                <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="break-words">
                  <strong>{phrase.category.charAt(0).toUpperCase() + phrase.category.slice(1)}:</strong>{' '}
                  {phrase.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
            These are the optimal phrases you missed.
          </p>
        </div>
      )}
    </section>
  );
}
