# Power Apps Import Instructions

## Step-by-Step Guide to Create the Ticket Prompt Pro App

### Option 1: Create from Scratch in Power Apps Studio

#### Step 1: Create a New Canvas App
1. Go to [make.powerapps.com](https://make.powerapps.com)
2. Click **+ Create** > **Blank app** > **Blank canvas app**
3. Name it "Ticket Prompt Pro"
4. Select **Tablet** format for best layout
5. Click **Create**

#### Step 2: Set Up App.OnStart
1. In the Tree view, click on **App**
2. In the formula bar, select **OnStart**
3. Copy and paste the entire OnStart formula from `src/App.yaml`
4. Click **Run OnStart** in the ribbon to initialize

#### Step 3: Add the Timer Control
1. Insert > Input > **Timer**
2. Rename to `TimerGame`
3. Set properties:
   - **Duration**: `1000`
   - **Repeat**: `true`
   - **AutoStart**: `false`
   - **Start**: `varGameStarted`
   - **OnTimerEnd**: `If(varGameStarted, Set(varElapsedSeconds, DateDiff(varStartTime, Now(), TimeUnit.Seconds)))`
   - **Visible**: `false`

#### Step 4: Build the Header Section
1. Insert > Layout > **Vertical container** (name: conMain)
2. Set Fill to white, add border radius
3. Add Label for title: "Build Your Prompt"
4. Add Label for subtitle
5. Add container for timer and selection count display

#### Step 5: Create the Scenario Card
1. Insert > Layout > **Container**
2. Set yellow background (RGBA(254, 252, 232, 1))
3. Add labels for "SCENARIO" header and scenario text

#### Step 6: Build the Phrases Gallery
1. Insert > Gallery > **Blank horizontal gallery**
2. Set **Items**: `colShuffledPhrases`
3. Set **WrapCount**: 4
4. Add Button inside template:
   - **Text**: `ThisItem.Label`
   - **Fill**: `If(ThisItem.ID in colSelectedPhrases.ID, RGBA(219, 234, 254, 1), RGBA(255, 255, 255, 1))`
   - **BorderColor**: `If(ThisItem.ID in colSelectedPhrases.ID, RGBA(59, 130, 246, 1), RGBA(226, 232, 240, 1))`
   - **DisplayMode**: `If(CountRows(colSelectedPhrases) >= 4 And Not(ThisItem.ID in colSelectedPhrases.ID), DisplayMode.Disabled, DisplayMode.Edit)`
   - **OnSelect**: See formula below

```
If(
    ThisItem.ID in colSelectedPhrases.ID,
    Remove(colSelectedPhrases, LookUp(colSelectedPhrases, ID = ThisItem.ID)),
    If(
        CountRows(colSelectedPhrases) < 4,
        Collect(colSelectedPhrases, ThisItem);
        If(Not(varGameStarted), Set(varGameStarted, true); Set(varStartTime, Now()))
    )
)
```

#### Step 7: Create "Your Prompt" Section
1. Insert container with blue border
2. Add gallery showing `colSelectedPhrases`
3. Add X button on each item to remove

#### Step 8: Add Control Buttons
1. **Reset Button**:
   - OnSelect: Full reset formula from PowerFx_Formulas.txt
   
2. **Hint Button**:
   - OnSelect: `Set(varShowHint, Not(varShowHint))`
   
3. **Test Prompt Button**:
   - DisplayMode: `If(CountRows(colSelectedPhrases) = 4 And Not(varShowResults), DisplayMode.Edit, DisplayMode.Disabled)`
   - OnSelect: Scoring formula from PowerFx_Formulas.txt

#### Step 9: Add Hint Panel (Conditional)
1. Container with **Visible**: `varShowHint`
2. Gallery with **Items**: `colHintCategories`
3. Display Name and Description for each hint

#### Step 10: Add Results Panel (Conditional)
1. Container with **Visible**: `varShowResults`
2. Score badge showing `varTotalScore & "/" & varMaxPossible`
3. Stats cards for Score%, Optimal count, Time, Speed bonus
4. Gallery showing selected phrases with scores
5. Coach message label
6. Missed optimal phrases section

#### Step 11: Add Pro Tip Footer
1. Blue-tinted container
2. "Pro Tip" label
3. Helpful text about optimal prompts

### Option 2: Manual JSON Import

If you need to import as a solution:

1. **Export as msapp**: After building in Power Apps, go to File > Save as > This computer
2. **Import**: File > Open > Browse > Select the .msapp file

### Troubleshooting

#### Timer Not Working
- Ensure Timer.Start is bound to `varGameStarted`
- Check that Timer.Visible is `false` (it runs even when hidden)

#### Phrases Not Shuffling
- Run App.OnStart manually after saving
- Check that `colShuffledPhrases` is created in OnStart

#### Scoring Issues
- Verify `Sum()` and `CountIf()` functions reference correct collection
- Check that Weight and Optimal fields are defined correctly

### Color Reference

| Element | Color Code |
|---------|------------|
| Primary Blue | RGBA(59, 130, 246, 1) |
| Selected Background | RGBA(219, 234, 254, 1) |
| Scenario Yellow | RGBA(254, 252, 232, 1) |
| Success Green | RGBA(22, 163, 74, 1) |
| Text Primary | RGBA(15, 23, 42, 1) |
| Text Secondary | RGBA(100, 116, 139, 1) |
| Border Light | RGBA(226, 232, 240, 1) |
| Card Background | RGBA(248, 250, 252, 1) |

### Testing Checklist

- [ ] App loads without errors
- [ ] Timer starts on first phrase selection
- [ ] Can select up to 4 phrases
- [ ] 5th phrase selection is blocked
- [ ] Can deselect phrases
- [ ] Reset clears all and shuffles
- [ ] Hint panel toggles correctly
- [ ] Test button enabled only with 4 selections
- [ ] Score calculation is correct
- [ ] Time bonus calculation works
- [ ] Results panel shows correctly
- [ ] Coach message varies by score
- [ ] Missed optimal phrases display
