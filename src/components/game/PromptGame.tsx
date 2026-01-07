import { useState, useCallback } from 'react';
import { Timer, RotateCcw, Rocket, Lightbulb } from 'lucide-react';
import { phrases } from '@/data/phrases';
import { useGameTimer } from '@/hooks/useGameTimer';
import { computeScore } from '@/utils/scoring';
import { PhraseChip } from './PhraseChip';
import { PromptToken } from './PromptToken';
import { ResultsPanel } from './ResultsPanel';
import { Button } from '@/components/ui/button';
import { GameResult } from '@/types/game';

const MAX_SELECTIONS = 4;

export function PromptGame() {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const { seconds, isRunning, start, stop, reset: resetTimer, formatTime } = useGameTimer();

  const togglePhrase = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const currentIdx = prev.indexOf(index);
      if (currentIdx >= 0) {
        return prev.filter((i) => i !== index);
      } else {
        if (prev.length >= MAX_SELECTIONS) return prev;
        if (!isRunning) start();
        return [...prev, index];
      }
    });
  }, [isRunning, start]);

  const handleTest = useCallback(() => {
    if (selectedIndices.length !== MAX_SELECTIONS) return;
    stop();
    const selectedPhrases = selectedIndices.map((i) => phrases[i]);
    const gameResult = computeScore(selectedPhrases, seconds);
    setResult(gameResult);
  }, [selectedIndices, seconds, stop]);

  const handleReset = useCallback(() => {
    setSelectedIndices([]);
    setResult(null);
    resetTimer();
  }, [resetTimer]);

  const limitReached = selectedIndices.length >= MAX_SELECTIONS;
  const canTest = selectedIndices.length === MAX_SELECTIONS && !result;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-[980px]">
        <div className="bg-card rounded-2xl shadow-soft p-4 sm:p-6 flex flex-col gap-4">
          {/* Header */}
          <header>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-1">
              Build Your Prompt
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Craft the perfect IT ticket prompt with these phrases.
            </p>
            <div className="mt-3 p-3 rounded-xl bg-[hsl(var(--scenario-bg))] border border-[hsl(var(--scenario-border))] text-sm leading-relaxed">
              <strong>Scenario:</strong> User's Windows 11 laptop is very slow and crashes after an auto-update; fan is loud; large apps recently installed. Corporate build, BitLocker, standard user rights.
            </div>
          </header>

          {/* Status Row */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <Timer className="w-4 h-4" />
              <span>Time:</span>
              <span className="tabular-nums">{formatTime(seconds)}</span>
            </div>
            <div className="font-medium">
              Phrases Selected: <span className="tabular-nums">{selectedIndices.length}</span>/{MAX_SELECTIONS}
            </div>
          </div>

          {/* Prompt Panel */}
          <section className="rounded-xl border-2 border-dashed border-border bg-secondary/30 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Your Prompt:
            </div>
            <div className="flex flex-wrap items-start gap-2 min-h-[40px]">
              {selectedIndices.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  Select phrases below to construct your prompt.
                </span>
              ) : (
                selectedIndices.map((idx) => (
                  <PromptToken
                    key={idx}
                    phrase={phrases[idx]}
                    onRemove={() => togglePhrase(idx)}
                  />
                ))
              )}
            </div>
          </section>

          {/* Phrases Section */}
          <section className="rounded-xl border border-border bg-secondary/30 p-4 flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <div>
                <h2 className="font-semibold text-foreground">Available Phrases</h2>
                <p className="text-xs text-muted-foreground">
                  Pick exactly four. Mix essentials, structure, and clarifying checks.
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                Limit: 4 phrases • Tap again or × to remove
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[200px] sm:max-h-[220px] overflow-y-auto pr-1">
              {phrases.map((phrase, index) => {
                const isSelected = selectedIndices.includes(index);
                const isDisabled = limitReached && !isSelected;
                return (
                  <PhraseChip
                    key={index}
                    phrase={phrase}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onClick={() => togglePhrase(index)}
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
              variant="secondary"
              onClick={handleReset}
              className="flex-1 gap-2 rounded-full"
              size="lg"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Game
            </Button>
          </div>

          {/* Results */}
          {result && <ResultsPanel result={result} formatTime={formatTime} />}

          {/* Pro Tip */}
          <aside className="rounded-xl p-4 bg-[hsl(var(--info-bg))] border border-[hsl(var(--info-border))] flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[hsl(var(--info-foreground))] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[hsl(var(--info-foreground))]">Pro Tip</span>
              <p className="text-sm text-foreground mt-0.5">
                Aim for diversity and include essentials: incident framing, context, evidence, constraints, and a safe plan.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
