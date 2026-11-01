# AlgoLab — Technical Architecture

> Target architecture / initial blueprint. This document describes **intended** modules, not necessarily files that already exist. Keep it updated as implementation evolves.

## 1. Technology decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (current stable), **App Router** | Easy deployment on Vercel; well-defined routes and component boundaries |
| Frontend | React, TypeScript (`strict`) | Typed UI and domain logic |
| Styling | Tailwind CSS (current supported release) | Fast, consistent utility styling and responsive design |
| Charts | Recharts | Accessible chart + separate tabular representation |
| UI primitives | Small in-project components | Avoid a full heavyweight design-system dependency |
| Package manager | pnpm | Reproducible workspace and scripts |
| Lint / format | Biome | Fast consistent checks; `pnpm lint` |
| Testing | Vitest + Testing Library as needed | Tests for algorithms, benchmark helpers, lesson state, UI interactions |
| Worker | Browser Web Worker | Keep expensive algorithms off the main UI thread |
| Persistence | Local storage (versioned and validated) | No authentication/backend required in MVP |
| Hosting | Vercel | Simple Next.js deployment |

No backend, API routes or database is planned for MVP. The product can run without credentials or secrets. Use standard Vercel **Next.js deployment** first; do not force `output: 'export'` unless there is a specific need for static hosting and all routes are verified compatible. Static-only rendering is an architectural goal but not a requirement for Vercel.

Pin actual dependency versions in `pnpm-lock.yaml` once initialized. Use only stable versions supported by each other, rather than assuming versions in this blueprint are current.

## 2. Canonical directory structure

**Use `src/app`, never root `app`. Never introduce a folder named `src/pages` or `pages`, even as a generic UI module.** That name conflicts with Next.js routing conventions in mixed setups.

```text
algolab/
├── AGENTS.md
├── architecture.md
├── product.md
├── README.md
├── biome.json
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── public/
│   └── ...static-assets
└── src/
    ├── app/                         # Next.js App Router ONLY
    │   ├── layout.tsx               # Global shell, fonts, metadata
    │   ├── globals.css              # Global tokens and Tailwind
    │   ├── page.tsx                 # Redirect to /learn
    │   ├── learn/
    │   │   ├── page.tsx             # Curriculum overview
    │   │   └── [slug]/page.tsx      # One lesson by slug
    │   ├── lab/page.tsx             # Free lab page
    │   └── progress/page.tsx        # Learning progress and saved runs
    ├── features/                    # User-facing flows / interactions
    │   ├── guided-learning/
    │   │   ├── ui/                  # Lesson runner and steps
    │   │   ├── model/               # Lesson progression logic
    │   │   └── index.ts
    │   ├── experiment-lab/
    │   │   ├── ui/                  # Configuration, charts, table
    │   │   ├── model/               # Experiment state and orchestration
    │   │   └── index.ts
    │   ├── exercise-checker/
    │   │   ├── ui/                  # Questions and feedback
    │   │   ├── model/               # Pure answer evaluation
    │   │   └── index.ts
    │   └── progress-tracking/
    │       ├── ui/
    │       ├── model/               # Persistence facade / selectors
    │       └── index.ts
    ├── entities/                    # Domain concepts, no feature imports
    │   ├── algorithm/
    │   │   ├── model/               # Algorithm metadata, registry, types
    │   │   ├── lib/                 # Pure reference implementations
    │   │   └── index.ts
    │   ├── benchmark/
    │   │   ├── model/               # Config, results, worker protocol
    │   │   ├── lib/                 # Data generators, statistics, validation
    │   │   ├── ui/                  # Shared domain-specific result display
    │   │   ├── worker/              # Worker entry and execution helpers
    │   │   └── index.ts
    │   └── lesson/
    │       ├── model/               # Lesson, step, exercise types
    │       ├── content/             # All six Russian lesson definitions
    │       └── index.ts
    └── shared/
        ├── ui/                      # Button, Input, Card, Tabs, etc.
        ├── lib/                     # Generic utilities; no domain coupling
        ├── hooks/                   # Truly generic client hooks
        ├── config/                  # Storage schema version, limits, tokens
        └── types/                   # Generic shared types, if genuinely shared
```

The structure is intentionally **FSD-inspired, not strict ceremony**. Create directories as code is needed, not all placeholder files upfront. Keep feature internals private and expose stable functions/components through `index.ts` when used across modules.

### Import direction

```text
src/app  ─────→ src/features ─────→ src/entities ─────→ src/shared
    │                                  │
    └──────────────────────────────────┘
```

- `app`: routes, layouts and composition; no algorithms or benchmark logic.
- `features`: use-case orchestration and UI. May import domain entities and shared modules.
- `entities`: algorithm implementations, benchmark schemas, lesson content; must not import features.
- `shared`: generic presentation/utils, must not import domain modules.
- Avoid feature-to-feature dependencies and cycles. If guided lessons and the free lab need the same result view or experiment controls, extract reusable domain-specific display into `entities/benchmark/ui` (or generic controls into `shared/ui`) and compose them at the appropriate level; do not make `guided-learning` import `experiment-lab`.

## 3. Runtime boundaries and data flow

Next.js renders routes and static content; interactive lesson/lab components are Client Components. Benchmark execution happens in a browser Web Worker.

```text
Learner (browser)
       │
       ▼
App Router page / Client Component
       │
       ├── Guided-learning flow ──→ Lesson registry and question evaluation
       │                                  │
       │                                  └──→ Progress persistence (browser)
       │
       └── Experiment-lab UI
                  │ run(config)
                  ▼
          Experiment orchestrator
                  │ typed messages
                  ▼
            Web Worker
                  │
                  ├── seeded dataset generator
                  ├── clone equivalent inputs per algorithm
                  ├── algorithm correctness validation
                  ├── instrumented comparison-count trials
                  └── separately timed repeated trials
                  │
                  ▼
          Typed results / errors
                  │
                  ▼
          chart + accessible table + interpretation
```

### Worker integration

- Worker code must not import React/UI/Next server modules.
- Prefer TypeScript module worker built from a URL that the Next.js bundler actually supports. **Verify `next dev` and `next build`**, including deployment; do not assume a Web Worker integration works without testing.
- Define a discriminated union for worker messages: `run`, `progress`, `result`, `error`, `cancel` (and optionally `ready`). Include `requestId` to ignore stale messages.
- Cancellation must be robust: a worker occupied by synchronous CPU work may not process a queued cancel message until the loop ends. Prefer **terminating the active worker** on cancel and spawning a fresh one when needed, or cooperative chunking with explicit yielding. Always clean up workers on unmount.
- Enforce reasonable `n`, trial-count and total-work limits before worker dispatch and inside worker handling.
- Workers are client-only; instantiate from a user action or client effect, never at module top level during SSR.

## 4. Domain models (illustrative interfaces)

These are contracts to implement, refine and test, **not claims of existing types**.

```ts
export type ProblemFamily = "sorting" | "search";
export type InputDistribution = "random" | "sorted" | "reversed";
export type ExperimentMetric = "comparisons" | "timeMs";

export interface AlgorithmDefinition {
  id: string;
  titleRu: string;
  family: ProblemFamily;
  expectedComplexity: string; // presentation only; never a fake benchmark formula
  requiresSortedInput?: boolean;
  descriptionRu: string;
}

export interface ExperimentConfig {
  algorithmIds: string[];
  family: ProblemFamily;
  inputDistribution: InputDistribution;
  sizes: number[];
  seed: number;
  repetitions: number;
  targetPolicy?: "present" | "missing"; // search only
}

export interface Measurement {
  algorithmId: string;
  inputSize: number;
  comparisons: number;    // explicitly defined count, not time
  medianTimeMs: number;  // median of valid timing repetitions
  repetitions: number;
}

export interface ExperimentResult {
  schemaVersion: number;
  config: ExperimentConfig;
  measurements: Measurement[];
  measuredAt: string;
  environmentNoteRu: string;
}

export type ExerciseKind = "complexity-choice" | "growth-prediction" | "interpretation";

export interface Exercise {
  id: string;
  kind: ExerciseKind;
  promptRu: string;
  optionsRu: Array<{ value: string; label: string }>;
  correctValue: string;
  explanationRu: string;
  codeCpp?: string;
}

export interface LessonDefinition {
  id: string;
  slug: string;
  titleRu: string;
  order: number;
  /** Typed ordered theory, hypothesis, experiment and quiz steps. */
  steps: LessonStep[];
}
```

`LessonStep` should be a discriminated union created when implementing the first fully functional lesson. Keep lesson content structured, not hardcoded directly into `page.tsx`. Store pure answer evaluation separately from React components.

## 5. Algorithm and measurement rules

### Algorithm ownership

- `entities/algorithm/lib`: reference implementations and instrumented variants or injected counters, with correctness tests.
- `entities/algorithm/model`: registry provides **metadata, allowed family, preconditions and intended complexity**, not synthetic data.
- `entities/benchmark/lib`: seeded generator, input cloning, validity checks, median/statistics, bounds.
- `entities/benchmark/worker`: execution only; returns typed results; should not hold UI state.

### Primary metric: element comparisons

Use a clearly documented convention **within each family**. For sorting, count comparisons between array elements used to determine ordering. For search, count comparisons between candidate elements and target values. Avoid describing the result as a universal CPU instruction count. Record assignments/writes separately if needed; do not compare unlike metrics silently.

Count-specific runs and time-specific runs should be separate, so instrumentation does not distort the primary runtime results. Use small manually verifiable arrays in unit tests; actual counts may depend on algorithm details and data distributions.

### Timing protocol

For each `n`, algorithm and repetition:
1. Generate a fixed input for that `n` and trial using a seeded PRNG; share the source data across compared algorithms.
2. Clone input before any in-place algorithm mutates it.
3. Validate output correctness (sorted output, valid search index or `-1` as appropriate).
4. Warm up timing code as appropriate.
5. Measure **algorithm execution only** with `performance.now()`; exclude input construction and UI rendering.
6. Collect several repeated time values and calculate a median.
7. Present count series and median-time series separately, including labels/units.

Exact data generation, target policy and repeat/aggregation policy must be recorded in result metadata. Never display hardcoded curves as actual measurements. Web runtime results are environment-sensitive; experiment reproducibility refers to **input generation and protocol**, not identical milliseconds on all devices.

### Guardrails

- Use bounded and validated sizes, especially for quadratic algorithms.
- Handle long tasks with cancellation, runtime limit and helpful user feedback.
- Keep raw large input arrays out of saved results.
- No user-submitted code execution; all algorithms are trusted, compiled application code.
- Do not fit Big O classes automatically in MVP and claim certainty. Display theoretical complexity separately from observations.

## 6. Lesson engine

A lesson is structured data containing an ordered sequence of typed steps. Suggested step types:

```ts
type LessonStep =
  | { type: "theory"; id: string; titleRu: string; body: StructuredTheory }
  | { type: "hypothesis"; id: string; question: Exercise }
  | { type: "experiment"; id: string; preset: ExperimentConfig; guidanceRu: string }
  | { type: "reflection"; id: string; question: Exercise }
  | { type: "quiz"; id: string; exercises: Exercise[] };
```

This is pseudocontract: design `StructuredTheory` as simple safe local content (plain text/paragraphs/code samples); avoid adding MDX/remote CMS until necessary.

- The lesson runner reads by slug, validates step ordering, tracks progress, supports back/next and prevents accidental answer reveal before submission.
- Experiments in lessons reuse the **same engine and UI primitives** as the free lab, but load a preset and include a learning prompt.
- Users may revisit previous lessons; do not globally lock routes.
- Completion requires some demonstration of understanding, not merely viewing content.
- Quiz data is bundled with the app; answer checker is pure, independently testable logic.

## 7. State and persistence

- Keep transient UI state (selected algorithms, field edits, worker lifecycle) near the owning feature via React state/hooks.
- Avoid global Zustand/Redux by default; introduce a store only if meaningful cross-route state becomes complex.
- Persist progress/results through a single explicit `progress-tracking` facade; do not scatter direct `localStorage` calls across components.
- Prefer versioned JSON records with parsing/validation and graceful migrations/defaults.
- No browser persistence access during SSR. Hydrate client-only state after mount and avoid hydration mismatch.
- Impose a limit on saved runs (for example 20–50) and keep data small. Provide delete/clear actions.
- Persistence in MVP is local to the current browser/profile; it is not an account.

## 8. Styling and accessibility

- Neutral surface palette, clear typography (e.g. Inter or system UI), restrained accent, consistent spacing and modest border radii.
- Build a compact layout first; no decorative landing screen.
- Reusable components in `shared/ui` should have accessible focus and semantic markup.
- All charts have axes, units, legend and a **separate usable table**; important insights must also exist as text.
- Responsive controls and data tables must work on small screens (scrolling tables is acceptable if labeled).
- Respect `prefers-reduced-motion`; default to no complex animation.

## 9. Package scripts and tests

Intended scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "format": "biome check --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Use co-located `*.test.ts` / `*.test.tsx` where sensible. Minimum tests:

1. Sorting output correctness over edge cases, duplicates and distributions.
2. Linear/binary search results on sorted datasets, existing and missing targets.
3. Operation count on hand-checkable small inputs.
4. Seeded generation reproducibility and fair comparison input equivalence.
5. Statistics / median computation, bound validation and invalid config rejection.
6. Pure answer evaluation and lesson progression.
7. Browser worker cancellation/progress integration in a testable harness or manual smoke test when automation is impractical.
8. Route smoke test: `/learn`, `/learn/<slug>`, `/lab`, `/progress`.

Note: Worker integration and chart behavior must also be manually checked in a real browser; unit tests alone do not guarantee bundler compatibility.

Before finishing a task, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, as mandated in `AGENTS.md`, and report any failures honestly.

## 10. Deployment and operating model

- Deploy the Git repository to **Vercel** using its Next.js framework preset.
- The app requires no backend env vars, API keys or database in MVP.
- Run production build locally before deployment; smoke-test worker execution and client persistence on the deployed app.
- Ensure chart/browser-only modules are isolated behind client boundaries.
- Maintain `README.md` with commands, lesson list, measurement methodology, limitations and deployment link (when known).
- Do not assume build success means algorithms are correct or lab data scientifically sound.

## 11. Implementation order / anti-overengineering checklist

1. Scaffold Next.js in `src/app` and establish repo scripts.
2. Build the pure algorithm registry + validated deterministic benchmark engine and tests.
3. Integrate Web Worker, cancellation and actual measured results; smoke-test dev/build.
4. Build `/lab` with controls, chart, table and methodological notes.
5. Build **one complete lesson**, including hypothesis, experiment, answer checking and persistence.
6. Extract stable reusable lesson primitives and add remaining five lessons.
7. Complete `/progress` and optional saved experiments.
8. Test responsive/accessibility behavior, deploy to Vercel and conduct educational evaluation.

**Do not** implement six separate visually complete but nonfunctional lesson pages before the core experiment engine exists. The architecture is successful only when the main learning journey works from start to finish.
