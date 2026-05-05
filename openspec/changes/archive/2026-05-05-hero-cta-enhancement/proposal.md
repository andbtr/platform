# Proposal: Hero CTA Enhancement

## Intent

The hero CTA button — the single conversion element above the fold — needs to be more eye-catching and conversion-optimized. Currently a static gradient button with basic hover effects. Users scroll past without clicking. The landing page must command attention and convert visitors into registered dancers.

## Scope

### In Scope
- Ring pulse (sonar) effect: 2–3 CSS pseudo-element rings expanding behind the button
- Breathing animation: subtle scale pulse (1 → 1.025 → 1) over 4s
- Shimmer sweep: diagonal light bar crossing the button every 5s
- Animated gradient border: gold→cyan→fuchsia wrapper reusing `gradient-shift`
- Dual CTA: secondary glass button "Conoce nuestra historia" → smooth-scroll to `#info`
- Social proof microcopy: replace "Únete a la familia…" with "Únete a más de 200 bailarines ya inscritos"
- Entrance animation: CTA block fade-in + slide-up with 0.6s delay after countdown
- Accessibility: all infinite animations gated on `prefers-reduced-motion: no-preference`

### Out of Scope
- JS animation libraries (framer-motion, gsap, react-spring)
- Confetti/particle burst on click (overkill for this action)
- Floating sticky CTA on scroll (separate UX concern)
- Registration form button consistency update (deferred follow-up)
- Dynamic participant count from database (static "200+" acceptable per exploration)

## Capabilities

### New Capabilities
- `hero-cta-animations`: CSS-only keyframe animations and utility classes for ring-pulse, breathing, shimmer, and animated gradient border
- `hero-cta-dual-layout`: Dual CTA button group with primary (register) and secondary (scroll-to-info) buttons, plus social proof microcopy

### Modified Capabilities
- None

## Approach

**All CSS-only** — zero new dependencies. Eight composable enhancements layered on the existing button markup in `hero-section.tsx`:

1. Button wrapped in a gradient-border `div` (2px padding, `rounded-full`, `gradient-shift` animation reused from existing CSS)
2. Two `::before`/`::after` pseudo-elements on the wrapper for ring-pulse with staggered `animation-delay`
3. Shimmer sweep via an inner `::after` that animates `left: -100% → 100%` every 5s
4. Breathing scale via `@keyframes breathe` applied to the wrapper
5. Secondary `<button>` with `.glass` class, gold border, `onClick` → `scrollIntoView('#info')`
6. Social proof text replaces existing secondary line, adds `TrendingUp` icon
7. Entrance animation via `@keyframes cta-enter` with `animation-delay: 0.6s`, `animation-fill-mode: both`
8. All infinite animations wrapped in `@media (prefers-reduced-motion: no-preference)`

Performance: no `backdrop-blur` on animated layers, `will-change: transform` only on the wrapper, rings hidden on `<360px` viewport. New classes prefixed with `hero-cta-` to avoid namespace collisions.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `components/sections/hero-section.tsx` | Modified | Button markup restructured with gradient wrapper, dual CTA, social proof, entrance class, scroll logic |
| `app/globals.css` | Modified | New `@keyframes` (ring-pulse, breathe, cta-enter, shimmer-cta), utility classes (`.hero-cta-*`) |
| `components/sections/info-section.tsx` | Unchanged | Scroll target (`id="info"`) already exists |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Animation overload (4 simultaneous effects) | Medium | Use subtle values: opacity 0.3, scale 1.025, long durations (4–5s) |
| Mobile compositor strain from pseudo-elements | Low | No blur on animated layers; rings hidden < 360px wide; `will-change` on wrapper only |
| `prefers-reduced-motion` not respected | Low | Strict media query gate; hover/transition states preserved |
| Layout shift from entrance animation | Low | Use `animation-fill-mode: both`; CTA block has fixed height |

## Rollback Plan

Revert `hero-section.tsx` to pre-change commit. Remove `hero-cta-*` classes from `globals.css`. No DB migrations, no config changes. Single PR revert.

## Dependencies

- None

## Success Criteria

- [ ] Hero CTA renders with ring pulse, shimmer, breathing, and gradient border on desktop/mobile
- [ ] Secondary CTA smooth-scrolls to InfoSection on click
- [ ] Social proof text reads "Únete a más de 200 bailarines ya inscritos"
- [ ] CTA block fades in with slide-up 0.6s after countdown appears
- [ ] All animations disabled when `prefers-reduced-motion: reduce` is active
- [ ] No layout shift or CLS regression (Lighthouse audit)
- [ ] No new npm dependencies added
