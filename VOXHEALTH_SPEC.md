# VoxHealth UI/UX Specification Implementation

## Overview

VoxHealth is a voice-first, patient-owned medical journal on Solana. This document outlines the complete design system implementation following the official specification.

---

## 1. Color System

### PAPER (Light) — Default Theme

```
Surface 0 (--paper)       #FAF7F2  Page background, warm off-white
Surface 1 (--linen)       #F2EEE6  Cards, panels
Surface 2 (--vellum)      #E8E2D5  Inset wells, code blocks
Stroke (--rule)           #DDD6C7  1px borders, dividers

Ink-1 (--ink)             #0E1116  Primary text, headlines
Ink-2 (--ink-muted)       #44474C  Secondary text
Ink-3 (--ink-subtle)      #6E7176  Meta, captions
```

### INK (Dark) — Paired Theme

```
Surface 0 (--paper)       #0B0E12  Page background
Surface 1 (--linen)       #14181E  Cards, panels
Surface 2 (--vellum)      #1C2128  Inset wells
Stroke (--rule)           #2A2F37  Borders, dividers

Ink-1 (--ink)             #F2EEE6  Primary text
Ink-2 (--ink-muted)       #B5B0A6  Secondary text
Ink-3 (--ink-subtle)      #7B7973  Meta, captions
```

### Accents (Same Hex Both Themes)

```
Sage (#2E7E6F)            Primary CTA, "secure", saved, healthy. Calm, clinical.
Sage-Soft (#C8E0D8)       Accent washes, success backgrounds
Coral (#D9573F)           Urgent flags, missed doses, danger CTAs only
Coral-Soft (#F6D9D2)      Danger backgrounds
Amber (#C28A2A)           Pending review, advisory
Indigo (#2D3F8F)          Hardware-wallet UI, Ledger touchpoints, signing
```

**Color Rules:**
- Sage is the ONE primary accent
- Coral is medical urgency only — never use for delete/off
- Never color alone: pair with icon, label, or position
- Contrast: WCAG AAA on Body-L (≥7:1), AA on Caption (≥4.5:1)
- No gradients in component fills
- One ambient gradient permitted: low-contrast warm wash on marketing hero

---

## 2. Typography

### Font Stack

```
Editorial display       Newsreader    (Google Fonts)
UI / Body              Inter          (Google Fonts, optical-sizing: auto)
Mono / Data            JetBrains Mono (Google Fonts)
```

### Type Scale (mobile-first; 1rem = 16px desktop, 17px mobile)

```
Display-XL  3.5rem / 1.05 / -0.02em   Newsreader 600  (hero only)
Display-L   2.5rem / 1.08 / -0.015em  Newsreader 600
Display-M   2rem   / 1.12 / -0.01em   Newsreader 600  (page titles)
Title       1.5rem / 1.2  / -0.005em  Newsreader 600  (card headlines)
Subtitle    1.125rem / 1.35           Inter 600
Body-L      1.125rem / 1.6            Inter 400       (patient flows default)
Body        1rem / 1.6                Inter 400       (clinician flows)
Caption     0.875rem / 1.45           Inter 500
Micro       0.75rem / 1.4 / +0.04em   Inter 600 UPPERCASE
Mono        0.875rem / 1.5            JetBrains Mono 500
Vital       4rem / 1 / -0.025em       Newsreader 600  (big numbers)
```

**Rules:**
- Patient flows: minimum 17px mobile, 18px desktop. Default to Body-L.
- Never text below 14px anywhere
- Headlines: serif. Everything else: sans. Mono only for data tokens
- Line length: 60–75ch body; 32–48ch mobile patient flows
- Letter-spacing: zero for sans, slight negative for large serif, +0.04em uppercase only

---

## 3. Layout & Space

```
Grid:        4-pt base (0.25rem). Use multiples of 4.
Container:   Patient flows max-w 480px (single column)
             Clinician/caregiver max-w 1280px with 320px right rail
Gutter:      16px mobile, 24px tablet, 32px desktop
Section:     64–96px vertical rhythm between sections
Density:     LOW for patient flows, MEDIUM for clinician dashboards

Breakpoints: sm 640, md 768, lg 1024, xl 1280

Cards:
  - 1px stroke + Surface 1 + 16px padding mobile, 24px desktop
  - Border-radius 14px (soft, editorial — not pill, not iOS-tile)
  - Shadow only on elevated overlays (0 1px 2px rgba(14,17,22,0.04), 0 8px 24px rgba(14,17,22,0.06))
  - No hover-translate. Hover = stroke darkens to ink-muted
```

---

## 4. Component Vocabulary

### VoiceOrb

The hero of the app. 160px mobile, 200px desktop. Sage fill at rest with subtle radial glow.
- Idle: gentle 4s breathing scale 1 → 1.02
- Recording: outer waveform ring driven by live mic amplitude
- Tap target: 240px including aura
- Single label below: "Tap to speak"
- Long-press: push-to-talk
- Tap-release: hands-free mode

**Implementation:** `components/voxhealth/voice-orb.tsx`

### TimelineEntry

Date column on left (sticky on scroll, mono ink-muted "MAY 8" / Body "Wed"). Card on right with:
- Title (serif)
- 1-line summary
- Voice playback bar (16px tall)
- Tag chips (Medication / Symptom / Vitals)
- "Verified on chain" badge with indigo dot

**Implementation:** `components/voxhealth/timeline.tsx`

### MedicationCard

- Pill icon, name in Title, dose in mono ("10 mg")
- Schedule in Caption
- Big tap-target check ring on right
- Missed = coral border
- On-time = sage-soft surface with sage check

**Implementation:** `components/voxhealth/medications.tsx`

### QRCodeShare

A dignified panel — not a wallet popover.
- 56% viewport mobile, max 360px square
- Border: inset linen frame
- Doctor's name, permission scope as plain sentences with toggles
- Expiry timer
- "Stop sharing" button (coral text on linen, not coral fill)

**Implementation:** `components/voxhealth/qr-share.tsx`

### TrustStrip

Footer band, vellum surface. Three calm rows of micro-labels:
- "Encrypted on your Ledger"
- "Stored on Solana"
- "HIPAA-aligned by design"

Indigo dot precedes each. Never animate.

**Implementation:** `components/voxhealth/trust-strip.tsx`

---

## 5. Button System

```
Primary:      sage fill / white text / 14px radius / 56px tall mobile, 48px desktop
Secondary:    ink stroke / linen fill / ink text / same shape
Tertiary:     text-only ink-muted with sage on hover; no shape
Destructive:  coral text on linen, 1px coral stroke; never coral fill except confirmed-destructive
Min tap:      48×48 always. Patient flows: 56×56 minimum on mobile
```

---

## 6. Motion

```
Curves:
  Entrance:  cubic-bezier(0.2, 0.8, 0.2, 1)
  Exit:      cubic-bezier(0.4, 0, 0.2, 1)
  No bouncing

Durations:
  Micro:     140ms
  Default:   220ms
  Page:      320ms
  Orb breath: 480ms

Allowed:
  - Orb breathing (4s, scale 1→1.02→1)
  - Waveform reactive to mic amplitude
  - Timeline entries: stagger 40ms each, fade-up 8px
  - Page transitions: cross-fade 220ms, no slide
  - Reduced-motion: ALL animations replaced by instantaneous state change

Forbidden:
  - Parallax, particles, 3D tilt, springy overshoot, scroll-jacking, autoplay video
```

---

## 7. Accessibility

```
WCAG Target:    2.2 AAA on patient flows; AA elsewhere
Contrast:       ≥7:1 on Body-L; ≥4.5:1 on Caption; ≥3:1 on UI strokes
Type sizing:    Settings: Default / Large / Extra Large (1.0× / 1.15× / 1.3×)
                All layouts reflow without horizontal scroll at 1.3×
Focus:          2px sage outline, 4px offset, never removed
                Skip-to-content link visible on first tab
Tap targets:    48×48 minimum, 56×56 in patient flows
Voice / SR:     VoiceOver and TalkBack; live regions for transcription
                aria-pressed on orb; aria-live for confirmations
                Transcript always visible during recording
Tremor-friendly: Dwell-tap option (tap-and-hold to confirm)
                Larger hit-area than visual button
                Debounce 300ms on critical actions
Color-blind:    Never status by color alone. Always icon + label.
Captions:       Every voice playback has transcript expansion + disable autoplay option
Languages:      Layouts accommodate +30% character growth (es-MX, pt-BR)
```

---

## 8. Brand Voice & Microcopy

```
Tone:        Calm clinician + thoughtful editor. Never cute, never alarming.
Reading age: 8th grade max in patient flows. 12th grade in clinician/caregiver flows.
Sentences:   Short. Active voice. State action, then consequence.
             Example: "Tap to speak. We'll save it to your timeline."

Forbidden:   "decentralized", "self-sovereign", "leverage", "seamless",
             "revolutionary", "blockchain"

Permitted:   "your keys", "your timeline", "secure device" (Ledger),
             "Solana" only in trust footer/settings

Time:        Humanize. "Today, 9:42 AM" not "2026-05-08T13:42Z"
Numbers:     Spell zero–nine in body, numerals 10+.
             Numerals always in vitals, dosages, durations
Confirmations: Read back what was captured.
             "Got it — sharp pain in left foot, since Tuesday. Saved."
```

---

## 9. Key Screens Implemented

### HOME (Patient)
- Top nav: VoxHealth wordmark + small avatar
- Greeting Display-M: "Good morning, Margaret."
- Subtitle Body-L: "How are you feeling today?"
- VoiceOrb centered, "Tap to speak" beneath
- Two tiles: "Today's medications (3)" and "Last entry · 8 hours ago"
- TrustStrip in footer

**File:** `components/voxhealth/patient-home.tsx`

### TIMELINE
- Display-M "Your timeline" + Caption "All entries since you started."
- Filter pills: All · Symptoms · Medications · Visits
- Sticky month divider serif Title
- TimelineEntry list, grouped by day
- Docked VoiceOrb at bottom

**File:** `components/voxhealth/timeline.tsx`

### MEDICATIONS
- Today's schedule as MedicationCards in chronological order
- Streak counter top: "8 days on time" Display-L with progress bar
- "Add medication" voice-first

**File:** `components/voxhealth/medications.tsx`

### QR SHARE
- Display-M "Share with your doctor"
- Body-L: "They'll see your timeline for the next 30 minutes."
- QRCodeShare panel
- Timer + Stop-sharing button

**File:** `components/voxhealth/qr-share.tsx`

---

## 10. Don'ts (Project-Specific)

- No "wallet", "blockchain", "decentralized" in patient-facing copy
- No coral as decorative color — reserved for medical urgency
- No sub-14px text. No sub-48×48 tap targets (56×56 patient flows)
- No autoplay audio, background music, haptic-spam
- No carousels (patients lose them)
- No modal dialogs to dismiss permission/consent — use full screen
- No third-party fonts beyond Newsreader, Inter, JetBrains Mono
- No "AI" anthropomorphism pretending NoahAI is a doctor
- No icon-only buttons in patient flows — always icon + label
- No vague error copy: "Something went wrong" → "We couldn't reach Solana right now. Your entry is saved on this phone and will sync when you're back online."

---

## 11. CSS Custom Properties

All available in `app/globals.css`:

```css
/* Colors */
--paper, --linen, --vellum, --rule
--ink, --ink-muted, --ink-subtle
--sage, --sage-soft, --coral, --coral-soft, --amber, --indigo

/* Semantic */
--background, --foreground, --card, --card-foreground
--border, --input, --primary, --primary-foreground
--secondary, --muted, --muted-foreground, --accent, --destructive, --ring

/* Spacing */
--radius: 0.875rem (14px)

/* Typography */
--font-sans (Inter)
--font-serif (Newsreader)
--font-mono (JetBrains Mono)
```

---

## 12. Build & Deployment

All components compile successfully with Next.js 16.2.4 (Turbopack).

Production build: `npm run build`
Development: `npm run dev`

---

**Last Updated:** May 8, 2026
**Status:** Complete implementation, all screens and components built per specification
