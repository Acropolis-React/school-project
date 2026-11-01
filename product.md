# AlgoLab — Product Requirements Document

> Status: MVP specification, version 1.0  
> Project type: Grade 10 school software + research project  
> Working title (RU): «Разработка интерактивного веб-приложения для изучения и экспериментального анализа временной сложности алгоритмов»  
> Product language: Russian (all UI, explanations, feedback and exercises)  
> Documentation language: English

## 1. Product summary

**AlgoLab** is a free, browser-based educational lab for understanding the time complexity of algorithms. Learners study short explanations, predict what will happen, run **real computational experiments**, interpret measurements, and solve code-analysis problems.

**Core promise:** Learn to independently determine and explain the Big O time complexity of simple algorithms, rather than memorizing a table of complexities.

The product has two interconnected modes:
1. **Guided learning:** a structured sequence of lessons, each combining theory, hypothesis, experiment and practice.
2. **Free laboratory:** independently configure and compare algorithms, input distributions and input sizes.

This is **not** a marketing landing page, animation showcase, LeetCode clone or general-purpose code-execution service.

## 2. Problem, audience and value

### User problem

Beginners can memorize `O(n)`, `O(log n)` and `O(n²)` without understanding why these growth patterns emerge, how to analyze loops, or why theoretical and observed runtimes differ. Static explanations alone give too little opportunity to test hypotheses and reason from evidence.

### Primary users

- Secondary-school students (roughly grades 8–11) beginning algorithms and Big O.
- Beginning programmers and introductory computer-science students.
- Students preparing for introductory competitive-programming problems.

### Core jobs to be done

- **Learn:** “I want a clear introduction to Big O with working examples.”
- **Test a hypothesis:** “If input size doubles, how will the amount of work change?”
- **Compare:** “How does merge sort differ from bubble sort, and when does it matter?”
- **Practice:** “Can I derive the complexity of an unfamiliar C++ loop on my own?”
- **Return:** “I want to continue my course, retry errors, or compare another algorithm.”

### Value proposition

- Theory becomes observable through authentic measurements.
- Learners actively predict and explain results rather than passively watching an animation.
- Progress persists locally so learners can resume lessons and revisit previous investigations.
- A focused educational instrument with no account requirement or unnecessary UI.

No monetization is planned. “Product/business value” means educational usefulness, repeated voluntary use, and demonstrable learning outcomes—not subscription revenue.

## 3. Product principles (non-negotiable)

1. **Learning before decoration.** Minimal interface; no landing page, parallax, gratuitous motion or gamification.
2. **Real data only.** Never render invented benchmark results as measured data. Examples and placeholders must be labeled.
3. **Prediction before reveal.** In guided experiments, collect a learner hypothesis before showing results when pedagogically relevant.
4. **Explain the why.** Every chart must have context, measurement definition and an interpretation prompt.
5. **Theory and experiment are different.** Timings and finite samples cannot prove Big O mathematically; they support hypotheses that are justified through code analysis.
6. **Beginner-first language.** Russian, concise copy, defined terminology, concrete C++ code examples.
7. **No sign-in required.** The MVP works completely in a browser; saving is local.
8. **Small, finished scope.** Prefer five correctly instrumented algorithms and six polished lessons over many untested features.

## 4. Information architecture and routes

| Route | Screen | Purpose |
|---|---|---|
| `/` | Redirect to `/learn` | Start using the app immediately; no promotional landing page |
| `/learn` | Learning overview | Lesson list, progress, continue button |
| `/learn/[slug]` | Guided lesson | Theory → prediction → experiment → interpretation → exercises |
| `/lab` | Free lab | Compare algorithms on real datasets and interpret graphs |
| `/progress` | Progress and history | Learned topics, exercise results, locally saved experiments |

Shared shell: compact header with **AlgoLab** name and 3 navigation items: **Обучение**, **Лаборатория**, **Прогресс**. Keep navigation accessible on mobile. No sidebar is mandatory.

## 5. User journeys

### Journey A — first-time learner

1. Visit `/`; land on `/learn` with “Начать обучение” and a clear lesson list.
2. Open lesson 1 (no registration).
3. Read short, chunked theory and annotated C++ examples.
4. State a prediction (e.g. what happens to comparisons if `n` doubles).
5. Run the experiment using real algorithm implementations; chart and table show observations.
6. Explain the trend or answer a conceptual question.
7. Solve 2–3 simple tasks that test understanding of code complexity.
8. See feedback and sources of error. Progress is saved locally, with an obvious next lesson.

### Journey B — returning learner

1. Visit `/learn`; “Продолжить” takes the learner to the last incomplete lesson.
2. Review a mistaken question and try again, or start the next lesson.
3. Optionally inspect `/progress` for milestones and recent experiments.

### Journey C — independent investigation

1. Visit `/lab` directly.
2. Select **compatible** algorithms (same problem), input distribution, sample sizes and desired metric.
3. Run the experiment; view chart, numeric results and a concise methodological note.
4. Toggle between comparison counts and runtime, inspect input assumptions and optionally save the experiment.
5. Open the relevant lesson when additional explanation is needed.

## 6. Guided curriculum (MVP: six lessons)

All six lessons must share one consistent content model and provide: (a) small theory section, (b) code or reasoning example, (c) prediction, (d) relevant empirical experiment, (e) 2–3 practice questions, (f) answer explanations. Content should be substantial but not a textbook chapter.

| Order | Working lesson slug | Key learning objective | Suggested evidence/experiment |
|---|---|---|---|
| 1 | `what-is-big-o` | Define `n`, basic operations, asymptotic growth and bounds | Compare operation-count curves for simple linear vs quadratic examples |
| 2 | `linear-and-quadratic` | Derive `O(1)`, `O(n)` and `O(n²)` for consecutive and nested loops | Compare how operation counts change as `n` doubles |
| 3 | `logarithmic` | Explain halving and `O(log n)` | Measure linear vs binary search on a sorted array |
| 4 | `n-log-n` | Understand `O(n log n)` with divide-and-conquer | Bubble sort vs merge sort on identical inputs |
| 5 | `input-cases` | Distinguish best, typical and worst cases; explain data effects | Insertion sort on sorted, random, reverse-sorted arrays |
| 6 | `analyze-code` | Analyze unfamiliar short C++ code and distinguish evidence from proof | Mixed code-analysis questions and a final investigative exercise |

Important content distinctions:
- Big O denotes an **asymptotic upper bound**. If teaching common tight growth classes colloquially, explain the distinction from Theta (`Θ`) at an accessible level; avoid falsely claiming that experiments determine a unique mathematical Big O bound.
- A nested loop does not *always* imply `O(n²)`; iteration bounds must be inspected.
- Runtime is not identical to step count; constant factors and the browser environment matter.
- An algorithm with `O(n log n)` may be slower on small `n` than an `O(n²)` one.
- Binary search requires sorted input; comparing it to linear search on arbitrary unsorted input is invalid.

### Exercise types (MVP)

- Predict growth after doubling `n` (multiple choice; answer can be approximate).
- Determine complexity of short **read-only, trusted C++ snippets** (`O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)`).
- Interpret an experimental table or graph and give a reasoned answer.
- Identify hidden assumptions or mistakes (e.g. binary search on an unsorted array).

No execution of arbitrary user-provided code. No full online judge, automatic free-text grading or AI tutor in MVP.

## 7. Free laboratory requirements

### Controls

- Problem family: `sorting` or `search` (must not compare different task families directly).
- Algorithms: two or more per family where possible; single-algorithm inspection is permitted.
- Dataset distribution (sorting): random, already sorted, reverse sorted. Use seeded deterministic generation.
- Array sizes: a bounded sequence (e.g. `50, 100, 250, 500, 1000, 2500, 5000`); avoid heavy `O(n²)` work above a safe cap.
- Metrics: **element comparisons** (primary for cross-algorithm comparisons within a family) and **elapsed time** (secondary). Consider recording writes separately for sorting, never silently combining unlike operations.
- Run, cancel, retry and reset.

### First supported algorithm set

- Sorting: `bubbleSort`, `insertionSort`, `mergeSort`.
- Search: `linearSearch`, `binarySearch`.
- Additional simple constant/linear/quadratic functions can be used as *trusted educational examples*, not necessarily public lab choices.

Potential post-MVP additions: quicksort, two-sum brute-force vs hash map (with distinct metrics clearly defined), more dataset types.

### Outputs

- Line chart of measurement vs input size with axes, units, legend and accessible data table.
- Table including algorithm, `n`, counted comparisons, measured duration, and repetition metadata.
- User-friendly explanation of selected algorithm(s), assumptions and theoretical expected growth.
- Explain that measured duration may be noisy; surface the number of repetitions.
- Save a **bounded summary** of a completed experiment to local storage. Allow reopen and delete.
- Present loading/progress, cancellation and meaningful error states.

### Measurement integrity and methodology

- Execute actual algorithm implementations against generated input arrays, not `n²`/`n log n` formula outputs masquerading as experiments.
- Generate datasets deterministically using an explicit seed, and give **identical source data** to algorithms compared at the same `n` and trial (clone before mutation).
- Compare algorithms only if input preconditions and output semantics are equivalent. For binary search, datasets **must be sorted** and target-choice rules consistent. Clearly explain that any preprocessing/sorting cost is excluded from the benchmark unless a separate end-to-end scenario explicitly includes it.
- Instrument comparison counts with a precisely defined shared counting convention; verify counts in tests.
- Prefer **separate executions** for comparison-count instrumentation and runtime measurement, since counting overhead changes elapsed time.
- Benchmark in a Web Worker when supported so the UI stays responsive. Use bounded input sizes, repetition counts and cancellation to avoid long hangs.
- For time measurements, use `performance.now()`, warm-up runs when appropriate, several repeated measurements and the **median**; describe device/browser dependencies.
- Exclude data generation, graph rendering and UI updates from algorithm timing.
- Avoid precise claims about asymptotic complexity based only on finite benchmark curves.
- Do not conflate a sample's median measured time with a worst-case complexity bound.

## 8. Progress and persistence

MVP uses local browser persistence; no user account or cloud sync.

Store (versioned schema):
- Lesson completion and latest viewed lesson.
- Exercise attempts and latest/success states (not just a global points counter).
- Recent saved experiments: metadata, seed, algorithm IDs, input configuration, results, timestamp and measurement schema version.

Storage expectations:
- Gracefully handle missing/blocked/corrupted local storage.
- Enforce a modest retention limit for experiments and avoid storing raw large arrays.
- Explicitly communicate that data is saved **in this browser**, not synced across devices.
- Provide a way to clear locally stored learning data with confirmation.

## 9. Interaction, content and visual design

- Language: **Russian throughout the product** (UI, lessons, tooltips, validation, exercise feedback).
- A minimal, practical, developer-tool visual identity: off-white/white canvas, dark readable text, one restrained accent, distinct accessible chart colors.
- Clear hierarchy and compact navigation; no promotional landing, hero animation, parallax or decorative gradients.
- Reuse an accessible component set and tokens; consistent spacing, typography and border radii.
- Mobile support: controls wrap/stack, chart has responsive dimensions and a usable data-table alternative.
- Graphs cannot be the only representation of results; include labeled tables and text interpretation.
- Keyboard-friendly forms, accessible labels, visible focus, semantic landmarks, adequate contrast and reduced-motion compliance.
- Code samples use C++ first because this product targets beginner algorithms/competitive programming. Their language is clearly labeled.
- Avoid giving away exercise answers before submission; explain errors after the attempt.

## 10. Functional acceptance criteria

1. A newcomer can begin lesson 1 without login, reach a real experiment and finish practice.
2. Completing or partially finishing a lesson survives page refresh/reopening on the same browser.
3. Guided experiments require a hypothesis before revealing results when the lesson specifies it.
4. The lab compares bubble/insertion/merge using the **same arrays** for each `n` and trial; inputs are deterministic for the same seed.
5. Sorting algorithms return correctly sorted results, and binary search behaves correctly on sorted inputs and missing values.
6. Measured comparison counts come from actual execution and are validated on small hand-checkable arrays.
7. Time measurement uses repeated runs (median); there are no fake data points represented as real benchmarks.
8. A long running experiment can be cancelled; the UI stays usable, and experiment errors do not crash the app.
9. An attempt to compare incompatible algorithms is prevented or guided into a compatible experiment.
10. Every lesson has an independent competency check, not just a “read” completion switch.
11. Local progress survives refresh. If P1 experiment saving is implemented, saved experiments can be reopened and removed; corrupted storage never breaks boot.
12. Production build deploys to Vercel and core flows work without any server credentials.

## 11. Outcome measures (for evaluation, not fabricated targets)

- **Learning:** pre-/post-test on comparable tasks assessing ability to determine and explain complexity. Report sample size, test difficulty, average/median change, limitations and avoid claiming causation without adequate design.
- **Task completion:** can a learner finish one full lesson without external instructions?
- **Comprehension:** can a learner explain why a chosen graph shape is plausible and why a finite graph is not a proof?
- **Reliability:** algorithm test pass rate; experiment completion without freezes; reproducible datasets.
- **Return usefulness:** can learners resume an unfinished lesson and repeat old exercises without rebuilding context?

## 12. Priorities

### P0 — ship first

- Responsive app shell and three sections.
- Real measurement engine and five algorithms.
- Free lab with reproducible experiments, count chart, timing chart and result table.
- Six guided lessons with theory, hypotheses, appropriate experiments and questions.
- Exercise feedback and persistent lesson progress.
- Error/loading/cancel states and automated correctness tests.

### P1 — after P0 is reliable

- Saved experiments and history (the `/progress` view must still exist without history).
- “Identify the unknown complexity” challenge built from real generated results.
- Retry incorrectly answered questions; clearer progress analytics.

### P2 — nice-to-have

- CSV export, optional report generation.
- Additional algorithms or alternate content language.
- Data export/import between browsers.

### Non-goals / prohibited scope creep

- Authentication, payments, database, social feeds, streaks, leaderboard, notification spam.
- Arbitrary execution of submitted C++/JS code.
- Heavy algorithm-step animations, complex custom visualization engines.
- Full online judge, personalized AI tutoring, server-side benchmarking.
- Backend/API work without explicit new product requirements.

## 13. Delivery milestones

**M0 — Foundation:** Next.js + TypeScript + pnpm + Tailwind + Biome, App Router shell, routes, reusable design tokens, local deployment readiness.

**M1 — Scientific engine:** deterministic generators, algorithm implementations, counting conventions, worker protocol, reliable timing, cancellation, unit tests.

**M2 — Free lab:** controls, responsive results chart/table, states and notes. Verify against actual measured results.

**M3 — Vertical slice:** one *complete* guided lesson from theory through hypothesis, lab and graded exercises; persistence tested.

**M4 — Curriculum:** remaining five lessons using the same authoring schema; progress view; accessibility checks.

**M5 — Quality and research:** tests, build, live Vercel deployment, prepare pre/post learning evaluation and project-defense demonstration.

Do not start M4 until M3 is genuinely usable. Keep `architecture.md` in sync with any intentional architectural change.

## 14. Definition of done for the school project

A learner can complete the course, independently classify the complexity of simple C++ algorithms, explain empirical growth trends, and operate the laboratory to investigate equivalent algorithms. Results are genuinely measured, limitations are disclosed, and the product works publicly on Vercel without a login.

---

**Single-sentence decision test:** Does this change help a beginner **understand, investigate or independently analyze Big O**? If not, it is probably outside MVP scope.
