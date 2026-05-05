# hero-cta-social-proof Specification

## Purpose

Replace the secondary text below the hero CTA button with social proof microcopy. Text-only change — no structural layout modifications, no additional buttons.

## ADDED Requirements

| # | Requirement | RFC 2119 | Scenarios |
|---|------------|----------|-----------|
| S1 | **Social Proof Microcopy**: Text below CTA MUST read "Únete a más de 200 bailarines ya inscritos", replacing "Únete a la familia de Morenada Huajsapata". Text SHALL be visible in the accessibility tree. | MUST | 2 (display, screen-reader) |
| S2 | **Contrast**: Social proof text SHALL meet WCAG AA minimum contrast ratio (4.5:1 for normal text) against the hero dark-navy background. | SHALL | 1 (contrast audit) |

### Scenario: Social Proof — Display
- GIVEN the hero section renders
- WHEN user views the area below the CTA button
- THEN text reads "Únete a más de 200 bailarines ya inscritos"
- AND the previous text "Únete a la familia de Morenada Huajsapata" SHALL NOT appear

### Scenario: Social Proof — Screen Reader
- GIVEN a screen reader is active
- WHEN the hero CTA area renders
- THEN social proof text is announced in reading order as visible content
- AND SHALL NOT use `aria-hidden`

### Scenario: Social Proof — Contrast
- GIVEN the hero section has a dark-navy background
- WHEN the social proof text renders
- THEN text-to-background contrast ratio is ≥ 4.5:1
