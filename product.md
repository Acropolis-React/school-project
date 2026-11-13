# AlgoLab — Product Requirements Document

> Status: MVP specification · Language of the product: Russian · Documentation: English  
> School project topic: «Разработка интерактивного веб-приложения для изучения и экспериментального анализа временной сложности алгоритмов».  
> See `architecture.md` for implementation and `AGENTS.md` for Codex execution rules.

## 1. Product vision

**AlgoLab** is a minimalist educational web application that teaches learners to **understand, determine, and explain Big O complexity**, not simply memorize formulas. Its core learning cycle is **Learn → Predict → Explore → Explain → Practice**.

The laboratory provides two clearly separated sources: **deterministic theoretical simulations** for growth models and **instrumented TypeScript execution** for exact operation counts. Neither source reports execution time. Never describe mathematical plots as measured benchmarks or engine counts as elapsed-time benchmarks.

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

Open `/lab`, choose a theoretical comparison or an instrumented operation-count experiment, configure inputs, inspect the chart/table and assumptions, then optionally save a titled research record with a hypothesis and conclusion. No course step is required.

## 4. Main navigation and UX

| Route | User purpose |
| --- | --- |
| `/` | Educational home dashboard: continue learning, course progress and lab shortcut |
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

**Theoretical source:** functions `1`, `log₂(n)`, `n`, `n·log₂(n)`, and `n²` for positive `n`, optionally with documented scaling for illustration. These are **not real elapsed times or counted operations**.

**Experimental source:** the trusted TypeScript engine executes linear search, binary search, bubble sort, insertion sort, and merge sort on bounded seeded inputs. It reports exact comparisons, swaps, array reads/writes, or the documented total. Counts describe these implementations and are not milliseconds.

**Controls:** choose a source and family, one or more comparable algorithms, a bounded input-size range, point count, input distribution, operation metric, and reproducible seed. Search experiments can also choose target placement. Binary search requires sorted input.

**Examples:** Bubble Sort / Insertion Sort / Merge Sort (sorting), Linear Search / Binary Search (search). Algorithm cards describe use, assumptions, relevant theoretical growth and best/average/worst-case distinctions where needed. For model comparisons, label what each curve represents; do not fabricate data-distribution-dependent benchmark results. A choice of random/sorted/reversed input may be omitted until a defensible model or real execution supports it.

**Outputs:** interactive chart, exact table, interpretation, stated assumptions, and an explicit provenance badge. Saved research includes a custom title, configuration, optional hypothesis/conclusion, editing, and reproducible reopening; timestamps describe record changes, not algorithm timing.

The theoretical and instrumented providers share the same laboratory presentation contract, so charts and tables do not duplicate data-source logic. Repeated elapsed-time measurement and Web Workers remain later options only if a real research or responsiveness need justifies them.

## 8. Progress and persistence

- Store last visited lesson/step, completed lessons, exercise outcomes, and optionally saved simulation configurations/results.
- Local browser storage only; no account or syncing.
- Handle empty, invalid and outdated persisted values, and offer deletion/reset.
- Keep storage bounded and do not save huge generated arrays.
- Be transparent that progress is stored in the current browser only.

## 9. Priorities and scope

**P0:** usable app layout; curriculum navigation; one end-to-end lesson then six lessons; pure model generator; free lab with real interactive inputs, correctly labeled theoretical charts/tables; deterministic exercise checking; local lesson progress; accessible, responsive experience.

**P1:** saved research records; review of mistakes; deeper unknown-algorithm classification exercises; polishing progress reports.

**P2:** CSV/PDF export, more algorithm families, and optional elapsed-time measurement.

**Out of scope for the current UI:** authentication, backend/API/database, arbitrary user code, Web Workers, elapsed-time benchmarking, generated fake timings, marketing landing pages, elaborate animation and gamification.

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
11. Instrumented experiments reproduce the same exact counts from the same configuration and seed, without presenting counts as time.
12. Version 1 saved explorations remain available after migration and can be edited as version 2 research records.

## 11. School research and evaluation

**Project goal:** build an interactive tool for learning and explaining asymptotic time complexity.

**Research hypothesis:** combining theory, model-based exploration and practical exercises may improve understanding compared with theory-only learning. Assess using pre-/post-tests with comparable questions, report sample size, method and limitations; never invent an educational effect.

**Methodological limitation:** theoretical charts remain mathematical models. Instrumented charts execute trusted implementations and report exact counts under a declared counting model, but do not measure elapsed time or generalize to every implementation or device.

## 12. Delivery milestones

M0 — Existing repository setup, routing, adapted FSD, validation scripts, minimal shell.  
M1 — Typed models and deterministic model functions with manual checks of calculations and edge cases.  
M2 — `/lab` configuration, model charts, tables and explanation.  
M3 — First complete theory → prediction → visualization → practice lesson.  
M4 — Remaining lessons using the same lesson engine.  
M5 — Progress/history, polish, accessibility and Vercel deployment.  
M6a (implemented foundation) — Trusted instrumented algorithms, explicit counting rules, seeded inputs and safe synchronous limits.
M6b (implemented) — Integrate exact operation counts and reproducible research records into the laboratory.
M6c (optional, later) — Add elapsed-time experiments only with proper methodology.

The product is successful when a learner can **independently determine and explain** the Big O of simple unfamiliar code, and use visual models appropriately without confusing them with measured performance.
