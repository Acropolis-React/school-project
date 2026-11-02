# AlgoLab — Architecture

> **Status:** Target architecture for an existing initialized repository. Do not reinitialize the project, rewrite its history, or move the existing `src/app` directory.
>
> **Source of product requirements:** `product.md`. This file defines technical boundaries and implementation rules. The initial MVP uses explicitly labeled theoretical simulations; see `product.md` for requirements and `AGENTS.md` for Codex rules.

## 1. Technology and scope

| Area | Decision |
| --- | --- |
| Framework | Next.js App Router (`src/app`) |
| Language | TypeScript (strict mode) |
| UI | React, Tailwind CSS |
| Charts | Recharts |
| Architecture | Feature-Sliced Design (adapted naming for Next.js) |
| Package manager | pnpm |
| Validation | Biome (`pnpm lint`), TypeScript (`pnpm typecheck`), production build (`pnpm build`) |
| Initial data source | Typed deterministic simulation fixtures |
| Persistence | Browser localStorage for learning progress |
| Deployment | Vercel |

The initial milestone is a **working educational UI**, with guided lessons, exercises, a laboratory interface, and charts using clearly labeled simulated data. No dedicated backend, database, authentication, Web Worker, arbitrary code execution, or server-side benchmarking is required in this milestone.

The long-term learning goal remains understanding Big O through theory, hypotheses, practical tasks, and (eventually) actual computation. Simulated numbers are **not empirical measurements** and must never be represented as such.

## 2. Adapted FSD layers

Next.js already owns `src/app` for App Router, so do **not** create an additional FSD app layer. Rename the usual FSD page layer to `views`, and put global providers and configuration in `providers`.

```text
src/app          Next.js App Router: route entry points, layouts, metadata
src/providers    Global providers, global styles, application setup
src/views        FSD page-level composition (equivalent to FSD pages)
src/widgets      Large reusable compositional UI blocks
src/features     User actions and use cases
src/entities     Domain models, domain content, domain presentation
src/shared       Domain-independent utilities and UI primitives
```

`src/app` and `src/providers` are application composition boundaries, not ordinary domain slices. They may import `views`, `widgets`, `features`, `entities`, and `shared`. Other layers must never import from `app` or `providers`.

**Allowed dependencies among sliced layers:**

```text
views → widgets → features → entities → shared
```

A higher layer can also directly import *any* lower layer; intermediate imports are not required. Never import upward. Do not directly import between separate slices of the same layer. Within one slice, internal imports are permitted.

The naming is intentionally adapted FSD; do not attempt to install a second router or create `src/pages`, `src/_pages`, `src/_app`, or a root-level `app` directory.

## 3. Target file structure

```text
algolab/
├── public/
├── src/
│   ├── app/                              # Next.js App Router, keep existing location
│   │   ├── layout.tsx                    # Uses providers / global styles
│   │   ├── page.tsx                      # Thin adapter -> views/home dashboard
│   │   ├── learn/
│   │   │   ├── page.tsx                  # Thin adapter -> views/learn
│   │   │   └── [slug]/page.tsx           # Thin adapter -> views/lesson
│   │   ├── lab/page.tsx                  # Thin adapter -> views/lab
│   │   └── progress/page.tsx             # Thin adapter -> views/progress
│   ├── providers/
│   │   ├── ui/                            # Global client providers only when required
│   │   └── styles/globals.css             # Global Tailwind styles/theme
│   ├── views/
│   │   ├── home/                         # Returning learner dashboard
│   │   ├── learn/
│   │   │   ├── ui/learn-view.tsx
│   │   │   └── index.ts
│   │   ├── lesson/
│   │   │   ├── ui/lesson-view.tsx
│   │   │   └── index.ts
│   │   ├── lab/
│   │   │   ├── ui/lab-view.tsx
│   │   │   └── index.ts
│   │   └── progress/
│   │       ├── ui/progress-view.tsx
│   │       └── index.ts
│   ├── widgets/
│   │   ├── app-shell/                     # Global application frame/navigation
│   │   ├── home-page/                     # Page-specific home sections
│   │   ├── learn-page/                    # Course list and progress heading
│   │   ├── lesson-page/                   # Lesson runner sections
│   │   ├── lab-page/                      # Lab settings, chart and results
│   │   └── progress-page/                 # Progress states and sections
│   ├── features/
│   │   ├── configure-experiment/
│   │   │   ├── model/
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   ├── run-experiment/
│   │   │   ├── model/                     # Interface to experiment data provider
│   │   │   ├── lib/                       # Mock-backed implementation for MVP
│   │   │   └── index.ts
│   │   ├── answer-exercise/
│   │   │   ├── lib/                       # Pure answer validation
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   └── track-lesson-progress/
│   │       ├── model/
│   │       └── index.ts
│   ├── entities/
│   │   ├── algorithm/
│   │   │   ├── model/                     # IDs, metadata, complexity and limitations
│   │   │   └── index.ts
│   │   ├── experiment/
│   │   │   ├── model/                     # Config, result, series and status types
│   │   │   ├── lib/                       # Typed simulated datasets
│   │   │   ├── ui/                        # Charts/results if domain-reusable
│   │   │   └── index.ts
│   │   ├── lesson/
│   │   │   ├── model/                     # Lesson/exercise schemas
│   │   │   ├── content/                   # Russian educational content
│   │   │   └── index.ts
│   │   └── learning-progress/
│   │       ├── model/
│   │       ├── lib/                       # Versioned local persistence
│   │       └── index.ts
│   └── shared/
│       ├── ui/                            # Generic accessible controls
│       ├── lib/                           # Generic helpers/storage utilities
│       ├── config/                        # Shared application constants
│       └── types/
├── AGENTS.md
├── architecture.md
├── product.md
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

This is a **responsibility map**, not a command to create all directories at once. Create folders and `index.ts` public APIs only when functionality exists. Keep the repository's already working configuration and existing conventions where compatible.

### Layer responsibilities

- **`app`:** Route declarations, Next.js layouts, metadata, error/loading boundaries; thin imports of `views`. No algorithm or exercise logic.
- **`providers`:** Global providers, global CSS, app initialization. Avoid global state unless necessary.
- **`views`:** Thin route-level adapters that compose the corresponding page widget and pass route data when required.
- **`widgets`:** One page-specific slice per screen plus global composition widgets. Independent screen sections live in the page slice; widget slices never import one another.
- **`features`:** User interactions such as configuring experiments, requesting results, submitting answers, updating progress.
- **`entities`:** Algorithms, experiments, lessons, exercises and progress as domain concepts; schemas, fixed data, domain-specific UI.
- **`shared`:** Accessible, domain-independent components reused across page widgets, plus formatting utilities, generic storage helpers and design tokens.

Each slice should expose a public API via `index.ts`. Import other slices through their public APIs rather than deep paths; inside a slice, relative imports are allowed. Keep source files focused and normally below 300 lines, splitting large TSX files by meaningful UI sections. Configure alias `@/*` to point at `src/*` if not already configured.

## 4. Runtime behavior — MVP

```text
User selects lesson or opens laboratory
          ↓
Next.js route (src/app)
          ↓
FSD view (src/views)
          ↓
Feature interaction (configure/run/answer)
          ↓
Typed experiment data source (simulated for MVP)
          ↓
Recharts plot + tabular data + educational explanation
          ↓
Optional local progress update
```

### Experiment data source

Define an interface / function contract independent of implementation, for example:

```ts
type ExperimentConfig = {
  algorithmIds: string[];
  datasetKind: "random" | "sorted" | "reversed";
  minSize: number;
  maxSize: number;
  samples: number;
  metric: "operations" | "time";
};

type ExperimentPoint = {
  inputSize: number;
  value: number;
};

type ExperimentSeries = {
  algorithmId: string;
  points: ExperimentPoint[];
};

type ExperimentResult = {
  source: "simulation" | "measurement";
  metric: "operations" | "time";
  series: ExperimentSeries[];
};
```

These are conceptual shapes; refine them only when a real implementation requires it. The view should not know whether results come from simulated data or from a future benchmarking engine. Keep data-provider decisions in `features/run-experiment`, and typed experiment data/models in `entities/experiment`.

**Simulation rules:**

1. Start with deterministic, internally consistent data shaped by known growth functions, e.g. `n`, `n * log2(n)`, and `n * n`. The coefficient/scaling is illustrative, not a measured hardware constant.
2. Honor the selected algorithms, metric, data distribution, input-size range and sample count when those controls are exposed; otherwise explicitly disable or hide unsupported controls.
3. Do not generate a visually convincing but arbitrary curve disconnected from selected controls. Avoid random noise unless deliberately and reproducibly modeled.
4. Clearly label plots and exports **«Демонстрационные данные»** or **«Модельные значения»**. State that this is a mathematical illustration, not a benchmark of the user's device.
5. Never claim real runtime, operation counts, repetitions, device comparisons, or statistically observed performance when values are synthetic.
6. For the MVP, prefer modeled **relative operations / abstract units**. Do not present synthetic milliseconds as real latency; a time metric should be marked as estimated/model-based or disabled until implemented.
7. Lessons may use illustrative examples, but distinguish theoretical upper bounds, exact instrumented counts, and model curves. Big O characterizes asymptotic growth, not a guarantee about exact measured timing.

This approach enables frontend validation without premature worker/benchmarking complexity. **Before claiming the project experimentally measured real algorithms**, implement and validate a genuine measurement mode.

### Future real-measurement phase (not MVP)

The data-provider contract must allow a later implementation that executes trusted TypeScript algorithms, counts explicitly defined operations, and measures actual elapsed time. Begin with bounded, synchronous browser execution for small safe inputs if adequate; add a dedicated Web Worker only when expensive runs or responsiveness require it. Preserve the same chart and lesson UI. Use seeded identical inputs for fair comparisons, repetitions for time measurements, correctness checks, input constraints and a cancellation mechanism.

Do not create Web Worker files, messaging protocols, RPC wrappers, fake progress bars, or complex concurrency orchestration now.

## 5. Lessons and exercises

- Lesson content is **Russian-language structured data** under `entities/lesson/content`, not hard-coded repeated page JSX.
- Use a reusable lesson renderer: introduction, concise theory, code examples, prediction, experiment, explanation, and 2–3 practice questions.
- C++ code snippets are read-only learning examples; compiling/executing user code is out of scope.
- Answer evaluation uses pure functions that can be verified independently; show explanations after a response. Do not present a multiple-choice guess as a mathematical proof.
- An experiment embedded in a lesson should reuse the same configuration/result contracts as the free laboratory.
- Keep lessons and free laboratory connected but usable independently.

## 6. Progress persistence

- Save completion state and answered-exercise outcomes in localStorage; do not require login.
- Access browser-only APIs exclusively from client-side code.
- Use a versioned schema/key, validate parsed payloads and recover gracefully from corrupted or missing data.
- Do not treat progress saved in localStorage as portable across devices.
- Avoid persisting huge charts or input arrays; save compact settings and results only if history is explicitly implemented.

## 7. UI / UX rules

- Russian-only user-facing interface and course content.
- The first useful screen should be reachable immediately; **no marketing landing page**.
- Keep the UI neutral, responsive, accessible, and restrained: clear typography, compact navigation, simple cards, functional charts.
- No decorative motion, fake dashboards, unnecessary gradients, intrusive modals, gamification streaks, or artificial onboarding.
- Charts need labels, units, meaningful legends, a corresponding results table, and explicit synthetic/real provenance.
- Preserve keyboard navigation, focus visibility, reasonable contrasts, and empty/error states.
- Prefer Server Components for static route composition and the narrowest possible Client Components for interactive controls or localStorage.

## 8. Manual verification and completion criteria

At minimum verify:

- Every route resolves without errors and navigation works.
- Each supported lesson renders and exercises validate answers correctly.
- Experiment configuration changes cause appropriate deterministic series updates.
- Invalid sizes/empty selections are handled rather than producing broken charts.
- No chart claims simulated data are measured data.
- Progress survives reload and malformed localStorage data does not crash the app.
- Mobile and desktop layouts remain usable.

Before declaring a coding task complete, run `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Manually verify the relevant functionality and responsive layouts. Report any commands or checks that could not run. Do not claim successful validation without actually performing it. Automated unit testing is outside the current MVP scope.

## 9. Development order

1. Inspect existing repository and preserve initialization/commits.
2. Establish adapted FSD folders and route adapters in the existing `src/app`.
3. Implement shared minimal UI and navigation.
4. Implement typed algorithm metadata, lesson content schema and one complete lesson.
5. Implement the mock-backed experiment contract and functional lab charts/table with transparent labeling.
6. Connect experiments inside lessons, exercises and progress persistence.
7. Complete the planned lesson set, manually verify behavior, refine UX and deploy to Vercel.
8. **Later, optional:** replace simulation with actual instrumented execution; only add Web Workers if they solve demonstrated responsiveness problems.

When a task conflicts with the target tree, favor **minimal modifications to the actual repo** rather than wholesale restructuring. Keep `product.md` and `AGENTS.md` aligned with the MVP simulation decision when those files are next edited.
