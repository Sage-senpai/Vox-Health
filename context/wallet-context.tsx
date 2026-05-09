'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WalletContextType } from '@/types';
import { connectWallet, disconnectWallet } from '@/lib/solana/wallet-bridge';
import { detectEnvironment, type WalletEnvironment } from '@/lib/solana/mwa';

interface VoxWalletContext extends WalletContextType {
  environment: WalletEnvironment;
  /** Whether the agent is wired to a live signer right now. */
  hasLiveSigner: boolean;
}

const WalletContext = createContext<VoxWalletContext | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [environment, setEnvironment] = useState<WalletEnvironment>('none');
  const [hasLiveSigner, setHasLiveSigner] = useState(false);

  useEffect(() => {
    setEnvironment(detectEnvironment());
  }, []);

  const connect = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await connectWallet();
      if (result) {
        setPublicKey(result.pubkey);
        setEnvironment(result.environment as WalletEnvironment);
        setHasLiveSigner(true);
      } else {
        // Soft fallback so the UI can keep moving in mock mode.
        const mock = 'mock-' + Date.now().toString(36);
        setPublicKey(mock);
        setHasLiveSigner(false);
        console.warn('[VoxHealth] No wallet detected; running in mock mode.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectWallet();
    setPublicKey(null);
    setHasLiveSigner(false);
  }, []);

  const value: VoxWalletContext = {
    publicKey,
    isConnected: !!publicKey,
    isLoading,
    connect,
    disconnect,
    environment,
    hasLiveSigner,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
