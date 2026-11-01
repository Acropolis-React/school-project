# AlgoLab — Product Requirements Document

> Status: MVP specification · Language of the product: Russian · Documentation: English  
> School project topic: «Разработка интерактивного веб-приложения для изучения и экспериментального анализа временной сложности алгоритмов».  
> See `architecture.md` for implementation and `AGENTS.md` for Codex execution rules.

## 1. Product vision

**AlgoLab** is a minimalist educational web application that teaches learners to **understand, determine, and explain Big O complexity**, not simply memorize formulas. Its core learning cycle is **Learn → Predict → Explore → Explain → Practice**.

The MVP uses **deterministic, clearly labeled theoretical simulations** to illustrate algorithmic growth. It does **not** measure real execution times or operation counts. Real computational benchmarking can be introduced later if the project needs to substantiate its experimental-analysis title. Never describe mathematical plots as measured benchmarks.

AlgoLab is not a landing page, LeetCode alternative, animated sorting playground, or arbitrary-code execution service.

## 2. User problem, audience and value

**Audience:** school pupils (especially grades 8–11), beginners in algorithms, early university students, and informatics olympiad beginners.

**Problem:** Learners can memorize `O(n²)` or `O(log n)` but often cannot explain where it comes from, analyze new code, predict growth, or distinguish theory from observed running time.

**Value:** A short, structured course connects explanations and C++ code examples to interactive model-based experiments and immediate practice feedback. A free lab supports independent exploration outside the course.

**Why return:** continue the curriculum, revisit mistakes, explore an algorithm encountered elsewhere, and compare growth classes with adjustable inputs. Do not add streaks, daily rewards, leaderboards or engagement gimmicks.

## 3. Product experience and user flows

### First-time learner

1. Open `/learn` directly; no sign-up or marketing landing page.
2. Select a lesson (the first is suggested, but lessons are not locked).
3. Read concise theory and a small annotated C++ snippet.
4. Predict what will happen when input size grows.
5. Explore an interactive **model visualization**, with a visible simulation disclosure.
6. Interpret the curve and answer 2–3 practice questions.
7. See explanations, save progress locally, and continue to the next lesson.

### Returning learner

Open `/learn`, continue the last lesson, revisit wrong answers, or open `/progress` to view completed lessons and saved work.

### Free laboratory

Open `/lab`, select comparable algorithms / growth models, configure input range, view theoretical curves and data table, understand assumptions, optionally save the configuration and results. No course step is required.

## 4. Main navigation and UX

| Route | User purpose |
| --- | --- |
| `/` | Redirect to `/learn` |
| `/learn` | Curriculum and continue-learning entry |
| `/learn/[slug]` | Structured lesson with exercise steps |
| `/lab` | Free complexity laboratory |
| `/progress` | Local progress and saved explorations |

The UI must be restrained and useful: compact navigation, clear typography, neutral colors and one accent, helpful empty/loading/error states, responsive layout, accessible controls, no heavy animation or decorative landing page. **All user-facing text is in Russian.** Graphs need labeled axes, units, legends, and a corresponding data table or accessible equivalent.

## 5. Six-lesson MVP curriculum

Each lesson follows the same configurable lesson runner, not a separate hand-built page. The components are short theory, code/reasoning example, prediction, simulation, interpretation and practice.

| # | Slug | Learning outcome | Model activity |
| --- | --- | --- | --- |
| 1 | `what-is-big-o` | Explain `n`, basic operations, asymptotic behavior and Big O | Compare linear and quadratic curves |
| 2 | `linear-and-quadratic` | Analyze sequential and nested loops; `O(1)`, `O(n)`, `O(n²)` | Predict doubling effects |
| 3 | `logarithmic` | Understand repeated halving and binary search preconditions | Compare linear / logarithmic growth |
| 4 | `n-log-n` | Understand `n log n`, contrast sorting approaches | Compare `n²` vs `n log n` curves |
| 5 | `input-cases` | Recognize best, average and worst cases and why input matters | Compare explicitly explained model scenarios |
| 6 | `analyze-code` | Derive complexity from unfamiliar short C++ snippets | Mixed exercises + final assessment |

**Important accuracy rules:** Big O is an asymptotic upper bound, not an exact operation count; explain when a bound is not tight. `Θ` is a tight bound, when appropriate. Nested loops are not always quadratic; inspect loop bounds. Binary search assumes sorted input. Theoretical complexity does not imply identical runtime for all implementations. Simulations illustrate growth but cannot prove the exact complexity of an unknown algorithm.

## 6. Exercises and feedback

MVP exercise kinds:

- Multiple-choice complexity classification of trusted, read-only C++ snippets.
- Predicting approximate growth when `n` doubles.
- Interpreting a graph/table and choosing an explanation.
- Identifying invalid assumptions, such as binary search on an unsorted array.

Answers are evaluated by deterministic pure functions, with a meaningful explanation after submission. Allow retry. Lesson completion must require submitting key checks, not only navigating through content. No arbitrary C++ execution, AI grading, full online judge, or remote content management system.

## 7. Laboratory behavior

**MVP visualization source:** theoretical functions `1`, `log₂(n)`, `n`, `n·log₂(n)`, and `n²` for positive `n`, optionally with documented scaling for illustration. These are **not real elapsed times or counted operations**.

**Controls:** choose a family (sorting or search), one or more comparable algorithms, select a bounded input-size range and point count, change views/metrics only when their meaning is supported. Include reasonable, explained presets.

**Examples:** Bubble Sort / Insertion Sort / Merge Sort (sorting), Linear Search / Binary Search (search). Algorithm cards describe use, assumptions, relevant theoretical growth and best/average/worst-case distinctions where needed. For model comparisons, label what each curve represents; do not fabricate data-distribution-dependent benchmark results. A choice of random/sorted/reversed input may be omitted until a defensible model or real execution supports it.

**Outputs:** interactive chart, table, brief interpretation, stated formula/assumptions, clear badge or text such as «Теоретическая модель · не реальные измерения». Saving and reopening experiments is P1; do not mislabel the creation timestamp as a measurement timestamp.

**Later (not MVP):** a real benchmark engine, actual instrumented algorithm runs, input generation, repeated timing, validation, Web Workers if truly necessary. The educational laboratory must be structured to swap data sources without redoing charts.

## 8. Progress and persistence

- Store last visited lesson/step, completed lessons, exercise outcomes, and optionally saved simulation configurations/results.
- Local browser storage only; no account or syncing.
- Handle empty, invalid and outdated persisted values, and offer deletion/reset.
- Keep storage bounded and do not save huge generated arrays.
- Be transparent that progress is stored in the current browser only.

## 9. Priorities and scope

**P0:** usable app layout; curriculum navigation; one end-to-end lesson then six lessons; pure model generator; free lab with real interactive inputs, correctly labeled theoretical charts/tables; deterministic exercise checking; local lesson progress; accessible, responsive experience.

**P1:** saved explorations; review of mistakes; deeper unknown-algorithm classification exercises; polishing progress reports.

**P2:** CSV/PDF export, more algorithm families, optional real-measurement mode.

**Out of scope for MVP:** authentication, backend/API/database, arbitrary user code, Web Workers, real execution benchmarking, generated fake timings, marketing landing pages, elaborate animation and gamification.

## 10. Acceptance criteria

1. A new visitor can learn without registration and reach a working lesson within one click from `/learn`.
2. At least one end-to-end lesson is built and manually verified before expanding to all six.
3. A user can change valid lab settings and see consistent data, chart and explanation updates.
4. The same configuration always generates the same model points.
5. All charts explicitly distinguish theoretical simulation from real measurement.
6. A user can answer a C++ complexity question and obtain accurate feedback.
7. Progress persists after refresh within the same browser.
8. Wrong inputs and corrupted stored data fail gracefully.
9. Every section works on desktop and mobile and keyboard interaction is possible.
10. `pnpm lint`, `pnpm typecheck`, and `pnpm build` succeed (or blockers are documented honestly); key user flows are manually verified.

## 11. School research and evaluation

**Project goal:** build an interactive tool for learning and explaining asymptotic time complexity.

**Research hypothesis:** combining theory, model-based exploration and practical exercises may improve understanding compared with theory-only learning. Assess using pre-/post-tests with comparable questions, report sample size, method and limitations; never invent an educational effect.

**Methodological limitation:** MVP charts visualize mathematical complexity models and are not empirical benchmark measurements. To substantiate claims of *experimental analysis of actual algorithms*, implement and document a real-measurement module before final school evaluation, or adjust the project title/claims to emphasize *interactive modeling of algorithmic complexity*.

## 12. Delivery milestones

M0 — Existing repository setup, routing, adapted FSD, validation scripts, minimal shell.  
M1 — Typed models and deterministic model functions with manual checks of calculations and edge cases.  
M2 — `/lab` configuration, model charts, tables and explanation.  
M3 — First complete theory → prediction → visualization → practice lesson.  
M4 — Remaining lessons using the same lesson engine.  
M5 — Progress/history, polish, accessibility and Vercel deployment.  
M6 (optional, later) — Real computational experiments with proper methodology.

The product is successful when a learner can **independently determine and explain** the Big O of simple unfamiliar code, and use visual models appropriately without confusing them with measured performance.
