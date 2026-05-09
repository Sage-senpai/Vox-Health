/**
 * Browser-side Solana client.
 *
 * Wraps a Connection + the wallet adapter API into a tiny surface the
 * HealthAgent's solana tools call into. Stays SSR-safe by only constructing
 * the Connection on first use from the browser.
 */

import { Connection, PublicKey, type Commitment } from '@solana/web3.js';
import { env } from '@/lib/env';

let _conn: Connection | null = null;

export function getConnection(commitment: Commitment = 'confirmed'): Connection {
  if (!_conn) {
    _conn = new Connection(env.solana.rpc, commitment);
  }
  return _conn;
}

export function getProgramId(): PublicKey | null {
  if (!env.solana.programId) return null;
  try {
    return new PublicKey(env.solana.programId);
  } catch {
    return null;
  }
}

export function patientPda(owner: PublicKey, programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('patient'), owner.toBuffer()], programId);
}

export function entryPda(
  patient: PublicKey,
  sequence: bigint,
  programId: PublicKey,
): [PublicKey, number] {
  const seqBuf = Buffer.alloc(8);
  seqBuf.writeBigUInt64LE(sequence);
  return PublicKey.findProgramAddressSync(
    [Buffer.from('entry'), patient.toBuffer(), seqBuf],
    programId,
  );
}

export function grantPda(
  patient: PublicKey,
  doctor: PublicKey,
  programId: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('grant'), patient.toBuffer(), doctor.toBuffer()],
    programId,
  );
}
