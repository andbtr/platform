## Exploration: Hero CTA Button Enhancement

### Current State

The hero CTA is a raw `<button>` (not shadcn/ui) in `components/sections/hero-section.tsx` (lines 114–121). It is the single conversion element above the fold on the landing page.

**Existing styling:**
- Fuchsia gradient background (`#E91E8C` → `#FF4081`) with `animate-gradient` (3s loop)
- Static glow shadow: `shadow-[0_0_40px_rgba(233,30,140,0.4)]` that intensifies on hover
- Inner blur glow layer for depth
- Sparkles icon (`lucide-react`) with `animate-pulse`
- Hover: `scale-105` + stronger shadow
- No entrance animation — renders immediately with the rest of the hero
- No `prefers-reduced-motion` guards
- Secondary text below: *"Únete a la familia de Morenada Huajsapata"*

**Design system context:**
- All existing animations are CSS-only (`float`, `pulse-glow`, `shimmer`, `gradient-shift`)
- No JS animation libraries installed (no framer-motion, gsap, react-spring)
- `tw-animate-css` is available as a dependency
- Color palette: gold `#C5A059`, cyan `#4FB8C4`, fuchsia `#E91E8C`, navy `#050A18`
- Glassmorphism utilities exist: `.glass`, `.glass-strong`, `.border-gold-glow`

**Related buttons elsewhere:**
- `registration-form.tsx` uses a similar pink gradient button (`.btn-glow` class)
- `gallery-section.tsx` has a gold-outlined secondary button
- Navigation uses shadcn `<Button>` with cyan gradients

### Affected Areas

- `components/sections/hero-section.tsx` — primary CTA button and surrounding layout
- `app/globals.css` — new keyframe animations and utility classes
- `components/sections/registration-form.tsx` — potential style consistency updates

### Approaches

#### 1. Ring Pulse (Sonar Effect) + Breathing Scale
**Description:** Pure CSS expanding rings emanate from behind the button, combined with a subtle 3% scale breathing loop. This mimics a "heartbeat" or notification badge pattern and is extremely effective at drawing peripheral attention.

- **Pros:** Zero JS; single most impactful attention hack; works on all screen sizes; fits the dark theme beautifully; can use fuchsia + gold rings for brand coherence
- **Cons:** Can feel aggressive if loop is too fast; needs `prefers-reduced-motion` override
- **Effort:** Low

#### 2. Shimmer Sweep + Animated Gradient Border
**Description:** A diagonal light bar sweeps across the button every 4–5 seconds. A thin rotating conic-gradient border (gold → cyan → fuchsia → gold) wraps the button using `@property --angle` or a background-position hack.

- **Pros:** Adds constant motion without being noisy; signals "premium/luxury" (common in fintech/crypto UIs); pure CSS
- **Cons:** Conic-gradient border with rounded buttons is tricky — needs a wrapper `div` with `padding: 2px` and `border-radius`; `@property` has limited Safari support (16.4+) though acceptable for this audience
- **Effort:** Medium

#### 3. Dual CTA Layout (Primary + Secondary)
**Description:** Keep the current pink button as primary, add a second button below or beside it: *"Conoce más"* with `.glass` + gold border. This reduces friction for users not ready to register.

- **Pros:** Immediate UX win; increases click-through surface area; the secondary button can smooth-scroll to `InfoSection`
- **Cons:** Slightly dilutes focus from the primary action; needs scroll-to logic
- **Effort:** Low

#### 4. Social Proof + Urgency Microcopy
**Description:** Replace the secondary text below the button with dynamic social proof: *"Únete a más de 200 bailarines"* or *"Solo quedan X días — regístrate ahora"*. Tie it to the existing countdown state.

- **Pros:** Psychological conversion trigger (FOMO + social validation); zero performance cost; reinforces the countdown already on screen
- **Cons:** Copy needs to be realistic (no fake numbers); requires deciding on a participant count or dynamic source
- **Effort:** Low

#### 5. 3D Perspective Lift + Magnetic Hover (Lightweight JS)
**Description:** On hover, the button tilts slightly toward the cursor using a small `onMouseMove` handler updating `transform: rotateX/Y()`. On mobile, fallback to simple `translateY(-4px)`.

- **Pros:** Feels tactile and premium; differentiates from flat UI
- **Cons:** Requires React state + event listeners; easy to overdo; negligible but still non-zero JS overhead
- **Effort:** Medium

#### 6. Confetti/Particle Burst on Click
**Description:** Canvas-based or DOM-based particle explosion on click, using gold/cyan/fuchsia sparks.

- **Pros:** Delightful micro-interaction; strong reward signal for clicking
- **Cons:** Needs a library (e.g., `canvas-confetti` + 3KB) or complex custom canvas code; overkill for a simple navigation action; may clash with the serious cultural tone of the site
- **Effort:** High

#### 7. Floating Sticky CTA on Scroll
**Description:** The CTA duplicates into a sticky bottom bar that appears after scrolling past the hero.

- **Pros:** Always-visible conversion path; common pattern for landing pages
- **Cons:** Involves scroll listener + intersection observer; may conflict with existing navigation; mobile screen real estate is precious
- **Effort:** Medium–High

### Recommendation

**Implement a composite of Options 1 + 2 + 3 + 4.** They are all CSS-only (except a trivial `onClick` for the secondary CTA) and stack well without visual noise.

**Specific recommendation:**

1. **Ring Pulse (Option 1)** — Add 2–3 pseudo-element rings (`::before`, `::after`, and an extra wrapper `span`) with staggered `animation-delay`. Rings use `border: 1px solid rgba(233, 30, 140, 0.3)` and scale from 1× to 1.6× while fading opacity to 0. Loop: 3s. This is the anchor effect.

2. **Breathing Scale (Option 1)** — Button itself scales `1 → 1.025 → 1` over 4s, `ease-in-out`, infinite. Subtle enough to not compete with the rings.

3. **Shimmer Sweep (Option 2)** — A `::after` pseudo-element with `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` moves from `left: -100%` to `left: 100%` every 5s. Only on the button face, not the glow layer.

4. **Animated Border (Option 2, simplified)** — Instead of conic-gradient (complex), use a wrapper with `background: linear-gradient(90deg, #C5A059, #4FB8C4, #E91E8C, #C5A059)` and `background-size: 300% 100%` animated with `gradient-shift`. The wrapper has `padding: 2px` and `border-radius: 9999px`; the inner button sits on top with its own background. This avoids `@property` and works everywhere.

5. **Dual CTA (Option 3)** — Add a secondary `<button>` below the primary: *"Conoce nuestra historia"* with `.glass` background, gold border, and `hover:bg-gold/10`. It smooth-scrolls to `InfoSection` via `document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })`.

6. **Social Proof (Option 4)** — Change the text below from *"Únete a la familia..."* to *"Únete a más de 200 bailarines ya inscritos"* (or a dynamic count if available). Add a small flame/arrow-up icon.

7. **Accessibility:** Wrap all infinite animations in `@media (prefers-reduced-motion: no-preference)`. Under reduced motion, disable ring pulse, breathing, and shimmer. Keep hover states and the gradient background.

8. **Entrance Animation:** Delay the entire CTA block by ~0.6s after the countdown mounts, using a simple CSS animation (`opacity: 0 → 1`, `translateY(20px) → 0`, `0.8s ease-out`). This creates a staged reveal: title → countdown → CTA.

**Why this combination:**
- The ring pulse solves the "attention" problem immediately.
- The shimmer and breathing add life without clutter.
- The dual CTA and social proof solve the "irresistible" problem through psychology, not just pixels.
- Everything is CSS — no new dependencies, no JS bundle increase, 60fps guaranteed.
- The enhancements are scoped to the hero; other pink buttons (registration form) can optionally adopt the same `.btn-hero-primary` class later for consistency.

### Risks

- **Animation overload:** Four simultaneous effects (rings, breathe, shimmer, border) could feel like "clown vomit" if timing is not carefully tuned. Mitigation: use slow, subtle values (opacity 0.3, scale 1.025, long durations).
- **Reduced motion:** Users with vestibular disorders may find even subtle pulsing uncomfortable. Mitigation: strict `prefers-reduced-motion` media query that strips all infinite loops.
- **Mobile performance:** Multiple blurred pseudo-elements and large shadows can cause compositor strain on low-end Android devices. Mitigation: use `will-change: transform` sparingly; test on a budget device; rings can be hidden on screens < 360px wide.
- **Consistency:** The registration form button currently uses `.btn-glow` (static shadow). If the hero CTA gets a new animated class, users may expect the registration submit button to match. Plan: extract a reusable `.btn-hero-primary` class in `globals.css` that both can share.
- **Sticky nav overlap:** If a floating/sticky CTA is added later (Option 7), ensure z-index layering does not conflict with the existing `<Navigation>` mobile menu.

### Ready for Proposal

**Yes.** The scope is well-defined, the approaches are ranked, and the recommended composite path is feasible with zero new dependencies. The orchestrator can ask the user to confirm whether they want:
- (A) The full composite (ring pulse + breathe + shimmer + border + dual CTA + social proof)
- (B) A minimal version (ring pulse + breathe only)
- (C) Whether they have a real participant count for the social proof text, or if a static estimate is acceptable
