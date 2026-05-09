// VoxHealth — voice-first medical record program
//
// Three instructions:
//   1. initialize_patient   create the patient PDA (one per wallet)
//   2. seal_entry           append an encrypted entry pointer to the patient's
//                            timeline. The entry payload itself lives off-chain
//                            (Arweave/IPFS); only the pointer + Ledger signature
//                            + severity + timestamp are anchored on-chain.
//   3. grant_doctor_access  mint a time-bounded read grant for a doctor pubkey.
//                            Doctors verify by checking the PDA at
//                            (patient, doctor) and ensuring expires_at > now.
//
// Storage strategy:
//   - The patient PDA stores aggregate counters + the head of a linked list of
//     entries. Each entry is itself a PDA seeded by (patient, sequence).
//   - Doctor grants are PDAs seeded by (patient, doctor) so revocation is just
//     a close_account.

use anchor_lang::prelude::*;

declare_id!("VoxH1th11111111111111111111111111111111111");

#[program]
pub mod voxhealth {
    use super::*;

    pub fn initialize_patient(
        ctx: Context<InitializePatient>,
        ledger_pubkey: Pubkey,
    ) -> Result<()> {
        let patient = &mut ctx.accounts.patient;
        patient.owner = ctx.accounts.owner.key();
        patient.ledger_pubkey = ledger_pubkey;
        patient.entry_count = 0;
        patient.created_at = Clock::get()?.unix_timestamp;
        patient.bump = ctx.bumps.patient;
        emit!(PatientInitialized {
            patient: patient.key(),
            owner: patient.owner,
            ts: patient.created_at,
        });
        Ok(())
    }

    pub fn seal_entry(
        ctx: Context<SealEntry>,
        cid: String,
        sealed_signature: [u8; 64],
        severity: u8,
        recorded_at: i64,
    ) -> Result<()> {
        require!(cid.len() <= MAX_CID_LEN, VoxError::CidTooLong);
        require!(severity >= 1 && severity <= 5, VoxError::InvalidSeverity);

        let patient = &mut ctx.accounts.patient;
        let entry = &mut ctx.accounts.entry;

        entry.patient = patient.key();
        entry.sequence = patient.entry_count;
        entry.cid = cid;
        entry.sealed_signature = sealed_signature;
        entry.severity = severity;
        entry.recorded_at = recorded_at;
        entry.anchored_at = Clock::get()?.unix_timestamp;
        entry.bump = ctx.bumps.entry;

        patient.entry_count = patient
            .entry_count
            .checked_add(1)
            .ok_or(VoxError::Overflow)?;

        emit!(EntrySealed {
            patient: patient.key(),
            entry: entry.key(),
            sequence: entry.sequence,
            severity,
            ts: entry.anchored_at,
        });
        Ok(())
    }

    pub fn grant_doctor_access(
        ctx: Context<GrantDoctorAccess>,
        doctor: Pubkey,
        expires_at: i64,
        access_level: u8,
    ) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        require!(expires_at > now, VoxError::AlreadyExpired);
        require!(access_level <= 2, VoxError::InvalidAccessLevel);

        let grant = &mut ctx.accounts.grant;
        grant.patient = ctx.accounts.patient.key();
        grant.doctor = doctor;
        grant.granted_at = now;
        grant.expires_at = expires_at;
        grant.access_level = access_level;
        grant.bump = ctx.bumps.grant;

        emit!(DoctorAccessGranted {
            patient: grant.patient,
            doctor,
            expires_at,
            access_level,
        });
        Ok(())
    }

    pub fn revoke_doctor_access(_ctx: Context<RevokeDoctorAccess>) -> Result<()> {
        // The accounts macro closes the grant PDA back to the owner. Anchor
        // refunds the rent automatically.
        Ok(())
    }
}

// ─── Account state ──────────────────────────────────────────────────────

const MAX_CID_LEN: usize = 96; // long enough for an Arweave tx id or a CIDv1.

#[account]
pub struct Patient {
    pub owner: Pubkey,           // 32 — wallet that signs writes
    pub ledger_pubkey: Pubkey,   // 32 — pubkey held by the patient's Ledger
    pub entry_count: u64,        // 8
    pub created_at: i64,         // 8
    pub bump: u8,                // 1
}
impl Patient {
    pub const SIZE: usize = 8 + 32 + 32 + 8 + 8 + 1;
}

#[account]
pub struct Entry {
    pub patient: Pubkey,             // 32
    pub sequence: u64,               // 8
    pub cid: String,                 // 4 + MAX_CID_LEN
    pub sealed_signature: [u8; 64],  // 64 — Ledger Ed25519 over (cid || patient || sequence)
    pub severity: u8,                // 1
    pub recorded_at: i64,            // 8
    pub anchored_at: i64,            // 8
    pub bump: u8,                    // 1
}
impl Entry {
    pub const SIZE: usize = 8 + 32 + 8 + 4 + MAX_CID_LEN + 64 + 1 + 8 + 8 + 1;
}

#[account]
pub struct DoctorGrant {
    pub patient: Pubkey,         // 32
    pub doctor: Pubkey,          // 32
    pub granted_at: i64,         // 8
    pub expires_at: i64,         // 8
    pub access_level: u8,        // 1 — 0=view, 1=comment, 2=full
    pub bump: u8,                // 1
}
impl DoctorGrant {
    pub const SIZE: usize = 8 + 32 + 32 + 8 + 8 + 1 + 1;
}

// ─── Instructions ───────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct InitializePatient<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = Patient::SIZE,
        seeds = [b"patient", owner.key().as_ref()],
        bump,
    )]
    pub patient: Account<'info, Patient>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SealEntry<'info> {
    #[account(mut, has_one = owner)]
    pub patient: Account<'info, Patient>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = Entry::SIZE,
        seeds = [b"entry", patient.key().as_ref(), patient.entry_count.to_le_bytes().as_ref()],
        bump,
    )]
    pub entry: Account<'info, Entry>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(doctor: Pubkey)]
pub struct GrantDoctorAccess<'info> {
    #[account(has_one = owner)]
    pub patient: Account<'info, Patient>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = DoctorGrant::SIZE,
        seeds = [b"grant", patient.key().as_ref(), doctor.as_ref()],
        bump,
    )]
    pub grant: Account<'info, DoctorGrant>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeDoctorAccess<'info> {
    #[account(has_one = owner)]
    pub patient: Account<'info, Patient>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        close = owner,
        seeds = [b"grant", grant.patient.as_ref(), grant.doctor.as_ref()],
        bump = grant.bump,
    )]
    pub grant: Account<'info, DoctorGrant>,
}

// ─── Events ─────────────────────────────────────────────────────────────

#[event]
pub struct PatientInitialized {
    pub patient: Pubkey,
    pub owner: Pubkey,
    pub ts: i64,
}

#[event]
pub struct EntrySealed {
    pub patient: Pubkey,
    pub entry: Pubkey,
    pub sequence: u64,
    pub severity: u8,
    pub ts: i64,
}

#[event]
pub struct DoctorAccessGranted {
    pub patient: Pubkey,
    pub doctor: Pubkey,
    pub expires_at: i64,
    pub access_level: u8,
}

// ─── Errors ─────────────────────────────────────────────────────────────

#[error_code]
pub enum VoxError {
    #[msg("CID exceeds maximum length.")]
    CidTooLong,
    #[msg("Severity must be between 1 and 5.")]
    InvalidSeverity,
    #[msg("Grant already expired.")]
    AlreadyExpired,
    #[msg("Access level must be 0, 1, or 2.")]
    InvalidAccessLevel,
    #[msg("Counter overflow.")]
    Overflow,
}
