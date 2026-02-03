# Call Sal Website V2 — Glassmorphism Rebuild

## Live URLs
- **Production**: https://callsal-website-v2.vercel.app
- **GitHub**: https://github.com/Karasal/callsal-website-v2
- **Auto-deploy**: Connected — pushes to `master` trigger Vercel builds

## Tech Stack
- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 + @tailwindcss/postcss
- Framer Motion 12 + anime.js
- Deployed on Vercel (auto-deploy from GitHub)

## Design System
- **Aesthetic**: 2026 Glassmorphism + Gemini-inspired
- **Primary**: Lime (#CCFF00) — brand accent, CTAs
- **Secondary**: Cyan (#00F0FF) — hover states, glows, ambient
- **Background**: Pure black (#000000)
- **Typography**: Syne (display/headings) + Inter (body)
- **Panels**: Frosted glass (backdrop-blur, translucent borders, rounded-2xl)
- **Animations**: Smooth ease, NO bouncy springs. Staggered reveals, scroll-driven.

## CSS Classes (Design Tokens)
- `.glass` / `.glass-strong` / `.glass-nav` — frosted glass panels
- `.gradient-text` / `.gradient-text-reverse` — lime↔cyan gradient text
- `.gradient-border` — gradient border via mask trick
- `.glow-lime` / `.glow-cyan` / `-strong` variants — box-shadow glows
- `.btn-primary` — lime CTA button with hover glow
- `.btn-glass` — frosted glass button with cyan hover
- `.orb` + `.orb-lime` / `.orb-cyan` / `.orb-mixed` — ambient floating gradient orbs
- `.noise-overlay` — subtle film grain via SVG

## Font Class Mapping (v1 → v2)
| v1 Class | v2 Class | Usage |
|----------|----------|-------|
| `font-heading` | `font-display` | Headings, titles (Syne) |
| `font-mono` | `font-body` | Body text, labels (Inter) |
| `font-sans` | `font-body` | Body text (Inter) |

## Panel Class Mapping (v1 → v2)
| v1 Class | v2 Class | Notes |
|----------|----------|-------|
| `brutalist-panel` | `glass` or `glass-strong` | Add `rounded-2xl` |
| `bg-white/5 border border-white/10` | `glass` | Single utility |
| Sharp edges | `rounded-xl` / `rounded-2xl` | Everywhere |
| `hover-gradient-bg` | `hover:bg-white/[0.08]` | Subtle glass hover |

## Components Built

### Core Shell
- `AmbientBackground.tsx` — 3 floating gradient orbs (replaces v1's InteractiveBackground, GlobalEffects, CinematicOverlay, CustomCursor)
- `GlassHeader.tsx` — Floating top nav (logo, contact info, MST clock, mobile menu)
- `GlassNav.tsx` — Floating bottom nav (5 tabs, auth section, gradient active indicator)

### Pages
- `Hero.tsx` (~1200 lines) — Includes ALL sub-components inline:
  - `ProximityHeroText` — "HI - IT'S YOUR NEW PAL, SAL!" with glow
  - `PixelNerdSal` — SVG pixel art character
  - `IntegratedSalBot` — Chat interface with /api/chat
  - `TheArmory` — SOFTWARE/HARDWARE tabs with detail modals
  - `VideoPortfolio` — 6 projects, case studies, Hollywood Advantage
  - `SoftwareItem`, `SoftwareDetailModal`, `VideoModal`
- `MeetSalman.tsx` — Bio, journey, philosophy, stats
- `TheOffer.tsx` — Free video offer, FAQ, video portfolio
- `BookingPage.tsx` — 4-step booking flow (type → date → time → details)
- `AuthModal.tsx` — Login/register with key validation
- `Dashboard.tsx` — Admin booking management, client welcome
- `ClientHubOnboarding.tsx` — 11-step typeform-style onboarding
- `ImageModal.tsx` — Fullscreen image lightbox

## Project Structure
```
callsal-website-v2/
├── api/                    ← Copied verbatim from v1 (zero changes)
│   ├── auth/               ← login, logout, me, register
│   ├── admin/              ← bookings management
│   ├── bookings/           ← availability
│   ├── chat/               ← Gemini integration
│   ├── client/             ← onboarding
│   └── email/              ← send (booking confirmations)
├── components/             ← All glassmorphism components
│   ├── AmbientBackground.tsx
│   ├── AuthModal.tsx
│   ├── BookingPage.tsx
│   ├── ClientHubOnboarding.tsx
│   ├── Dashboard.tsx
│   ├── GlassHeader.tsx
│   ├── GlassNav.tsx
│   ├── Hero.tsx
│   ├── ImageModal.tsx
│   ├── MeetSalman.tsx
│   └── TheOffer.tsx
├── hooks/                  ← Copied from v1
│   ├── useMobileAnimations.ts
│   └── useProximityGlow.ts
├── services/               ← Copied from v1
│   ├── demoContent.ts
│   └── storageService.ts
├── public/                 ← Copied from v1 (images, robots.txt, sitemap)
├── src/
│   └── index.css           ← Glassmorphism design system
├── App.tsx                 ← Main shell, tab routing, auth state
├── index.tsx               ← React entry point
├── index.html              ← SEO meta, Syne/Inter fonts
├── types.ts                ← Copied from v1
├── vercel.json             ← Copied from v1
├── package.json
├── vite.config.ts
├── tsconfig.json
└── postcss.config.js
```

## Build Sequence (Complete)

| Phase | Description | Commit | Status |
|-------|-------------|--------|--------|
| 1 | Scaffold + Core Shell | 5394e88 | ✅ |
| 2-4 | Hero, Armory, VideoPortfolio | b9cda0b | ✅ |
| 5-7 | MeetSalman, TheOffer, BookingPage | 4a1e6bf | ✅ |
| 8 | Auth, Dashboard, Onboarding | bd0dbb1 | ✅ |
| 9 | Wire ClientHubOnboarding | 5415f1d | ✅ |
| 10 | CLAUDE.md, GitHub, Vercel | a358b7c | ✅ |

## What Stays From V1 (Zero Changes)
- All API routes (auth, bookings, chat, email, onboarding)
- Booking logic, auth flow (JWT cookies), email templates
- Redis storage, Nodemailer config
- ChatSal Gemini integration
- Copy/messaging (every word identical, new skin only)
- Hash-based deep linking (#book, #offer, #about, etc.)

## What Changed (V1 → V2)
- **Fonts**: Space Grotesk/Mono/Montserrat → Syne + Inter
- **Panels**: Brutalist sharp edges → Frosted glass rounded-2xl
- **Effects**: CRT scanlines, neural grid, glitch → Ambient orbs, noise overlay
- **Cursor**: HUD crosshair → Standard (removed CustomCursor)
- **Animations**: Glitch/mechanical → Smooth ease, staggered reveals
- **Colors**: Same lime/cyan palette, but glows instead of hard borders

## Env Vars Needed (Copy from V1)
These must be configured in Vercel project settings:
```
REDIS_URL=...
JWT_SECRET=...
GEMINI_API_KEY=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
ADMIN_EMAIL=...
```

## Key Decisions
- Syne font chosen over Space Grotesk — bolder, more distinctive for 2026 aesthetic
- Inter for body — clean, readable, pairs well with Syne
- Root-level components (not inside src/) — matches v1 structure
- tsconfig strict mode OFF — v1 code wasn't written for it
- verbatimModuleSyntax OFF — v1 imports aren't type-only
- anime.js added but not yet used (available for future timeline animations)
- v1's orphan components (Features, ServiceGrid, SalesGeneration, LiveDemos, ChatSal, BookingSystem) confirmed unused — not ported

## Mistakes / Gotchas
- Vite scaffold puts entry in `src/main.tsx` — we use `index.tsx` at root
- tsconfig.app.json defaults to `include: ["src"]` — must add root dirs
- Windows bash: use `cp -r` not `xcopy` (xcopy fails in git bash)
- Phase 1 was previously marked complete but files were missing — always verify with `ls`
- strict mode OFF in tsconfig — v1 code wasn't written for it
- `font-heading` → `font-display`, `font-mono` → `font-body` (easy to miss)

## Known Issues / TODO (for next session)
- [ ] Continue visual QA on remaining pages (MeetSalman, TheOffer, BookingPage)
- [ ] Test auth flow end-to-end
- [ ] Test booking flow end-to-end
- [ ] Test chat (SalBot) functionality
- [ ] Performance audit (Lighthouse)

## Session Log: Feb 2, 2026 (Session 1)

### What happened
1. Started with empty directory (Phase 1 was falsely marked complete)
2. Read ALL v1 source files to understand structure
3. Built Phase 1 from scratch: Vite, Tailwind v4, design system CSS, core shell
4. Ported Hero.tsx (1,767 lines in v1) with all inline sub-components
5. Ported MeetSalman, TheOffer, BookingPage
6. Ported AuthModal, Dashboard, ClientHubOnboarding
7. Wired all components into App.tsx
8. Created GitHub repo, pushed, deployed to Vercel

### Commits (Session 1)
```
a358b7c Phase 10: Update CLAUDE.md — all phases complete
5415f1d Phase 9: Wire ClientHubOnboarding, finalize all components
bd0dbb1 Phase 8: Auth, Dashboard, Onboarding — glassmorphism port
4a1e6bf Phase 5-7: MeetSalman, TheOffer, BookingPage — glassmorphism port
b9cda0b Phase 2-4: Hero, Armory, VideoPortfolio — glassmorphism port
1bda037 Update CLAUDE.md with correct Phase 1 commit hash
5394e88 Phase 1: Scaffold + Core Shell — glassmorphism rebuild
```

---

## Session Log: Feb 2, 2026 (Session 2 — Visual Polish)

### What was done
Extensive visual polish and scaling fixes to match v1 proportions while keeping v2 glassmorphism aesthetic:

#### Hero Section Fixes
- **CINEMATICS heading**: Fixed scaling — `text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[6rem] xl:text-[7rem] 2xl:text-[8rem]`
- **Subheadings** ("AI POWERS THE SCALE" / "CINEMA CAPTURES THE SOUL"): Scaled to `text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl`, centered on mobile
- **Body text**: Centered on mobile (`text-center lg:text-left`)
- **THE ARMORY**: Pushed below fold on mobile (`pt-20`)
- **Video selector**: Removed awkward scroll container, items stack naturally

#### Hollywood Advantage Section
- **Title**: Fixed overflow — reduced to `lg:text-5xl xl:text-6xl`
- **"NETFLIX MASTERPIECES"**: Highlighted in red (`text-red-600`)
- **Extended description**: Split into two paragraphs for readability
- **Camera name**: Updated to "RED KOMODO-X 6K CINEMA CAMERA"
- **Added missing V1 content**:
  - Two feature cards: "6K NARRATIVE MASTERING" (film reel icon), "HOLLYWOOD COLOR GRADE" (easel icon)
  - "OFFICIALLY APPROVED FOR NETFLIX" badge with red background

#### Case Study Section
- Fixed title scaling for mobile (`text-xl sm:text-2xl lg:text-4xl`)
- "PROJECT FOR:" badge — added `whitespace-nowrap`, smaller mobile text

#### Software Detail Modal
- Fixed horizontal overflow (`overflow-x-hidden`)
- Reduced all sizes for better fit
- Added `min-w-0` and `break-words` to prevent text overflow

#### Radiosity/Glow Effects (NEW)
- **Logo**: Persistent pulsing lime glow (`animate-logo-glow`)
- **Primary buttons**: Subtle lime radiosity glow
- **Glass buttons**: Subtle cyan undertone on hover
- **Background orbs**: Now drift organically with `drift`, `breathe`, `pulse-glow` animations
- **CSS Classes added**: `.radiosity-lime`, `.radiosity-cyan`, `.radiosity-mixed`

#### Video Modal
- Added fullscreen + landscape lock for mobile video playback
- Uses Fullscreen API + Screen Orientation API

#### Global Fixes
- **No horizontal scroll**: Added `overflow-x: hidden` to html/body
- **Logo updated**: "CALL SAL." → "CALL SAL ." (space before period)
- **Footer branding**: Fixed overlap in "EST MMXXVI © CALL SAL ."

#### Icons Updated
- HERITAGE BRANDING: Film → BookOpen
- UNMATCHED AUTHORITY: Target → Crown
- 6K NARRATIVE MASTERING: Grid → Film reel
- HOLLYWOOD COLOR GRADE: Person → Easel

### Files Changed
- `components/Hero.tsx` — Most changes (scaling, content, icons)
- `components/GlassHeader.tsx` — Logo text, branding spacing, logo glow
- `components/AmbientBackground.tsx` — More orbs, drift/breathe animations
- `src/index.css` — Radiosity classes, enhanced keyframes, global overflow fix

### Key CSS Additions
```css
/* Radiosity glows */
.radiosity-lime::before { ... radial-gradient lime glow ... }
.radiosity-cyan::before { ... radial-gradient cyan glow ... }

/* New keyframes */
@keyframes drift { /* organic multi-directional movement */ }
@keyframes breathe { /* opacity/scale pulsing */ }
@keyframes pulse-glow { /* for radiosity elements */ }
@keyframes logo-glow { /* pulsing glow on logo */ }

/* Global overflow protection */
html, body { overflow-x: hidden; max-width: 100vw; }
```

### Ready for next session
- Continue fixing other pages (MeetSalman, TheOffer, BookingPage) if needed
- Test interactive features (auth, booking, chat)
- Deploy and verify production

---

## Session Log: Feb 3, 2026 (Session 3 — Ambient Background & OKLCH)

### What was done
Complete overhaul of desktop ambient background system for premium glassmorphism aesthetic.

#### GlassNav Fix
- **Nav indicator race condition**: Fixed gradient indicator skipping icon on first load
- Solution: Double `requestAnimationFrame` ensures icons/fonts painted before measuring
- Added resize listener for robustness

#### Desktop Ambient Background (Complete Rewrite)
- **Problem**: Mobile looked gorgeous (diffused glow), desktop had 4 separate "light spots"
- **Solution**: Separate mobile/desktop implementations with `lg:hidden` / `hidden lg:block`

##### Mobile (LOCKED — do not edit)
- Original orb-based system preserved exactly
- 6 orbs with drift/breathe animations
- Works perfectly on narrow viewports

##### Desktop (New System)
- **Edge-projected gradients**: Linear gradients from each edge (not radial orbs)
  - Electric green from left + top edges
  - Frosty cyan from right + bottom edges
- **OKLCH color interpolation**: Vibrant blends without muddy midtones
  - Electric green: `oklch(0.95 0.40 118)` — high lightness, high chroma, hue 118°
  - Frosty cyan: `oklch(0.90 0.16 190)` — bright, low chroma for icy feel
- **Aurora rotation**: 120-second counter-clockwise drift of color positions
- **Frosted halo layer**: 60px blur for diffused aura effect

#### Key Learnings: OKLCH Color Space
- RGB interpolation creates muddy browns when lime mixes with dark backgrounds
- OKLCH (perceptually uniform) keeps gradients vibrant throughout
- Hue 118° = electric green-lime (not yellow-brown, not forest green)
- Hue 190° = true cyan (frosty, not green-tinted)
- Higher lightness (0.90+) prevents dark muddy blends

#### Files Changed
- `components/PerspectiveGrid.tsx` — Desktop edge-projected gradients with OKLCH
- `components/AmbientBackground.tsx` — Separate mobile/desktop systems, aurora animation
- `components/GlassNav.tsx` — Double RAF fix for indicator positioning
- `src/index.css` — Aurora keyframes (aurora-green, aurora-cyan)

### Commits (Session 3)
```
2f53581 Fix nav indicator position on initial load
965c7cb Visual polish: nav indicator, hardware sections, MeetSalman refinements
```

### CSS: Aurora Keyframes
```css
@keyframes aurora-green {
  0%, 100% { transform: translate(-30%, -30%); }  /* top-left */
  25% { transform: translate(-30%, 50%); }         /* bottom-left */
  50% { transform: translate(50%, 50%); }          /* bottom-right */
  75% { transform: translate(50%, -30%); }         /* top-right */
}

@keyframes aurora-cyan {
  0%, 100% { transform: translate(50%, 50%); }    /* bottom-right */
  25% { transform: translate(50%, -30%); }         /* top-right */
  50% { transform: translate(-30%, -30%); }        /* top-left */
  75% { transform: translate(-30%, 50%); }         /* bottom-left */
}
```

### Ready for next session
- **Interaction & Animation Overhaul**: Clean up ported v1 animations
- Replace static/prekeyed animations with fluid microinteractions
- Apple-like glass morphing feel — clean, elegant, reactive
- No bouncy springs — smooth ease curves
- Focus on: hover states, transitions, modal animations, scroll behavior

---

## Session Log: Feb 3, 2026 (Session 4 — Scroll-Driven Parallax Entrance)

### What was done
Complete rebuild of landing experience with Calgary diorama hero and scroll-driven parallax.

#### Calgary Diorama Hero
- **Hero images added**: `public/calgary-diorama.jpg` (desktop), `public/calgary-diorama-mobile.jpg` (mobile)
- **Full viewport**: Image fills 100vh, edge-to-edge
- **Scroll hint**: "Scroll to explore" positioned in white table area of diorama, dark grey text
- **Bounce animation**: New `animate-bounce-slow` keyframe for scroll indicator

#### Scroll-Driven Parallax System
- **Not triggered animations** — true scroll-position-driven transitions
- **scrollProgress**: 0 (top) → 1 (after 80vh of scroll)
- **Reversible**: Scroll up = everything reverses, scroll down = progresses
- **Controls**:
  - Diorama → black overlay opacity (0% → 100%)
  - Header → slides down from -40px, opacity 0 → 1
  - Nav → slides up from +40px, opacity 0 → 1
  - Hero content → fades in + rises 30px → 0
  - Scroll hint → fades out quickly (gone by 33% scroll)

#### Ambient Background Update
- **Removed lime green entirely** from ambient glow
- **New palette**: Light neon blue (OKLCH hue 230) → Dark frosty cyan/teal (OKLCH hue 195-200)
- Mobile orbs now all cyan variants

#### Gradient Scroll Progress Bar
- **Position**: Fixed top of viewport
- **Style**: Lime → Cyan gradient (matches nav indicator)
- **Glow**: Subtle box-shadow
- **Visibility**: Only appears after entrance transition completes (scrollProgress >= 1)

#### UI Changes
- **Scrollbar hidden globally**: Both webkit and Firefox
- **GlassHeader/GlassNav**: Now use inline styles driven by scrollProgress (not framer-motion animate)
- **Hero content wrapper**: Inline styles for scroll-driven opacity/transform

### Files Changed
- `App.tsx` — scrollProgress state, scroll listener, progress bar, passed scrollProgress to components
- `components/Hero.tsx` — Diorama hero, scroll-driven fade/content reveal, scroll hint
- `components/GlassHeader.tsx` — scrollProgress prop, inline style transforms
- `components/GlassNav.tsx` — scrollProgress prop, inline style transforms
- `components/AmbientBackground.tsx` — Cyan/teal only (no lime), OKLCH blues
- `src/index.css` — Hidden scrollbar, bounce-slow keyframe

### Commits (Session 4)
```
8fd57d1 Scroll-driven parallax entrance with Calgary diorama hero
```

### User Direction for Next Session
User is considering a **major aesthetic pivot**:
- **Light mode**: White background, black text
- **Keep brutalism elements** — still "hot af"
- **2026 neumorphic feel**: Gloss, frost gradients, subtle gridlines
- **Classy, elegant web app feel**
- **Progress bar**: Move to bottom edge of navbar with underglow

### Ready for next session
- Move gradient progress bar to bottom edge of GlassNav with underglow
- Explore light mode conversion (white bg, black text, glassmorphism on light)
- Consider subtle background gridlines
- Test current scroll parallax on production
