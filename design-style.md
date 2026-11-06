# AlgoLab — Design Style

This document is the visual and UX source of truth for AlgoLab. It describes the implemented product, not an aspirational redesign. Product-facing copy remains in Russian; this document is in English for contributors.

## 1. Design Philosophy

AlgoLab is a focused learning workspace, not a marketing site or a gamified dashboard. Its personality is calm, technical and direct: the interface should help a learner read, predict, compare and explain algorithmic growth without decorative competition.

Composition follows four principles:

1. **Learning before decoration.** Theory, assumptions, controls, plots and feedback are always the visual priorities.
2. **Purposeful structure over indiscriminate minimalism.** Use alignment, rules, type and spacing for hierarchy, and use a panel when it strengthens grouping, discoverability or interaction clarity.
3. **One controlled accent.** Mint identifies progress, selection and primary actions. It is not ambient decoration.
4. **Measured density.** Lessons stay readable; the laboratory stays information-dense. Empty space must separate ideas, not simulate luxury.

## 2. Visual Identity

### Color palette

The implemented dark palette is defined in `src/providers/styles/globals.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--app` | `#0d1117` | Main page background and dark controls |
| `--sidebar` | `#10161e` | Desktop sidebar and mobile navigation |
| `--surface` | `#151c25` | Purposeful grouped surfaces, charts and primary learning panel |
| `--surface-raised` | `#1a2430` | Selected/raised controls and table headings |
| `--surface-hover` | `#202c39` | Hover feedback only |
| `--track` | `#2a3645` | Progress tracks |
| `--border` | `#26303d` | Quiet dividers and structural rules |
| `--border-strong` | `#344152` | Interactive control boundaries |
| `--text-primary` | `#e6edf3` | Main content and headings |
| `--text-secondary` | `#9aa9ba` | Explanations and supporting copy |
| `--text-muted` | `#718096` | Metadata and tertiary labels |
| `--accent` | `#4cc9a6` | Primary action, progress and selection |
| `--accent-hover` | `#62d7b6` | Primary hover state |
| `--error` | `#f87171` | Incorrect input and answer feedback |
| `--warning` | `#fbbf24` | Educational cautions and chart series |

Do not introduce generic purple/blue gradients, glowing fields or unrelated ambient color washes. A restrained mint-tinted surface or gradient may distinguish a primary functional panel when it remains inside the established palette. Semantic chart colors may differ from the UI accent when they are required to distinguish data series.

### Typography

- Primary typeface: Geist Sans via `next/font` with Cyrillic and Latin subsets.
- Technical notation and numeric readouts: Geist Mono.
- Page titles: approximately `28px` on small screens and `34px` on larger screens, bold, tight tracking, compact line height.
- Home title: approximately `28px` mobile and `36px` desktop; it may be larger because it orients the learner.
- Section titles: usually `18–20px`, semibold.
- Body copy: `14–16px`, with `24–28px` line height depending on reading length.
- Labels and metadata: `12–14px`; uppercase is limited to short contextual labels such as “Начать обучение”.
- Paragraph measure is normally limited to roughly `42–48rem`. Long explanatory text must not run the full width of the laboratory.

Headings use balanced wrapping and paragraphs use pretty wrapping. Avoid assigning the same scale and weight to every heading: page, section, label and metadata levels must remain visibly distinct.

### Radius rules

- Buttons and form controls: `8px` (`rounded-lg`) by default.
- Major functional panels: `12px` (`rounded-xl`) when the radius helps identify a coherent task surface.
- Dense list/navigation items: `2–6px`; the radius supports focus and hover states, not a card aesthetic.
- Code blocks and chart internals may use `8px` when clipping content requires it.
- Progress tracks and status dots may be fully rounded because their geometry communicates function.
- Open page sections are not rounded by default; meaningful cards and dashboard widgets may be.

### Spacing principles

Use the Tailwind spacing scale already present in the product. Typical relationships are:

- `8–12px` between a label and its supporting text or control.
- `16–24px` inside functional panels.
- `24–32px` between related sections.
- `40px` between major home-dashboard regions.
- Page gutters: `16px` mobile, `24px` tablet, `40px` desktop.

Spacing must follow content relationships. Do not apply one vertical padding value to every section.

### Containers, borders and surfaces

- Main content max-width: `1220px`.
- Lesson content max-width: `896px` (`max-w-4xl`).
- Borders are one-pixel structural rules. Full borders are appropriate for settings, charts, tables, code, primary actions, dashboard widgets and useful empty states.
- Open sections use top/bottom rules or column dividers when a surrounding panel would not improve comprehension.
- Major functional cards may use low-contrast shadows to separate them from the app background. Shadows must remain subtle and consistent; they are not decoration by themselves.
- Glassmorphism is not used. Sticky mobile chrome uses an opaque background.

### Surface styling rules

- Avoid strong inner glow, inset lighting and radial bloom inside panels.
- Prefer contrast, spacing and one-pixel borders over decorative illumination.
- Use shadows sparingly and only when they improve separation; keep their blur, spread and opacity restrained.
- Highlighted surfaces may use the established accent in a border or small functional detail, but must not look illuminated from within.

### Iconography

Lucide icons use a restrained `1.8–2.2px` stroke. Keep icons for navigation, direction, status and recognizable actions. Do not add a decorative icon above every heading, card or empty state. An icon that simply repeats adjacent text should be removed.

### Motion

Motion is limited to color/state transitions, progress-width updates, smooth lesson navigation and meaningful loading feedback. No scroll reveals, floating decoration, hover scaling or glow animation. `prefers-reduced-motion` disables non-essential durations and smooth scrolling.

### Dark UI quality rules

- Premium dark UI should feel solid, controlled and intentional.
- Do not simulate depth through excessive lighting, broad haze or oversized soft shadows.
- Avoid the generic AI-style combination of blur, colored glow and radial bloom.
- Preserve richness through hierarchy, edge definition and material contrast rather than luminous effects.

## 3. Layout and Composition Rules

- Use open lists for curricula, progress histories and other scan-heavy repeated content.
- Use grids only when columns express a real relationship: for example, experiment settings beside the resulting chart, or course progress beside a laboratory shortcut.
- The home screen uses deliberate asymmetry: course progress receives more width than the secondary laboratory entry.
- The laboratory is denser than lesson pages because controls and results must remain visible as a working system.
- Establish section hierarchy with type scale, rules, alignment and spacing before adding a surface.
- Preserve negative space around a primary task; do not fill it with badges, fake statistics or decorative widgets.
- Vary rhythm according to the task: compact navigation, readable lessons, dense tables, and a stronger pause before major home sections.
- Asymmetry is appropriate only when importance or workflow is asymmetric. Random offsets and irregular card shapes are prohibited.

## 4. Anti-AI Design Patterns — Mandatory Rules

These rules prevent default template behavior. They are not blanket bans; any exception needs a product, usability or compositional rationale. They never take priority over the UX and visual-integrity rules below.

1. No repetitive three-card layouts without a content-driven reason.
2. No unnecessary cards or nested card containers.
3. No default centered hero template.
4. No decorative gradients or glows without brand justification.
5. No arbitrary glassmorphism.
6. No repetitive spacing applied indiscriminately.
7. No meaningless animations or excessive hover effects.
8. No icons used purely as visual filler.
9. No generic marketing copy.
10. No fabricated metrics or decorative charts.
11. No random asymmetry introduced just to appear unique.
12. No unnecessary redesign of established, effective components.
13. No sacrificing UX or accessibility for aesthetics.
14. No visual components without a clear functional or compositional purpose.

Additional project constraint: theoretical complexity plots must always be described as models, never as measured runtimes or real operation counts.

## 5. UX and Visual Integrity — Non-Negotiable Rules

1. Never remove UI components solely to achieve minimalism.
2. Primary and secondary actions must have clear visual affordances.
3. Text-only actions are reserved for appropriate low-emphasis contexts.
4. Never replace meaningful interactive components with plain text.
5. Never sacrifice usability to eliminate an AI design pattern.
6. Keep a purposeful hierarchy of primary, secondary and tertiary actions.
7. Preserve useful visual complexity when it improves comprehension.
8. Design refinement should improve composition, not simply reduce styling.
9. Existing high-quality components should be preserved.
10. Every removed component must have a clear UX or design justification.
11. Anti-AI design guidelines must never override accessibility, functionality or product requirements.
12. Visual simplicity is a possible outcome, not the default objective.

These rules govern all future audits and refactors. A card, icon, border, shadow, gradient or animation is evaluated by its role and execution—not removed because it belongs to a broad visual category.

## 6. Component Design Guidelines

### Buttons

- Primary buttons use mint fill and dark text for the single strongest action in a region.
- Secondary buttons use a raised neutral surface and strong border.
- Ghost buttons are for tertiary navigation and genuinely low-emphasis actions in open layouts. They must not replace primary or secondary controls.
- Default radius is `8px`; minimum height is `44px`; icons are optional and must clarify direction or action.
- Buttons need intentional fill or border, sufficient padding, and distinct hover, focus-visible, active and disabled states.
- Do not place two equally strong primary buttons side by side.
- Primary buttons must remain clearly identifiable as controls through solid fill, contrast, shape and spacing.
- Primary actions use restrained emphasis, never a large colored glow or soft luminous shadow.
- Hover states should use a precise color or border shift with, at most, a short neutral shadow; they must not feel flashy.

### Cards and panels

- A full panel is justified for the continue-learning task, experiment settings, charts, data tables and code.
- Course and progress lists may remain open, while secondary shortcuts, empty states and data-management sections use panels when the panel improves discoverability or protects an action.
- Avoid a card inside a card. Internal grouping uses dividers and spacing.
- Do not flatten a functional card into a heading and paragraph unless the resulting structure is demonstrably clearer.

### Inputs and forms

- Inputs use the app background, a strong border, `6–8px` radius and a visible mint focus outline.
- Labels are always visible. Help text explains meaning or constraints, not obvious mechanics.
- Validation appears next to the affected form region and uses semantic error color and `role="alert"` when appropriate.
- Checkbox/radio controls remain native and keyboard-operable.

### Navigation

- Desktop uses a persistent 232px sidebar; mobile uses a fixed four-item bottom navigation.
- Active desktop items use a restrained filled surface plus mint icon/rule treatment; mobile items may use a compact mint-tinted selected background.
- Mobile top chrome is compact and may use a subtle backdrop blur to preserve separation while scrolling. Navigation labels remain visible.

### Modals and dropdowns

- No modal is currently required. Future modals must be reserved for focused decisions that cannot safely occur inline, with focus trapping, Escape handling and return focus.
- Prefer native selects for compact, accessible option sets. Custom dropdowns require a concrete interaction need and complete keyboard behavior.

### Tables

- Tables are for exact model values and comparisons, not layout.
- Use quiet row rules, aligned numeric columns, a descriptive caption and horizontal scrolling on narrow screens.
- Keep the graph and table labels consistent.

### Charts

- Every chart needs axes, labels, units/meaning, series identification and an accessible table or equivalent.
- The theoretical-model disclosure must be visible near the chart.
- Use color to distinguish series, but never rely on color alone for the surrounding explanation.
- Do not add charts that do not support a learning decision.

### Empty states

- Empty states use a purposeful panel with clear next-step copy and one visually recognizable action.
- A restrained semantic icon may reinforce the state; it must not replace explanatory copy.
- Never invent data to avoid showing an empty state.

### Loading and error states

- Loading placeholders match the approximate occupied region and use restrained pulsing that respects reduced-motion preferences.
- Errors state what is wrong and what the learner can do next. Preserve entered data whenever possible.
- Success and answer feedback must be textual as well as colored.

## 7. Responsive Design

- Mobile breakpoint behavior begins from a single readable column with `16px` gutters and fixed bottom navigation.
- At tablet widths, increase gutters and line length before adding columns.
- Desktop introduces the sidebar and task-driven columns; do not create columns merely because space exists.
- Laboratory settings stack above the chart until the `xl` layout can support a 340px control rail without compressing the graph.
- Data tables scroll horizontally rather than shrinking labels into illegibility.
- Buttons may become full-width on mobile when they are the primary continuation action. Secondary actions retain visible button treatment; only tertiary text actions should collapse to content width.
- Responsive adaptation must reconsider priority: keep headings, task controls and feedback visible before supporting detail. Avoid blindly stacking decorative blocks.
- Validate at representative widths near 390px, 768px and 1440px, including overflow, keyboard focus and fixed-navigation clearance.

## 8. Design Review Checklist

Before completing any UI-related task, verify:

- [ ] Does the interface resemble a generic AI-generated template?
- [ ] Is every decorative element necessary?
- [ ] Is the composition appropriate for the content and task?
- [ ] Is every card container justified?
- [ ] Do all primary and secondary actions look unmistakably interactive?
- [ ] Has any useful component been flattened or removed without a UX justification?
- [ ] Does the page retain enough visual structure to support scanning and comprehension?
- [ ] Is the information hierarchy immediately understandable?
- [ ] Are typography and spacing deliberate rather than uniform defaults?
- [ ] Is the design consistent with the rest of the application?
- [ ] Are empty, loading, error, success, selected, hover and focus states covered where relevant?
- [ ] Is the interface responsive and accessible by keyboard?
- [ ] Are chart assumptions, axes and model disclosures accurate?
- [ ] Has existing functionality and Russian product language been preserved?
- [ ] Were desktop, tablet and mobile renderings inspected rather than inferred only from source?
