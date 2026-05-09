/**
 * Wallet bridge — pick the right Solana signer for the current environment
 * and register it with the agent runtime.
 *
 * Resolution order:
 *   1. Solana Mobile MWA (when inside the dApp Store browser)
 *   2. Phantom / window.solana (when present on desktop)
 *   3. null — every solana.* tool falls back to its mock path
 *
 * This module owns the wallet-adapter polymorphism so neither the agent
 * tools nor the WalletProvider need to know which wallet is active.
 */

import { PublicKey, type Transaction } from '@solana/web3.js';

import { setActiveSigner, type WalletSigner } from '@/lib/agent/tools/solana';
import { detectEnvironment, getMwaSigner } from '@/lib/solana/mwa';

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: PublicKey | null;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: <T extends Transaction>(tx: T) => Promise<T>;
}

interface SolanaWindow extends Window {
  solana?: PhantomProvider;
}

/**
 * Connect a wallet for the current environment. Returns the connected pubkey
 * or null. As a side effect, registers a WalletSigner with the agent so any
 * subsequent solana.* tool call uses the live signing path.
 */
export async function connectWallet(): Promise<{ pubkey: string; environment: string } | null> {
  if (typeof window === 'undefined') return null;
  const environment = detectEnvironment();

  if (environment === 'solana-mobile') {
    const mwa = await getMwaSigner();
    if (mwa) {
      setActiveSigner(mwa);
      return { pubkey: mwa.publicKey.toBase58(), environment };
    }
  }

  if (environment === 'desktop-phantom') {
    const phantom = (window as SolanaWindow).solana;
    if (phantom?.isPhantom) {
      const { publicKey } = await phantom.connect();
      const signer: WalletSigner = {
        publicKey,
        signTransaction: (tx) => phantom.signTransaction(tx),
      };
      setActiveSigner(signer);
      return { pubkey: publicKey.toBase58(), environment };
    }
  }

  // No wallet present; surface this so the UI can prompt the user to install
  // Phantom or open in the Solana Mobile dApp Store browser.
  return null;
}

export async function disconnectWallet(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await (window as SolanaWindow).solana?.disconnect();
  } catch {
    /* no-op */
  }
  setActiveSigner(null);
}
