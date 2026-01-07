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
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-[1400px]">
        <div className="bg-card rounded-2xl shadow-soft p-4 sm:p-6 flex flex-col gap-4">
          {/* Header */}
          <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-1">
                Build Your Prompt
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Select 4 phrases to build the best IT ticket prompt. Higher scores = better choices!
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Timer className="w-4 h-4" />
                <span className="tabular-nums">{formatTime(seconds)}</span>
              </div>
              <div className="font-medium bg-secondary px-3 py-1 rounded-full">
                <span className="tabular-nums">{selectedPhrases.length}</span>/{MAX_SELECTIONS} selected
              </div>
            </div>
          </header>

          {/* Scenario */}
          <div className="p-3 rounded-xl bg-[hsl(var(--scenario-bg))] border border-[hsl(var(--scenario-border))] text-sm leading-relaxed">
            <strong>Scenario:</strong> Windows 11 laptop running slow with crashes after update. Fan loud, new apps installed. Corporate device, standard user.
          </div>

          {/* Prompt Panel */}
          <section className="rounded-xl border-2 border-dashed border-border bg-secondary/30 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Your Prompt:
            </div>
            <div className="flex flex-wrap items-start gap-2 min-h-[40px]">
              {selectedPhrases.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  Select phrases below to construct your prompt.
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

          {/* All Phrases Mixed */}
          <section className="rounded-xl border border-border bg-secondary/30 p-4 flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <div>
                <h2 className="font-semibold text-foreground">Available Phrases</h2>
                <p className="text-xs text-muted-foreground">
                  All choices earn points — find the 4 optimal phrases for a perfect 100!
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                Tap to select • Tap again to remove
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
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

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleTest}
              disabled={!canTest}
              className="flex-1 gap-2 rounded-full shadow-button"
              size="lg"
            >
              <Rocket className="w-4 h-4" />
              Test Your Prompt
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="gap-2 rounded-full"
              size="lg"
            >
              <HelpCircle className="w-4 h-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
              className="flex-1 gap-2 rounded-full"
              size="lg"
            >
              <RotateCcw className="w-4 h-4" />
              Reset & Shuffle
            </Button>
          </div>

          {/* Hint Panel */}
          {showHint && (
            <div className="rounded-xl p-4 bg-[hsl(var(--warning-bg))] border border-[hsl(var(--warning-border))]">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[hsl(var(--warning-foreground))]" />
                <span className="font-semibold text-[hsl(var(--warning-foreground))]">Hint: The 4 Parts of a Great Prompt</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HINT_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="bg-card/50 rounded-lg p-2 border border-border">
                    <span className="font-medium text-sm">{cat.name}</span>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {result && <ResultsPanel result={result} formatTime={formatTime} />}

          {/* Pro Tip */}
          <aside className="rounded-xl p-4 bg-[hsl(var(--info-bg))] border border-[hsl(var(--info-border))] flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[hsl(var(--info-foreground))] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[hsl(var(--info-foreground))]">Pro Tip</span>
              <p className="text-sm text-foreground mt-0.5">
                Every phrase scores points, but only 4 are optimal. A perfect prompt covers: incident definition, environment, constraints, and action plan.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
