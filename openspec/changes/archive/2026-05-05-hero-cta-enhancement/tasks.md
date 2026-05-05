# Tasks: Hero CTA Enhancement

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~70–85 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |

Decision needed before apply: No

## Phase 1: CSS Keyframes and Utility Classes

- [x] 1.1 Add `@keyframes ring-pulse`, `breathe`, and `border-glow` to `app/globals.css` inside `@media (prefers-reduced-motion: no-preference)`.
- [x] 1.2 Add `.btn-hero-primary` class: `position: relative`, breathing animation, ring-pulse `::before`/`::after` with 0s/1.5s stagger, `will-change: transform` on rings, rings hidden on `@media (max-width: 359px)`.
- [x] 1.3 Add `.btn-hero-glow` class: animated multi-layer box-shadow cycling through gold→cyan→fuchsia theme colors over 5s.
- [x] ~~1.4~~ Removed — shimmer and wrapper border rejected by user during implementation.

## Phase 2: Markup Changes in Hero Section

- [x] 2.1 Apply `.btn-hero-primary` and `.btn-hero-glow` classes to the existing button element in `components/sections/hero-section.tsx`.
- [x] 2.2 Remove static fuchsia `shadow-[...]` classes from button (replaced by animated `.btn-hero-glow`).
- [x] 2.3 Keep existing: gradient background, `animate-gradient`, Sparkles icon, `hover:scale-105`, onClick handler.
- [x] 2.4 Change the secondary `<p>` text below the button to `"Únete a más de 200 bailarines ya inscritos"`.
- [x] 2.5 Add `focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050A18]` so the focus ring stays distinguishable from the animated glow.

## Phase 3: Visual Verification

- [x] 3.1 Verify ring pulse is visible on viewports ≥360px and hidden on viewports <360px.
- [x] 3.2 Verify all infinite animations stop when `prefers-reduced-motion: reduce` is active.
- [x] 3.3 Verify glow border cycles through gold→cyan→fuchsia theme colors on the button.
- [x] 3.4 Verify focus ring remains visible and distinguishable when button is focused via Tab.
- [x] 3.5 Verify button click still navigates to `/inscription`.
- [x] 3.6 Verify social proof text reads correctly and is present in the accessibility tree.

## Scope Changes (user-approved)

| Change | Reason |
|--------|--------|
| ❌ Shimmer sweep removed | User rejected — didn't like color movement inside button |
| ❌ Border wrapper div removed | User rejected — didn't like container look |
| ✅ Glow border (box-shadow) added | User-approved replacement — animated glow directly on button |
