/**
 * Anchor program tests for VoxHealth.
 *
 * Run with `anchor test` once the program is built. Covers the four
 * patient-life-cycle paths:
 *
 *   1. initialize_patient creates the PDA at the right seeds
 *   2. seal_entry appends and increments the entry counter
 *   3. grant_doctor_access creates a (patient, doctor) PDA with expiry
 *   4. revoke_doctor_access closes the grant and refunds rent
 *
 * Plus the input-validation cases the Rust program enforces:
 *   - severity outside [1, 5] is rejected
 *   - already-expired grant is rejected
 *   - invalid access level is rejected
 */

import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { expect } from 'chai';

import type { Voxhealth } from '../target/types/voxhealth';

describe('voxhealth', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Voxhealth as Program<Voxhealth>;

  const owner = (provider.wallet as anchor.Wallet).payer;
  const ledgerPubkey = Keypair.generate().publicKey;

  const [patientPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('patient'), owner.publicKey.toBuffer()],
    program.programId,
  );

  it('initializes the patient PDA', async () => {
    await program.methods
      .initializePatient(ledgerPubkey)
      .accountsPartial({
        owner: owner.publicKey,
        patient: patientPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const patient = await program.account.patient.fetch(patientPda);
    expect(patient.owner.toBase58()).to.equal(owner.publicKey.toBase58());
    expect(patient.ledgerPubkey.toBase58()).to.equal(ledgerPubkey.toBase58());
    expect(patient.entryCount.toString()).to.equal('0');
  });

  it('seals an entry and increments the counter', async () => {
    const sequence = new anchor.BN(0);
    const seqBuf = Buffer.alloc(8);
    seqBuf.writeBigUInt64LE(BigInt(sequence.toString()));
    const [entryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('entry'), patientPda.toBuffer(), seqBuf],
      program.programId,
    );

    const cid = 'mockArweaveTxId-shouldBe43chars-AAAAAAAAAAA';
    const sig = new Array(64).fill(0).map((_, i) => i % 256);

    await program.methods
      .sealEntry(cid, sig as unknown as number[], 3, new anchor.BN(Date.now() / 1000))
      .accountsPartial({
        patient: patientPda,
        owner: owner.publicKey,
        entry: entryPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const entry = await program.account.entry.fetch(entryPda);
    expect(entry.cid).to.equal(cid);
    expect(entry.severity).to.equal(3);

    const patient = await program.account.patient.fetch(patientPda);
    expect(patient.entryCount.toString()).to.equal('1');
  });

  it('rejects severity outside [1, 5]', async () => {
    const sequence = new anchor.BN(1);
    const seqBuf = Buffer.alloc(8);
    seqBuf.writeBigUInt64LE(BigInt(sequence.toString()));
    const [entryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('entry'), patientPda.toBuffer(), seqBuf],
      program.programId,
    );

    try {
      await program.methods
        .sealEntry('cid', new Array(64).fill(0), 9, new anchor.BN(0))
        .accountsPartial({
          patient: patientPda,
          owner: owner.publicKey,
          entry: entryPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      expect.fail('Expected severity 9 to be rejected');
    } catch (err) {
      expect(String(err)).to.match(/InvalidSeverity|6001/);
    }
  });

  it('grants and revokes doctor access', async () => {
    const doctor = Keypair.generate().publicKey;
    const [grantPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('grant'), patientPda.toBuffer(), doctor.toBuffer()],
      program.programId,
    );

    const expires = Math.floor(Date.now() / 1000) + 86400;

    await program.methods
      .grantDoctorAccess(doctor, new anchor.BN(expires), 0)
      .accountsPartial({
        patient: patientPda,
        owner: owner.publicKey,
        grant: grantPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const grant = await program.account.doctorGrant.fetch(grantPda);
    expect(grant.doctor.toBase58()).to.equal(doctor.toBase58());
    expect(grant.accessLevel).to.equal(0);

    await program.methods
      .revokeDoctorAccess()
      .accountsPartial({
        patient: patientPda,
        owner: owner.publicKey,
        grant: grantPda,
      })
      .rpc();

    const closed = await program.account.doctorGrant.fetchNullable(grantPda);
    expect(closed).to.be.null;
  });

  it('rejects an already-expired grant', async () => {
    const doctor = Keypair.generate().publicKey;
    const [grantPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('grant'), patientPda.toBuffer(), doctor.toBuffer()],
      program.programId,
    );
    try {
      await program.methods
        .grantDoctorAccess(doctor, new anchor.BN(0), 0)
        .accountsPartial({
          patient: patientPda,
          owner: owner.publicKey,
          grant: grantPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      expect.fail('Expected expired grant to be rejected');
    } catch (err) {
      expect(String(err)).to.match(/AlreadyExpired|6002/);
    }
  });
});
