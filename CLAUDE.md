# Call Sal Website V2 — Glassmorphism Rebuild

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

## Component Library
- `GlassCard` — glass panel with optional gradient border, hover lift
- `GlassNav` — floating bottom navigation bar (frosted glass, spring indicator)
- `GlassHeader` — floating top header bar (frosted glass)
- `GlassButton` — primary/glass/ghost variants with motion
- `AmbientBackground` — gradient orb layer

## Project Structure
```
callsal-website-v2/
├── api/              ← Copied verbatim from v1 (zero changes)
├── components/       ← New glassmorphism components
├── hooks/            ← Copied from v1
├── services/         ← Copied from v1
├── public/           ← Copied from v1
├── src/index.css     ← New glassmorphism design system
├── App.tsx           ← Main app shell with tab navigation
├── index.tsx         ← React entry point
├── index.html        ← SEO + Syne/Inter fonts
├── types.ts          ← Copied from v1
└── vercel.json       ← Copied from v1
```

## What Stays From V1 (Zero Changes)
- All API routes (auth, bookings, chat, email, onboarding)
- Booking logic, auth flow (JWT), email templates
- Redis storage, Nodemailer, Stripe
- ChatSal Gemini integration
- Copy/messaging (same words, new skin)

## Build Sequence Status
- [x] Phase 1: Scaffold + Core Shell ✅ (commit 2ae7cad)
- [ ] Phase 2: Hero Section (The Money Shot)
- [ ] Phase 3: Services ("The Armory")
- [ ] Phase 4: Video Portfolio
- [ ] Phase 5: Meet Salman
- [ ] Phase 6: The Offer
- [ ] Phase 7: Booking System
- [ ] Phase 8: Auth + Client Hub
- [ ] Phase 9: Polish
- [ ] Phase 10: Deploy + Migrate

## Key Decisions
- Syne font chosen over Space Grotesk — bolder, more distinctive for 2026 aesthetic
- Inter for body — clean, readable, pairs well with Syne
- Root-level components (not inside src/) — matches v1 structure
- tsconfig strict mode OFF — v1 code wasn't written for it
- verbatimModuleSyntax OFF — v1 imports aren't type-only
- anime.js added for complex timeline animations (user requested)

## Mistakes / Gotchas
- Vite scaffold puts entry in `src/main.tsx` — we use `index.tsx` at root
- tsconfig.app.json defaults to `include: ["src"]` — must add root dirs
- Windows bash: use PowerShell for file copy operations (xcopy fails in bash)
