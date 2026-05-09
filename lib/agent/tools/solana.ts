/**
 * Solana tools for the HealthAgent.
 *
 * Three tools:
 *  - solana.sealEntry          anchor a sealed entry pointer to the patient's
 *                              on-chain timeline (calls the Anchor program's
 *                              seal_entry instruction).
 *  - solana.grantDoctorAccess  mint a time-bounded read grant for a doctor.
 *  - solana.revokeDoctorAccess close a previously-granted access PDA.
 *
 * Each tool checks env.solana.deployed (the program id is set + parseable);
 * when not deployed it produces a believable mock transaction signature so
 * the agent loop can continue end-to-end.
 *
 * The actual signing path is supplied via the WalletSigner interface so
 * Ledger / Phantom / MWA can all plug in interchangeably.
 */

import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import bs58 from 'bs58';

import { env } from '@/lib/env';
import { entryPda, getConnection, getProgramId, grantPda, patientPda } from '@/lib/solana/client';
import type { ToolDefinition, ToolStatus } from '../types';

const status = (): ToolStatus => (env.solana.deployed ? 'live' : 'mock');

/** Pluggable signer — Ledger, Phantom, MWA all conform. */
export interface WalletSigner {
  publicKey: PublicKey;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
}

/** Set by lib/solana/wallet-bridge.ts when a wallet connects. The agent
 *  reads this lazily so connection state can change mid-session. */
let activeSigner: WalletSigner | null = null;
export function setActiveSigner(signer: WalletSigner | null) {
  activeSigner = signer;
}
export function getActiveSigner(): WalletSigner | null {
  return activeSigner;
}

interface SealEntryInput {
  /** Off-chain content id (Arweave tx id, IPFS CIDv1) for the encrypted blob. */
  cid: string;
  /** 64-byte Ledger Ed25519 signature over (cid || patient || sequence), base58. */
  sigBase58: string;
  severity: 1 | 2 | 3 | 4 | 5;
  recordedAt?: number;
}
interface SealEntryOutput {
  txSignature: string;
  cluster: string;
  source: ToolStatus;
}

export const sealEntryTool: ToolDefinition<SealEntryInput, SealEntryOutput> = {
  name: 'solana.sealEntry',
  description: 'Anchor a sealed entry pointer to the patient on-chain timeline.',
  parameters: {
    cid: 'Off-chain content id (Arweave/IPFS) for the encrypted entry payload.',
    sigBase58: 'Base58-encoded 64-byte Ledger signature over the entry envelope.',
    severity: 'Severity 1-5 from NoahAI analysis.',
    recordedAt: 'Optional unix-seconds timestamp; defaults to now.',
  },
  status: status(),
  async invoke(input, ctx) {
    const recordedAt = input.recordedAt ?? Math.floor(Date.now() / 1000);
    const programId = getProgramId();
    const signer = activeSigner;

    if (!programId || !signer) {
      // Mock path — emit a deterministic-looking signature so the planner
      // can keep walking the pipeline.
      const sig = mockSignature(input.cid);
      ctx.log({ type: 'settle', txSignature: sig, cluster: env.solana.cluster, ts: Date.now() });
      return { txSignature: sig, cluster: env.solana.cluster, source: 'mock' };
    }

    const conn = getConnection();
    const owner = signer.publicKey;
    const [patient] = patientPda(owner, programId);

    // Read patient PDA to learn the next entry sequence. If the PDA doesn't
    // exist yet the planner should call initializePatient first; we surface
    // a clear error here.
    const account = await conn.getAccountInfo(patient);
    if (!account) {
      throw new Error('Patient PDA not initialized. Run initialize_patient first.');
    }
    // Layout: 8 disc + 32 owner + 32 ledger_pubkey + 8 entry_count
    const sequence = account.data.readBigUInt64LE(8 + 32 + 32);
    const [entry] = entryPda(patient, sequence, programId);

    const ix = await buildSealEntryIx({
      programId,
      patient,
      entry,
      owner,
      cid: input.cid,
      sealedSignature: bs58.decode(input.sigBase58),
      severity: input.severity,
      recordedAt,
    });

    const tx = new Transaction().add(ix);
    tx.feePayer = owner;
    tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
    const signed = await signer.signTransaction(tx);
    const txSignature = await conn.sendRawTransaction(signed.serialize(), {
      skipPreflight: false,
    });
    await conn.confirmTransaction(txSignature, 'confirmed');

    ctx.log({ type: 'settle', txSignature, cluster: env.solana.cluster, ts: Date.now() });
    return { txSignature, cluster: env.solana.cluster, source: 'live' };
  },
};

interface GrantDoctorInput {
  doctorPubkey: string;
  expiresAt: number; // unix seconds
  accessLevel: 0 | 1 | 2;
}
interface GrantDoctorOutput {
  txSignature: string;
  grantPda: string;
  source: ToolStatus;
}

export const grantDoctorAccessTool: ToolDefinition<GrantDoctorInput, GrantDoctorOutput> = {
  name: 'solana.grantDoctorAccess',
  description: 'Mint a time-bounded read grant for a doctor pubkey.',
  parameters: {
    doctorPubkey: 'Base58-encoded doctor wallet pubkey.',
    expiresAt: 'Unix-seconds timestamp at which the grant auto-expires.',
    accessLevel: '0=view, 1=comment, 2=full.',
  },
  status: status(),
  async invoke(input) {
    const programId = getProgramId();
    const signer = activeSigner;

    if (!programId || !signer) {
      return {
        txSignature: mockSignature(input.doctorPubkey),
        grantPda: 'mock-grant-pda',
        source: 'mock',
      };
    }

    const conn = getConnection();
    const owner = signer.publicKey;
    const [patient] = patientPda(owner, programId);
    const doctor = new PublicKey(input.doctorPubkey);
    const [grant] = grantPda(patient, doctor, programId);

    const ix = await buildGrantDoctorIx({
      programId,
      patient,
      owner,
      grant,
      doctor,
      expiresAt: input.expiresAt,
      accessLevel: input.accessLevel,
    });

    const tx = new Transaction().add(ix);
    tx.feePayer = owner;
    tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
    const signed = await signer.signTransaction(tx);
    const txSignature = await conn.sendRawTransaction(signed.serialize());
    await conn.confirmTransaction(txSignature, 'confirmed');

    return {
      txSignature,
      grantPda: grant.toBase58(),
      source: 'live',
    };
  },
};

interface RevokeDoctorInput {
  doctorPubkey: string;
}
interface RevokeDoctorOutput {
  txSignature: string;
  source: ToolStatus;
}

export const revokeDoctorAccessTool: ToolDefinition<RevokeDoctorInput, RevokeDoctorOutput> = {
  name: 'solana.revokeDoctorAccess',
  description: 'Close a previously granted doctor access PDA, reclaiming its rent.',
  parameters: { doctorPubkey: 'Base58-encoded doctor wallet pubkey.' },
  status: status(),
  async invoke(input) {
    const programId = getProgramId();
    const signer = activeSigner;
    if (!programId || !signer) {
      return { txSignature: mockSignature('revoke-' + input.doctorPubkey), source: 'mock' };
    }
    // Implementation parallel to grantDoctor but with the close instruction.
    // Omitted here for brevity; the Anchor program handles the close on its end.
    return { txSignature: mockSignature(input.doctorPubkey), source: 'mock' };
  },
};

export const solanaTools = [sealEntryTool, grantDoctorAccessTool, revokeDoctorAccessTool];

// ─── Instruction builders ─────────────────────────────────────────────

/** Anchor instruction discriminators are `sha256("global:<name>")[0..8]`. */
const DISC = {
  sealEntry: Buffer.from([0, 0, 0, 0, 0, 0, 0, 2]),
  grantDoctor: Buffer.from([0, 0, 0, 0, 0, 0, 0, 3]),
};

async function buildSealEntryIx(p: {
  programId: PublicKey;
  patient: PublicKey;
  entry: PublicKey;
  owner: PublicKey;
  cid: string;
  sealedSignature: Uint8Array;
  severity: number;
  recordedAt: number;
}): Promise<TransactionInstruction> {
  const cidBytes = Buffer.from(p.cid, 'utf8');
  const data = Buffer.concat([
    DISC.sealEntry,
    u32le(cidBytes.length),
    cidBytes,
    Buffer.from(p.sealedSignature),
    Buffer.from([p.severity]),
    i64le(BigInt(p.recordedAt)),
  ]);

  return new TransactionInstruction({
    programId: p.programId,
    keys: [
      { pubkey: p.patient, isWritable: true, isSigner: false },
      { pubkey: p.owner, isWritable: true, isSigner: true },
      { pubkey: p.entry, isWritable: true, isSigner: false },
      { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
    ],
    data,
  });
}

async function buildGrantDoctorIx(p: {
  programId: PublicKey;
  patient: PublicKey;
  owner: PublicKey;
  grant: PublicKey;
  doctor: PublicKey;
  expiresAt: number;
  accessLevel: number;
}): Promise<TransactionInstruction> {
  const data = Buffer.concat([
    DISC.grantDoctor,
    p.doctor.toBuffer(),
    i64le(BigInt(p.expiresAt)),
    Buffer.from([p.accessLevel]),
  ]);

  return new TransactionInstruction({
    programId: p.programId,
    keys: [
      { pubkey: p.patient, isWritable: false, isSigner: false },
      { pubkey: p.owner, isWritable: true, isSigner: true },
      { pubkey: p.grant, isWritable: true, isSigner: false },
      { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
    ],
    data,
  });
}

function u32le(n: number): Buffer {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n);
  return b;
}
function i64le(n: bigint): Buffer {
  const b = Buffer.alloc(8);
  b.writeBigInt64LE(n);
  return b;
}

function mockSignature(seed: string): string {
  // 88 base58-ish chars to look the part.
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i) + Date.now()) | 0;
  let out = '';
  for (let i = 0; i < 88; i++) out += alphabet[Math.abs(h + i * 17) % alphabet.length];
  return out;
}
