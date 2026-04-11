# Decision Log — Forward Design Portfolio

### DEC-001: Next.js 14 with App Router as Framework

**Date:** 2026-04-11 14:00 | **Status:** Approved
**Decision Maker:** Prides Agent
**Context:** Need a high-performance, SEO-friendly framework for a cinematic portfolio
**Options:**

| Option | Pros | Cons |
|--------|------|------|
| Next.js 15 | SSR/SSG, App Router, Image optimization, Vercel native | Slightly heavier |
| Astro | Fastest static, great for content | Less dynamic capabilities |
| Vite + React | Lightweight | No built-in SSR/SEO |
**Rationale:** Next.js 15 provides the best balance of performance, SEO, and dynamic capabilities needed for scroll-driven animations and smooth transitions. App Router enables server components for optimal loading.
**Implementation:** Coder will scaffold with `npx create-next-app` using App Router
**Dependencies:** Use pnpm for package management
**Review Date:** 2026-05-11

### DEC-002: GSAP + Lenis for Animation & Scroll

**Date:** 2026-04-11 14:00 | **Status:** Approved
**Decision Maker:** Prides Agent
**Context:** Need premium scroll-driven animations for hero sequence and page transitions
**Options:**

| Option | Pros | Cons |
|--------|------|------|
| GSAP + Lenis | Industry standard, ScrollTrigger, smooth inertia | Learning curve, license for commercial |
| Framer Motion | React-native, easy integration | Less control over scroll |
| Locomotive Scroll | Great scroll experience | Less animation features |
**Rationale:** GSAP's ScrollTrigger is ideal for the 24-frame hero animation linked to scroll position. Lenis provides the smooth inertia scrolling expected in premium portfolios. They complement each other perfectly.
**Implementation:** Install gsap, @studio-freight/lenis (or lenis)
**Review Date:** 2026-05-11

### DEC-003: Dark Gallery Aesthetic with Warm Accents

**Date:** 2026-04-11 14:00 | **Status:** Approved
**Decision Maker:** Prides Agent
**Context:** Design direction from about-guidance.md specifies cinematic editorial feel
**Options:**

| Option | Pros | Cons |
|--------|------|------|
| Dark charcoal + warm gold | Gallery feel, makes images pop, Kinshasa golden hour | Must ensure contrast ratios |
| White minimal | Clean, standard | Clinical, contradicts guidance |
| Warm cream | Softer | Less dramatic |
**Rationale:** The guidance document explicitly specifies dark gallery aesthetic with warm amber/gold accents. This aligns with the "walking into a gallery exhibition in Kinshasa at golden hour" emotional blueprint.
**Implementation:** Tailwind config with custom colors, Playfair Display + Inter fonts
**Review Date:** 2026-05-11

### DEC-004: Scroll-Driven Hero Animation (33 frames)

**Date:** 2026-04-11 14:00 | **Status:** Approved
**Decision Maker:** Prides Agent
**Context:** 33 WebP frames exist in public/hero_sequences/ with scroll-trigger config
**Options:**

| Option | Pros | Cons |
|--------|------|------|
| Scroll-linked frame swap | Immersive, follows guidance config | Must preload frames |
| Timed video loop | Simpler | Less interactive |
| CSS sprite | Fast | Hard to manage |
**Rationale:** The existing scroll-trigger-config.json specifies 3000px scroll distance with 24 frames (actually 33 available). Using GSAP ScrollTrigger to drive frame-by-frame progression creates the cinematic entrance the guidance demands.
**Implementation:** Preload first 12 frames, lazy-load rest, GSAP ScrollTrigger for frame progression
**Review Date:** 2026-05-11

### DEC-005: French as Primary Content Language

**Date:** 2026-04-11 14:00 | **Status:** Approved
**Decision Maker:** Prides Agent
**Context:** Rodrigue is Kinshasa-based, guidance uses French taglines and copy
**Options:**

| Option | Pros | Cons |
|--------|------|------|
| French primary | Authentic to creator, target audience | Limits English-only visitors |
| Bilingual FR/EN | Inclusive | More complex |
| English primary | Wider reach | Loses authenticity |
**Rationale:** The guidance document's copy examples are in French ("Créer. Éclairer. Inspirer."). The primary audience includes DRC/African clients. French primary honors the creator's voice. Navigation can include EN toggle for future expansion.
**Implementation:** All content in French, lang="fr" on html, structured for i18n future expansion
**Review Date:** 2026-05-11
