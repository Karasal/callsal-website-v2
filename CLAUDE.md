# Call Sal Website V2 — Glassmorphism Rebuild

## Commands
```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

## Live URLs
- **Production**: https://callsal-website-v2.vercel.app
- **GitHub**: https://github.com/Karasal/callsal-website-v2
- **Auto-deploy**: Pushes to `master` trigger Vercel builds

## Tech Stack
- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 + @tailwindcss/postcss
- Framer Motion 12
- Deployed on Vercel

## Design System
- **Aesthetic**: 2026 Glassmorphism + 3D wireframe room
- **Primary**: Lime (#CCFF00) — brand accent, CTAs
- **Secondary**: Cyan (#00F0FF) — hover states, glows
- **Background**: Pure black (#000000)
- **Typography**: Syne (display/headings) + Inter (body)
- **Panels**: Flat black with subtle borders (not transparent blur)
- **Animations**: Smooth ease, NO bouncy springs. Scroll-driven.
- **Ghost-fade standard**: NO scale-pop, NO x-slides. Only subtle `opacity + y:6-8px` fade-up (0.15-0.25s).

## CSS Classes (Design Tokens)
- `.glass` / `.glass-strong` / `.glass-nav` — flat black panels with subtle borders
- `.gradient-text` / `.gradient-text-reverse` — lime↔cyan gradient text
- `.gradient-border` — gradient border via mask trick
- `.glow-lime` / `.glow-cyan` / `-strong` variants — box-shadow glows
- `.btn-primary` — lime CTA button with frosty radiosity glow
- `.btn-glass` — glass button with cyan hover
- Font classes: `font-display` (Syne headings), `font-body` (Inter body)

## Components

### Core Shell
- `App.tsx` — Main shell, tab routing, auth state, shared mouse tracking, snap scroll
- `GlassHeader.tsx` — Compact pill header (logo, phone, location, time)
- `GlassNav.tsx` — Bottom pill nav (branding + home + auth), auto-hides at module zone

### 3D System (Desktop Only)
- `Room3DEnhanced.tsx` — Canvas 3D wireframe room with camera zoom + picture frame + panel shadow
- `ModuleManager.tsx` — Manages module panel state in 3D space
- `Module3DOverlay.tsx` — HTML cards positioned in 3D space, scrollable content panel + selector bar

### Overlays (Floating Panels)
- `TVOverlay.tsx` — VIEW CINEMATICS → floating TV with flip animation, video selector, info bar
- `BookingOverlay.tsx` — BOOK NOW → floating 4-step booking form

### Modules (content inside 3D panel)
- `modules/ArmoryModule.tsx` — SOFTWARE/HARDWARE tabs with detail modals
- `modules/CinematicsModule.tsx` — Full video portfolio, Hollywood Advantage, camera gear
- `modules/MeetSalmanModule.tsx` — Wraps MeetSalman
- `modules/TheOfferModule.tsx` — Wraps TheOffer
- `modules/BookingModule.tsx` — Wraps BookingPage

### Pages (full content components)
- `Hero.tsx` (~2000 lines) — Diorama, Wall3DTitle, TheArmory, VideoPortfolio inline
- `MeetSalman.tsx` — Bio, journey, philosophy, stats
- `TheOffer.tsx` — Free video offer, FAQ, video portfolio
- `BookingPage.tsx` — 4-step booking flow
- `AuthModal.tsx` — Login/register with key validation
- `Dashboard.tsx` — Admin booking management, client welcome
- `ClientHubOnboarding.tsx` — 11-step typeform-style onboarding

## Env Vars (Vercel)
```
REDIS_URL, JWT_SECRET, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL
```

## Architecture: 3D Module System

### Scroll Flow (Desktop)
1. **Diorama** (scrollProgress = 0) — Full-screen Calgary diorama image
2. **Hero** (scrollProgress = 0.7) — Wall3DTitle with CSS 3D transforms, white room
3. **Modules** (scrollProgress = 1.0) — Immersive panel + selector in black room

### Mouse Parallax
- Shared mouse state in App.tsx (smoothMouse with lerp 0.06)
- Passed to Room3DEnhanced and Hero (Wall3DTitle)
- Camera rotates ±8° based on mouse position

### Module System (Immersive 3D Panel)
- **5 modules**: Armory, Cinematics, Meet Salman, The Offer, Book Meeting
- **Single centered panel** (3D pos: x:0 y:3.8 z:6.5, 6.0×3.5) — content + horizontal selector bar
- **No modal** — content lives directly in the 3D panel, scrollable within
- Content scaled at 1600px base width, negative marginBottom corrects scroll height
- Tab switch: opacity:0 → scrollTop:0 → reveal (clean transition)
- **Smart scroll**: hover panel → scroll module content; hover outside → snap scroll
- **Header/Nav auto-hide**: fade out as scrollProgress approaches module zone (0.8→1.0)
- All page content accessed via module wrappers; only `overview` and `dashboard` routes in App.tsx

## Key Decisions
- **Flat black panels** — 3D room motion made transparent blur jarring
- **CSS 3D transforms** for hero title — simpler than canvas text projection
- **HTML-only clicks** — canvas renders room, HTML handles interaction (scroll passthrough)
- **Three snap points** — smoother UX (diorama → hero → modules)
- **No modal, content in 3D** — panel IS the experience
- **Sine easing** for camera zoom — smoother than quadratic

## Gotchas
- Entry point is `index.tsx` at root (not `src/main.tsx`)
- tsconfig strict mode OFF — v1 code wasn't written for it
- Z-index: Room3D (z-0) < Diorama (z-[2]) < Modules (z-50-60) < Nav/Header (z-9999)
- Double RAF needed for nav indicator positioning (fonts must paint first)
- OKLCH color space prevents muddy gradients (hue 118° = lime, hue 190° = cyan)

## Current State (Session 26, Feb 6, 2026)
- 3D room with camera zoom, picture frame, diorama parallax
- CSS 3D hero title synced with mouse parallax
- Immersive centered module panel (5 modules, horizontal selector bar)
- Three-point snap scroll + smart scroll
- TVOverlay (VIEW CINEMATICS) + BookingOverlay (BOOK NOW)
- Hash deep links (#book, #about, #offer)
- Dead code audit complete (~730 lines removed, +1011 demoContent.ts)
- Content parity complete: Armory + Cinematics match V1 content
- Animated lime→cyan gradient border beam on module panel
- Claude/Gemini AI platform logo cards in Armory
- TVOverlay shows video descriptions in NOW PLAYING bar
- Home button removed from GlassNav (redundant)
- Booking flow fully working (date/time/contact steps)
- Module panel gradient scrollbar (lime→cyan)
- Cinematics video player grid moved above footer CTA
- Auth modal header fixed (black bg)
- Hero text: lime accents, black stroke, text shadows
- BookingOverlay mobile scroll fix

## Known Issues
- Duplicate content: TheArmory/VideoPortfolio in Hero.tsx (mobile) AND module files (desktop) — ~1500 lines
- Duplicate logic: BookingOverlay.tsx vs BookingPage.tsx — same 4-step flow in two presentations
- `onStart` prop on Hero wired to no-op — DISCOVER/MEET SALMAN buttons on mobile do nothing
- Auth login requires server-side API (Vercel serverless functions)

## TODO
- [ ] Visual QA on all overlays and modules
- [ ] Performance audit (Lighthouse)
- [ ] Auth flow end-to-end testing on Vercel

## Session History
See [SESSION_LOG.md](SESSION_LOG.md) for detailed session-by-session development history.
