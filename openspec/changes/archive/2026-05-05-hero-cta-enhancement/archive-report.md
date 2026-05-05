# Archive Report: Hero CTA Enhancement

**Change**: hero-cta-enhancement
**Archived**: 2026-05-05
**Mode**: hybrid (engram + openspec)
**Verdict from verify**: PASS WITH WARNINGS (0 critical issues)

---

## Executive Summary

Enhanced the hero CTA button on the landing page with three CSS-only animations (ring pulse, breathing, glow border) and social proof microcopy. Two originally-planned features (shimmer sweep, dual CTA with gradient wrapper) were explicitly rejected by the user during visual verification and removed from scope. All animations are gated on `prefers-reduced-motion: no-preference`. Implementation required zero new dependencies, zero new files — only modifications to `app/globals.css` and `components/sections/hero-section.tsx`.

---

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| hero-cta-animations | Created | 5 ADDED requirements (A1–A5), 2 REMOVED requirements (R-A3 shimmer, R-A4 wrapper). 7 scenarios + 6 cross-cutting constraints. |
| hero-cta-social-proof | Created | 2 ADDED requirements (S1–S2). 3 scenarios. |

Both delta specs were copied as-is to `openspec/specs/{domain}/spec.md` (main specs did not previously exist).

---

## Archive Contents

| Artifact | Path | Status |
|----------|------|--------|
| Proposal | `archive/2026-05-05-hero-cta-enhancement/proposal.md` | ✅ (original scope — includes shimmer + wrapper + dual CTA) |
| Exploration | `archive/2026-05-05-hero-cta-enhancement/explore.md` | ✅ (7 approaches evaluated) |
| Specs (animations) | `archive/2026-05-05-hero-cta-enhancement/specs/hero-cta-animations/spec.md` | ✅ (updated post-feedback) |
| Specs (social-proof) | `archive/2026-05-05-hero-cta-enhancement/specs/hero-cta-social-proof/spec.md` | ✅ |
| Design | `archive/2026-05-05-hero-cta-enhancement/design.md` | ⚠️ (updated post-feedback — reflects final box-shadow approach) |
| Tasks | `archive/2026-05-05-hero-cta-enhancement/tasks.md` | ⚠️ (10/12 complete; 2 stale referencing removed features) |
| Verify Report | `archive/2026-05-05-hero-cta-enhancement/verify-report.md` | ✅ (PASS WITH WARNINGS) |

---

## Scope Evolution (from proposal to final)

| Feature | Proposed | Final | Reason |
|---------|----------|-------|--------|
| Ring pulse | ✅ | ✅ | — |
| Breathing | ✅ | ✅ | — |
| Shimmer sweep | ✅ | ❌ | User rejected — "no quiero ese movimiento de color dentro del botón" |
| Gradient wrapper border | ✅ | ❌ | User rejected — "no me agrada ese contenedor" |
| Box-shadow glow border | — | ✅ | User-approved replacement for wrapper |
| Dual CTA | ✅ | ❌ | Out of scope (deferred) |
| Social proof | ✅ | ✅ | — |
| Entrance animation | ✅ | ❌ | Replaced by A5 (immediate visibility requirement) |

---

## What Was Built (Final Implementation)

### CSS (`app/globals.css`)
- `@keyframes ring-pulse`: 2 pseudo-element rings behind button (scale 1→1.6, opacity 0.6→0, 3s, staggered 1.5s). Hidden on viewports <360px.
- `@keyframes breathe`: Button scales 1→1.025→1 over 4s, paused on hover.
- `@keyframes border-glow`: Multi-layer box-shadow cycling gold→cyan→fuchsia over 5s.
- `.btn-hero-primary`: Position relative, breathing animation, ring pulse pseudo-elements.
- `.btn-hero-glow`: Animated box-shadow glow applied directly to button.
- All infinite animations inside `@media (prefers-reduced-motion: no-preference)`.

### Markup (`components/sections/hero-section.tsx`)
- Button receives `btn-hero-primary btn-hero-glow` classes.
- Static fuchsia shadow classes removed (replaced by `.btn-hero-glow`).
- Focus ring preserved via `focus-visible:ring-2 focus-visible:ring-[#C5A059]`.
- Social proof text changed to "Únete a más de 200 bailarines ya inscritos".

---

## Verification Summary

- **Build**: ✅ Compiled successfully (3.8s)
- **Spec compliance**: 10/10 scenarios implemented
- **Removed features**: Correctly absent (no shimmer keyframe, no wrapper div)
- **Accessibility**: All animations gated on `prefers-reduced-motion`, focus ring distinguishable, WCAG AA contrast met
- **Performance**: No `@property` at-rules, `will-change` only on ring elements, rings hidden <360px
- **Warnings**: tasks.md and design.md are stale (document original pre-feedback scope) — documentation debt only, no code defects

---

## Warnings Carried Forward

1. **tasks.md**: Phase 1-2 task descriptions reference removed features (shimmer, wrapper). Tasks were marked `[x]` at build time but descriptions reflect the original design. This is documentation debt — no code action needed.
2. **design.md**: Documents the original wrapper-based border and shimmer approaches as "chosen". Final implementation uses box-shadow glow. The design was updated with a "revisited" decision section that reflects the final approach. Minor naming mismatch only.
3. **proposal.md**: Reflects original full scope including shimmer, wrapper, dual CTA, and entrance animation. Serves as historical record of what was originally envisioned.

---

## Source of Truth Updated

The following main specs now reflect the implemented behavior:
- `openspec/specs/hero-cta-animations/spec.md`
- `openspec/specs/hero-cta-social-proof/spec.md`

---

## SDD Cycle Complete

The change has been fully planned (propose → explore → spec → design → tasks), implemented (apply), verified (verify), and archived. Ready for the next change.
