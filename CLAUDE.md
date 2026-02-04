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

---

## Session Log: Feb 3, 2026 (Session 5 — Scroll UX + Compact Header)

### What was done
Complete overhaul of scroll behavior and header/nav components for clean, smooth UX.

#### Scroll Behavior Overhaul
- **Problem**: Scroll down was smooth, scroll up was janky (instant blip + CSS transitions fighting)
- **Solution**: Smooth scroll BOTH directions with direction-aware animations
- **Direction tracking**: `scrollDirection` state tracks 'forward' vs 'backward'
- **Forward (scroll down)**: Choreographed entrance animation
- **Backward (scroll up)**: Simple slide-off (header slides UP, nav slides DOWN)
- **No more instant scroll** — everything smooth and reversible

#### Header Redesign (Desktop)
- **Before**: Full-width bar with logo, contact, time, call button
- **After**: Compact pill in top-left corner (`left-6 top-6 rounded-full`)
- **Logo with phone icon**: Clickable to call (tel: link)
- **Condensed info**: `905-749-0266 | CALGARY, AB | 3:45 PM MST`
- **No expansion animation** — stays as a compact pill always

#### Header (Mobile)
- Full-width bar with logo+phone and hamburger menu
- Same slide animation as desktop

#### Nav Fixes
- **Overflow fixed**: Changed from percentage-based width to `left-6 right-6` (proper margins)
- **Gradient indicator**: Now positioned inside `<nav>` element (under tabs, not under branding)
- **Three-column layout**: Branding (left) | Tabs (center) | Auth (right)
- **Simplified animation**: No more pill morphing, just slide in/out

#### Animation System
- **Forward entrance**:
  - Header/Nav appear (0.15-0.40 scroll progress)
  - Content fades in (0.35-0.55)
  - Gradient indicator expands (0.50-0.75)
- **Backward exit**:
  - Header: `translateY = (1 - scrollProgress) * -100` (slides up)
  - Nav: `translateY = (1 - scrollProgress) * 100` (slides down)
  - Full width maintained (no pill shrinking)

### Files Changed
- `App.tsx` — scrollDirection state, direction tracking, simplified snap behavior
- `components/GlassHeader.tsx` — Complete rewrite: compact pill, phone icon, condensed info
- `components/GlassNav.tsx` — Separate desktop/mobile, fixed overflow, indicator position
- `components/Hero.tsx` — Removed isReturning prop (no longer needed)

### Commits (Session 5)
```
b68cea7 Scroll UX overhaul: smooth bidirectional transitions + compact header
```

### Key Decisions
- Smooth scroll both ways > instant blip (less jarring)
- Direction-aware animations > symmetric reversible animations (different UX going back)
- Compact header pill > full-width bar (less screen real estate, cleaner look)
- Phone icon in logo > separate call button (more intuitive)

### Ready for next session
- Test on production (Vercel auto-deploy)
- Fine-tune animation timing if needed
- Consider adding email to header pill if space allows
- Mobile menu could use polish

---

## Session Log: Feb 3, 2026 (Session 6 — SalBot Nuke + 3D Parallax Room)

### What was done
Major cleanup and new 3D background effect for hero section.

#### SalBot Nuked
- **Removed entirely**: `PixelNerdSal` component, `IntegratedSalBot` component
- **Deleted**: `/api/chat/index.ts` (Gemini-powered chat endpoint)
- **Removed**: "LAUNCH SAL BOT" button, `isSalBotExpanded` state
- **Hero layout**: Now full-width (was split to accommodate chat panel)

#### Hero Text Made HUGE
- **Before**: `text-[12vw] sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4.5rem] 2xl:text-[5rem]`
- **After**: `text-[15vw] sm:text-[12vw] md:text-[11vw] lg:text-[9vw] xl:text-[8vw] 2xl:text-[7.5vw]`
- Viewport-width based sizing = scales massively on all screens

#### Color Updates (Lime → Hyperblue)
- "HOW I HELP YOU GROW [?]" → `text-[#00F0FF]` (was gradient)
- "THE SAL METHOD" → `text-[#00F0FF]` (was lime)
- Tagline accents (AI, EVERYTHING, COMPETITION, etc.) → `text-[#00F0FF]`
- Left border accent → `border-[#00F0FF]`
- MY GOAL, SILENT WORKERS, SMOOTH PIPELINES, CONSTANT GROWTH → `text-black`

#### WHY WORK WITH ME Modal
- Background: `bg-white` (was `glass-strong` grey)
- Close button: hover to gray-900 (was white)
- Added `shadow-2xl` for depth

#### 3D Parallax Room Background (NEW)
- **Component**: `ParallaxRoom.tsx`
- **Effect**: Wireframe 3D room (floor, ceiling, 4 walls) with mouse-driven parallax
- **Interaction**: Mouse position controls camera rotation (±8° max, smoothly interpolated)
- **Grid**: Subtle black lines on white background
- **Visibility**: Fades in after diorama fades out (scrollProgress 0.25 → 0.75)
- **Desktop only**: Disabled on mobile (no mouse to track)

#### Scroll-Up Animation Fix
- **Problem**: Hero text was jerking DOWN on scroll-up before fading
- **Root cause**: Direction detection was lagging by frames
- **Solution**: Phase-based state machine using refs
  - `hasReachedFullVisibility` ref tracks if hero was ever fully visible
  - Once true, any fade-out moves content UP (exit animation)
  - Resets when fully exited (allows re-entrance)
- **Result**: Smooth "rise up and out" on scroll-up, no jerk

### Files Changed
- `App.tsx` — Added scrollDirection prop to Hero
- `components/Hero.tsx` — SalBot removal, huge text, color updates, phase-based animation
- `components/ParallaxRoom.tsx` — NEW: 3D wireframe room with mouse parallax
- `api/chat/index.ts` — DELETED

### Commits (Session 6)
```
7229ea3 Session 6: Nuke SalBot, HUGE hero text, 3D parallax room background
```

### TODO for next session
- **Finish ParallaxRoom**: Tune grid density, room depth, rotation amount
- **Plan Hero → Armory transition**: User has full vision, needs implementation
- **Scroll choreography**: Map out the full tick-by-tick section transitions

---

## Session Log: Feb 3, 2026 (Session 7 — Dark Mode + Persistent Room3D)

### What was done
Complete dark mode conversion and persistent 3D room background that works across all pages.

#### Room3D Persistent Background
- **Moved from Hero.tsx to App.tsx**: Now renders at app level, persists across all tab changes
- **Overview tab**: Room3D fades in after diorama (scrollProgress controls opacity/trace)
- **Other tabs**: Room3D fully visible at opacity=1, scrollProgress=1 (black walls, dark grid, fully traced)
- **Desktop only**: Preserved original mobile exclusion

#### Dark Mode Conversion (Full Site)
All components updated with dark theme colors:
- Text: `text-gray-900` → `text-white`, `text-gray-500` → `text-gray-400`
- Borders: `border-gray-200` → `border-white/20`
- Updated: AuthModal, BookingPage, ClientHubOnboarding, Dashboard, GlassHeader, GlassNav, MeetSalman, TheOffer, Hero

#### Flat Black Panels (Not Transparent Glassmorphism)
- **Problem**: Transparent blur panels too jarring with 3D room motion
- **Solution**: Flat black panels with subtle borders
```css
.glass {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.glass-strong {
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### Frosty Radiosity Glows
- Removed hover glows on text/titles (useProximityGlow removed from all components)
- New glow style based on lime→cyan gradient:
```css
.btn-primary {
  box-shadow:
    0 0 15px rgba(204, 255, 0, 0.2),
    0 0 30px rgba(204, 255, 0, 0.1),
    0 0 45px rgba(0, 240, 255, 0.08);
}
```

#### Brutalist Grid Lines
- Grid color: darker grey (80→40 range based on scroll)
- Style: dotted with square caps
```typescript
ctx.lineCap = 'square';
ctx.lineJoin = 'miter';
const dotSize = 2;
const gapSize = 5;
ctx.setLineDash([dotSize, gapSize]);
```

#### Deleted Components
- `AmbientBackground.tsx` — replaced by Room3D
- `ParallaxRoom.tsx` — replaced by Room3D
- `PerspectiveGrid.tsx` — no longer needed

### Files Changed
- `App.tsx` — Added Room3D import and render at app level
- `components/Hero.tsx` — Removed Room3D import and render
- `components/Room3D.tsx` — NEW: Canvas-based 3D wireframe room
- `src/index.css` — Flat black glass panels, frosty radiosity glows
- All page components — Dark mode colors

### Commits (Session 7)
```
e62e8f2 Session 7: Dark mode, persistent 3D room background, flat black panels
```

### Ready for next session
- Visual QA on production (Vercel auto-deploy should be live)
- Fine-tune Room3D grid density/animation timing
- Test all pages with persistent background

---

## Session Log: Feb 3, 2026 (Session 7 Continued — Room3D Fixes)

### What was done
Fixed Room3D persistence and diorama transition issues.

#### Room3D Persistence Fix
- **Problem**: Room3D wasn't visible - covered by white backgrounds
- **Solution**: Z-index layering fixed:
  - Room3D: `z-0` (base layer, always visible)
  - Diorama: `z-[2]` (above Room3D, fades out)
  - Content: `z-10+` (above both)
- App.tsx background changed from `bg-white` to `bg-black`

#### Diorama Fade-to-Black Transition
- **Problem**: Diorama was fading directly to transparent (jarring)
- **Solution**: Two-phase transition:
  1. **0-25% scroll**: Black overlay fades IN over diorama
  2. **25-50% scroll**: Entire diorama container fades OUT → Room3D revealed
- Creates smooth cinematic: diorama → black → 3D grid room

#### Grid Lines Solid (Not Dotted)
- Removed `setLineDash([dotSize, gapSize])` pattern
- Lines are now solid with square caps (`ctx.lineCap = 'square'`)
- Cleaner, more premium look

### Files Changed
- `App.tsx` — Room3D opacity always 1, bg-black
- `components/Hero.tsx` — Two-phase diorama fade transition
- `components/Room3D.tsx` — Solid lines, z-0

### Commits (Session 7 Continued)
```
8f0b4dd Fix Room3D persistence: diorama fades to reveal grid
37d7677 Grid lines solid + diorama fade-to-black transition
```

### Key Learnings
- **Don't remove the diorama without asking** — user got stressed when I deleted it
- Z-index layering: Room3D (z-0) < Diorama (z-[2]) < Content (z-10+)
- Two-phase transitions (fade to black, then fade out) look more cinematic

### Ready for next session
- Test the full scroll flow: diorama → black → Room3D
- All other pages should show Room3D directly
- Consider adding scroll hint styling for dark background
