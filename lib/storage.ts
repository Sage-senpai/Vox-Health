/**
 * Storage layer for the encrypted entry payload.
 *
 * Anchor program only stores a content-addressed pointer (CID) on-chain.
 * The actual encrypted blob — audio + transcript + medication context —
 * lives off-chain on Arweave (preferred for permanence) or IPFS (fast).
 *
 * Live path: arweave-js for permanent storage. Lazy-imported to keep the
 * bundle slim until the patient actually seals their first entry.
 *
 * Mock path: deterministic Arweave-shaped tx ids generated locally so the
 * agent loop produces real-looking pointers in dev. The pointer is 43
 * base64url chars, matching `^[A-Za-z0-9_-]{43}$` — what the Anchor
 * program's MAX_CID_LEN was sized for.
 */

interface UploadInput {
  /** UTF-8 JSON of the encrypted envelope. */
  data: string;
  contentType?: string;
  tags?: { name: string; value: string }[];
}

interface UploadResult {
  cid: string;
  url: string;
  bytes: number;
  source: 'live' | 'mock';
}

const STORAGE_LIVE = typeof process !== 'undefined' && !!process.env.ARWEAVE_KEY;

export async function uploadEntry(input: UploadInput): Promise<UploadResult> {
  const bytes = new TextEncoder().encode(input.data).length;

  if (!STORAGE_LIVE) {
    const cid = mockArweaveId(input.data);
    return {
      cid,
      url: `arweave://${cid}`,
      bytes,
      source: 'mock',
    };
  }

  // Live Arweave path — only entered when ARWEAVE_KEY is configured.
  // We dynamic-import so the package never enters dev bundles. The ts-ignore
  // is intentional: arweave is an optional peer that may not be installed.
  try {
    // @ts-ignore -- optional peer dependency; only loaded when ARWEAVE_KEY is set
    const ArweaveMod = (await import('arweave')).default;
    const arweave = ArweaveMod.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
    const jwk = JSON.parse(process.env.ARWEAVE_KEY!);
    const tx = await arweave.createTransaction({ data: input.data }, jwk);
    tx.addTag('Content-Type', input.contentType ?? 'application/json');
    tx.addTag('App-Name', 'VoxHealth');
    for (const t of input.tags ?? []) tx.addTag(t.name, t.value);
    await arweave.transactions.sign(tx, jwk);
    await arweave.transactions.post(tx);
    return {
      cid: tx.id,
      url: `arweave://${tx.id}`,
      bytes,
      source: 'live',
    };
  } catch (err) {
    console.warn('[VoxHealth] Arweave upload failed, falling back to mock:', err);
    const cid = mockArweaveId(input.data);
    return { cid, url: `arweave://${cid}`, bytes, source: 'mock' };
  }
}

/** Build the canonical entry envelope the agent uploads + signs. */
export function buildEntryEnvelope(parts: {
  patientPubkey: string;
  transcript: string;
  audioBase64: string;
  severity: 1 | 2 | 3 | 4 | 5;
  symptoms?: string[];
  recordedAt: number;
}): string {
  return JSON.stringify({
    v: 1,
    patient: parts.patientPubkey,
    transcript: parts.transcript,
    audio: parts.audioBase64,
    severity: parts.severity,
    symptoms: parts.symptoms ?? [],
    recordedAt: parts.recordedAt,
  });
}

// ─── helpers ───────────────────────────────────────────────────────────

function mockArweaveId(seed: string): string {
  // Arweave tx ids are 43 base64url chars.
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = ((h ^ seed.charCodeAt(i)) * 16777619) >>> 0;
  }
  let out = '';
  for (let i = 0; i < 43; i++) {
    h = ((h ^ (i * 31 + 7)) * 16777619) >>> 0;
    out += alphabet[h & 63];
  }
  return out;
}
