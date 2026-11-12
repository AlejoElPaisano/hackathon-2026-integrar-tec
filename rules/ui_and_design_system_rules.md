# UI & DESIGN SYSTEM RULES - "LA FERIA DE SOLUCIONES IMPROBABLES"

## 1. Core Visual Philosophy (60-Second Testability)
Anyone opening the app must understand what the invention does, test it, and laugh or be impressed **within 60 seconds without instructions**.
- **UI Language:** 100% **Spanish** (labels, buttons, presets, results, error messages, and comedic/technical copy).
- **Single-Screen Interactive Workstation:** Avoid hidden tabs or multi-page routing. Use a split-view or top-to-bottom laboratory/tribunal/dashboard layout where **Input** and **Dynamic Result** are visible together.
- **One-Click Demo Presets (Mandatory):** Always display 3 quick-load chips/buttons above the input (e.g., *"Caso 1: ..."*, *"Caso 2: ..."*, *"Caso Crítico: ..."*) so judges can test the invention with a single click.

## 2. Aesthetic Direction by Pavilion
Match the visual theme immediately to the chosen Pavilion using Tailwind CSS + Lucide Icons:
- **Pabellón 1 (Molestias Cotidianas) & Pabellón 2 (Vida de Estudiante):**
  - Vibrant, ultra-clean modern SaaS / productivity aesthetic (`bg-slate-950` or crisp `bg-slate-50`, bold `indigo`/`emerald` accents, clear progress bars, badges, and interactive sliders).
- **Pabellón 3 (Mundos Inventados):**
  - Thematic, immersive UI chrome (e.g., medieval guild ledger, spectral bureaucracy terminal, or supervillain command center with `violet`/`amber`/`rose` accents and custom status badges).
- **Pabellón 4 (Decisiones Exageradas):**
  - Hyper-serious Scientific Laboratory / Supreme Court Tribunal / NASA Telemetry aesthetic (`font-mono` metrics, official seals, warning stripes, radar/gauge bars, and solemn stamps).

## 3. Designing the 6 "Ingredientes Improbables" (Make It Unforgettable)
Whichever ingredient is chosen MUST have a dedicated, high-impact visual component:
1. **Veredicto inapelable:** Render a dramatic judicial stamp/decree card with a gavel icon, solemn borders (`border-2 border-amber-500`), case number, and an unappealable final sentence banner.
2. **Número absurdamente preciso:** Display giant `tabular-nums font-mono` telemetry counters with 2–4 decimal places (e.g., `87.3419%`), accompanied by pseudo-scientific sub-indexes and confidence intervals.
3. **Comprobante oficial:** Style the output like a real printable/downloadable official document (serial number, QR/barcode visual, official seal, date/time stamp, signature line, and a *"Descargar / Imprimir Acta Oficial"* button using `window.print()` or canvas/HTML export).
4. **Personaje que opina:** Include a prominent avatar/mascot box with dynamic speech bubbles that react in real time as the user changes sliders/inputs, shifting mood/expression based on the values.
5. **Puntaje o ranking:** Render an animated podium / leaderboard table with gold/silver/bronze badges, point breakdowns, and status tags (*"Aprobado"*, *"En Riesgo"*, *"Descartado"*).
6. **Botón de emergencia:** Place a high-contrast industrial panic button (`bg-rose-600 hover:bg-rose-500 animate-pulse` with hazard styling) that triggers an instant dramatic mode change, alibi generator, or emergency protocol overlay.
