# FAST ARCHITECTURE & DEMO RESILIENCE RULES - 90-MINUTE HACKATHON

## 1. Zero-Friction Single-Page Architecture
To finish with 100% polish in 90 minutes, keep the architecture flat, transparent, and easy to explain during Tuesday's defense:
```text
src/
  data/
    presets.ts          # 3-4 rich Spanish demo presets + initial default state
  logic/
    inventionEngine.ts  # Pure, well-commented English functions (Input -> Output + Improbable Ingredient)
  components/
    HeaderBanner.tsx    # Invention title, Pavilion badge, and 1- sentence pitch
    InputPanel.tsx      # Interactive controls + 1-click Preset buttons + Reset button
    ResultDisplay.tsx   # Main output visualization
    ImprobableWidget.tsx# Dedicated spotlight component for the chosen Improbable Ingredient
```

## 2. Strict Scope Cuts (What Never to Build)
- **NO Authentication / Login:** Open directly into the working invention.
- **NO External Database / Docker:** Use React state + `localStorage` persistence so the app runs anywhere with zero setup (`npm install && npm run dev`).
- **NO Fragile External API Dependencies:** Unless an AI/API call is explicitly required, keep calculations deterministic and instant in `inventionEngine.ts`. If an external API is used, wrap it in `try/catch` with an immediate deterministic fallback so the app works 100% offline.

## 3. Mandatory 5-Point Verification & Defense Prep
Before minute 80, verify:
1. **Initial Render is Pre-Populated:** Opening `localhost` immediately shows the first preset already calculated so the screen is never blank.
2. **Dynamic Reactivity:** Changing any input or clicking another preset visibly updates both the main result and the *Ingrediente Improbable*.
3. **Zero Crash Guarantee:** Empty strings, `0`, negative numbers, or extreme slider values are clamped/handled gracefully without `NaN`, `undefined`, or console errors.
4. **1-Click Reset / Demo Load:** Includes a button to restore the default demo state immediately.
5. **Explainable Core Algorithm:** The logic in `src/logic/` is clean and commented so the author can clearly explain:
   - What each function does.
   - How inputs transform into the output.
   - Which design/logic choices were directed by the human vs. accelerated by AI.
