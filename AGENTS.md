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

## Component composition pattern

- Keep route files in `src/app` as thin adapters to `views`; a view should only compose the corresponding page widget and pass route data when needed.
- Create one page-specific slice in `src/widgets/<page>-page` for every screen. Put the screen's independent UI sections in its `ui` folder and expose only the page widget through the slice `index.ts`.
- Keep state and event coordination in the page widget, and extract visual sections into focused child components with explicit typed props. Do not define child components inside another component.
- Move a component to `src/shared/ui` only when it is domain-independent and reused by multiple page widgets. Page-specific components must remain inside their widget slice.
- Import other slices through their public `index.ts`; use relative imports only inside the same slice. Preserve the FSD dependency direction and do not import one widget slice from another.
- Keep each source file focused and normally below 300 lines. If a TSX file approaches 300 lines, split it by meaningful UI sections instead of hiding complexity in generic abstractions.
- Do not mix domain formulas, lesson content, answer evaluation or persistence validation into presentation components; keep existing logic in `entities` and `features`.

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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
