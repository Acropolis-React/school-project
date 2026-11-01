# AGENTS.md — Codex project rules for AlgoLab

## Mission

Build **AlgoLab**, a focused Russian-language educational web app for learning and experimentally investigating algorithmic **time complexity (Big O)**. Never prioritize visual spectacle over correctness, clarity and learning outcomes.

## Mandatory context reading

1. **Before any code change, read `architecture.md` first.** Use it to locate modules, ownership boundaries and data flow.
2. Read the relevant sections of `product.md` to understand user goals, MVP scope and acceptance criteria.
3. Inspect the actual repository and involved files before editing. The docs are a specification, **not proof that a described file already exists**.
4. If documentation and implementation diverge, investigate and either restore alignment or propose a targeted docs update; do not silently expand scope.
5. Follow a user's latest explicit request when it overrides an earlier product decision; explain relevant trade-offs.

## Tech and workflow

- Next.js **App Router**, React, TypeScript `strict`, Tailwind CSS, Recharts, pnpm, Biome; deploy to Vercel.
- Project structure: `src/app` for routing, and domain modules under `src/features`, `src/entities`, `src/shared` as defined in `architecture.md`.
- Only use **one** App Router directory: `src/app`. Do not create a top-level `app` folder or a `src/pages`/`pages` router.
- Prefer stable maintained dependencies; add a dependency only when it removes real complexity and fits product scope.
- Follow existing patterns and naming conventions; don't introduce a new architecture or state-management library for a simple task.
- Keep React Server Components as the default for route wrappers and static content. Use `'use client'` only where browser state, charts, storage, events or workers require it.
- Do not access `window`, storage, `Worker` or `performance` during server rendering.
- UI text and all learning content **must be in Russian**; identifiers, code, technical docs and commit messages may be English.

## Product constraints

- No landing page, authentication, database, payments, social features, AI tutor or arbitrary code execution in MVP.
- Implement **real algorithm executions and actual operation counts**, never simulated charts advertised as measured results.
- Always label example/placeholder data clearly and remove placeholders from final core flows.
- Compare algorithms solving the same task on identical seeded data. Explain preconditions (especially sorting for binary search) and metric definitions.
- Count operations separately from uninstrumented runtime benchmarks; provide repetitions and use a median for elapsed time.
- Expensive runs should execute away from the UI thread and support cancellation and safe upper bounds.
- Keep theory correct: empirical data supports hypotheses; it does not formally prove asymptotic bounds.
- Preserve access to the complete learning flow; avoid locking all but the first lesson.
- All exercise feedback must be helpful and must not reveal the answer prematurely.

## UX and design constraints

- Simple, compact, functional layout. No landing-page hero, glassmorphism, excessive shadows, ornamental gradients, complex transitions or fake dashboard widgets.
- Every interactive element must perform an understandable action. No decorative/inert buttons.
- Clearly present units, labels, assumptions and a table alternative for every chart.
- Support desktop and mobile widths, proper form labels, focus visibility, keyboard navigation, sufficient contrast and reduced-motion preferences.
- Reuse existing components and tokens. Avoid duplicated one-off UI patterns.

## Engineering standards

- Keep files small and single-purpose. Domain logic must not live in page components.
- Prefer pure functions and explicit types. No `any` without an unavoidable documented reason.
- Keep imports directed inward: `app → features → entities → shared`. Never import `app` into a feature; never import features into shared/entities.
- Public module APIs should be explicit (e.g. package `index.ts` entry points); avoid deep cross-module imports into internal folders.
- Avoid creating shared abstractions before there is an actual second use; avoid premature FSD ceremony.
- Do not rewrite unrelated code, change the visual design without a request, or modify generated files.
- Do not add dependencies, modify package scripts, or change the architectural boundaries without a concrete reason.
- Treat local persistence as untrusted: validate or version data before use, provide safe defaults.
- Update documentation when changing public features, routes, domain model or module boundaries.

## Testing requirements

- Test real algorithm correctness on empty, singleton, duplicate, sorted and reverse-sorted inputs as relevant.
- Test the counting convention against hand-checkable examples.
- Test deterministic dataset generation, equivalent inputs for comparisons, and binary-search preconditions.
- Test quiz evaluation independently from UI; add UI tests for high-risk interactions where practical.
- Test worker cancellation, invalid messages and boundary sizes as applicable.
- Never interpret a successful typecheck as evidence of scientific correctness.

## Required commands before finishing ANY implementation task

Run these commands **after** the last code change, from the repository root, in this order:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

- Required `package.json` scripts: `lint` = `biome check .`, `typecheck` = `tsc --noEmit`, `test` = `vitest run`, `build` = `next build`.
- During initial scaffolding, create these scripts and install their dependencies first; do not pretend they succeeded if unavailable.
- If a command fails, fix the introduced issue and rerun the relevant checks and the final set.
- If unable to execute a command, explicitly report which command was not run and why. **Never claim unexecuted tests passed.**
- For documentation-only tasks, do not install dependencies just to satisfy checks; execute commands when available and report otherwise.

## Communication / completion format

At the end of each task, report concisely:
1. **Changed:** what functionality or files were changed.
2. **Why:** link the change to a user need or product acceptance criterion.
3. **Validation:** exact command outcomes (`lint`, `typecheck`, `test`, `build`) and any manual checks.
4. **Caveats:** limitations, untested scenarios, or deliberate deviations.

Work in a narrow scope: implement one end-to-end slice and validate it before spreading unfinished UI across many routes. Do not claim a feature is functional if it is only a mockup.
