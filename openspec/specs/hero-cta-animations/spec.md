# hero-cta-animations Specification

## Purpose

CSS-only keyframe animations for the hero CTA button: ring pulse, breathing, and animated glow border. The CTA SHALL render immediately with zero entrance animation or delay. All infinite animations gated on `prefers-reduced-motion`.

## ADDED Requirements

| # | Requirement | RFC 2119 | Scenarios |
|---|------------|----------|-----------|
| A1 | **Ring Pulse**: 2 pseudo-element rings expand behind the button (scale 1→1.6, opacity 0.6→0, 3s loop), staggered by 1.5s each. Hidden on viewports <360px. | MUST | 2 (default, small-viewport) |
| A2 | **Breathing**: Button scales 1→1.025→1 over 4s, ease-in-out, infinite. Paused on hover to allow hover:scale-105. | MUST | 1 (default) |
| A3 | **Animated Glow Border**: Multi-layered box-shadow cycling through gold→cyan→fuchsia (border glow + medium glow + large glow) over 5s, ease-in-out, infinite. Applied directly to the button via `.btn-hero-glow` class. Focus ring SHALL remain distinguishable. | MUST | 2 (default, keyboard-focus) |
| A4 | **Motion Respect**: ALL infinite animations (ring, breathing, glow border) SHALL NOT play when `prefers-reduced-motion: reduce`. Hover, focus, and static styles remain functional. | MUST | 1 (reduced-motion gate) |
| A5 | **No Entrance Animation**: CTA MUST render immediately at `opacity: 1` without any entrance animation or delay. No fade-in, slide-up, or staggered reveal. | MUST | 1 (immediate visibility) |

## REMOVED Requirements

| # | Requirement | Reason |
|---|------------|--------|
| R-A3 | Shimmer Sweep | User explicitly rejected during visual verification — "no quiero ese movimiento de color dentro del botón" |
| R-A4 | Animated Gradient Border (wrapper) | User rejected wrapper div — "no me agrada ese contenedor". Replaced with A3 (Animated Glow Border) directly on button. |

### Scenario: Ring Pulse — Default
- GIVEN page loaded, `prefers-reduced-motion: no-preference`
- WHEN hero CTA renders
- THEN 2 rings animate behind button (scale 1→1.6, opacity 0.6→0, 3s loop), staggered by 1.5s
- AND rings use `will-change: transform`

### Scenario: Ring Pulse — Small Viewport
- GIVEN viewport width < 360px
- WHEN hero CTA renders
- THEN ring pulse pseudo-elements SHALL NOT render

### Scenario: Breathing — Default
- GIVEN `prefers-reduced-motion: no-preference`
- WHEN hero CTA renders
- THEN button scales 1→1.025→1 over 4s, ease-in-out, infinite
- AND breathing pauses on hover

### Scenario: Animated Glow Border — Default
- GIVEN `prefers-reduced-motion: no-preference`
- WHEN hero CTA renders
- THEN button shows cycling box-shadow glow: gold border→cyan→fuchsia over 5s

### Scenario: Animated Glow Border — Keyboard Focus
- GIVEN button is focused via Tab key and glow border is active
- WHEN user inspects focus indicator
- THEN focus ring SHALL remain visible and distinguishable from glow animation

### Scenario: All Animations — Reduced Motion
- GIVEN `prefers-reduced-motion: reduce`
- WHEN hero CTA renders
- THEN ring pulse, breathing, and glow border animations SHALL NOT play
- AND hover transitions, focus ring, and static color styles remain functional

### Scenario: CTA — Immediate Visibility
- GIVEN the hero section mounts
- WHEN the CTA renders
- THEN the CTA is visible at full opacity with zero animation delay
- AND no entrance keyframe animation applies to the CTA block

## Cross-Cutting: Accessibility

| # | Constraint | RFC 2119 |
|---|-----------|----------|
| AC1 | All infinite animations SHALL be wrapped in `@media (prefers-reduced-motion: no-preference)`. | MUST |
| AC2 | Focus ring SHALL remain visible and distinguishable from animated glow border. | SHALL |
| AC3 | Button text and surrounding elements SHALL meet WCAG AA minimum contrast (4.5:1 normal text, 3:1 large text). | SHALL |

## Cross-Cutting: Performance

| # | Constraint | RFC 2119 |
|---|-----------|----------|
| P1 | `@property` at-rule SHALL NOT be present in CSS (Safari <16.4 compat). | MUST NOT |
| P2 | `will-change: transform` SHALL only target ring pulse elements. | SHALL |
| P3 | Ring pulse SHALL NOT render on viewports < 360px. | SHALL |
