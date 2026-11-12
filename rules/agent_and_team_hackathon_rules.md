# AGENT & TEAM EXECUTION RULES - 90-MINUTE HACKATHON ("LA FERIA DE SOLUCIONES IMPROBABLES")

## 1. Core Mindset & Speed Priority
We are operating in a **strict 90-minute hackathon**. Every decision and code generation step must optimize for:
- **Working Invention Over Promises:** One core mechanism (`Input -> Process -> Output`) working end-to-end with theatrical polish beats five incomplete screens.
- **Immediate Visual & Comedic/Practical Impact:** Judges and peers vote on how memorable, clear, and fun/useful the invention feels within 60 seconds of testing.
- **Strict Scope Cut:**
  - **NO Login / Auth screens.**
  - **NO External DB setup** (`localStorage` + rich initial presets inSpanish).
  - **NO Multi-page navigation labyrinths** (Single-screen interactive workstation).

## 2. Official 90-Minute Sprint Timeline
- **Minutes 00–10 (Lock "La Ficha del Invento"):** Pick Pavilion (1-4), Problem, and Improbable Ingredient (1-6). Define the exact Input, Core Logic function, and Output.
- **Minutes 10–60 (Build Core MVP Loop):** Build the single-screen app with 3 one-click Demo Presets, the Input form/controls, the pure English calculation/process module, and the dynamic Output panel. Commit milestones to `develop`.
- **Minutes 60–75 (Amplify the Improbable Ingredient & UI Polish):** Make the chosen *Ingrediente Improbable* (Veredicto, Número preciso, Comprobante oficial, Personaje, Ranking, or Botón de emergencia) visually unforgettable.
- **Minutes 75–85 (Official `README.md` & Release to `main`):** Fill out the mandatory Spanish `README.md` template, test from a clean reload, merge `develop` -> `main`, push, and record the final commit SHA.

## 3. Code Explainability for Tuesday's Defense
Because the human author must defend how the code works on Tuesday:
- **Isolate Core Logic in Pure Functions:** Keep the main algorithm/formula inside a clean, well-named file (e.g., `src/logic/inventionEngine.ts`) with brief, crystal-clear English comments explaining the formula/rules so it is effortless to explain live.
- **Parallel Collaboration:** Keep UI components, preset data, and core logic in separate files so team members can push to `develop` without merge conflicts.
