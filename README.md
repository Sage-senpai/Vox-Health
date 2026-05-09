# VoxHealth — Voice-First Blockchain Medical Journal

VoxHealth is a voice-first medical journal that lets patients record their health journey through natural conversation, encrypts it on hardware wallets, and shares it with doctors on-demand via QR codes.

> 30% of medical errors stem from incomplete patient histories. VoxHealth combines voice AI, blockchain, and hardware security to give patients true ownership of their medical record.

## How It Works

- Patients speak their symptoms daily (~30-second voice logs)
- AI asks follow-up questions and analyzes patterns
- Voice recordings + transcripts encrypted with a Ledger hardware wallet
- Immutable timeline stored on the Solana blockchain
- Doctors access the complete history via QR code (with patient permission)
- Zero-knowledge proofs protect privacy while enabling data portability

## Key Features

1. **Voice-First Interface** — Speak symptoms, medications, feelings; AI handles the rest.
2. **Hardware Encryption** — Ledger wallet secures all medical data (HIPAA-compliant by design).
3. **Blockchain Timeline** — Complete, chronological, immutable health record on Solana.
4. **AI Analysis** — NoahAI detects symptom patterns, medication interactions, urgent flags.
5. **Doctor Portal** — Any provider can access the timeline with a one-time patient permission.
6. **Medication Reminders** — Voice-based reminders with adherence tracking.
7. **Caregiver Dashboard** — Family members monitor elderly parents remotely.
8. **Cross-Hospital Portability** — Records travel with the patient, not stuck in one EMR.

## Target Users

- **Primary:** Elderly patients with chronic conditions (133M in US) who struggle with typing
- **Secondary:** Family caregivers managing parents' health (53M caregivers)
- **Tertiary:** Health-conscious individuals who want to own their medical data

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **State:** React Context
- **Voice capture:** Browser MediaRecorder API
- **Voice AI:** ElevenLabs (transcription, TTS, emotion detection) — placeholder integration
- **Blockchain:** Solana Web3.js (immutable storage + access-control smart contracts) — placeholder integration
- **Hardware security:** Ledger wallet encryption — placeholder integration
- **Health AI:** NoahAI for symptom pattern + medication interaction analysis — planned
- **Cross-chain payments:** LI.FI for insurance + micropayments — planned
- **Mobile:** Solana Mobile, offline-first focus — planned

## Project Structure

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout with providers
├── globals.css                 # Design tokens and styles
├── onboarding/page.tsx         # 4-step onboarding wizard
├── doctor/page.tsx             # Doctor access portal (QR scan target)
└── dashboard/
    ├── layout.tsx              # Dashboard with sidebar
    ├── page.tsx                # Today view
    ├── timeline/page.tsx       # Timeline with severity graph
    ├── medications/page.tsx    # Medication management
    ├── doctors/page.tsx        # Doctor access & permissions
    └── settings/page.tsx       # User settings & preferences

components/
├── landing/        # Landing page sections
├── onboarding/     # Onboarding form steps
├── dashboard/      # Dashboard layout components
├── recording/      # Voice recording interface
├── timeline/       # Timeline visualization
├── medications/    # Medication cards
├── voxhealth/      # Voice orb + branded primitives
└── ui/             # shadcn/ui components

lib/
├── solana.ts       # Solana blockchain stubs
└── voice.ts        # Voice / ElevenLabs stubs

context/
├── auth-context.tsx       # User authentication state
├── wallet-context.tsx     # Solana wallet state
└── recording-context.tsx  # Voice recording session state

hooks/
├── use-voice-recorder.ts  # MediaRecorder logic
└── use-timer.ts           # Recording timer

types/
└── index.ts               # Shared TypeScript interfaces
```

## App Surface

| Page         | Route                    | Purpose                           |
|--------------|--------------------------|-----------------------------------|
| Landing      | `/`                      | Product showcase                  |
| Onboarding   | `/onboarding`            | 4-step setup wizard               |
| Dashboard    | `/dashboard`             | Main app (today view)             |
| Timeline     | `/dashboard/timeline`    | Health history with graph         |
| Medications  | `/dashboard/medications` | Prescription management           |
| Doctors      | `/dashboard/doctors`     | Access sharing                    |
| Settings     | `/dashboard/settings`    | Profile & preferences             |
| Doctor Portal| `/doctor`                | Provider-facing access interface  |

## Design System

- **Primary Blue:** `#0F4C81` (medical trust)
- **Light Background:** `#E8F4F8` (calming)
- **Clinical Gray:** `#6B7280` (neutral)
- **Accent Green:** `#10B981` (healthy states)
- **Alert Red:** `#DC2626` (urgent only)
- **Headings:** Newsreader / Crimson Text (editorial serif)
- **Body:** Inter (clean, accessible)
- **Touch targets:** 48px minimum

Mobile-first responsive design with collapsible sidebar; tablet breakpoint 768px, desktop 1024px.

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation throughout
- Color + icon indicators (never color alone)
- 48px minimum touch targets
- Screen reader optimized, semantic HTML
- High contrast text + large-text toggle in settings
- Respects `prefers-reduced-motion` (voice orb)

## Integration Stubs

All blockchain and AI integrations are currently placeholder functions for the hackathon demo.

### Solana (`lib/solana.ts`)
- `connectWallet()` — Phantom / Ledger connection
- `saveMedicalEntry()` — immutable record creation
- `grantDoctorAccess()` / `revokeDoctorAccess()` — access tokens
- `verifyDoctorIdentity()` — provider authentication
- `getTransactionHistory()` — audit log

### Voice (`lib/voice.ts`)
- `recordAudio()` — MediaRecorder wrapper
- `transcribeAudio()` — ElevenLabs transcription stub
- `generateVoiceResponse()` — ElevenLabs TTS stub
- `analyzeSymptomKeywords()` — keyword extraction
- `generateFollowUpQuestions()` — dynamic Q&A
- `calculateSymptomSeverity()` — auto-severity from keywords

## Hooks

### `useVoiceRecorder()`
MediaRecorder lifecycle: `startRecording`, `stopRecording`, `pauseRecording`, `resumeRecording`, `reset`. Returns `isRecording`, `isPaused`, `duration`, `audioBlob`.

### `useTimer()`
Lightweight up-timer: `start`, `stop`, `reset`. Returns `time`, `formattedTime`, `isActive`.

## Environment Variables

No required environment variables for demo mode. In production:

```
ELEVENLABS_API_KEY=...
SOLANA_RPC_URL=...
NEXT_PUBLIC_ENVIRONMENT=production
```

## Running Locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm start
```

## Use Cases

- **Margaret, 68, diabetes:** Voice-logs foot tingling daily; doctor sees the progression over 3 weeks and adjusts medication early.
- **James, 45, caregiver:** Monitors dad's medication compliance remotely, gets alerts for missed pills.
- **Sarah, 35, emergency:** Voice-records severe headache symptoms; paramedics access complete history via QR.

## Business Model

- **B2C:** $9/month for unlimited doctor sharing, family access, advanced analytics
- **B2B2C:** Insurance partnerships (~$3–5/month per user, reduces ER visits)
- **B2B:** Healthcare provider licensing ($500–5000/year per clinic)
- **Data licensing:** Anonymized research data for pharma / public health (opt-in only)

## Security & HIPAA Posture

- All data structures support encryption
- Role-based access control (RLS-ready)
- Time-limited doctor access tokens
- Immutable audit logs via blockchain
- Patient consent required for sharing
- No tracking or analytics on medical data

## Roadmap

- Real Solana smart-contract integration
- ElevenLabs voice transcription + TTS
- Database backend (Supabase / Neon)
- Email + push notifications
- Insurance integration (LI.FI)
- Appointment scheduling + telehealth
- Multi-language support
- Native mobile app (Solana Mobile)

## Browser Support

Chrome / Edge 90+, Firefox 88+, Safari 14+, mobile Safari, mobile Chrome.

## License

MIT — open source for healthcare innovation.

---

## Scaffolding Note

The initial frontend file directory and UI scaffolding for this project were generated using **v0** by Vercel, then customized, refactored, and integrated into the VoxHealth product architecture described above.
