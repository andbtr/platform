# Design: Hero CTA Enhancement

## Technical Approach

Pure CSS enhancement — zero new files, zero new dependencies. Add 3 `@keyframes` and 2 utility classes to `globals.css`, apply new classes to the existing button in `hero-section.tsx`. No wrapper elements. All infinite animations gated on `@media (prefers-reduced-motion: no-preference)`.

## Architecture Decisions

### Decision: Pseudo-element allocation

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Ring pulse on button `::before`/`::after` | Button pseudo-elements are unused. Rings extend beyond button via `inset: -16px`/`-32px` + `z-index: -1`. Clean, zero DOM overhead. | **Chosen** |

### Decision: Border approach (revisited)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Animated box-shadow glow on button | No wrapper needed. Multi-layered `box-shadow` cycling through theme colors (gold→cyan→fuchsia) via `@keyframes border-glow`. Applied with `.btn-hero-glow` class directly on the button. Clean, no extra DOM. | **Chosen** |
| Wrapper `<div>` with `padding: 2px` | User rejected — "no me agrada ese contenedor, el botón parece estar dentro de algo". | Rejected |
| `border-image` with gradient | Doesn't support `border-radius` without hacks. | Rejected |

### Decision: Shimmer (removed)

User explicitly rejected the shimmer sweep effect: "no quiero ese movimiento de color dentro del botón". The shimmer `@keyframes`, `.btn-hero-shimmer` class, and associated div were all removed.

### Decision: Performance

Ring pulse elements only get `will-change: transform`. Breathing and glow border animations are GPU-compositable without explicit `will-change`. Ring pulse hidden via `@media (max-width: 359px)`.

## Data Flow

None — this is a presentation-only change. No state, no props, no API calls.

```
HeroSection
  └─ <section>
       └─ <button class="btn-hero-primary btn-hero-glow">
            ::before        (ring pulse layer 1, delay: 0s)
            ::after         (ring pulse layer 2, delay: 1.5s)
            <Sparkles />    (existing icon)
            <span>          (existing text)
          </button>
       └─ <p>              (social proof text)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/globals.css` | Modify | Add `@keyframes ring-pulse`, `breathe`, `border-glow`. Add classes `.btn-hero-primary`, `.btn-hero-glow`. All animations gated on `@media (prefers-reduced-motion: no-preference)`. Rings hidden `<360px`. |
| `components/sections/hero-section.tsx` | Modify | Add `btn-hero-primary btn-hero-glow` classes to button. Remove static fuchsia shadow classes. Change secondary text to "Únete a más de 200 bailarines ya inscritos". Button remains unwrapped. |

## CSS Keyframes Design

```
ring-pulse:  scale(1) opacity(0.6) → scale(1.6) opacity(0) | 3s ease-out infinite
breathe:     scale(1) → scale(1.025) → scale(1) | 4s ease-in-out infinite
border-glow: box-shadow cycles gold→cyan→fuchsia (3 layers) | 5s ease-in-out infinite
```

### Box-shadow glow breakdown

The `border-glow` keyframe uses 3 stacked box-shadow layers on the button:
- Layer 1: `0 0 0 2px <color>` — tight "border" glow
- Layer 2: `0 0 15px <color>` — medium aura
- Layer 3: `0 0 30px <color>` — large ambient glow

Colors cycle: gold (#C5A059) → cyan (#4FB8C4) → fuchsia (#E91E8C) → gold.

## Interfaces / Contracts

No API changes. Button keeps existing `onClick={navigateToRegistration}` behavior. Focus ring via Tailwind: `focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050A18]` on the button.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Manual | Ring pulse visible ≥360px, hidden <360px | Resize browser window |
| Manual | All animations stop with `prefers-reduced-motion: reduce` | Toggle in Chrome DevTools Rendering tab |
| Manual | Glow border cycles through gold→cyan→fuchsia | Visual inspection |
| Manual | Focus ring distinguishable from animated glow | Tab to button, verify gold ring is visible |
| Manual | Social proof text reads "Únete a más de 200 bailarines ya inscritos" | Visual + screen reader check |
| Manual | Button still navigates to /inscription on click | Click button |
| Manual | No CLS regression | Lighthouse Performance audit |

## Open Questions

- None
