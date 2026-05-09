# VoxHealth — Voice-First Blockchain Medical Journal

VoxHealth is a voice-first medical record. Patients speak their symptoms,
ElevenLabs transcribes, NoahAI flags patterns, the entry is encrypted on a
Ledger hardware wallet and sealed onto Solana. Doctors scan a QR code — the
on-chain grant is verified, ElevenLabs reads the past 30 days back to them in
a clinical voice, then access expires automatically.

The whole flow runs through a single long-running **`HealthAgent`**. Every
sponsor (Solana, ElevenLabs, NoahAI, Ledger, Virtuals, LI.FI, Solana Mobile)
registers as a tool on that agent.

> 30% of medical errors stem from incomplete patient histories. VoxHealth
> gives patients true ownership through voice in, hardware sealing, on-chain
> settlement, and time-bounded doctor access.

## App Surface

| Route                    | Purpose                                                      |
|--------------------------|--------------------------------------------------------------|
| `/`                      | Marketing landing — eldritch design, sponsor stack laid out  |
| `/app`                   | Patient daily flow — agentic voice orb drives the loop       |
| `/onboarding`            | 4-step wizard ending in wallet connect + on-chain init       |
| `/dashboard`             | Today view, timeline, medications, doctors, settings         |
| `/dashboard/timeline`    | Severity trend (Recharts) + entry cards with audio playback  |
| `/dashboard/medications` | Med cards, adherence %, mark-taken, reminder toggles         |
| `/dashboard/doctors`     | QR generator, grant list, expiry, revoke                     |
| `/dashboard/settings`    | Profile, notifications, privacy, about                       |
| `/doctor`                | Provider portal — verifies grant on-chain, plays summary     |
| `/billing`               | LI.FI Jumper iframe for cross-chain Pro subscription         |
| `/api/elevenlabs/token`  | Server-side signer for the EL conversational agent wss URL   |
| `/api/virtuals/webhook`  | Inbound webhook from the Virtuals caregiver runtime          |

## The Agent Runtime

[`lib/agent/runtime.ts`](lib/agent/runtime.ts) defines a `HealthAgent` class
that holds a tool registry and a session of structured `AgentEvent`s. Every
sponsor integration is a `ToolDefinition` — a name, a description, a
parameter schema, a `status` (`'live'` or `'mock'`), and an `invoke`
function.

```ts
import { bootstrapHealthAgent } from '@/lib/agent/bootstrap';

const agent = bootstrapHealthAgent({ patientPubkey });

const transcript = await agent.call('elevenlabs.transcribe', { audioBase64 });
await agent.call('noah.analyze', { transcript: transcript.transcript });
const seal = await agent.call('ledger.seal', { envelope });
await agent.call('solana.sealEntry', {
  cid, sigBase58: seal.sigBase58, severity: 4,
});
```

Two planners ship:

- **`defaultPlanner`** — deterministic dev walker. Walks transcribe →
  analyze → seal → settle → notify-if-flagged based on what's already in
  the event history. Used when NoahAI isn't configured.
- **`noahPlanner`** — POSTs the rolling history + tool catalog to NoahAI's
  `/v1/agent/plan` endpoint and lets the model pick the next tool.
  Activates automatically when `NOAH_API_KEY` is set.

## Sponsor Integration Matrix

Every integration ships with a working mock. Setting the relevant env var
flips it to live without code changes.

| Sponsor        | Tools registered                                                              | Live env vars                                | What live does                                      |
|----------------|-------------------------------------------------------------------------------|----------------------------------------------|-----------------------------------------------------|
| Solana         | `solana.initializePatient`, `sealEntry`, `grantDoctorAccess`, `revokeDoctorAccess`, `verifyDoctorGrant` | `NEXT_PUBLIC_VOXHEALTH_PROGRAM_ID`, `NEXT_PUBLIC_SOLANA_RPC` | Builds + sends real Anchor instructions             |
| ElevenLabs     | `elevenlabs.transcribe`, `synthesize`, `agentSession`                         | `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`  | STT, TTS, signed wss URL for the conversational agent |
| NoahAI         | `noah.analyze`, `noah.followUp` (+ `noahPlanner`)                             | `NOAH_API_KEY`, `NOAH_API_BASE`              | Clinical reasoning + agent planner                  |
| Ledger         | `ledger.connect`, `ledger.seal`                                               | `NEXT_PUBLIC_LEDGER_ENABLED=true`            | WebHID Ed25519 signing on the device                |
| Virtuals       | `virtuals.notifyCaregiver`, `virtuals.scheduleRobotVisit`                     | `VIRTUALS_AGENT_KEY`, `VIRTUALS_WEBHOOK_URL` | Pages caregiver / pharmacy / robot                  |
| LI.FI          | `lifi.quoteSubscription`, `lifi.x402Charge`                                   | none required                                 | Hits `li.quest/v1/quote` for cross-chain routing    |
| Solana Mobile  | `mobile.detectEnvironment`, `queueOfflineEntry`, `flushOfflineQueue`          | none required                                 | MWA signing in dApp Store browser, offline queue    |

The patient orb at `/app` runs the full pipeline against whatever's wired and
shows live tool status (`Tools live · 4 / 16`) so judges can see the
integration matrix at a glance.

## Solana Anchor Program

Source: [`programs/voxhealth/src/lib.rs`](programs/voxhealth/src/lib.rs).

Four instructions:

- `initialize_patient(ledger_pubkey)` — creates `Patient` PDA at
  `["patient", owner]`. Stores the owner pubkey, the Ledger pubkey used to
  seal entries, and the entry counter.
- `seal_entry(cid, sealed_signature, severity, recorded_at)` — appends an
  `Entry` PDA at `["entry", patient, sequence_le]`. The on-chain record is
  just the pointer + a 64-byte Ledger Ed25519 signature over
  `(cid || patient || sequence)`.
- `grant_doctor_access(doctor, expires_at, access_level)` — `DoctorGrant`
  PDA at `["grant", patient, doctor]`. Access levels: `0`=view,
  `1`=comment, `2`=full.
- `revoke_doctor_access` — closes the grant PDA, refunds the rent.

Each instruction emits a typed event so off-chain indexers can replay the
patient timeline without scanning every account.

### Live deployment

| Cluster | Program ID                                                                                       |
|---------|--------------------------------------------------------------------------------------------------|
| Devnet  | [`ASyqDJB5mdko6iN6c4foLFfc7g8VAPLdBtdkPpaffgvU`](https://explorer.solana.com/address/ASyqDJB5mdko6iN6c4foLFfc7g8VAPLdBtdkPpaffgvU?cluster=devnet) |

### Build + deploy

```bash
# from the repo root
anchor build
anchor deploy --provider.cluster devnet

# copy the program id into .env.local
echo "NEXT_PUBLIC_VOXHEALTH_PROGRAM_ID=<deployed-program-id>" >> .env.local
```

Once `NEXT_PUBLIC_VOXHEALTH_PROGRAM_ID` is set, every `solana.*` tool in
the agent flips from mock to live. The IDL at
[`lib/solana/idl.ts`](lib/solana/idl.ts) is the canonical TS view of the
program.

## Storage Layer

The Anchor program stores only the content-addressed pointer (CID).
The encrypted blob — audio + transcript + medication context — lives off-chain
on Arweave. [`lib/storage.ts`](lib/storage.ts) handles both paths:

- **Live** (when `ARWEAVE_KEY` is set): dynamic-imports `arweave-js`, posts a
  signed transaction, returns the real tx id.
- **Mock**: deterministic 43-char base64url id, FNV-stretched from the
  envelope. Looks like an Arweave id; agent loop runs end-to-end.

## Wallet Resolution

[`lib/solana/wallet-bridge.ts`](lib/solana/wallet-bridge.ts) picks the right
signer for the current environment:

1. Solana Mobile dApp Store browser → MWA via
   `@solana-mobile/mobile-wallet-adapter-protocol-web3js` (dynamic-imported)
2. Desktop Phantom → `window.solana`
3. Neither → mock signer; `solana.*` tools fall back to their mock paths

The connected signer is registered with the agent via
`setActiveSigner()`, so any subsequent `solana.*` tool call uses the live
signing path.

## Running locally

```bash
pnpm install
cp .env.example .env.local       # fill keys you have; the rest stay mocked
pnpm dev                          # http://localhost:3000

# Anchor program (optional — flips Solana from mock to live)
anchor build
anchor deploy --provider.cluster devnet

pnpm build && pnpm start          # production preview
```

Required env vars: none. Every integration has a working mock.

## Tech Stack

- **Framework** Next.js 16 App Router · React 19 · TypeScript strict
- **Styling** Tailwind v4 + shadcn/ui · Unbounded · IBM Plex Sans · Space Mono
- **Voice** Browser MediaRecorder API
- **Voice AI** ElevenLabs STT + TTS + Conversational Agents
- **Clinical AI** NoahAI (analysis + agent planner)
- **Blockchain** `@solana/web3.js`, `@coral-xyz/anchor`
- **Hardware** `@ledgerhq/hw-app-solana` over WebHID
- **Mobile** `@solana-mobile/mobile-wallet-adapter-protocol-web3js`
- **Cross-chain** LI.FI Jumper iframe + `li.quest/v1/quote`
- **Caregiver agent** Virtuals webhook bridge
- **Storage** Arweave (with deterministic mock CIDs in dev)

## Repository Layout

```
app/              Next.js routes (marketing /, patient /app, /doctor, /billing, /api/*)
components/
  eldritch/       Landing sections (hero, sponsor strip, stack, tracks, footer, …)
  voxhealth/      Patient orb + branded primitives
  doctor/         Doctor portal verification + summary
  billing/        LI.FI iframe mount
  dashboard/      Authenticated dashboard surface
  ui/             shadcn/ui primitives
context/          React context providers (auth, wallet, recording)
hooks/            useHealthAgent, useVoiceRecorder, useTimer
lib/
  agent/          HealthAgent runtime + every sponsor tool
    tools/        elevenlabs · noah · ledger · solana · mobile · virtuals · lifi
    runtime.ts    HealthAgent class + planner abstraction
    bootstrap.ts  one-call factory that registers everything
    types.ts      ToolDefinition, ToolContext, AgentEvent
  solana/         client, IDL, wallet bridge, MWA + offline queue
  env.ts          typed env access; integration.live booleans
  storage.ts      Arweave upload (live + deterministic mock)
programs/
  voxhealth/      Anchor program (Rust) — patients, entries, grants
public/           icons + brand assets
types/            shared TypeScript interfaces
```

## Hackathon Track Coverage

| Track                                          | Prize                          | VoxHealth qualification                                                              |
|------------------------------------------------|--------------------------------|--------------------------------------------------------------------------------------|
| Solana — Best App Overall                      | $10,000                        | Anchor program, devnet, contract addr in this README, public repo, demo < 3 min      |
| ElevenLabs — Best Integration                  | 3 mo. Scale tier               | Conversational agent + STT + TTS, signed wss server route                            |
| NoahAI                                         | 5M credits                     | Clinical reasoning + production agent planner                                        |
| Ledger — Top 10                                | 1 device per teammate          | On-device Ed25519 sealing + Patient.ledger_pubkey on-chain                           |
| Virtuals — AI Agent into Physical World        | $500                           | Caregiver agent webhook, robot home-visit scheduler                                  |
| LI.FI — Cross-Chain Solana UX                  | $1,000                         | LI.FI Jumper iframe + `li.quest/v1/quote` programmatic flow                          |
| Solana Mobile — Best Mobile App                | Seeker phones                  | MWA detection + offline-first queue + dApp-Store-ready build                         |
| Bonus — x402 on Solana                         | $500                           | `lifi.x402Charge` per-doctor-read micro-billing                                      |

## Frontend Scaffolding

The initial Next.js file directory and UI scaffolding for this project were
generated using **v0** by Vercel, then customized, refactored, and integrated
into the VoxHealth product architecture described above.

## License

MIT — open source for healthcare innovation.
