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
- `Room3DEnhanced.tsx` — Canvas 3D wireframe room with camera zoom + picture frame + panel shadow
- `ModuleManager.tsx` — State machine (diorama → floating → zoomed)
- `Module3DOverlay.tsx` — HTML cards positioned in 3D space, fly-to-fullscreen
- `TVOverlay.tsx` — Cinematics mode: flip animation, video player, selector, info bar

### Modules
- `modules/ArmoryModule.tsx` — SOFTWARE/HARDWARE tabs with detail modals
- `modules/CinematicsModule.tsx` — Full VideoPortfolio content (videos, Hollywood Advantage, camera gear)
- `modules/MeetSalmanModule.tsx` — Wraps MeetSalman with preview card
- `modules/TheOfferModule.tsx` — Wraps TheOffer with preview card
- `modules/BookingModule.tsx` — Wraps BookingPage with preview card

### Overlays (Floating Panels)
- `BookingOverlay.tsx` — Floating 4-step booking form (TVOverlay pattern)
- `TVOverlay.tsx` — Floating TV with video selector + info bar (flip animation)

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
│   │   ├── ArmoryModule.tsx
│   │   └── CinematicsModule.tsx
│   ├── BookingOverlay.tsx
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
3. **Modules** (scrollProgress = 1.0) — Preview panel + selector in black room

### Mouse Parallax
- Shared mouse state in App.tsx (smoothMouse with lerp 0.06)
- Passed to Room3DEnhanced and Hero (Wall3DTitle)
- Camera rotates ±8° based on mouse position

### Module System (Immersive 3D Panel)
- **5 modules**: Armory, Cinematics, Meet Salman, The Offer, Book Meeting
- **Single centered panel** (3D pos: x:0 y:3.8 z:6.5, 6.0×3.5) — content + horizontal selector bar
- **No modal** — content lives directly in the 3D panel, scrollable within
- Content scaled at 1600px base width for tame sizing, negative marginBottom corrects scroll height
- Tab switch: opacity:0 → scrollTop:0 → reveal (clean transition, no jarring flash)
- Horizontal selector bar at bottom with spring-animated gradient indicator (lime→cyan)
- **Smart scroll**: hover panel → scroll module content; hover outside → snap scroll to hero
- **Header/Nav auto-hide**: fade out as scrollProgress approaches module zone (0.8→1.0)
- **GlassNav** is a thin pill (bottom-right) with branding + home + auth only
- All page content (MeetSalman, TheOffer, BookingPage) accessed via module wrappers
- Only `overview` and `dashboard` routes remain in App.tsx

## Key Decisions
- **Flat black panels** instead of transparent blur — 3D room motion made blur jarring
- **CSS 3D transforms** for hero title — simpler than canvas text projection
- **HTML-only clicks** for modules — canvas renders room, HTML cards handle all interaction (allows scroll passthrough)
- **Three snap points** — smoother UX than two (diorama → hero → modules)
- **Sine easing** for camera zoom — smoother than quadratic
- **No modal, content in 3D** — panel IS the experience, no click-to-open fullscreen
- **Liquid glass nav/header** — subtle white tint + blur + border, auto-hide at module zone
- **Ghost-fade animation standard** — NO scale-pop, NO x-slides. Only subtle `opacity + y:6-8px` fade-up. Quick (0.15-0.25s). Scroll-driven animations are fine.

## Gotchas
- Vite scaffold puts entry in `src/main.tsx` — we use `index.tsx` at root
- tsconfig strict mode OFF — v1 code wasn't written for it
- `font-heading` → `font-display`, `font-mono` → `font-body`
- Z-index layering: Room3D (z-0) < Diorama (z-[2]) < Modules (z-50-60) < Nav/Header (z-9999)
- Double RAF needed for nav indicator positioning (fonts must paint first)
- OKLCH color space prevents muddy gradients (hue 118° = lime, hue 190° = cyan)

## Current State (Feb 5, 2026)
- ✅ 3D room with camera zoom, picture frame, diorama parallax
- ✅ CSS 3D hero title synced with mouse parallax
- ✅ Immersive centered module panel in 3D space (no modal, content IS the panel)
- ✅ Horizontal selector bar with 5 modules + gradient indicator
- ✅ Three-point snap scroll + smart scroll (hover panel = scroll content, outside = snap)
- ✅ Header/Nav auto-hide at module zone
- ✅ TVOverlay: VIEW CINEMATICS → floating TV quick-view
- ✅ BookingOverlay: BOOK NOW → floating 4-step booking form
- ✅ Hash deep links (#book, #about, #offer) auto-scroll to modules + select
- ✅ Dead code audit: ~730 lines removed (Session 23)

### Known Issues / Broken Things
- Auth/booking flows untested after modal removal
- TVOverlay and BookingOverlay may need adjustments after UI hide changes
- Need content QA pass comparing v1 vs v2 module content
- Duplicate content: TheArmory/VideoPortfolio exist in both Hero.tsx (mobile) and module files (desktop 3D) — ~1500 lines of duplication (design decision needed)
- Duplicate logic: BookingOverlay.tsx vs BookingPage.tsx — same 4-step booking flow in two presentations
- ~20 unused lucide-react icon imports in Hero.tsx (tree-shaken at build, cosmetic)
- `onStart` prop on Hero wired to no-op — DISCOVER and MEET SALMAN buttons on mobile do nothing

### NEXT SESSION (Session 24) — MISSION
**Content QA & Full Flow Testing**: Compare all 5 modules to v1 content, test auth/booking/deep links end-to-end, visual QA at different screen sizes.

### Session 23 (Feb 5, 2026)
- **Dead code audit**: Comprehensive codebase audit for invisible/wasteful elements
- **Deleted Room3D.tsx**: 421 lines, never imported (fully replaced by Room3DEnhanced)
- **Removed dead state/props**: totalScrollProgress, scrollDirection→Hero, viewState/zoomProgress/activeModuleId across App/Room3DEnhanced/ModuleManager/Module3DOverlay
- **Stripped isPreview mode**: All 5 module components had dead preview card code (~200 lines) — isPreview was always false
- **Removed 15 dead useRefs**: MeetSalman (3), TheOffer (9), BookingPage (1), Hero (2) — assigned to DOM but never read
- **Cleaned types/modules.ts**: Removed ViewState, Position3D, ModuleManagerState, Room3DEnhancedProps, easing functions
- **Removed dead ImageModal**: MeetSalman had import + state + JSX for image lightbox that was never triggered
- **Net result**: -773 lines, +39 lines. Zero behavior change. Build verified clean.

### Session 22 (Feb 5, 2026)
- **Scroll height fix**: CSS `transform:scale()` doesn't affect layout — scroll area was 2x visual height
- **Solution**: ResizeObserver tracks `scrollHeight`, applies negative `marginBottom` to match scroll area to visual content
- **Module tab switching**: Hide content (opacity:0) → scroll to top → reveal next frame (no jarring flash)
- **Armory compacted**: Removed fixed `lg:h-[550px]` grid height, tightened margins (mb-8→mb-4, mt-8→mt-4)
- **Bottom padding trimmed**: Armory/Cinematics/Booking wrappers `pb-8` → `pb-2`
- **TheOffer**: Added `pb-8` wrapper so bottom quote isn't clipped

### Session 21 (Feb 5, 2026)
- **Immersive 3D Panel**: Removed fullscreen modal entirely — content lives IN the 3D panel
- **Centered panel**: Single panel at x:0 y:3.5 z:6.5 (6.0×3.5), perfectly centered with camera
- **Horizontal selector bar**: Replaced vertical right panel with bottom selector bar + gradient indicator
- **Content scaling**: 1600px base width for tame content sizing inside panel
- **Scrollable content**: Module content scrolls within the 3D panel (overflow-y-auto)
- **Smart scroll**: body.dataset.modulePanelHover tracks hover; wheel over panel = scroll content, outside = snap
- **Header/Nav auto-hide**: Computed uiHide from scrollProgress (0.8→1.0 fade out)
- **Diorama parallax**: Base pan/tilt (0.05/0.03) even at scrollProgress 0 — picture frame subtly alive
- **Deep links scroll**: openModuleId now auto-scrolls to module zone
- **Massive cleanup**: Removed activeModuleId, zoomProgress, zoom animation, 155 lines deleted
- **ModuleManager simplified**: No more onZoomChange, handleOpenModule, handleCloseModule

### Session 20 (Feb 5, 2026)
- **Unified Module Selector**: Replaced N floating cards with 2 fixed 3D panels (preview + selector)
- **5 modules**: Armory, Cinematics, Meet Salman, The Offer, Book Meeting
- **New wrappers**: MeetSalmanModule.tsx, TheOfferModule.tsx, BookingModule.tsx (preview + full modes)
- **Selector panel**: Vertical list with spring-animated gradient indicator bar (lime→cyan)
- **GlassNav rewrite**: Full tab bar → thin pill (bottom-right, rounded-full) with branding + home icon + auth
- **App.tsx simplified**: Only overview + dashboard routes; MeetSalman/TheOffer/BookingPage removed from direct rendering
- **Hash deep links**: #book → book-meeting module, #about → meet-salman, #offer → the-offer
- **onConsultation rewired**: All callbacks now open book-meeting module instead of tab navigation
- **Room3DEnhanced**: 2 fixed frame shadows, removed modules prop/hit detection/hover tracking
- **types/modules.ts cleaned**: Removed PageId, page, basePosition from ModuleMetadata
- **Pill fix**: BrandingElement `w-auto` + `px-6 gap-4` prevents copyright text bleeding into home icon

### Session 19 (Feb 5, 2026)
- **Animation Purge**: Removed ALL scale-pop and x-slide Framer Motion animations across 9 files
- **Ghost-fade standard**: Every transition now uses subtle `opacity: 0, y: 6-8px` → visible, 0.15-0.25s duration
- **Killed**: `scale: 0.9x` pop (6), `x: ±20/±40` slides (10), `[0.16, 1, 0.3, 1]` overshoot easing (3)
- **BookingOverlay**: Centered on screen (flex container), min-height 520px prevents layout shifts between steps
- **Scroll-driven animations untouched** — diorama→hero→modules transitions are smooth and stay as-is

### Session 18 (Feb 5, 2026)
- **Module Consolidation**: 3 modules → 2 (removed THE SAL METHOD placeholder)
- **CinematicsModule.tsx**: New self-contained module with ALL VideoPortfolio content (intro, video grid, Hollywood Advantage, camera gear sections, internal video/image modals)
- **BookingOverlay.tsx**: Floating 4-step booking panel (meeting type → date → time → contact), follows TVOverlay pattern with mouse parallax
- **Hero Buttons**: VIEW CINEMATICS → cinematicsMode (TVOverlay), BOOK NOW → bookingMode (BookingOverlay)
- **Both overlays**: fade hero title, hide picture frame, lock scroll
- **Module3DOverlay**: "SO WHO IS THIS SAL GUY ANYWAY?" CTA at modal bottom → navigates to about page
- **BookingPage Fix**: Solid bg-black wrapper prevents 3D wireframe bleed-through
- **openModuleId prop**: Allows programmatic module opening from hero or nav

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
- [ ] Visual QA on all overlays and modules
- [ ] Test auth/booking flows end-to-end
- [ ] Performance audit (Lighthouse)

## Session History
See [SESSION_LOG.md](SESSION_LOG.md) for detailed session-by-session development history.
