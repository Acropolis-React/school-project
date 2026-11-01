# AlgoLab — Codex Instructions

## Read before making changes

1. Read **`product.md`** for product goals, UX, educational content, scope and acceptance criteria.
2. Read **`architecture.md`** for source layout, adapted FSD import rules, models and technical requirements.
3. Inspect the existing repository, package scripts and affected modules before editing. The repo already exists with an initial commit: **do not reinitialize it** or replace the project scaffolding without explicit permission.
4. If documents conflict, report the conflict and follow the latest explicit user instruction; do not silently restore older Web Worker or benchmarking requirements.

## Non-negotiable MVP scope

- Next.js App Router uses **`src/app`**. Do not move it or add a competing router.
- Follow adapted **Feature-Sliced Design**: `src/providers`, `src/views`, `src/widgets`, `src/features`, `src/entities`, `src/shared`.
- Use **deterministic theoretical simulations** for initial complexity charts. Never label simulated values as measured execution times or real operation counts.
- **Do not implement Web Workers, real benchmarks, backend, authentication or database in MVP**, unless the user explicitly changes scope.
- Product UI and educational content must be in **Russian**; code, file names and developer documentation can use English.
- Prefer small useful features and a fully working learning flow over decorative screens or scaffolding every planned directory.

## Architecture and engineering

- Keep `src/app` route files thin; page compositions belong in `views`.
- Global providers belong in `providers`, large reusable sections in `widgets`, user actions in `features`, business models and pure simulation/lesson logic in `entities`, generic utilities in `shared`.
- Only import down the FSD hierarchy; avoid cross-slice imports at the same level. Use public `index.ts` APIs across slices; avoid cycles.
- Keep TypeScript strict; avoid `any`, unclear implicit casts and unvalidated persisted data.
- Keep formulas, exercise scoring and lesson definitions separate from UI components.
- Use Server Components by default; apply `"use client"` at the smallest necessary interactive boundary.
- Do not create empty placeholder components, premature abstractions or duplicate source-of-truth files.
- Preserve existing user changes. Don't reset/rebase commits, perform unrelated refactors or force destructive git commands.

## UX and educational correctness

- No marketing landing page. `/` leads to learning; primary navigation: Learn, Lab, Progress.
- Minimal, restrained UI. Avoid excessive animation, gradients, giant empty sections and visual clutter.
- Charts must show axes, labels, units/meaning, legends and accessible result tables when needed.
- Make clear that plots are **theoretical models**, not actual algorithm runs.
- Explain algorithm assumptions and avoid misleading Big O statements (e.g. binary search requires sorted input; nested loops need not be quadratic).
- Give user feedback for correct and incorrect answers; avoid revealing correct answers before submission.

## Implementation discipline

1. Identify the smallest complete user-facing outcome for the task.
2. Implement the needed entities and pure logic first, then manually verify the behavior.
3. Compose features/widgets/views, keeping FSD boundaries correct.
4. Check empty, loading, invalid and responsive states where relevant.
5. Update `architecture.md` when the actual architecture changes, and `product.md` only when scope or requirements change.
6. Do not claim functionality exists unless it is implemented and verified.

## Mandatory validation before completing work

Run from the repository root:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

If validation scripts are missing, add and configure `lint`, `typecheck`, and `build` as appropriate to the agreed tech stack; if an environment/tooling problem prevents execution, state precisely which command was not run or failed and why. Do not falsely report success. Manually verify calculations, answer evaluation, storage validation, key interactions, and responsive behavior. Automated unit testing is outside the current MVP scope.

## Final response format

Briefly report:
- What changed and which routes/features work.
- Architectural decisions or deviations.
- Validation commands and their actual outcomes.
- Remaining limitations or next meaningful milestone.

Do not overstate simulated complexity charts as scientific measurements.
