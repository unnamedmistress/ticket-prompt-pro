# Ticket Prompt Pro - Power App Version

This is a Power Apps Canvas App conversion of the Ticket Prompt Pro game.

## Overview

A prompt-building training game where users select 4 phrases to construct the optimal IT support prompt. Players learn how to effectively communicate technical issues.

## Game Rules

1. Read the scenario describing an IT issue
2. Select exactly 4 phrases from the available options
3. Build the best possible prompt
4. Submit to see your score and feedback

## Scoring

- **Optimal Phrases**: 25 points each (4 optimal = 100 base points)
- **Good Phrases**: 15-20 points
- **Decent Phrases**: 8-12 points  
- **Weak Phrases**: 2-5 points
- **Time Bonus**: Up to 20 points for fast completion

## Installation

### Option 1: Import as Solution
1. Download the `.msapp` file from the releases
2. Open Power Apps Studio
3. Go to File > Open > Browse
4. Select the `.msapp` file

### Option 2: Create from Source
1. Create a new Canvas App in Power Apps
2. Copy the formulas and controls from the source files
3. Configure the data collections

## Files Structure

```
PowerApp/
  src/
    App.yaml           - Main app configuration
    Screens/
      MainScreen.yaml  - Main game screen
    Components/
      PhraseButton.yaml - Reusable phrase chip component
    DataSources/
      Phrases.yaml     - Phrase data collection
```

## Power Fx Collections

The app uses the following collections:
- `colPhrases` - All available phrases with weights and categories
- `colSelectedPhrases` - User's current selections
- `colShuffledPhrases` - Randomized phrase order

## Variables

- `varGameStarted` - Boolean for timer state
- `varStartTime` - Timer start timestamp
- `varElapsedSeconds` - Current elapsed time
- `varShowResults` - Display results panel
- `varShowHint` - Display hint panel
- `varGameResult` - Scoring results record

## Author

Converted from React/TypeScript to Power Apps
Original: https://github.com/unnamedmistress/ticket-prompt-pro
