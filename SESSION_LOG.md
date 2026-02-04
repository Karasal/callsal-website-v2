# Call Sal Website V2 — Session Log

Historical session logs moved from CLAUDE.md for cleaner project context.

---

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

---

## Session Log: Feb 3, 2026 (Session 7 Part 3 — Camera Zoom + Picture Frame)

### What was done
Cinematic 3D camera zoom-out effect where landing page IS the diorama in a picture frame.

#### Camera Zoom-Out on Scroll
- **Concept**: Start zoomed in on diorama (fills screen), scroll to zoom out and reveal 3D room
- **Camera interpolation** based on scroll progress:
  - `camY`: 2.5 → 3.5 (subtle Y shift)
  - `camZ`: 7.5 → 2.0 (zoom out)
- **Sine easing**: `(1 - Math.cos(zoomProgress * Math.PI)) / 2` for drone-like smooth glide
- **Mouse parallax disabled when zoomed in**: `maxPan = 0.3 * easeZoom`

#### Picture Frame with Diorama
- Diorama image loaded and rendered inside a 3D picture frame on back wall
- Frame dimensions: 4 units wide × 2.5 units tall
- Position: centered horizontally, close to floor (`frameY = 2.5`)
- **Flat black bezel**: 8px stroke, square caps, no glow

#### Color Transition Timing
- **Problem**: Walls changing color while zoomed in looked wrong
- **Solution**: Delay color transition to back half of scroll
- `colorProgress = (sp - 0.7) * 3.33` — only 70-100% scroll range
- Zoom completes first, THEN colors dissolve white→black

#### Other Fixes
- **GlassHeader/GlassNav**: Added `overflow-visible` to prevent button glow clipping
- **Hero text**: Thicker black stroke (`WebkitTextStroke: '3px #000'`)

#### 3D Hero Text (Attempted & Reverted)
- Tried rendering "HI - IT'S YOUR NEW PAL, SAL!" as 3D text on back wall
- Would reveal organically during zoom-out
- **Reverted**: User wants step-by-step approach to get this right

### Technical Details

#### 3D Projection
```typescript
const project = (x, y, z, w, h, camX, camY, camZ) => {
  const fov = Math.PI / 2; // 90 degrees
  const scale = w / (2 * Math.tan(fov / 2));
  const dx = x - camX, dy = y - camY, dz = z - camZ;
  if (dz <= 0) return null;
  return { x: w/2 + (dx/dz)*scale, y: h/2 + (dy/dz)*scale };
};
```

#### Camera Zoom Easing
```typescript
const zoomProgress = Math.min(1, sp);
const easeZoom = (1 - Math.cos(zoomProgress * Math.PI)) / 2; // Sine easing
const camY = 2.5 + (3.5 - 2.5) * easeZoom;
const camZ = 7.5 + (2.0 - 7.5) * easeZoom;
```

### Files Changed
- `components/Room3D.tsx` — Camera zoom, picture frame, color timing
- `components/GlassHeader.tsx` — overflow-visible
- `components/GlassNav.tsx` — overflow-visible
- `components/Hero.tsx` — Thicker text stroke

### Commits
```
1a7d1a7 Session 7: 3D room with camera zoom + picture frame
```

### Key Learnings
- **Sine easing** is smoother than quadratic for camera movement
- **Delay visual changes** until zoom completes for cleaner UX
- **3D text on wall** is ambitious — needs careful step-by-step implementation

### TODO for next session
User wants to implement 3D hero text on back wall with step-by-step guidance:
1. Define exact text content and positioning
2. Test font rendering at various distances
3. Handle lime/cyan highlights properly
4. Coordinate with scroll progress
5. Make sure it looks organic, not tacked on

---

## Session Log: Feb 3, 2026 (Session 9 — 3D Nav Attempt #2 + Revert)

### What happened
Attempted to render GlassHeader and GlassNav as 3D objects painted on the back wall of Room3D canvas. The goal was for nav elements to rotate WITH the room when mouse parallax moves the camera.

### Approaches tried
1. **Bilinear interpolation for text positioning** — calculated text positions relative to projected panel corners
2. **Canvas rotation** — applied `ctx.rotate()` to match panel angle
3. **Multiple iterations** — tried various fixes but text kept appearing flat/rotated incorrectly

### Why it failed
- Canvas 2D doesn't support true perspective transformation of text
- Rotating text by panel angle isn't enough — need full perspective skew
- The complexity kept growing without solving the core problem

### Resolution
**Reverted to backup**: `git reset --hard backup-before-3d-nav`
- Commit: `b558a95`
- Tag: `v2-stable-before-3d-nav`
- Site is back to working state with HTML-based header/nav

### Key Learnings
- **Canvas 2D limitations**: Can't do true perspective text without complex matrix transforms or drawing text to offscreen canvas then projecting as texture
- **Step-by-step with feedback**: When attempting complex visual changes, get user approval at EACH small step before proceeding
- **Backups are essential**: The branch/tag we created in Session 8 saved us

### Current stable state
- Room3D renders 3D wireframe room + diorama picture frame
- GlassHeader/GlassNav are HTML overlays (work correctly)
- Hero content visible with scroll-driven animations
- All other pages functional

### Options for next session (if user wants 3D nav)
1. **WebGL/Three.js** — true 3D text rendering with proper perspective
2. **CSS 3D transforms** — position HTML elements in 3D space with `transform-style: preserve-3d`
3. **Keep HTML overlays** — accept that nav doesn't rotate with room (current state works fine)
4. **Hybrid approach** — render nav panels as 3D quads in canvas, but keep text as positioned HTML

---

## Session Log: Feb 4, 2026 (Session 10 — CSS 3D Hero Title)

### What was done
Implemented CSS 3D transforms for hero title that syncs with Room3D mouse parallax.

#### Shared Mouse State (App.tsx)
- Lifted mouse tracking from Room3D to App.tsx
- Smooth interpolation with lerp (0.06 factor)
- Passed as `smoothMouse` prop to both Room3D and Hero

#### Wall3DTitle Component (Hero.tsx)
- CSS 3D transforms matching Room3D camera math exactly
- `rotateY` and `rotateX` calculated from same pan/tilt angles
- `transformOrigin: 'center center -300px'` — pushes pivot point back toward wall
- `scale: 0.9 + 0.2 * easeZoom` — subtle depth scaling
- Fades in during scroll (30-70% progress)
- Desktop only (mobile keeps original hero)

#### Layout (final "perfect" state)
- Left-justified (`items-start text-left`)
- Subtitle: "HOW I HELP YOU GROW" with lime accent line
- Multi-line title: "HI - IT'S / YOUR NEW / PAL, SAL!"
- 3px black stroke on white text, lime highlights on HI and SAL
- Blurb with cyan `border-l-2` accent
- Two buttons: SEE MY PROCESS (primary), VIEW CINEMATICS (glass)

#### Canvas Text Attempt (reverted)
- Tried rendering title directly in Room3D canvas
- Would truly fix text to the 3D wall
- Reverted because CSS approach is simpler and user liked the result

### Files Changed
- `App.tsx` — Shared mouse state, passed to Room3D and Hero
- `components/Hero.tsx` — Wall3DTitle component, mobile hero preserved
- `components/Room3D.tsx` — Receives smoothMouse prop, fixed variable redeclaration bug

### Commits
```
b1f814a Session 10: CSS 3D hero title with mouse parallax
```

### Key Learnings
- **CSS 3D transforms** can simulate "on wall" effect with proper transformOrigin
- **Shared state** between canvas and CSS is key for synced animations
- **Canvas text is hard** — perspective projection of text needs complex matrix math
- **Iterate with user feedback** — get approval at each step before over-engineering

### Current State
- Hero title rotates with mouse parallax (synced to Room3D)
- Title feels like it's "in the scene" but not perfectly fixed to wall
- User happy with current "perfect" sizing and layout
- Buttons are interactive after scroll completes (70%+ progress)

### TODO for next session
- Consider true canvas text if user wants it fixed to wall
- Or accept current CSS approach as "good enough"
- Test on production after deploy

---

## Session Log: Feb 4, 2026 (Session 11 — 3D Floating Module System)

### What was built
Complete 3D module system for displaying page sections as floating cards in Room3D canvas.

#### New Components
- `types/modules.ts` — ModuleMetadata, ViewState, module types
- `components/ModuleManager.tsx` — State machine (diorama/floating/zoomed)
- `components/Room3DEnhanced.tsx` — Canvas with module card rendering + hit detection

#### Three-Point Snap Scroll
- **Tick 0**: Diorama (scrollProgress = 0)
- **Tick 1**: Hero text (scrollProgress = 0.7) — white room, black text
- **Tick 2**: Module cards (scrollProgress = 1.0) — black room, white text

#### Dynamic Text Color
Text transitions black→white synchronized with room white→black:
```js
const colorProgress = (scrollProgress - 0.7) * 3.33; // 0.7→1.0
const textGrey = Math.round(255 * colorProgress);
```
Applied to: Hero blurb, VIEW CINEMATICS button, GlassHeader, GlassNav

#### Camera Follows Mouse
Fixed rotation direction in Room3DEnhanced — removed negative signs so camera looks toward mouse pointer instead of away from it.

#### Module Cards
- Positioned inside room at z=6-7 (between camera at z=2 and back wall at z=10.5)
- Canvas-rendered with hit detection for clicks
- Hover glow effect (lime border)
- Placeholder content (real extraction pending)

### Files Changed
- `App.tsx` — Three-point snap scroll, ModuleManager integration, disabled progress bar
- `components/Hero.tsx` — Wall3DTitle with dynamic colors, adjusted fade timing
- `components/GlassHeader.tsx` — Dynamic text color based on scrollProgress
- `components/GlassNav.tsx` — Dynamic text color based on scrollProgress
- `components/ModuleManager.tsx` — NEW: State machine coordinator
- `components/Room3DEnhanced.tsx` — NEW: Canvas module rendering
- `types/modules.ts` — NEW: Module type definitions

### Commits
```
e39a462 Session 11: 3D floating module system (WIP)
```

### Known Issues
1. **Scroll distance inconsistency**: When going back from modules→hero, text appears ghosted/faded (snap not landing at exact scrollProgress)
2. **Module content placeholders**: TheArmory and VideoPortfolio not yet extracted to module components

### Architecture Decisions
- **Hybrid approach**: Canvas for floating cards (parallax), HTML overlay for zoomed content
- **Three snap points** instead of two for smoother UX (diorama → hero → modules)
- **Desktop-first**: TheArmory/VideoPortfolio hidden on desktop (replaced by module system), still inline on mobile

### TODO for next session
- [ ] Fix scroll distance inconsistency (hero ghosted when going back)
- [ ] Extract TheArmory to `modules/TheArmory.tsx`
- [ ] Extract VideoPortfolio to `modules/VideoPortfolio.tsx`
- [ ] Create ModuleZoomView for full HTML content overlay
- [ ] Test carousel navigation between modules

---

## Session Log: Feb 4, 2026 (Session 12 — 3D Module Fly-to-Fullscreen)

### What was built
Complete 3D module system where cards float in the room, and clicking flies the card to fullscreen.

#### New Components
- `components/modules/ArmoryModule.tsx` — Extracted Armory as standalone module with full content
- `components/Module3DOverlay.tsx` — HTML cards positioned in 3D space with fly-to-fullscreen transitions

#### Key Features
1. **3D Card Positioning**: HTML content rendered in cards that match canvas 3D projection
2. **Fly-to-Fullscreen**: Click a card → it smoothly flies from 3D position to centered fullscreen
3. **Camera Zoom**: Room3D camera flies toward clicked module (subtle eye candy)
4. **Responsive Target**: Fullscreen is `min(80% screen width, 1000px)` × `75% height`
5. **Scroll Passthrough**: Cards are visual-only (`pointer-events: none`), canvas handles clicks
6. **Snap Scroll Works**: Can scroll back up to hero from module screen

#### Architecture
- **Canvas (Room3DEnhanced)**: Renders 3D room, grid, handles click/hover detection
- **HTML Overlay (Module3DOverlay)**: Renders actual module content positioned in 3D space
- **Hybrid Approach**: Canvas for interaction, HTML for content (responsive)

#### Camera Math (synced between canvas and overlay)
```javascript
// Camera flies toward module on click
const targetCamX = target.x * 0.02;  // Almost centered
const targetCamY = baseCamY;          // Don't move Y
const targetCamZ = target.z - 3.5;    // Stop 3.5 units in front

// Constrained rotation for subtle parallax
const maxPan = 0.08 * easeZoom * (1 - zp);
const maxTilt = 0.05 * easeZoom * (1 - zp);
```

#### Fly-to-Fullscreen Interpolation
```javascript
// Linear easing for clean scaling (no pop)
const ease = zoomProgress;

// Target responsive size
const targetWidth = Math.min(screenW * 0.8, 1000);
const targetHeight = screenH * 0.75;

// Interpolate position/size
const currentX = isActive ? transform.x + (targetX - transform.x) * ease : transform.x;
// ... etc
```

#### Key Decisions
- **Linear easing** instead of smoothstep — no "pop" effect
- **Center-origin scaling** — content scales outward from center, not corner
- **Cards visual-only when not active** — scroll events pass through to snap scroll
- **Canvas handles clicks** — existing hit detection in Room3DEnhanced

### Files Changed
- `components/modules/ArmoryModule.tsx` — NEW: Full Armory content as module
- `components/Module3DOverlay.tsx` — NEW: 3D positioned HTML cards
- `components/ModuleManager.tsx` — Wires Room3D + Module3DOverlay together
- `components/Room3DEnhanced.tsx` — Camera targeting, constrained rotation
- `types/modules.ts` — Added `isPreview` prop to ModuleContentProps

### Commits
```
a137148 Session 12: 3D module system with fly-to-fullscreen transition
```

### What Works
- ✅ Cards float in 3D room with real content preview
- ✅ Click card → flies smoothly to fullscreen center
- ✅ Scroll back up from module screen (snap scroll)
- ✅ Close button appears when zoomed
- ✅ Responsive fullscreen target size
- ✅ Subtle camera zoom as eye candy

### TODO for next session
- [ ] Extract VideoPortfolio as `CinematicsModule.tsx`
- [ ] Extract "THE SAL METHOD" content as module
- [ ] Fine-tune fullscreen size/position if needed
- [ ] Test on production (Vercel auto-deploy)

---

## Session Log: Feb 4, 2026 (Session 13 — Scroll Debug Deferred)

### What happened
Investigated scroll-up issue where modules→hero transition doesn't land at exact scrollProgress=0.7, causing slight visual mismatch (room slightly darker than intended).

### Attempts made (all reverted)
1. **Progress clamping** — Snap scrollProgress to exact values when near snap points
2. **Lerp-based interpolation** — Track target progress and lerp UI state toward it
3. **Force-correct on scrollend** — Instant scroll correction after smooth scroll completes

### Why they failed
- Clamping caused jarring "pops" when crossing thresholds mid-scroll
- Lerping desynchronized element animations (opacity and transform at different rates)
- Instant correction was visually jarring
- User insight: "When elements move, they should be fading in perfect sync"

### Decision
**Deferred to later** — Keeping current smooth behavior. Will revisit when:
1. Site is more complete
2. Progress bar is re-enabled for visual debugging
3. Can properly map snap points to scroll positions

### Current State
- Three-point snap scroll works (diorama → hero → modules)
- Smooth both directions
- Minor imprecision on modules→hero (lands ~0.75-0.78 instead of 0.70)
- Visually acceptable, smoothness prioritized over precision

### Key Learning
**Smoothness > Precision** — Users notice jarring pops more than slight color differences. Don't sacrifice buttery animations for pixel-perfect positioning.

### TODO (deferred)
- [ ] Re-enable gradient progress bar for debugging
- [ ] Map exact scroll positions to visual states
- [ ] Consider CSS scroll-snap instead of JS-based snapping
- [ ] Test on various browsers/devices for scroll behavior differences
