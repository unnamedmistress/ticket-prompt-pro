import { useState, useCallback, useMemo } from 'react';
import { Timer, RotateCcw, Rocket, Lightbulb, HelpCircle } from 'lucide-react';
import { shufflePhrases } from '@/data/phrases';
import { useGameTimer } from '@/hooks/useGameTimer';
import { computeScore } from '@/utils/scoring';
import { PhraseChip } from './PhraseChip';
import { PromptToken } from './PromptToken';
import { ResultsPanel } from './ResultsPanel';
import { Button } from '@/components/ui/button';
import { GameResult, Phrase } from '@/types/game';

const MAX_SELECTIONS = 4;

const HINT_CATEGORIES = [
  { name: 'Incident', description: 'Define what happened and what outcome you want' },
  { name: 'Environment', description: 'Specify the system details (OS, permissions, security)' },
  { name: 'Constraints', description: 'State limitations (no admin, preserve data, minimal downtime)' },
  { name: 'Plan', description: 'Request a structured, safe action plan' },
];

export function PromptGame() {
  const [shuffledPhrases, setShuffledPhrases] = useState<Phrase[]>(() => shufflePhrases());
  const [selectedPhrases, setSelectedPhrases] = useState<Phrase[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { seconds, isRunning, start, stop, reset: resetTimer, formatTime } = useGameTimer();

  const togglePhrase = useCallback((phrase: Phrase) => {
    setSelectedPhrases((prev) => {
      const exists = prev.some(p => p.label === phrase.label);
      if (exists) {
        return prev.filter(p => p.label !== phrase.label);
      } else {
        if (prev.length >= MAX_SELECTIONS) return prev;
        if (!isRunning) start();
        return [...prev, phrase];
      }
    });
  }, [isRunning, start]);

  const handleTest = useCallback(() => {
    if (selectedPhrases.length !== MAX_SELECTIONS) return;
    stop();
    const gameResult = computeScore(selectedPhrases, seconds);
    setResult(gameResult);
  }, [selectedPhrases, seconds, stop]);

  const handleReset = useCallback(() => {
    setSelectedPhrases([]);
    setResult(null);
    setShuffledPhrases(shufflePhrases());
    setShowHint(false);
    resetTimer();
  }, [resetTimer]);

  const selectedIds = useMemo(() => new Set(selectedPhrases.map(p => p.label)), [selectedPhrases]);
  
  const disabledIds = useMemo(() => {
    if (selectedPhrases.length < MAX_SELECTIONS) return new Set<string>();
    return new Set(shuffledPhrases.map(p => p.label).filter(id => !selectedIds.has(id)));
  }, [selectedPhrases.length, selectedIds, shuffledPhrases]);

  const canTest = selectedPhrases.length === MAX_SELECTIONS && !result;

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[1400px]">
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-soft p-3 sm:p-6 flex flex-col gap-3 sm:gap-4">
          {/* Header */}
          <header className="flex flex-col gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-1">
                Build Your Prompt
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Select 4 phrases to build the best IT ticket prompt.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-1 sm:gap-1.5 font-semibold text-primary">
                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="tabular-nums">{formatTime(seconds)}</span>
              </div>
              <div className="font-medium bg-secondary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                <span className="tabular-nums">{selectedPhrases.length}</span>/{MAX_SELECTIONS} selected
              </div>
            </div>
          </header>

          {/* Scenario */}
          <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-[hsl(var(--scenario-bg))] border border-[hsl(var(--scenario-border))]">
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 sm:mb-2">Scenario</div>
            <p className="text-sm sm:text-lg md:text-xl leading-relaxed font-medium">
              Windows 11 laptop running slow with crashes after update. Fan loud, new apps installed. Corporate device, standard user.
            </p>
          </div>

          {/* All Phrases Mixed */}
          <section className="rounded-lg sm:rounded-xl border border-border bg-secondary/30 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col xs:flex-row xs:items-baseline xs:justify-between gap-1 sm:gap-2">
              <div>
                <h2 className="font-semibold text-sm sm:text-base text-foreground">Available Phrases</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Find the 4 optimal phrases for a perfect 100!
                </p>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                Tap to select
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {shuffledPhrases.map((phrase) => {
                const id = phrase.label;
                return (
                  <PhraseChip
                    key={id}
                    phrase={phrase}
                    isSelected={selectedIds.has(id)}
                    isDisabled={disabledIds.has(id)}
                    onClick={() => togglePhrase(phrase)}
                  />
                );
              })}
            </div>
          </section>

          {/* Prompt Panel - Now below Available Phrases */}
          <section className="rounded-lg sm:rounded-xl border-2 border-primary/40 bg-primary/5 p-3 sm:p-4">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Your Prompt:
            </div>
            <div className="flex flex-wrap items-start gap-1.5 sm:gap-2 min-h-[36px] sm:min-h-[40px]">
              {selectedPhrases.length === 0 ? (
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Select phrases above to construct your prompt.
                </span>
              ) : (
                selectedPhrases.map((phrase) => (
                  <PromptToken
                    key={phrase.label}
                    phrase={phrase}
                    onRemove={() => togglePhrase(phrase)}
                  />
                ))
              )}
            </div>
          </section>

          {/* Controls */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="secondary"
                onClick={handleReset}
                className="flex-1 gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm px-2 sm:px-4"
                size="default"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Reset</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm px-2 sm:px-4"
                size="default"
              >
                <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{showHint ? 'Hide' : 'Hint'}</span>
              </Button>
            </div>
            <Button
              onClick={handleTest}
              disabled={!canTest}
              className="w-full gap-1.5 sm:gap-2 rounded-full shadow-button bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm sm:text-base"
              size="lg"
            >
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
              Test Your Prompt
            </Button>
          </div>

          {/* Hint Panel */}
          {showHint && (
            <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 bg-[hsl(var(--warning-bg))] border border-[hsl(var(--warning-border))]">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--warning-foreground))]" />
                <span className="font-semibold text-xs sm:text-sm text-[hsl(var(--warning-foreground))]">The 4 Parts of a Great Prompt</span>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                {HINT_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="bg-card/50 rounded-lg p-2 border border-border">
                    <span className="font-medium text-xs sm:text-sm">{cat.name}</span>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {result && <ResultsPanel result={result} formatTime={formatTime} />}

          {/* Pro Tip */}
          <aside className="rounded-lg sm:rounded-xl p-3 sm:p-4 bg-[hsl(var(--info-bg))] border border-[hsl(var(--info-border))] flex items-start gap-2 sm:gap-3">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--info-foreground))] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs sm:text-sm text-[hsl(var(--info-foreground))]">Pro Tip</span>
              <p className="text-xs sm:text-sm text-foreground mt-0.5">
                Every phrase scores points, but only 4 are optimal. A perfect prompt covers: incident, environment, constraints, and plan.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
