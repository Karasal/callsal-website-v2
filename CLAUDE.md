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

## CSS Classes (Design Tokens)
- `.glass` / `.glass-strong` / `.glass-nav` — flat black panels with subtle borders
- `.gradient-text` / `.gradient-text-reverse` — lime↔cyan gradient text
- `.gradient-border` — gradient border via mask trick
- `.glow-lime` / `.glow-cyan` / `-strong` variants — box-shadow glows
- `.btn-primary` — lime CTA button with frosty radiosity glow
- `.btn-glass` — glass button with cyan hover

## Font Class Mapping (v1 → v2)
| v1 Class | v2 Class | Usage |
|----------|----------|-------|
| `font-heading` | `font-display` | Headings (Syne) |
| `font-mono` | `font-body` | Body text (Inter) |

## Components

### Core Shell
- `App.tsx` — Main shell, tab routing, auth state, shared mouse tracking, snap scroll
- `GlassHeader.tsx` — Compact pill header (logo, phone, location, time)
- `GlassNav.tsx` — Bottom nav (5 tabs, auth, gradient indicator)

### 3D System (Desktop Only)
- `Room3D.tsx` — Canvas 3D wireframe room with camera zoom + picture frame
- `Room3DEnhanced.tsx` — Room3D + module card rendering + hit detection
- `ModuleManager.tsx` — State machine (diorama → floating → zoomed)
- `Module3DOverlay.tsx` — HTML cards positioned in 3D space, fly-to-fullscreen
- `TVOverlay.tsx` — Cinematics mode: flip animation, video player, selector, info bar

### Modules
- `modules/ArmoryModule.tsx` — SOFTWARE/HARDWARE tabs with detail modals

### Pages
- `Hero.tsx` (~2000 lines) — Diorama, Wall3DTitle, TheArmory, VideoPortfolio inline
- `MeetSalman.tsx` — Bio, journey, philosophy, stats
- `TheOffer.tsx` — Free video offer, FAQ, video portfolio
- `BookingPage.tsx` — 4-step booking flow
- `AuthModal.tsx` — Login/register with key validation
- `Dashboard.tsx` — Admin booking management, client welcome
- `ClientHubOnboarding.tsx` — 11-step typeform-style onboarding
- `ImageModal.tsx` — Fullscreen image lightbox

### Types
- `types/modules.ts` — ModuleMetadata, ViewState, module type definitions
- `types.ts` — Booking, User, API types (from v1)

## Project Structure
```
callsal-website-v2/
├── api/                    ← Copied from v1 (zero changes)
│   ├── auth/               ← login, logout, me, register
│   ├── admin/              ← bookings management
│   ├── bookings/           ← availability
│   ├── client/             ← onboarding
│   ├── email/              ← send (booking confirmations)
│   └── lib/                ← auth helpers, storage
├── components/
│   ├── modules/            ← Extracted module content
│   │   └── ArmoryModule.tsx
│   ├── GlassHeader.tsx
│   ├── GlassNav.tsx
│   ├── Hero.tsx
│   ├── Room3D.tsx
│   ├── Room3DEnhanced.tsx
│   ├── ModuleManager.tsx
│   ├── Module3DOverlay.tsx
│   ├── MeetSalman.tsx
│   ├── TheOffer.tsx
│   ├── BookingPage.tsx
│   ├── AuthModal.tsx
│   ├── Dashboard.tsx
│   ├── ClientHubOnboarding.tsx
│   └── ImageModal.tsx
├── hooks/
│   └── useMobileAnimations.ts
├── services/
│   ├── demoContent.ts
│   └── storageService.ts
├── types/
│   └── modules.ts
├── public/                 ← Images, calgary-diorama.jpg
├── src/
│   └── index.css           ← Design system
├── App.tsx
├── index.tsx
├── types.ts
├── vercel.json
└── package.json
```

## Env Vars (Vercel)
```
REDIS_URL=...
JWT_SECRET=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
ADMIN_EMAIL=...
```

## Architecture: 3D Module System

### Scroll Flow (Desktop)
1. **Diorama** (scrollProgress = 0) — Full-screen Calgary diorama image
2. **Hero** (scrollProgress = 0.7) — Wall3DTitle with CSS 3D transforms, white room
3. **Modules** (scrollProgress = 1.0) — Floating cards in black room

### Mouse Parallax
- Shared mouse state in App.tsx (smoothMouse with lerp 0.06)
- Passed to Room3D/Room3DEnhanced and Hero (Wall3DTitle)
- Camera rotates ±8° based on mouse position

### Module Click Flow
1. HTML cards in Module3DOverlay handle click/hover directly (canvas is visual-only)
2. ModuleManager sets activeModule, triggers zoomProgress animation
3. Floating cards fade out (opacity transition)
4. Fullscreen modal fades in instantly (pre-loaded, no scaling)
5. Close button fades modal out, cards fade back in

## Key Decisions
- **Flat black panels** instead of transparent blur — 3D room motion made blur jarring
- **CSS 3D transforms** for hero title — simpler than canvas text projection
- **HTML-only clicks** for modules — canvas renders room, HTML cards handle all interaction (allows scroll passthrough)
- **Three snap points** — smoother UX than two (diorama → hero → modules)
- **Sine easing** for camera zoom — smoother than quadratic
- **Linear easing** for fly-to-fullscreen — no "pop" effect
- **Liquid glass nav/header** — subtle white tint + blur + border, always z-[9999]

## Gotchas
- Vite scaffold puts entry in `src/main.tsx` — we use `index.tsx` at root
- tsconfig strict mode OFF — v1 code wasn't written for it
- `font-heading` → `font-display`, `font-mono` → `font-body`
- Z-index layering: Room3D (z-0) < Diorama (z-[2]) < Modules (z-50-100) < Zoomed (z-1000) < Nav/Header (z-9999)
- Double RAF needed for nav indicator positioning (fonts must paint first)
- OKLCH color space prevents muddy gradients (hue 118° = lime, hue 190° = cyan)

## Current State (Feb 4, 2026)
- ✅ 3D room with camera zoom and picture frame
- ✅ CSS 3D hero title synced with mouse parallax
- ✅ Module cards float in room, fly to fullscreen on click
- ✅ Three-point snap scroll works both directions
- ✅ All pages functional with dark mode
- ✅ Module clicks work without blocking scroll (HTML-based)
- ✅ Liquid glass nav/header always visible (z-9999)
- ✅ Smooth scroll transitions (diorama + hero title fade before modules)

### Known Issues
- None currently identified

### Session 17 (Feb 4, 2026)
- **Module Modal Rewrite**: Fade-to-modal replaces jerky zoom animation
- Floating cards fade out, fullscreen modal fades in instantly
- Modal at natural size (max-w-5xl), no transform scaling that caused jank
- Prev/next navigation arrows for module switching
- **Snap Scroll Fix**: Wheel listener on window (catches events over fixed overlays)
- **Ghosted Hero Fix**: Both directions snap to 0.7 (white room, black text)
- **UI Ghost Fix**: Header/Nav opacity + position use 0.7 threshold for backward scroll
- Removed scroll-up-to-open on modules (caused instability)

### Session 16 (Feb 4, 2026)
- **Cinematics Mode**: New TVOverlay.tsx with flip animation
- Hero buttons changed: "VIEW CINEMATICS" (primary) + "BOOK NOW" (secondary)
- Click VIEW CINEMATICS → hero title fades, TV flips from diorama to video player
- Floating panels: TV (38% width) + Selector + Info bar with subtle parallax
- Fixed sizes (no 3D projection resize), just translation parallax on mouse
- Snap scroll disabled during cinematicsMode to prevent scroll lock
- canInteract threshold lowered to 0.6 for floating point safety

### Session 15 (Feb 4, 2026)
- Diorama picture frame fades out 0.7→0.9 scrollProgress (invisible before modules)
- Hero title fades out instantly 0.75→0.80 (was 0.85→1.0, eliminated overlap)

### TODO
- [ ] Extract "THE SAL METHOD" content as module
- [ ] Extract "THE SAL METHOD" content as module
- [ ] Visual QA on remaining pages
- [ ] Test auth/booking flows end-to-end
- [ ] Performance audit (Lighthouse)

## Session History
See [SESSION_LOG.md](SESSION_LOG.md) for detailed session-by-session development history.
