/**
 * Hand-written IDL for the VoxHealth Anchor program.
 *
 * Once `anchor build` runs, the canonical IDL lives at
 *   target/idl/voxhealth.json
 * and this file becomes a re-export. Until then it lets the TS client compile
 * and call the program against a deployed devnet artifact.
 */

import type { Idl } from '@coral-xyz/anchor';

export const VOXHEALTH_IDL = {
  address: 'ASyqDJB5mdko6iN6c4foLFfc7g8VAPLdBtdkPpaffgvU',
  metadata: {
    name: 'voxhealth',
    version: '0.1.0',
    spec: '0.1.0',
    description: 'VoxHealth — voice-first medical record on Solana',
  },
  instructions: [
    {
      name: 'initializePatient',
      discriminator: [0, 0, 0, 0, 0, 0, 0, 1],
      accounts: [
        { name: 'owner', writable: true, signer: true },
        {
          name: 'patient',
          writable: true,
          pda: { seeds: [{ kind: 'const', value: [112, 97, 116, 105, 101, 110, 116] }, { kind: 'account', path: 'owner' }] },
        },
        { name: 'systemProgram', address: '11111111111111111111111111111111' },
      ],
      args: [{ name: 'ledgerPubkey', type: 'pubkey' }],
    },
    {
      name: 'sealEntry',
      discriminator: [0, 0, 0, 0, 0, 0, 0, 2],
      accounts: [
        { name: 'patient', writable: true },
        { name: 'owner', writable: true, signer: true },
        { name: 'entry', writable: true },
        { name: 'systemProgram', address: '11111111111111111111111111111111' },
      ],
      args: [
        { name: 'cid', type: 'string' },
        { name: 'sealedSignature', type: { array: ['u8', 64] } },
        { name: 'severity', type: 'u8' },
        { name: 'recordedAt', type: 'i64' },
      ],
    },
    {
      name: 'grantDoctorAccess',
      discriminator: [0, 0, 0, 0, 0, 0, 0, 3],
      accounts: [
        { name: 'patient' },
        { name: 'owner', writable: true, signer: true },
        { name: 'grant', writable: true },
        { name: 'systemProgram', address: '11111111111111111111111111111111' },
      ],
      args: [
        { name: 'doctor', type: 'pubkey' },
        { name: 'expiresAt', type: 'i64' },
        { name: 'accessLevel', type: 'u8' },
      ],
    },
    {
      name: 'revokeDoctorAccess',
      discriminator: [0, 0, 0, 0, 0, 0, 0, 4],
      accounts: [
        { name: 'patient' },
        { name: 'owner', writable: true, signer: true },
        { name: 'grant', writable: true },
      ],
      args: [],
    },
  ],
  accounts: [
    { name: 'patient', discriminator: [109, 97, 110, 101, 116, 105, 99, 1] },
    { name: 'entry', discriminator: [101, 110, 116, 114, 121, 0, 0, 1] },
    { name: 'doctorGrant', discriminator: [103, 114, 97, 110, 116, 0, 0, 1] },
  ],
  errors: [
    { code: 6000, name: 'CidTooLong', msg: 'CID exceeds maximum length.' },
    { code: 6001, name: 'InvalidSeverity', msg: 'Severity must be between 1 and 5.' },
    { code: 6002, name: 'AlreadyExpired', msg: 'Grant already expired.' },
    { code: 6003, name: 'InvalidAccessLevel', msg: 'Access level must be 0, 1, or 2.' },
    { code: 6004, name: 'Overflow', msg: 'Counter overflow.' },
  ],
  types: [],
} as const satisfies Idl;

export type VoxhealthIdl = typeof VOXHEALTH_IDL;
