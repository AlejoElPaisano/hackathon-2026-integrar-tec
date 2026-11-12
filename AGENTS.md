# HACKATHON 2026: "LA FERIA DE SOLUCIONES IMPROBABLES" - MASTER AGENT BRIEF

## 0. Mandatory Reading & Execution Context (READ FIRST)
We are competing in a **strict 90-minute hackathon** ("La Feria de Soluciones Improbables").
Before writing any code, generating files, or making commits, you **MUST** read and strictly obey this master brief and the modular rule files inside `rules/`:

1. **`AGENTS.md` (This file):** Hackathon challenge rules ("La Feria de Soluciones Improbables"), Pavilions, Improbable Ingredients, "La Ficha del Invento", 5 Mandatory Prototype Conditions, and the official `README.md` template.
2. **[`rules/github_and_code_rules.md`](rules/github_and_code_rules.md):** Mandatory 100% English internal codebase (variables, functions, file names, comments), `develop` -> `main` branching flow, and Conventional Commits in English.
3. **[`rules/agent_and_team_hackathon_rules.md`](rules/agent_and_team_hackathon_rules.md):** 90-minute sprint timeline, parallel execution without merge conflicts, and code explainability for Tuesday's defense.
4. **[`rules/ui_and_design_system_rules.md`](rules/ui_and_design_system_rules.md):** Instant visual polish, single-screen interactive workspace, and styling guidelines to make the *Ingrediente Improbable* shine.
5. **[`rules/fast_architecture_and_demo_rules.md`](rules/fast_architecture_and_demo_rules.md):** Zero-friction architecture (NO Login, NO complex DB, NO multi-page labyrinth), fail-safe execution, and 1-click Demo Data loader.
6. **[`rules/invention_spec_asado.md`](rules/invention_spec_asado.md):** Official "La Ficha del Invento" for **AFIP del Asado (ARCA-SADO)** (Pavilion 1 + Single Improbable Ingredient #3: *Comprobante oficial*).

### Critical Language Distinction:
- **Internal Code & Git Commits:** 100% in **English** (as defined in `rules/github_and_code_rules.md`).
- **User Interface (UI Copy) & `README.md`:** 100% in **Spanish** (for the live presentation, jury evaluation, and public voting).

---

## 1. What We Are Building (The Challenge)
Our mission is to build a working prototype in 90 minutes that solves a tiny, annoying, absurd, student-related, or exaggerated problem that nobody took seriously before.
**Golden Rule from the Organizers:** *"No queremos promesas, queremos ver tu invento andando."* (One single core function working end-to-end beats five half-baked features).

### What We DO NOT Need (Strict Scope Cut):
- **NO Login / Authentication.**
- **NO Complex Database** (use `localStorage` or in-memory state + rich mock/initial data unless strictly requested).
- **NO Multi-page Labyrinth** (a single, ultra-polished interactive view that works immediately is ideal).

---

## 2. The 4 Decisions & "La Ficha del Invento"
Every valid project in this hackathon is defined by choosing **1 Pavilion**, **1 Problem**, and **1 Improbable Ingredient**:

### A. The 4 Pavilions (Pick 1):
1. **Pabellón 1 - Molestias Cotidianas:** Real, tiny everyday annoyances (e.g., 40 mins deciding what food to order; the same person always making mate; 3 weeks in WhatsApp trying to set a date for the asado; splitting expenses for a group gift; excuses to avoid washing the dishes).
2. **Pabellón 2 - Vida de Estudiante:** Real student struggles with genuinely useful solutions (e.g., calculating the exact grade needed on the next exam to pass; group project task tracker so everyone knows who does what; prioritizing 5 urgent assignments; turning a long prompt/syllabus into concrete actionable steps; testing if 1 hour of study actually worked).
3. **Pabellón 3 - Mundos Inventados:** Administrative/daily headaches for fictional characters (e.g., a dragon managing appointment slots for knights challenging it; a ghost running a complaints office for humans who don't get scared; a superheroine budgeting collateral building damage per fight; a villain organizing their evil agenda; a spaceship crew splitting cleaning chores).
4. **Pabellón 4 - Decisiones Exageradas:** Trivial decisions treated with extreme scientific/committee seriousness (e.g., technical report on quince vs. sweet potato pastafrola; risk analysis of leaving home without an umbrella; supreme court tribunal deciding milanesa with mashed potatoes vs. fries; strategic master plan to pick a series tonight; formal evaluation of sleeping 5 more minutes).

### B. The Improbable Ingredient (MUST Include Exactly 1):
This is the signature twist that makes the prototype memorable during voting:
1. **Veredicto inapelable:** The result is announced like an indisputable judicial sentence or supreme decree.
2. **Número absurdamente preciso:** Displays hyper-specific metrics (e.g., *"73.42% probability of immediate regret"*).
3. **Comprobante oficial:** Generates a downloadable/printable or visually official certificate, diploma, legal act, or ticket with the result.
4. **Personaje que opina:** An opinionated narrator, judge, or mascot comments dynamically on the user's inputs and results.
5. **Puntaje o ranking:** Options or participants end up sorted in a dramatic leaderboard/standings table.
6. **Botón de emergencia:** A prominent button that triggers something drastic (instant alibi, dramatic appeal, self-destruct/reset, or panic mode).

### C. La Ficha del Invento (Spec Sheet):
Before or right as we start coding, ensure these 8 fields are clear:
- **Nombre:** Short, catchy name.
- **Pabellón:** One of the 4 pavilions.
- **Quién:** Specific person or group suffering the problem.
- **Problema:** One direct sentence.
- **Entrada (Input):** What data the user enters or clicks.
- **Proceso (Core Logic):** The single core function (calculates, sorts, raffles, compares, generates).
- **Salida (Output):** What appears on screen.
- **Ingrediente:** Which of the 6 improbable ingredients is featured.

---

## 3. Mandatory Prototype Checklist (5 Conditions to Pass)
Every piece of code you generate must ensure our prototype satisfies all 5 official rules:
- [ ] **1. Receives Input:** The user enters at least one piece of data (text, option, number, slider, or click). Include a "Cargar Ejemplo / Demo" button so it can also be tested in 1 click!
- [ ] **2. Processes It:** The app actively calculates, sorts, raffles, compares, or generates a response based on the input.
- [ ] **3. Outputs Visible Result:** The result renders dynamically on screen and clearly changes according to the input.
- [ ] **4. Highlights the Improbable Ingredient:** The chosen ingredient is visually obvious, interactive, and central to the experience.
- [ ] **5. Testable in 1 Minute (Zero Friction):** Anyone who has never seen the app can understand and use it immediately without instructions. Pre-populate initial/demo state so the screen never looks empty on first render.

---

## 4. Code Quality & Explainability (For Tuesday's Defense)
On exposition day, the author must explain:
1. What each important part of the code does.
2. How it runs and is tested.
3. Which decisions were made by the human vs. suggested by the AI.

**Therefore, write code that is:**
- **Modular & Easy to Read:** Separate core logic/calculations (`src/logic/` or `src/utils/`) from UI components (`src/components/`) clearly, using descriptive English function names.
- **Fail-Safe:** Wrap operations in `try/catch` and validate empty inputs gracefully so the live demo NEVER crashes.
- **Frequent Commits:** Make small, frequent Conventional Commits to `develop` every time a milestone works. At minute 80-85, we merge `develop` into `main` and record the final commit SHA.

---

## 5. Mandatory `README.md` Template (Official Requirement)
Before minute 85, you MUST generate or update the root `README.md` in **Spanish** using this exact official structure required by the hackathon rules:

```markdown
# [Nombre del invento]

**Pabellón:** [Uno de los cuatro]
**Ingrediente improbable:** [El que elegiste]

## El problema
[Quién lo sufre y qué le pasa, en dos o tres oraciones.]

## La solución
[Qué hace tu invento y qué lo vuelve distinto.]

## Cómo probarlo
1. [Paso uno - incluir comandos de instalación/ejecución ej. `npm install && npm run dev`]
2. [Paso dos - qué ingresar en pantalla]
3. [Qué debería verse al final]

## Herramientas de IA utilizadas
[Cuáles usaste y para qué (ej. generación de estructura base, lógica del algoritmo, estilos de interfaz y documentación).]
```

---

## 6. How You (The Agent) Should Act Right Now
1. **If we haven't chosen the idea yet (Minutes 00-10):** Propose 3 ultra-fast, high-impact combinations of *Pabellón + Problema + Ingrediente Improbable* that look amazing in a web app, and fill out "La Ficha del Invento" for the one chosen.
2. **Once the idea is chosen (Minutes 10-60):** Build the working MVP immediately (Input -> Core Process -> Output) with clean, high-impact UI in Spanish and pre-loaded demo presets.
3. **Minutes 60-75:** Amplify the *Ingrediente Improbable* and visual polish.
4. **Minutes 75-85:** Generate the official `README.md`, verify everything runs from scratch, and prepare the final merge to `main` + output the last commit SHA.
