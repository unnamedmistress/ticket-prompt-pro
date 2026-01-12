import * as React from 'react';
import { 
  Button, 
  Badge,
  Card,
  CardHeader,
  Text,
  Title1,
  Title2,
  Title3,
  Body1,
  Caption1,
  makeStyles,
  tokens,
  shorthands,
  mergeClasses
} from '@fluentui/react-components';
import { 
  Timer24Regular, 
  ArrowReset24Regular, 
  Rocket24Regular, 
  Lightbulb24Regular,
  QuestionCircle24Regular,
  Trophy24Regular,
  Star24Filled
} from '@fluentui/react-icons';

// Types
interface Phrase {
  label: string;
  weight: number;
  category: string;
  type: 'relevant' | 'helpful' | 'clarifying' | 'weak';
  optimal?: boolean;
}

interface GameResult {
  totalScore: number;
  maxPossible: number;
  percentage: number;
  optimalCount: number;
  elapsedSeconds: number;
  selectedPhrases: Phrase[];
  timeBonus: number;
}

// Phrases data
const phrases: Phrase[] = [
  // OPTIMAL ANSWERS (25 points each = 100 total)
  { label: "Describe what you want to do: schedule meetings with availability polling", weight: 25, category: "goal", type: "relevant", optimal: true },
  { label: "State your Outlook version and platform (desktop, web, mobile)", weight: 25, category: "environment", type: "relevant", optimal: true },
  { label: "Mention your account type (Microsoft 365, Exchange, personal)", weight: 25, category: "context", type: "relevant", optimal: true },
  { label: "Ask how to find or enable this scheduling feature", weight: 25, category: "plan", type: "relevant", optimal: true },
  // GOOD ANSWERS (15-20 points)
  { label: "Ask if the feature requires admin permissions or a specific license", weight: 20, category: "permissions", type: "relevant" },
  { label: "Ask what the feature is officially called in Outlook", weight: 18, category: "goal", type: "relevant" },
  { label: "Ask if it's available in your region or being rolled out", weight: 18, category: "context", type: "relevant" },
  { label: "Mention where you've already looked (ribbon, settings, add-ins)", weight: 15, category: "troubleshooting", type: "relevant" },
  { label: "Ask if it's a built-in feature or an add-in to install", weight: 17, category: "context", type: "relevant" },
  { label: "Ask for a link to Microsoft's official instructions", weight: 15, category: "plan", type: "relevant" },
  // DECENT ANSWERS (8-12 points)
  { label: "Mention you've searched the ribbon and calendar settings", weight: 12, category: "troubleshooting", type: "helpful" },
  { label: "Ask if your IT department needs to enable it", weight: 12, category: "permissions", type: "helpful" },
  { label: "Ask for a brief, focused answer", weight: 10, category: "style", type: "helpful" },
  { label: "Request step-by-step bullet points", weight: 10, category: "style", type: "helpful" },
  { label: "Ask the AI to clarify anything it needs first", weight: 10, category: "clarifying", type: "clarifying" },
  { label: "Ask about alternative ways to poll for meeting times", weight: 8, category: "plan", type: "helpful" },
  { label: "Ask if the feature has a different name in older versions", weight: 8, category: "context", type: "helpful" },
  { label: "Ask for keyboard shortcuts to access it faster", weight: 8, category: "style", type: "helpful" },
  // WEAK ANSWERS (2-5 points)
  { label: "Explain exactly what your colleague said about it", weight: 3, category: "context", type: "weak" },
  { label: "Ask what version your colleague is using", weight: 3, category: "context", type: "weak" },
  { label: "Keep the tone casual and friendly", weight: 5, category: "style", type: "weak" },
  { label: "Mention you're frustrated you can't find it", weight: 4, category: "style", type: "weak" },
  { label: "Ask for screenshots showing where to click", weight: 5, category: "plan", type: "weak" },
  { label: "Say you've been searching for a long time", weight: 5, category: "context", type: "weak" },
  { label: "Ask whether Scheduler is new or old", weight: 4, category: "context", type: "weak" },
  { label: "Thank the AI before it responds", weight: 3, category: "style", type: "weak" },
  { label: "Try restarting Outlook before asking", weight: 2, category: "troubleshooting", type: "weak" },
  { label: "Ask if updating Outlook might help", weight: 2, category: "troubleshooting", type: "weak" },
  { label: "Ask if the feature works without internet", weight: 4, category: "clarifying", type: "weak" },
];

const HINT_CATEGORIES = [
  { name: 'Goal', description: "Define what you're looking for and your objective" },
  { name: 'Environment', description: 'Specify your Outlook version and platform' },
  { name: 'Context', description: "Mention your account type and what you've tried" },
  { name: 'Plan', description: 'Request step-by-step instructions to find the feature' },
];

const MAX_BASE_SCORE = 100;
const TIME_BONUS_MAX = 20;
const FAST_TIME_THRESHOLD = 15;
const SLOW_TIME_THRESHOLD = 60;
const MAX_SELECTIONS = 4;

// Styles
const useStyles = makeStyles({
  container: {
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '100vh',
    fontFamily: tokens.fontFamilyBase,
  },
  card: {
    ...shorthands.padding('24px'),
    ...shorthands.borderRadius('16px'),
    boxShadow: tokens.shadow16,
    backgroundColor: tokens.colorNeutralBackground1,
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  header: {
    marginBottom: '16px',
  },
  statsRow: {
    display: 'flex',
    ...shorthands.gap('16px'),
    alignItems: 'center',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    ...shorthands.padding('6px', '12px'),
    ...shorthands.borderRadius('20px'),
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: tokens.fontWeightSemibold,
  },
  timerBadge: {
    color: tokens.colorBrandForeground1,
  },
  scenario: {
    ...shorthands.padding('16px', '20px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: '#fef9c3',
    ...shorthands.border('1px', 'solid', '#fde047'),
    marginBottom: '20px',
  },
  scenarioLabel: {
    fontSize: '11px',
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  phrasesSection: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    marginBottom: '20px',
  },
  phrasesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('8px'),
    marginTop: '12px',
  },
  phraseChip: {
    ...shorthands.padding('8px', '16px'),
    ...shorthands.borderRadius('20px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    fontSize: '13px',
    transitionProperty: 'all',
    transitionDuration: '150ms',
    ':hover': {
      boxShadow: tokens.shadow4,
      transform: 'translateY(-1px)',
    },
  },
  phraseChipSelected: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.border('2px', 'solid', tokens.colorBrandStroke1),
    color: tokens.colorBrandForeground1,
  },
  phraseChipDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
    ':hover': {
      boxShadow: 'none',
      transform: 'none',
    },
  },
  promptPanel: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.border('2px', 'solid', tokens.colorBrandStroke1),
    marginBottom: '20px',
    minHeight: '60px',
  },
  promptLabel: {
    fontSize: '11px',
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: tokens.colorBrandForeground1,
    marginBottom: '8px',
  },
  promptTokens: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('8px'),
  },
  promptToken: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    ...shorthands.padding('6px', '12px'),
    ...shorthands.borderRadius('16px'),
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: '12px',
  },
  controlsRow: {
    display: 'flex',
    ...shorthands.gap('12px'),
    marginBottom: '12px',
  },
  hintPanel: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: '#fef3c7',
    ...shorthands.border('1px', 'solid', '#fcd34d'),
    marginBottom: '20px',
  },
  hintGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('12px'),
    marginTop: '12px',
  },
  hintCard: {
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
  },
  resultsPanel: {
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    marginBottom: '20px',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
  },
  scoreBadge: {
    ...shorthands.padding('8px', '16px'),
    ...shorthands.borderRadius('20px'),
    backgroundColor: '#dcfce7',
    color: '#166534',
    fontWeight: tokens.fontWeightBold,
    fontSize: '18px',
  },
  perfectBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    ...shorthands.gap('12px'),
    marginBottom: '16px',
  },
  statCard: {
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
  },
  statLabel: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },
  selectionsList: {
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    marginBottom: '16px',
  },
  selectionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.padding('6px', '0'),
    fontSize: '13px',
    ...shorthands.gap('12px'),
  },
  proTip: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('12px'),
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: '#eff6ff',
    ...shorthands.border('1px', 'solid', '#bfdbfe'),
  },
  missedOptimal: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: '#eff6ff',
    ...shorthands.border('1px', 'solid', '#bfdbfe'),
    marginTop: '16px',
  },
});

export interface IHelloWorldProps {
  name?: string;
}

export const HelloWorld: React.FC<IHelloWorldProps> = () => {
  const styles = useStyles();
  
  const [shuffledPhrases, setShuffledPhrases] = React.useState<Phrase[]>(() => 
    [...phrases].sort(() => Math.random() - 0.5)
  );
  const [selectedPhrases, setSelectedPhrases] = React.useState<Phrase[]>([]);
  const [result, setResult] = React.useState<GameResult | null>(null);
  const [showHint, setShowHint] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  React.useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const computeScore = (selected: Phrase[], timerSeconds: number): GameResult => {
    const baseScore = selected.reduce((sum, p) => sum + p.weight, 0);
    const optimalCount = selected.filter(p => p.optimal).length;
    
    let timeBonus = 0;
    if (timerSeconds <= FAST_TIME_THRESHOLD) {
      timeBonus = TIME_BONUS_MAX;
    } else if (timerSeconds < SLOW_TIME_THRESHOLD) {
      const timeRange = SLOW_TIME_THRESHOLD - FAST_TIME_THRESHOLD;
      const timeOver = timerSeconds - FAST_TIME_THRESHOLD;
      timeBonus = Math.round(TIME_BONUS_MAX * (1 - timeOver / timeRange));
    }
    
    const totalScore = baseScore + timeBonus;
    const maxPossible = MAX_BASE_SCORE + TIME_BONUS_MAX;
    const percentage = Math.round((totalScore / maxPossible) * 100);

    return {
      totalScore,
      maxPossible,
      percentage,
      optimalCount,
      elapsedSeconds: timerSeconds,
      selectedPhrases: selected,
      timeBonus,
    };
  };

  const getCoachMessage = (res: GameResult): string => {
    if (res.optimalCount === 4) return "Perfect! You found the optimal prompt combination!";
    if (res.percentage >= 90) return "Excellent! You're very close to the perfect prompt.";
    if (res.percentage >= 75) return "Great job! Strong prompt with room for refinement.";
    if (res.percentage >= 50) return "Good start. Try to identify the highest-impact phrases.";
    return "Keep practicing! Focus on goal, environment, context, and plan.";
  };

  const togglePhrase = (phrase: Phrase) => {
    setSelectedPhrases(prev => {
      const exists = prev.some(p => p.label === phrase.label);
      if (exists) {
        return prev.filter(p => p.label !== phrase.label);
      } else {
        if (prev.length >= MAX_SELECTIONS) return prev;
        if (!isRunning) setIsRunning(true);
        return [...prev, phrase];
      }
    });
  };

  const handleTest = () => {
    if (selectedPhrases.length !== MAX_SELECTIONS) return;
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const gameResult = computeScore(selectedPhrases, seconds);
    setResult(gameResult);
  };

  const handleReset = () => {
    setSelectedPhrases([]);
    setResult(null);
    setShuffledPhrases([...phrases].sort(() => Math.random() - 0.5));
    setShowHint(false);
    setIsRunning(false);
    setSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const selectedIds = new Set(selectedPhrases.map(p => p.label));
  const disabledIds = selectedPhrases.length < MAX_SELECTIONS 
    ? new Set<string>() 
    : new Set(shuffledPhrases.map(p => p.label).filter(id => !selectedIds.has(id)));
  const canTest = selectedPhrases.length === MAX_SELECTIONS && !result;

  const optimalPhrases = phrases.filter(p => p.optimal);
  const missedOptimal = result 
    ? optimalPhrases.filter(p => !result.selectedPhrases.some(s => s.label === p.label))
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <Title1>Build Your Prompt</Title1>
          <Body1>Select 4 phrases to build the best prompt for solving this IT ticket.</Body1>
          <div className={styles.statsRow}>
            <div className={mergeClasses(styles.statBadge, styles.timerBadge)}>
              <Timer24Regular />
              <span>{formatTime(seconds)}</span>
            </div>
            <div className={styles.statBadge}>
              <span>{selectedPhrases.length}/{MAX_SELECTIONS} selected</span>
            </div>
          </div>
        </div>

        {/* Scenario */}
        <div className={styles.scenario}>
          <div className={styles.scenarioLabel}>Scenario</div>
          <Text size={400} weight="medium">
            A colleague mentioned a new &quot;Scheduler&quot; feature in Outlook that helps find meeting times 
            everyone can attend, but you can&apos;t find it anywhere in your app.
          </Text>
        </div>

        {/* Phrases Section */}
        <div className={styles.phrasesSection}>
          <Title3>Available Phrases</Title3>
          <Caption1>Find the 4 optimal phrases for a perfect 100!</Caption1>
          <div className={styles.phrasesGrid}>
            {shuffledPhrases.map((phrase) => {
              const isSelected = selectedIds.has(phrase.label);
              const isDisabled = disabledIds.has(phrase.label);
              return (
                <button
                  key={phrase.label}
                  className={mergeClasses(
                    styles.phraseChip,
                    isSelected && styles.phraseChipSelected,
                    isDisabled && styles.phraseChipDisabled
                  )}
                  onClick={() => !isDisabled && togglePhrase(phrase)}
                  disabled={isDisabled}
                >
                  {phrase.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Panel */}
        <div className={styles.promptPanel}>
          <div className={styles.promptLabel}>Your Prompt:</div>
          <div className={styles.promptTokens}>
            {selectedPhrases.length === 0 ? (
              <Caption1>Select phrases above to construct your prompt.</Caption1>
            ) : (
              selectedPhrases.map((phrase) => (
                <span 
                  key={phrase.label} 
                  className={styles.promptToken}
                  onClick={() => togglePhrase(phrase)}
                  style={{ cursor: 'pointer' }}
                >
                  {phrase.label}
                  <span style={{ marginLeft: '4px' }}>x</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controlsRow}>
          <Button 
            appearance="secondary" 
            icon={<ArrowReset24Regular />}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button 
            appearance="outline" 
            icon={<QuestionCircle24Regular />}
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </Button>
        </div>
        <Button 
          appearance="primary" 
          icon={<Rocket24Regular />}
          onClick={handleTest}
          disabled={!canTest}
          size="large"
          style={{ width: '100%', marginBottom: '20px' }}
        >
          Test Your Prompt
        </Button>

        {/* Hint Panel */}
        {showHint && (
          <div className={styles.hintPanel}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <QuestionCircle24Regular />
              <Text weight="semibold">The 4 Parts of a Great Prompt</Text>
            </div>
            <div className={styles.hintGrid}>
              {HINT_CATEGORIES.map((cat) => (
                <div key={cat.name} className={styles.hintCard}>
                  <Text weight="semibold">{cat.name}</Text>
                  <Caption1>{cat.description}</Caption1>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className={styles.resultsPanel}>
            <div className={styles.resultsHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {result.optimalCount === 4 ? <Trophy24Regular /> : <Star24Filled />}
                <Title2>Results</Title2>
              </div>
              <div className={mergeClasses(
                styles.scoreBadge,
                result.optimalCount === 4 && styles.perfectBadge
              )}>
                {result.totalScore} / {result.maxPossible} pts
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{result.percentage}%</div>
                <div className={styles.statLabel}>Score</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{result.optimalCount}/4</div>
                <div className={styles.statLabel}>Optimal</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{formatTime(result.elapsedSeconds)}</div>
                <div className={styles.statLabel}>Time</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue} style={{ color: result.timeBonus > 0 ? '#16a34a' : undefined }}>
                  +{result.timeBonus}
                </div>
                <div className={styles.statLabel}>Speed Bonus</div>
              </div>
            </div>

            <div className={styles.selectionsList}>
              <Text weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>Your Selections:</Text>
              {result.selectedPhrases.map((phrase) => (
                <div key={phrase.label} className={styles.selectionItem}>
                  <span style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    {phrase.optimal && <Star24Filled style={{ color: '#eab308', width: '16px', height: '16px' }} />}
                    <span style={{ fontWeight: phrase.optimal ? 600 : 400 }}>{phrase.label}</span>
                  </span>
                  <span style={{ 
                    color: phrase.weight >= 20 ? '#16a34a' : phrase.weight >= 10 ? tokens.colorBrandForeground1 : tokens.colorNeutralForeground3,
                    fontWeight: 600 
                  }}>
                    +{phrase.weight}
                  </span>
                </div>
              ))}
            </div>

            <Text weight="medium">{getCoachMessage(result)}</Text>

            {missedOptimal.length > 0 && (
              <div className={styles.missedOptimal}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Lightbulb24Regular style={{ color: '#2563eb' }} />
                  <Text weight="semibold" style={{ color: '#2563eb' }}>Next Time, Consider:</Text>
                </div>
                {missedOptimal.map((phrase) => (
                  <div key={phrase.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '6px' }}>
                    <Star24Filled style={{ color: '#eab308', width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px' }}>
                      <strong>{phrase.category.charAt(0).toUpperCase() + phrase.category.slice(1)}:</strong>{' '}
                      {phrase.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pro Tip */}
        <div className={styles.proTip}>
          <Lightbulb24Regular style={{ color: '#2563eb', flexShrink: 0 }} />
          <div>
            <Text weight="bold" style={{ color: '#2563eb' }}>Pro Tip</Text>
            <Body1>
              Every phrase scores points, but only 4 are optimal. A perfect prompt covers: goal, environment, context, and plan.
            </Body1>
          </div>
        </div>
      </div>
    </div>
  );
};
